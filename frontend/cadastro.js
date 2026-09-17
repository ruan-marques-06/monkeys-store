// 1. A função matemática (O Motor)
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '' || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11)) resto = 0;
    if (resto != parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11)) resto = 0;
    if (resto != parseInt(cpf.substring(10, 11))) return false;
    return true;
}

// 2. A conexão com a tela (O Volante)
const campoCpf = document.getElementById('cpf');

// O evento 'blur' dispara assim que o usuário tira o cursor do campo do CPF
campoCpf.addEventListener('blur', function() {
    const cpfDigitado = campoCpf.value;

    // Se o campo estiver vazio, não faz a validação
    if (cpfDigitado === '') {
        campoCpf.style.borderColor = '#444'; // Volta para a cor padrão
        return; 
    }

    // Chama a função matemática
    if (validarCPF(cpfDigitado)) {
        // RESPOSTA POSITIVA: CPF Válido - Borda fica verde
        campoCpf.style.borderColor = '#00ff00';
    } else {
        // RESPOSTA NEGATIVA: CPF Inválido - Borda fica vermelha e mostra um aviso
        campoCpf.style.borderColor = '#e60000';
        alert('O CPF digitado é inválido! Por favor, corrija.');
        
        // Opcional: Apaga o CPF errado para forçar o usuário a digitar de novo
        campoCpf.value = ''; 
    }
});

// Captura o formulário de cadastro
document.getElementById('form-cadastro').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita que a página recarregue do zero

    // Captura os valores que o cliente digitou
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const cpf = document.getElementById('cpf').value;
    const telefone = document.getElementById('telefone').value;
    const botao = event.target.querySelector('button');

    // Faz a validação matemática do CPF mais uma vez antes de enviar
    if (!validarCPF(cpf)) {
        alert("Por favor, digite um CPF válido antes de continuar.");
        return;
    }

    // Muda o botão para dar um feedback visual
    botao.textContent = 'Enviando código...';
    botao.disabled = true;

    try {
        // Dispara os dados para a nova rota do Spring Boot
        const resposta = await fetch('http://localhost:8080/api/usuarios/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, senha, cpf, telefone })
        });

        if (resposta.ok) {
            // Removemos o alert antigo para a navegação ficar fluida e já mandamos pra tela nova!
            // O encodeURIComponent garante que símbolos como '@' passem sem quebrar a URL
            window.location.href = `verificacao.html?email=${encodeURIComponent(email)}`;
        } else {
            // Se o e-mail já existir no banco, o Java vai mandar um erro
            const mensagemErro = await resposta.text();
            alert('Erro: ' + mensagemErro);
            botao.textContent = 'Cadastrar';
            botao.disabled = false;
        }
    } catch (erro) {
        console.error('Erro ao conectar:', erro);
        alert('Servidor fora do ar. Tente novamente mais tarde.');
        botao.textContent = 'Cadastrar';
        botao.disabled = false;
    }
});