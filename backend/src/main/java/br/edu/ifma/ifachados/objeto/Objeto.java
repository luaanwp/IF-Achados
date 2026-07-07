package br.edu.ifma.ifachados.objeto;

import br.edu.ifma.ifachados.categoria.Categoria;
import br.edu.ifma.ifachados.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.LocalDate;

// Entidade principal do sistema: cada item perdido/achado cadastrado vira
// uma linha na tabela "objeto" no MySQL, via JPA/Hibernate.
@Entity
public class Objeto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(length = 600)
    private String descricao;

    private String local;

    private LocalDate data;

    // URL completa da imagem, ex: http://localhost:8080/uploads/objetos/xxx.jpg
    private String fotoUrl;

    // "disponivel" ou "devolvido"
    private String status;

    // Relacionamento N:1 — vários objetos podem ter a mesma categoria.
    // @JoinColumn cria a coluna de chave estrangeira "categoria_id" na tabela objeto.
    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    // Relacionamento N:1 com User — vários objetos podem pertencer ao mesmo dono.
    // Cria a coluna "dono_id". É esse vínculo que permite o endpoint
    // GET /api/objetos/meus filtrar apenas os objetos de quem está logado.
    @ManyToOne
    @JoinColumn(name = "dono_id")
    private User dono;

    public Objeto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getLocal() {
        return local;
    }

    public void setLocal(String local) {
        this.local = local;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public User getDono() {
        return dono;
    }

    public void setDono(User dono) {
        this.dono = dono;
    }
}