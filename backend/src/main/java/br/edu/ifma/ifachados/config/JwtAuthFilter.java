package br.edu.ifma.ifachados.config;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Filtro que roda UMA VEZ a cada requisição (OncePerRequestFilter), antes de
// chegar nos Controllers. É aqui que o JWT enviado pelo frontend é lido e
// transformado em autenticação dentro do Spring Security.
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain)
            throws ServletException, IOException {

        // O frontend manda o token no header "Authorization: Bearer <token>".
        // Se não vier nesse formato, simplesmente segue sem autenticar
        // (rotas públicas continuam acessíveis normalmente).
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // Remove o prefixo "Bearer " (7 caracteres) para ficar só com o token puro.
            String token = authHeader.substring(7);

            try {
                String email = jwtService.extrairEmail(token);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // IMPORTANTE: aqui o "principal" salvo é apenas a String do e-mail,
                    // não o objeto User completo. Por isso os Controllers que precisam
                    // do usuário logado (ex: ObjetoController) buscam o User no banco
                    // a partir desse e-mail via UserRepository.findByEmail(...).
                    // A lista de authorities fica vazia pois o projeto não usa roles/perfis.
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(email, null, Collections.emptyList());
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e) {
                // token inválido ou expirado: segue sem autenticar,
                // o SecurityConfig barra a rota protegida com 403
            }
        }

        filterChain.doFilter(request, response);
    }
}