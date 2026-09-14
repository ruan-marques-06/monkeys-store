package com.monkeysstore.api.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ItemPedidoId implements Serializable {

    private Integer idPedido;
    private Integer idProduto;

    public ItemPedidoId() {}

    public ItemPedidoId(Integer idPedido, Integer idProduto) {
        this.idPedido = idPedido;
        this.idProduto = idProduto;
    }

    public Integer getIdPedido() { return idPedido; }
    public void setIdPedido(Integer idPedido) { this.idPedido = idPedido; }

    public Integer getIdProduto() { return idProduto; }
    public void setIdProduto(Integer idProduto) { this.idProduto = idProduto; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ItemPedidoId that = (ItemPedidoId) o;
        return Objects.equals(idPedido, that.idPedido) && Objects.equals(idProduto, that.idProduto);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idPedido, idProduto);
    }
}