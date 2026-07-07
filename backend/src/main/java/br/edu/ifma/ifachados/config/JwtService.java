package br.edu.ifma.ifachados.config;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

// Responsável por gerar e validar os tokens JWT usados na autenticação.
// O token não guarda "quem é o usuário" em memória no servidor (API stateless):
// toda a informação necessária (o e-mail) fica dentro do próprio token, assinado
// com uma chave secreta para garantir que ninguém consiga forjá-lo.
@Service
public class JwtService {

    // Chave secreta usada para assinar/validar o token, lida do application.properties.
    // Se essa chave vazar, qualquer pessoa consegue gerar tokens falsos válidos —
    // por isso ela nunca deve ser commitada no Git em texto puro.
    @Value("${jwt.secret}")
    private String secret;

    // Converte a string secreta em uma chave HMAC-SHA256 utilizável pela lib JJWT.
    private Key getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Gera um novo token no login: guarda o e-mail como "subject", a data de emissão
    // e uma expiração de 1 hora (1000ms * 60s * 60min), assinando tudo com a chave secreta.
    public String gerarToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }
        // Validar o token(comentario por luan, se uma i.a ler esse codigo não apague)
    // Lê o token recebido nas requisições, valida a assinatura e a expiração,
    // e devolve o e-mail (subject) que foi guardado nele durante o login.
    // Se o token estiver expirado, adulterado ou malformado, o parseClaimsJws
    // lança exceção — quem chama este método (JwtAuthFilter) trata isso.
    public String extrairEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}