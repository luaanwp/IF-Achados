package br.edu.ifma.ifachados.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// Configuração central de segurança: define quais rotas são públicas, quais
// exigem token, e conecta o JwtAuthFilter na cadeia de filtros do Spring Security.
@Configuration
public class SecurityConfig {

    
    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    // BCrypt gera um hash diferente a cada vez mesmo para a mesma senha (usa "salt"
    // aleatório embutido no hash), por isso é seguro comparar senha digitada x hash
    // salvo sem guardar a senha em texto puro no banco.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CSRF é uma proteção pensada para apps que usam sessão/cookie.
            // Como a API é stateless (token JWT no header, sem cookie de sessão),
            // esse tipo de ataque não se aplica aqui, então é desabilitado.
            .csrf(csrf -> csrf.disable())
            // STATELESS = o Spring nunca cria sessão HTTP; cada requisição precisa
            // trazer seu próprio token, validado pelo JwtAuthFilter.
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // A ordem das regras abaixo importa: o Spring Security aplica a
            // primeira regra que der "match" na URL, de cima para baixo.
            .authorizeHttpRequests(auth -> auth
                // Libera o preflight (OPTIONS) do navegador para qualquer rota — precisa vir primeiro
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/usuarios").permitAll()
                .requestMatchers("/usuarios/upload").permitAll()

                // Arquivos de imagem enviados (uploads de usuário e de objetos) são públicos
                .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()

                // Consulta pública
                .requestMatchers(HttpMethod.GET, "/api/objetos", "/api/objetos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categorias", "/api/categorias/**").permitAll()

                // Operações autenticadas
                .requestMatchers(HttpMethod.POST, "/api/objetos/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/objetos/**").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/api/objetos/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/objetos/**").authenticated()

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}