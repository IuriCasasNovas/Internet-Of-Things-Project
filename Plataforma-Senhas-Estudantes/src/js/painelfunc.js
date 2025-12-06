const tabelaBody = document.querySelector("table tbody");
const verMaisBtn = document.querySelector("#ver-mais button");

let todasValidacoes = []; // Guarda todos os dados do PHP
const mostrarInicial = 5; // Número de linhas a mostrar inicialmente
let verMaisClicado = false; // Sinaliza se o botão foi clicado

async function atualizarTabela() {
  try {
    const resposta = await fetch("http://localhost:3000/api/get_validacoes.php");
    const dados = await resposta.json();
    todasValidacoes = dados; // Atualiza array global

    if (!verMaisClicado) {
      // Mostra só as primeiras linhas
      preencherTabela(todasValidacoes.slice(0, mostrarInicial));
    } else {
      // Já clicou "Ver mais", mostra tudo
      preencherTabela(todasValidacoes);
    }
  } catch (e) {
    console.error("Erro ao carregar dados:", e);
  }
}

function preencherTabela(linhas) {
  // Limpa tabela atual
  tabelaBody.innerHTML = "";

  // Adiciona linhas
  linhas.forEach((row) => {
    const tr = document.createElement("tr");
    const estadoClass = row.Resultado.toLowerCase() === "valido" ? "estado válido" : "estado inválido";
    tr.innerHTML = `
      <td>${row.Nome}</td>
      <td>${row.Numero_Aluno}</td>
      <td><span class="${estadoClass}">${row.Resultado}</span></td>
      <td>${row.Data_Hora}</td>
    `;
    tabelaBody.appendChild(tr);
  });
}

// Evento do botão "Ver mais"
verMaisBtn.addEventListener("click", () => {
  verMaisClicado = true;
  preencherTabela(todasValidacoes); // Mostra todas as linhas
  verMaisBtn.parentElement.style.display = "none"; // Oculta o botão
});

async function handleLogout() {
  try {
    const response = await fetch('../api/logout.php', { method: 'POST' });
    const data = await response.json();
    
    if (response.ok) {
      console.log('Logout bem-sucedido. Redirecionando...');
      window.location.href = data.redirectTo; 
    }
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
}

function attachEventListeners() {
  const logoutButton = document.getElementById('logout-btn');
  const footerLogout = document.getElementById('footer-logout');
  

  if (logoutButton) logoutButton.addEventListener('click', handleLogout);
  if (footerLogout) {
    footerLogout.addEventListener('click', (e) => {
      e.preventDefault(); 
      handleLogout();     
    });
  }
}


// Abre/fecha o menu lateral no mobile
function toggleMenu() {
    const menu = document.getElementById("mobileMenu");
    menu.classList.toggle("open");
}
