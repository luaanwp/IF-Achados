package br.edu.ifma.ifachados.user;

import java.io.File;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifma.ifachados.user.dto.UserDTO;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/usuarios")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    // Listar todos os usuários
    @GetMapping
    public ResponseEntity<List<User>> listarTodos() {
        try {
            List<User> usuarios = userRepository.findAll();
            return ResponseEntity.status(200).body(usuarios);
        } catch (Exception e) {
            logger.error("Erro ao listar usuarios", e);
            return ResponseEntity.status(500).body(null);
        }
    }

    // Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<User> buscarPorId(@PathVariable Long id) {
        try {
            return userRepository.findById(id)
                    .map(user -> ResponseEntity.status(200).body(user))
                    .orElse(ResponseEntity.status(404).body(null));
        } catch (Exception e) {
            logger.error("Erro ao buscar usuario com id {}", id, e);
            return ResponseEntity.status(500).body(null);
        }
    }

    // Criar novo usuário
@Autowired
private PasswordEncoder passwordEncoder;

@PostMapping
public ResponseEntity<User> criar(@RequestBody User user) {
    try {
        user.setSenha(passwordEncoder.encode(user.getSenha()));
        User usuarioSalvo = userRepository.save(user);
        return ResponseEntity.status(201).body(usuarioSalvo);
    } catch (Exception e) {
        logger.error("Erro ao criar usuario", e);
        return ResponseEntity.status(500).body(null);
    }
}

    // Deletar usuário
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            if (!userRepository.existsById(id)) {
                return ResponseEntity.status(404).build();
            }
            userRepository.deleteById(id);
            return ResponseEntity.status(204).build();
        } catch (Exception e) {
            logger.error("Erro ao deletar usuario com id {}", id, e);
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<User> upload(@ModelAttribute UserDTO dto) {

        try {
            File pasta = new File("uploads");
            if (!pasta.exists()) {
                pasta.mkdir();
            }

            String nomeOriginal = dto.getImagem().getOriginalFilename();
            // Remove qualquer caractere que não seja letra, número, ponto ou hífen
            // (evita espaços, parênteses, acentos etc. quebrando a URL depois)
            String nomeLimpo = nomeOriginal.replaceAll("[^a-zA-Z0-9.-]", "_");

            String nomeArquivo = java.util.UUID.randomUUID() + "_" + nomeLimpo;

            String caminho = System.getProperty("user.dir") + "/uploads/" + nomeArquivo;

            dto.getImagem().transferTo(new File(caminho));

            User user = new User();
            user.setNome(dto.getNome());
            user.setEmail(dto.getEmail());
            user.setImagemUrl("http://localhost:8080/uploads/" + nomeArquivo);
            user.setSenha(passwordEncoder.encode(dto.getSenha()));

            // 1º salva no banco normalmente
            User usuarioSalvo = userRepository.save(user);

            // 2º embrulha o resultado num ResponseEntity com status 201
            return ResponseEntity.status(201).body(usuarioSalvo);

        } catch (Exception e) {
            logger.error("Erro ao fazer upload de usuario", e);
            // status 500 = erro inesperado no servidor
            return ResponseEntity.status(500).body(null);
        }
    }
}