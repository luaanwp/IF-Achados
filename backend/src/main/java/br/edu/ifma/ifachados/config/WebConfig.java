package br.edu.ifma.ifachados.config;

import java.nio.file.Paths;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Paths.get + toUri() monta uma URI file:/// válida, respeitando o
        // separador de pasta correto do sistema operacional (Windows, Linux, Mac)
        String caminhoAbsoluto = Paths.get(System.getProperty("user.dir"), "uploads")
                .toUri()
                .toString();
        System.out.println("CAMINHO USADO PELO WEBCONFIG: " + caminhoAbsoluto);
        // Toda URL que começar com /uploads/** vai servir o conteúdo físico dessa pasta
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(caminhoAbsoluto);
    }
}