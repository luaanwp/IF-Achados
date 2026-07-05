package br.edu.ifma.ifachados.objeto;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifma.ifachados.categoria.Categoria;
import br.edu.ifma.ifachados.categoria.CategoriaRepository;
import br.edu.ifma.ifachados.objeto.dto.ObjetoDTO;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/objetos")
public class ObjetoController {

    @Autowired
    private ObjetoRepository objetoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    private static final Logger logger = LoggerFactory.getLogger(ObjetoController.class);

    // Listar todos
    @GetMapping
    public ResponseEntity<List<Objeto>> listarTodos() {
        try {
            List<Objeto> objetos = objetoRepository.findAll();
            return ResponseEntity.status(200).body(objetos);
        } catch (Exception e) {
            logger.error("Erro ao listar objetos", e);
            return ResponseEntity.status(500).body(null);
        }
    }

    // Buscar por id
    @GetMapping("/{id}")
    public ResponseEntity<Objeto> buscarPorId(@PathVariable Long id) {
        try {
            return objetoRepository.findById(id)
                    .map(objeto -> ResponseEntity.status(200).body(objeto))
                    .orElse(ResponseEntity.status(404).body(null));
        } catch (Exception e) {
            logger.error("Erro ao buscar objeto com id {}", id, e);
            return ResponseEntity.status(500).body(null);
        }
    }

    // Criar novo objeto (multipart/form-data: campos + foto juntos)
    @PostMapping
    public ResponseEntity<Objeto> criar(@ModelAttribute ObjetoDTO dto) {
        try {
            // Busca a categoria pelo nome recebido do front (ex: "documentos");
            // se ainda não existir no banco, cria automaticamente
            Categoria categoria = categoriaRepository.findByNome(dto.getCategoria())
                    .orElseGet(() -> {
                        Categoria nova = new Categoria();
                        nova.setNome(dto.getCategoria());
                        return categoriaRepository.save(nova);
                    });

            Objeto objeto = new Objeto();
            objeto.setNome(dto.getNome());
            objeto.setDescricao(dto.getDescricao());
            objeto.setLocal(dto.getLocal());
            objeto.setData(LocalDate.parse(dto.getData()));
            objeto.setStatus("disponivel");
            objeto.setCategoria(categoria);

            // Salva a foto, se o usuário enviou uma
            if (dto.getFoto() != null && !dto.getFoto().isEmpty()) {
                File pasta = new File("uploads/objetos");
                if (!pasta.exists()) {
                    pasta.mkdirs();
                }

                String nomeOriginal = dto.getFoto().getOriginalFilename();
                // Mesma sanitização que já usamos no upload do usuário
                String nomeLimpo = nomeOriginal.replaceAll("[^a-zA-Z0-9.-]", "_");
                String nomeArquivo = UUID.randomUUID() + "_" + nomeLimpo;

                String caminho = System.getProperty("user.dir") + "/uploads/objetos/" + nomeArquivo;
                dto.getFoto().transferTo(new File(caminho));

                objeto.setFotoUrl("http://localhost:8080/uploads/objetos/" + nomeArquivo);
            }

            Objeto objetoSalvo = objetoRepository.save(objeto);
            return ResponseEntity.status(201).body(objetoSalvo);

        } catch (IOException | IllegalStateException e) {
            logger.error("Erro ao criar objeto", e);
            return ResponseEntity.status(500).body(null);
        }
    }

    // Atualizar objeto existente
    @PutMapping("/{id}")
    public ResponseEntity<Objeto> atualizar(@PathVariable Long id, @RequestBody Objeto dadosAtualizados) {
        try {
            return objetoRepository.findById(id)
                    .map(objeto -> {
                        objeto.setNome(dadosAtualizados.getNome());
                        objeto.setDescricao(dadosAtualizados.getDescricao());
                        objeto.setLocal(dadosAtualizados.getLocal());
                        objeto.setData(dadosAtualizados.getData());
                        Objeto atualizado = objetoRepository.save(objeto);
                        return ResponseEntity.status(200).body(atualizado);
                    })
                    .orElse(ResponseEntity.status(404).body(null));
        } catch (Exception e) {
            logger.error("Erro ao atualizar objeto com id {}", id, e);
            return ResponseEntity.status(500).body(null);
        }
    }

    // Marcar como devolvido (usado pelo botão em ObjetoDetalhes.jsx)
    @PatchMapping("/{id}/devolvido")
    public ResponseEntity<Objeto> marcarComoDevolvido(@PathVariable Long id) {
        try {
            return objetoRepository.findById(id)
                    .map(objeto -> {
                        objeto.setStatus("devolvido");
                        Objeto atualizado = objetoRepository.save(objeto);
                        return ResponseEntity.status(200).body(atualizado);
                    })
                    .orElse(ResponseEntity.status(404).body(null));
        } catch (Exception e) {
            logger.error("Erro ao marcar objeto {} como devolvido", id, e);
            return ResponseEntity.status(500).body(null);
        }
    }

    // Deletar objeto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            if (!objetoRepository.existsById(id)) {
                return ResponseEntity.status(404).build();
            }
            objetoRepository.deleteById(id);
            return ResponseEntity.status(204).build();
        } catch (Exception e) {
            logger.error("Erro ao deletar objeto com id {}", id, e);
            return ResponseEntity.status(500).build();
        }
    }
}
