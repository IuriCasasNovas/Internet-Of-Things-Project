function toggleMenu() {
  document.getElementById("mobileMenu").classList.toggle("open");
}

const verMaisBtn = document.querySelector("#ver-mais button");

const tabelaBody = document.querySelector("table tbody");


const pessoasExtras = [
  { nome: "Carla Mendes", numero: "2025000011", estado: "Válido", dataHora: "09-10-2025  12:45" },
  { nome: "Marta Sousa", numero: "2025000012", estado: "Válido", dataHora: "09-10-2025  13:10" },
  { nome: "Sara Costa", numero: "2025000013", estado: "Inválido", dataHora: "09-10-2025  14:02" },
  { nome: "Patrícia Gomes", numero: "2025000014", estado: "Válido", dataHora: "09-10-2025  14:30" },
];

verMaisBtn.addEventListener("click", () => {
  pessoasExtras.forEach((pessoa) => {
    const novaLinha = document.createElement("tr");

    novaLinha.innerHTML = `
      <td>${pessoa.nome}</td>
      <td>${pessoa.numero}</td>
      <td><span class="estado ${pessoa.estado.toLowerCase()}">${pessoa.estado}</span></td>
      <td>${pessoa.dataHora}</td>
    `;

    tabelaBody.appendChild(novaLinha);
  });

  verMaisBtn.parentElement.style.display = "none";
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