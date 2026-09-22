// Variáveis globais para guardar as encomendas na memória e saber qual o filtro atual
let todasAsEncomendas = []; 
let filtroAtual = 'TODOS';

document.addEventListener('DOMContentLoaded', carregarPedidos);

// Função mágica para mostrar notificações elegantes
function mostrarNotificacao(mensagem, tipo = 'sucesso') {
    const corFundo = '#000000';
    const corBorda = tipo === 'sucesso' ? '1px solid #00ff88' : '1px solid #ff0000';
    const corTexto = tipo === 'sucesso' ? '#00ff88' : '#ff0000';

    Toastify({
        text: mensagem,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
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

// 1. Busca os dados no backend
async function carregarPedidos() {
    const tbody = document.getElementById('tabela-pedidos-body');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;">A carregar encomendas...</td></tr>';

    try {
        const resposta = await fetch('http://localhost:8080/api/pedidos');
        if (!resposta.ok) throw new Error('Falha ao procurar pedidos');

        // Guarda os dados na memória global
        todasAsEncomendas = await resposta.json();
        
        // Chama a função que desenha a tabela
        renderizarTabela();
        atualizarMetricas();
    } catch (erro) {
        console.error(erro);
        tbody.innerHTML = '<tr><td colspan="6" style="color:red; text-align:center; padding: 20px;">Erro de conexão com o servidor.</td></tr>';
    }
}

// 2. Desenha a tabela com base no filtro atual
function renderizarTabela() {
    const tbody = document.getElementById('tabela-pedidos-body');
    tbody.innerHTML = '';

    // Filtra a lista com base no botão clicado
    let encomendasParaMostrar = todasAsEncomendas;
    if (filtroAtual !== 'TODOS') {
        encomendasParaMostrar = todasAsEncomendas.filter(pedido => pedido.status === filtroAtual);
    }

    if (encomendasParaMostrar.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px; color: #888;">Nenhuma encomenda encontrada para este filtro.</td></tr>';
        return;
    }

    // Exibe os mais recentes primeiro
    [...encomendasParaMostrar].reverse().forEach(pedido => {
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
}

// 3. Aplica o filtro quando o utilizador clica num botão
function aplicarFiltro(statusDesejado, botaoClicado) {
    filtroAtual = statusDesejado;

    // Remove a cor vermelha de todos os botões (deixa-os cinzentos)
    const botoes = document.querySelectorAll('.btn-filtro');
    botoes.forEach(btn => {
        btn.style.borderColor = '#333';
        btn.style.color = '#888';
    });

    // Pinta o botão que foi clicado com as cores da marca
    botaoClicado.style.borderColor = 'var(--brand-red, #ff0000)';
    botaoClicado.style.color = 'white';

    // Redesenha a tabela
    renderizarTabela();
}

// 4. Atualiza o estado no servidor
async function atualizarStatusPedido(idPedido, novoStatus) {
    if (!confirm(`Confirmar alteração da encomenda #${idPedido} para ${novoStatus}?`)) return;

    try {
        const resposta = await fetch(`http://localhost:8080/api/pedidos/${idPedido}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoStatus)
        });

        if (resposta.ok) {
            // Adicionei a sua notificação de sucesso aqui!
            mostrarNotificacao(`✅ Encomenda #${idPedido} atualizada para ${novoStatus}!`, 'sucesso');
            carregarPedidos(); // Recarrega os dados do servidor
        } else {
            mostrarNotificacao('❌ Erro ao atualizar status.', 'erro');
        }
    } catch (erro) {
        console.error(erro);
        mostrarNotificacao('❌ Erro de conexão com o servidor.', 'erro');
    }
}

// 5. Calcula e atualiza os cartões de métricas no topo da página
function atualizarMetricas() {
    let faturamento = 0;
    let pendentes = 0;
    let enviados = 0;

    todasAsEncomendas.forEach(pedido => {
        // Soma o dinheiro de todos os pedidos, exceto os cancelados
        if (pedido.status !== 'CANCELADO') {
            faturamento += pedido.valorTotal;
        }
        
        // Conta as quantidades
        if (pedido.status === 'AGUARDANDO PAGAMENTO') pendentes++;
        if (pedido.status === 'ENVIADO') enviados++;
    });

    // Atualiza os textos no ecrã
    document.getElementById('metrica-faturamento').innerText = `R$ ${faturamento.toFixed(2).replace('.', ',')}`;
    document.getElementById('metrica-pendentes').innerText = pendentes;
    document.getElementById('metrica-enviados').innerText = enviados;
}