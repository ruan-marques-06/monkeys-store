document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-maker');

    const converterParaBase64 = (arquivo) => {
        return new Promise((resolve, reject) => {
            const leitor = new FileReader();
            leitor.readAsDataURL(arquivo);
            leitor.onload = () => resolve(leitor.result);
            leitor.onerror = (erro) => reject(erro);
        });
    };

    form.addEventListener('submit', async (evento) => {
        evento.preventDefault(); 

        const arquivoFoto = document.getElementById('imagemFile').files[0];
        const imagemBase64 = await converterParaBase64(arquivoFoto);

        const novoProduto = {
            nome: document.getElementById('nome').value,
            marca: document.getElementById('marca').value,
            tipo: document.getElementById('tipo').value,
            preco: parseFloat(document.getElementById('preco').value),
            imagemUrl: imagemBase64
        };

        try {
            const resposta = await fetch('http://localhost:8080/api/produtos/maker/adicionar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novoProduto)
            });

            if (resposta.ok) {
                alert('Peça adicionada com sucesso ao banco de dados!');
                form.reset(); 
            } else {
                alert('Erro ao salvar a peça. Verifique o terminal do Java.');
            }
        } catch (erro) {
            console.error('Falha de conexão:', erro);
            alert('Não foi possível conectar com a API.');
        }
    });
});