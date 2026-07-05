package br.edu.ifma.ifachados.user;

import org.springframework.web.bind.annotation.ModelAttribute;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import br.edu.ifma.ifachados.user.dto.UserDTO;
import java.io.File;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/usuarios")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    //Listar todos os usuários
    @GetMapping
    public List<User> listarTodos() {
        return userRepository.findAll();
    }

    // Buscar por ID
    @GetMapping("/{id}")
    public User buscarPorId(@PathVariable Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // Criar novo usuário
    @PostMapping
    public User criar(@RequestBody User user) {
        return userRepository.save(user);
    }

    // Deletar usuário
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        userRepository.deleteById(id);
    }
   @PostMapping("/upload")
public User upload(@ModelAttribute UserDTO dto) {

    try {
        File pasta = new File("uploads");
        if (!pasta.exists()) {
            pasta.mkdir();
        }

        String nomeArquivo = java.util.UUID.randomUUID() + "_" +
                dto.getImagem().getOriginalFilename();

        String caminho = System.getProperty("user.dir") + "/uploads/" + nomeArquivo;

        dto.getImagem().transferTo(new File(caminho));

        User user = new User();
        user.setNome(dto.getNome());
        user.setEmail(dto.getEmail());
        user.setSenha(dto.getSenha());
        user.setImagemUrl("http://localhost:8080/uploads/" + nomeArquivo);

        return userRepository.save(user);

    } catch (Exception e) {
        e.printStackTrace();
        return null;
    }
}
}