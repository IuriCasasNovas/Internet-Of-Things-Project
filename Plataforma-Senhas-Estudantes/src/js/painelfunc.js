document.addEventListener("DOMContentLoaded", () => {
  const tabelaBody = document.querySelector("table tbody");
  const verMaisBtn = document.querySelector("#ver-mais button");

  if (!tabelaBody || !verMaisBtn) {
    console.error("Erro: Elementos da tabela ou botão 'Ver mais' não encontrados.");
    return;
  }

  let todasValidacoes = [];
  const mostrarInicial = 5;
  let verMaisClicado = false;

  async function atualizarTabela() {
    try {
      console.log("Carregando dados da API...");
      const resposta = await fetch(`http://localhost:3000/api/get_validacoes.php?timestamp=${Date.now()}`);

      if (!resposta.ok) {
        throw new Error(`Erro na API: ${resposta.status}`);
      }

      const dados = await resposta.json();
      console.log("Dados recebidos:", dados);

      todasValidacoes = dados;

      if (!verMaisClicado) {
        preencherTabela(todasValidacoes.slice(0, mostrarInicial));
      } else {
        preencherTabela(todasValidacoes);
      }
    } catch (e) {
      console.error("Erro ao carregar dados:", e);
    }
  }

  function preencherTabela(linhas) {
    console.log("Preenchendo tabela com linhas:", linhas);

    tabelaBody.innerHTML = "";

    linhas.forEach((row) => {
      const tr = document.createElement("tr");
      const estadoClass =
        row.Resultado.toLowerCase() === "valido" ? "estado válido" : "estado inválido";

      tr.innerHTML = `
        <td>${row.Nome}</td>
        <td>${row.Numero_Aluno}</td>
        <td><span class="${estadoClass}">${row.Resultado}</span></td>
        <td>${row.Data_Hora}</td>
      `;
      tabelaBody.appendChild(tr);
    });
  }

  verMaisBtn.addEventListener("click", () => {
    console.log("Botão 'Ver mais' clicado");
    verMaisClicado = true;
    preencherTabela(todasValidacoes);
    verMaisBtn.parentElement.style.display = "none";
  });

  // Atualiza a tabela a cada 5 segundos
  setInterval(atualizarTabela, 2500);

  // Carrega os dados inicialmente
  atualizarTabela();
});
