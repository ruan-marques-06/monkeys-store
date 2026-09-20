package com.monkeysstore.api.dto;

import java.math.BigDecimal;
import java.util.List;

public class PedidoDTO {
    private Integer clienteId;
    private BigDecimal valorTotal;
    private List<ItemPedidoDTO> itens;

    public Integer getClienteId() {
        return clienteId;
    }

    public void setClienteId(Integer clienteId) {
        this.clienteId = clienteId;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public List<ItemPedidoDTO> getItens() {
        return itens;
    }

    public void setItens(List<ItemPedidoDTO> itens) {
        this.itens = itens;
    }
}
