package br.edu.ifma.ifachados.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifma.ifachados.config.JwtService;
import br.edu.ifma.ifachados.user.dto.LoginDTO;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        try {
            User user = userRepository.findAll()
                    .stream()
                    .filter(u -> u.getEmail().equals(dto.getEmail()))
                    .findFirst()
                    .orElse(null);

            if (user == null || !passwordEncoder.matches(dto.getSenha(), user.getSenha())) {
                return ResponseEntity.status(401).body("Usuário ou senha inválidos");
            }

            String token = jwtService.gerarToken(user.getEmail());
            return ResponseEntity.status(200).body(token);

        } catch (Exception e) {
            logger.error("Erro ao fazer login", e);
            return ResponseEntity.status(500).body("Erro interno ao processar login");
        }
    }
}