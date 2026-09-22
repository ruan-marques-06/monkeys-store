const URL_API = 'http://localhost:8080/api/produtos';

// Função auxiliar para notificações (Toastify)
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

// 1. LER: Busca todos os produtos do banco
async function carregarProdutos() {
    try {
        const resposta = await fetch(URL_API);
        const produtos = await resposta.json();
        
        const tabela = document.getElementById('tabela-corpo');
        tabela.innerHTML = ''; 

        produtos.forEach(produto => {
            const linha = document.createElement('tr');
            // Adicionada a exibição da categoria abaixo do nome do produto
            linha.innerHTML = `
                <td><img src="${produto.imagemUrl}" alt="Foto" class="img-miniatura" onerror="this.src='https://via.placeholder.com/50'"></td>
                <td>
                    <strong>${produto.nome}</strong><br>
                    <span style="color: #9b59b6; font-size: 0.8rem; text-transform: uppercase; font-weight: bold;">[${produto.categoria || 'SEM CATEGORIA'}]</span><br>
                    <small style="color: #888;">${produto.descricao}</small>
                </td>
                <td>R$ ${produto.preco.toFixed(2)}</td>
                <td>${produto.quantidadeEmEstoque} un.</td>
                <td>
                    <button class="btn-acao btn-editar" onclick='prepararEdicao(${JSON.stringify(produto)})' title="Editar"><i class="fas fa-edit"></i></button>
                    <button class="btn-acao btn-deletar" onclick="deletarProduto(${produto.id})" title="Excluir"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tabela.appendChild(linha);
        });
    } catch (erro) {
        console.error('Erro ao carregar produtos:', erro);
    }
}

// 2. CRIAR E ATUALIZAR
document.getElementById('form-maker').addEventListener('submit', async function(event) {
    event.preventDefault();

    const id = document.getElementById('produtoId').value;
    const nome = document.getElementById('nome').value;
    const categoria = document.getElementById('categoria').value; // CAPTURA DA CATEGORIA
    const descricao = document.getElementById('descricao').value;
    const preco = document.getElementById('preco').value;
    const quantidadeEmEstoque = document.getElementById('quantidade').value;
    const inputArquivo = document.getElementById('imagemUrl');

    try {
        let resposta;
        
        if (!id) {
            // MODO CRIAÇÃO (POST)
            const formData = new FormData();
            formData.append('nome', nome);
            formData.append('categoria', categoria); // ENVIO DA CATEGORIA
            formData.append('descricao', descricao);
            formData.append('preco', preco);
            formData.append('quantidadeEmEstoque', quantidadeEmEstoque);
            
            if (inputArquivo.files.length > 0) {
                formData.append('imagemFile', inputArquivo.files[0]);
            } else {
                mostrarNotificacao("Por favor, selecione uma imagem do seu computador.", "erro");
                return;
            }

            resposta = await fetch(URL_API, {
                method: 'POST',
                body: formData 
            });
        } else {
            // MODO EDIÇÃO (PUT)
            const imagemUrlAntiga = document.getElementById('imagemUrlAntiga').value;

            const produtoAtualizado = {
                nome,
                categoria, // ATUALIZAÇÃO DA CATEGORIA
                descricao,
                preco: parseFloat(preco),
                quantidadeEmEstoque: parseInt(quantidadeEmEstoque),
                imagemUrl: imagemUrlAntiga
            };

            resposta = await fetch(`${URL_API}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produtoAtualizado)
            });
        }

        if (resposta.ok) {
            mostrarNotificacao(id ? 'Produto atualizado com sucesso!' : 'Produto salvo no catálogo!', 'sucesso');
            cancelarEdicao(); 
            carregarProdutos(); 
        } else {
            mostrarNotificacao('Erro ao salvar o produto no servidor.', 'erro');
        }
    } catch (erro) {
        console.error('Erro de conexão:', erro);
        mostrarNotificacao('Erro de conexão com o servidor.', 'erro');
    }
});

// 3. DELETAR
async function deletarProduto(id) {
    if (confirm('Tem certeza que deseja apagar este produto do catálogo?')) {
        try {
            const resposta = await fetch(`${URL_API}/${id}`, { method: 'DELETE' });
            if (resposta.ok) {
                mostrarNotificacao('Produto excluído com sucesso!', 'sucesso');
                carregarProdutos();
            }
        } catch (erro) {
            console.error('Erro ao deletar:', erro);
        }
    }
}

// 4. PREPARAR EDIÇÃO
function prepararEdicao(produto) {
    document.getElementById('produtoId').value = produto.id;
    document.getElementById('nome').value = produto.nome;
    document.getElementById('categoria').value = produto.categoria || ''; // PREENCHE A CATEGORIA
    document.getElementById('descricao').value = produto.descricao;
    document.getElementById('preco').value = produto.preco;
    document.getElementById('quantidade').value = produto.quantidadeEmEstoque;
    
    let inputAntigo = document.getElementById('imagemUrlAntiga');
    if(!inputAntigo) {
        inputAntigo = document.createElement('input');
        inputAntigo.type = 'hidden';
        inputAntigo.id = 'imagemUrlAntiga';
        document.getElementById('form-maker').appendChild(inputAntigo);
    }
    inputAntigo.value = produto.imagemUrl;

    document.getElementById('imagemUrl').value = '';
    document.getElementById('imagemUrl').required = false; 

    document.getElementById('titulo-form').textContent = 'Editar Produto';
    document.getElementById('btn-salvar').textContent = 'Atualizar Catálogo';
    document.getElementById('btn-cancelar').style.display = 'block';
    
    window.scrollTo(0, 0); 
}

// 5. CANCELAR EDIÇÃO
function cancelarEdicao() {
    document.getElementById('form-maker').reset();
    document.getElementById('produtoId').value = '';
    document.getElementById('categoria').value = ''; // LIMPA A CATEGORIA
    document.getElementById('imagemUrl').required = true; 
    
    document.getElementById('titulo-form').textContent = 'Adicionar Novo Produto';
    document.getElementById('btn-salvar').textContent = 'Publicar no Catálogo';
    document.getElementById('btn-cancelar').style.display = 'none';
}

// Executa assim que a página carrega
carregarProdutos();