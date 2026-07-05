package br.edu.ifma.ifachados.user;

import br.edu.ifma.ifachados.config.JwtService;
import br.edu.ifma.ifachados.user.dto.LoginDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public String login(@RequestBody LoginDTO dto) {

        User user = userRepository.findAll()
                .stream()
                .filter(u -> u.getEmail().equals(dto.getEmail())
                          && u.getSenha().equals(dto.getSenha()))
                .findFirst()
                .orElse(null);

        if (user == null) {
            return "Usuário ou senha inválidos";
        }

        return jwtService.gerarToken(user.getEmail());
    }
}