let paginaAtual = 1;

document.addEventListener('DOMContentLoaded', () => {
    carregarHistorico(paginaAtual);

    document.getElementById('btn-anterior').addEventListener('click', () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            carregarHistorico(paginaAtual);
        }
    });

    document.getElementById('btn-proximo').addEventListener('click', () => {
        paginaAtual++;
        carregarHistorico(paginaAtual);
    });
});

async function carregarHistorico(pagina) {
    const tbody = document.getElementById('tabela-corpo');
    const btnAnt = document.getElementById('btn-anterior');
    const btnProx = document.getElementById('btn-proximo');
    const infoPag = document.getElementById('info-pagina');

    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">A carregar...</td></tr>';

    try {
        const response = await fetch(`../api/historico.php?page=${pagina}`);
        const dados = await response.json();

        tbody.innerHTML = '';

        if (dados.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Sem registo de compras.</td></tr>';
            btnProx.disabled = true;
            return;
        }

        dados.data.forEach(compra => {
            const row = `
                <tr>
                    <td>${compra.data}</td>
                    <td>${compra.quantidade}</td>
                    <td>${compra.preco}</td>
                    <td>${compra.metodo}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

        infoPag.textContent = `Página ${dados.pagina_atual} de ${dados.total_paginas}`;
        
        btnAnt.disabled = (pagina <= 1);
        
        btnProx.disabled = (pagina >= dados.total_paginas);

    } catch (error) {
        console.error('Erro:', error);
        tbody.innerHTML = '<tr><td colspan="4" style="color:red; text-align:center;">Erro ao carregar dados.</td></tr>';
    }
}