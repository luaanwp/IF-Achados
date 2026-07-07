package br.edu.ifma.ifachados.objeto;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifma.ifachados.user.User;

public interface ObjetoRepository extends JpaRepository<Objeto, Long> {

    List<Objeto> findByDono(User dono);

}