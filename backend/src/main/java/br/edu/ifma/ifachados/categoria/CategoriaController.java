package br.edu.ifma.ifachados.categoria;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaRepository categoriaRepository;

    private static final Logger logger = LoggerFactory.getLogger(CategoriaController.class);

    @GetMapping
    public ResponseEntity<List<Categoria>> listarTodas() {
        try {
            List<Categoria> categorias = categoriaRepository.findAll();
            return ResponseEntity.status(200).body(categorias);
        } catch (Exception e) {
            logger.error("Erro ao listar categorias", e);
            return ResponseEntity.status(500).body(null);
        }
    }
}
