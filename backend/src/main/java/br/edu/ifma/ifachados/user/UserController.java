package br.edu.ifma.ifachados.user;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
}