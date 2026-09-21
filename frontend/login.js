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

document.getElementById('form-login').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita que a página recarregue

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const botao = event.target.querySelector('button');

    // Feedback visual de carregamento
    botao.textContent = 'Carregando...';
    botao.disabled = true;

    try {
        // Envia os dados para a nossa API Spring Boot
        const resposta = await fetch('http://localhost:8080/api/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        if (resposta.ok) {
            const usuario = await resposta.json();

            // Salva os dados no navegador para usar depois (ex: mostrar "Olá, Nome")
            localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

            // REDIRECIONAMENTO COM BASE NA HIERARQUIA
            if (usuario.tipo === 'VENDEDOR' || usuario.tipo === 'PROPRIETARIO') {
                window.location.href = 'painel.html'; // Vai para a área da Equipe
            } else {
                window.location.href = 'index.html'; // Vai para a loja pública
            }

        } else {
            mostrarNotificacao('❌ E-mail ou senha incorretos!');
            botao.textContent = 'Entrar';
            botao.disabled = false;
        }
    } catch (erro) {
        console.error('Erro ao conectar com a API:', erro);
        mostrarNotificacao('Servidor fora do ar. Tente novamente mais tarde.');
        botao.textContent = 'Entrar';
        botao.disabled = false;
    }
});