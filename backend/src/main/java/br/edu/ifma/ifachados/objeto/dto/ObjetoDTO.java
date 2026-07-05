package br.edu.ifma.ifachados.objeto.dto;

import org.springframework.web.multipart.MultipartFile;

// Os nomes dos campos aqui têm que bater exatamente com as chaves
// que o CadastroObjeto.jsx manda no FormData (nome, categoria, descricao, local, data, foto)
public class ObjetoDTO {

    private String nome;
    private String categoria;
    private String descricao;
    private String local;
    private String data;
    private MultipartFile foto;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
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

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public MultipartFile getFoto() {
        return foto;
    }

    public void setFoto(MultipartFile foto) {
        this.foto = foto;
    }
}
