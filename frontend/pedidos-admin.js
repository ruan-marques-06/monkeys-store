document.addEventListener('DOMContentLoaded', carregarPedidos);

// Função mágica para mostrar notificações elegantes
function mostrarNotificacao(mensagem, tipo = 'sucesso') {
    // Define as cores com base no tipo (verde para sucesso, vermelho para erro)
    const corFundo = tipo === 'sucesso' ? '#000000' : '#000000';
    const corBorda = tipo === 'sucesso' ? '1px solid #00ff88' : '1px solid #ff0000';
    const corTexto = tipo === 'sucesso' ? '#00ff88' : '#ff0000';

    Toastify({
        text: mensagem,
        duration: 3000, // Desaparece após 3 segundos
        close: true,    // Mostra um 'x' para fechar
        gravity: "top", // Aparece no topo da tela
        position: "right", // Aparece no lado direito
        style: {
            background: corFundo,
            border: corBorda,
            color: corTexto,
            borderRadius: "8px",
            fontFamily: "sans-serif",
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
        }
    }).showToast();
}

async function carregarPedidos() {
    const tbody = document.getElementById('tabela-pedidos-body');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;">A carregar encomendas...</td></tr>';

    try {
        const resposta = await fetch('http://localhost:8080/api/pedidos');
        if (!resposta.ok) throw new Error('Falha ao procurar pedidos');

        const pedidos = await resposta.json();
        tbody.innerHTML = '';

        if (pedidos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;">Nenhuma encomenda recebida ainda.</td></tr>';
            return;
        }

        // Exibe os mais recentes primeiro
        pedidos.reverse().forEach(pedido => {
            const dataObj = new Date(pedido.dataEmissao);
            const dataFormatada = dataObj.toLocaleDateString('pt-BR') + ' às ' + dataObj.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
            
            let corStatus = 'white';
            if(pedido.status === 'ENVIADO') corStatus = '#00ff88'; // Verde
            if(pedido.status === 'CANCELADO') corStatus = '#ff3333'; // Vermelho
            if(pedido.status === 'AGUARDANDO PAGAMENTO') corStatus = '#ffcc00'; // Amarelo

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${pedido.id}</td>
                <td>${pedido.nomeCliente}</td>
                <td>${dataFormatada}</td>
                <td style="color: ${corStatus}; font-weight: bold;">${pedido.status}</td>
                <td style="color: #00ff88; font-weight: bold;">R$ ${pedido.valorTotal.toFixed(2).replace('.', ',')}</td>
                <td>
                    <button onclick="atualizarStatusPedido(${pedido.id}, 'ENVIADO')" class="btn-acao" style="border-color: #00ff88; color: #00ff88; margin-right: 5px;" title="Marcar como Enviado"><i class="fas fa-check"></i></button>
                    <button onclick="atualizarStatusPedido(${pedido.id}, 'CANCELADO')" class="btn-acao" style="border-color: #ff3333; color: #ff3333;" title="Cancelar Encomenda"><i class="fas fa-times"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (erro) {
        console.error(erro);
        tbody.innerHTML = '<tr><td colspan="6" style="color:red; text-align:center; padding: 20px;">Erro de conexão com o servidor.</td></tr>';
    }
}

async function atualizarStatusPedido(idPedido, novoStatus) {
    if (!confirm(`Confirmar alteração da encomenda #${idPedido} para ${novoStatus}?`)) return;

    try {
        const resposta = await fetch(`http://localhost:8080/api/pedidos/${idPedido}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoStatus)
        });

        if (resposta.ok) {
            carregarPedidos();
        } else {
            mostrarNotificacao('Erro ao atualizar status.');
        }
    } catch (erro) {
        console.error(erro);
        mostrarNotificacao('Erro de conexão com o servidor.');
    }
}