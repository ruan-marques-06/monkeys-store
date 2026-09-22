document.addEventListener('DOMContentLoaded', carregarVitrine);

// Memória temporária do carrinho
let itensCarrinho = [];

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

// Busca os produtos na API e desenha a vitrine
// Memória global para a vitrine
let todosOsProdutos = []; 

// 1. Busca os dados no servidor e inicializa a tela
async function carregarVitrine() {
    const grid = document.querySelector('.product-grid');
    if (!grid) return; // Proteção extra caso não esteja na página index.html

    grid.innerHTML = '<p style="text-align: center; width: 100%;">A carregar coleção...</p>';

    try {
        const resposta = await fetch('http://localhost:8080/api/produtos');
        if (!resposta.ok) throw new Error('Falha ao comunicar com o servidor');
        
        // Guarda na memória
        todosOsProdutos = await resposta.json();
        
        // Desenha a loja inteira e monta o menu lateral dinâmico
        renderizarProdutos(todosOsProdutos);
        renderizarCategorias();

    } catch (erro) {
        console.error(erro);
        grid.innerHTML = '<p style="color: var(--btn-red); text-align: center; width: 100%;">Erro ao carregar o catálogo. O backend está a correr?</p>';
    }
}

// 2. Desenha os "cards" das roupas no ecrã
function renderizarProdutos(listaDeProdutos) {
    const grid = document.querySelector('.product-grid');
    grid.innerHTML = ''; 

    if (listaDeProdutos.length === 0) {
        grid.innerHTML = '<p style="text-align: center; width: 100%; color: #888;">Nenhuma peça encontrada para este filtro.</p>';
        return;
    }

    listaDeProdutos.forEach(produto => {
        const card = `
            <article class="card">
                <div class="image-wrapper">
                    <img src="${produto.imagemUrl || 'img/placeholder.png'}" alt="${produto.nome}">
                </div>
                <div class="card-info">
                    <h2 class="title">${produto.nome}</h2>
                    <span class="price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                    <button class="btn-cart" onclick="adicionarAoCarrinho(${produto.id}, '${produto.nome}', ${produto.preco}, '${produto.imagemUrl}')">
                        ADICIONAR AO CARRINHO
                    </button>
                </div>
            </article>
        `;
        grid.innerHTML += card;
    });
}

// 3. Lê o banco de dados e cria os botões do menu
function renderizarCategorias() {
    const lista = document.getElementById('lista-categorias');
    if (!lista) return;

    // Filtra categorias vazias e remove duplicados
    const categoriasBrutas = todosOsProdutos
        .map(produto => produto.categoria)
        .filter(categoria => categoria != null && categoria.trim() !== '');
    
    const categoriasUnicas = [...new Set(categoriasBrutas)].sort();

    // Começa sempre com o botão "Todas as Peças" (repare que ele já ganha a classe 'ativo')
    let html = `<li><a href="#" onclick="filtrarPorCategoria('TODAS', this)" class="link-categoria ativo">Todas as Peças</a></li>`;

    // Cria os restantes botões
    categoriasUnicas.forEach(categoria => {
        html += `<li><a href="#" onclick="filtrarPorCategoria('${categoria}', this)" class="link-categoria">${categoria}</a></li>`;
    });

    lista.innerHTML = html;
}

// 4. Acionado quando clica numa categoria do menu
function filtrarPorCategoria(categoriaDesejada, elementoClicado) {
    if (event) event.preventDefault(); // Evita que a página salte para o topo

    // 1. Gere a parte visual: remove a classe 'ativo' de todos e coloca só no clicado
    if (elementoClicado) {
        document.querySelectorAll('.link-categoria').forEach(link => {
            link.classList.remove('ativo');
        });
        elementoClicado.classList.add('ativo');
    }

    // 2. Gere os dados: Filtra e redesenha a vitrine
    if (categoriaDesejada === 'TODAS') {
        renderizarProdutos(todosOsProdutos);
    } else {
        const filtrados = todosOsProdutos.filter(produto => 
            produto.categoria && produto.categoria.toUpperCase() === categoriaDesejada.toUpperCase()
        );
        renderizarProdutos(filtrados);
    }
}

// Adiciona o item na lista e abre a barra lateral
function adicionarAoCarrinho(id, nome, preco, imagem) {
    itensCarrinho.push({ id, nome, preco, imagem });
    renderizarCarrinho();
    abrirSidebar();
}

// Desenha os itens dentro da barra lateral e soma o total
function renderizarCarrinho() {
    let html = '';
    let total = 0;

    if (itensCarrinho.length === 0) {
        document.getElementById('itens-sidebar').innerHTML = '<p style="text-align:center; color:gray; margin-top: 20px;">O seu carrinho está vazio.</p>';
        document.getElementById('total-sidebar').innerText = 'R$ 0,00';
        return;
    }

    itensCarrinho.forEach((item, index) => {
        total += item.preco;
        html += `
            <div class="item-carrinho">
                <img src="${item.imagem}" alt="${item.nome}" onerror="this.src='img/placeholder.png'">
                <div style="flex-grow: 1;">
                    <p style="margin: 0; font-size: 14px;">${item.nome}</p>
                    <p style="margin: 5px 0 0; color: var(--price-green); font-weight: bold;">
                        R$ ${item.preco.toFixed(2).replace('.', ',')}
                    </p>
                </div>
                <button onclick="removerDoCarrinho(${index})" style="background: transparent; border: none; color: var(--btn-red); cursor: pointer; font-size: 16px;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });

    document.getElementById('itens-sidebar').innerHTML = html;
    document.getElementById('total-sidebar').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Remove o item e atualiza o visual da barra
function removerDoCarrinho(index) {
    itensCarrinho.splice(index, 1);
    renderizarCarrinho();
}

// Abre a barra lateral
function abrirSidebar() {
    document.getElementById('carrinho-sidebar').classList.add('aberto');
    document.getElementById('carrinho-overlay').style.display = 'block';
}

// Fecha a barra lateral
function fecharCarrinhos() {
    document.getElementById('carrinho-sidebar').classList.remove('aberto');
    document.getElementById('carrinho-overlay').style.display = 'none';
}

async function finalizarPedido() {
    if (itensCarrinho.length === 0) {
        alert("O seu carrinho está vazio.");
        return;
    }

    // 1. VERIFICA SE O CLIENTE ESTÁ LOGADO
    const usuarioJSON = localStorage.getItem('usuarioLogado');

    // Se não houver dados salvos, bloqueia a compra e manda para o login
    if (!usuarioJSON) {
        mostrarNotificacao("Por favor, faça login ou crie uma conta para finalizar a sua encomenda.");
        window.location.href = 'login.html';
        return; // Para a função aqui
    }

    // Desempacota os dados do cliente que o login.js guardou
    const usuarioLogado = JSON.parse(usuarioJSON);
    const idDoClienteLogado = usuarioLogado.id;

    // Calcula o total e formata os itens para o Java
    let total = 0;
    const itensFormatados = itensCarrinho.map(item => {
        total += item.preco;
        return {
            produtoId: item.id,
            quantidade: 1, 
            precoUnitario: item.preco
        };
    });

    // 2. MONTA O PEDIDO COM O ID REAL
    const payload = {
        clienteId: idDoClienteLogado, // Substituímos o "1" pelo ID de quem fez login
        valorTotal: total,
        itens: itensFormatados
    };

    try {
        const resposta = await fetch('http://localhost:8080/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (resposta.ok) {
            mostrarNotificacao("🚀 Encomenda finalizada com sucesso!", "sucesso"); 
            itensCarrinho = []; 
            renderizarCarrinho(); 
            fecharCarrinhos();
        } else {
            mostrarNotificacao("⚠️ Falha ao processar encomenda.");
        }
    } catch (erro) {
        console.error(erro);
        mostrarNotificacao("❌ Erro de conexão com o Servidor.");
    }
}