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

if (campoCpf) {
    campoCpf.addEventListener('blur', function() {
        const cpfDigitado = campoCpf.value;

        if (cpfDigitado === '') {
            campoCpf.style.borderColor = '#444'; 
            return; 
        }

        if (validarCPF(cpfDigitado)) {
            campoCpf.style.borderColor = '#00ff00';
        } else {
            campoCpf.style.borderColor = '#e60000';
            alert('O CPF digitado é inválido! Por favor, corrija.');
            campoCpf.value = ''; 
        }
    });
}

// Captura o formulário de cadastro
document.getElementById('form-cadastro').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const cpf = document.getElementById('cpf').value;
    const telefone = document.getElementById('telefone').value;
    const cep = document.getElementById('cep').value;
    const rua = document.getElementById('rua').value;
    const numero = document.getElementById('numero').value;
    const cidade = document.getElementById('cidade').value;
    const botao = event.target.querySelector('button');

    if (!validarCPF(cpf)) {
        alert("Por favor, digite um CPF válido antes de continuar.");
        return;
    }

    botao.textContent = 'Enviando código...';
    botao.disabled = true;

    try {
        const resposta = await fetch('http://localhost:8080/api/usuarios/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                nome, 
                email, 
                senha, 
                cpf, 
                telefone,
                cep,
                rua,
                numero,
                cidade 
            })
        });

        if (resposta.ok) {
            window.location.href = `verificacao.html?email=${encodeURIComponent(email)}`;
        } else {
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