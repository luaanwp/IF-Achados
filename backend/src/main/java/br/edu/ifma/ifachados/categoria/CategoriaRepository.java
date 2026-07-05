package br.edu.ifma.ifachados.categoria;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    // Usado no cadastro de objeto: encontra a categoria pelo nome (ex: "documentos")
    Optional<Categoria> findByNome(String nome);
}
