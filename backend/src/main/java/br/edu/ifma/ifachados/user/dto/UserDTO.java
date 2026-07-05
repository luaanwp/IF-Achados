package br.edu.ifma.ifachados.user.dto;

import org.springframework.web.multipart.MultipartFile;

public class UserDTO {

    private String nome;
    private String email;
    private String senha;
    private MultipartFile imagem;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public MultipartFile getImagem() { return imagem; }
    public void setImagem(MultipartFile imagem) { this.imagem = imagem; }
}