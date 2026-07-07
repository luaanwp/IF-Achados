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

@Configuration
public class SecurityConfig {

    
    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
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