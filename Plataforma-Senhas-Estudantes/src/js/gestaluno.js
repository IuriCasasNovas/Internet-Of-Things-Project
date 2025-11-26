let ficheiroSelecionado = null;

function updateProfilePictures(fotoPath) {
  const path = fotoPath ? fotoPath : '../img/default-profile.png';
  const profilePics = document.querySelectorAll('#profile-pic, #profile-pic-footer'); 
  profilePics.forEach(pic => {
    if (pic) pic.src = path;
  });
}   

function updateUI(user) {
  try {
    const primeiroNome = user.nome.split(' ')[0];

    const profileName = document.getElementById('profile-name');
    if (profileName) profileName.textContent = user.nome;

    const footerUsername = document.getElementById('footer-username');
    if (footerUsername) footerUsername.textContent = user.nome;

    updateProfilePictures(user.foto);

  } catch (error) {
    console.error("Erro ao atualizar a UI:", error, user);
  }
}
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
  const logoutButton = document.getElementById('logout-button');
  const footerLogout = document.getElementById('footer-logout');
  

  if (logoutButton) logoutButton.addEventListener('click', handleLogout);
  if (footerLogout) {
    footerLogout.addEventListener('click', (e) => {
      e.preventDefault(); 
      handleLogout();     
    });
  }
}

async function initDashboard() {
  try {
    const response = await fetch('../api/me.php'); 
    if (!response.ok) {
      window.location.href = '/pages/login.html';
      return; 
    }

    const data = await response.json();
    updateUI(data.user); 
    
    attachEventListeners();

  } catch (error) {
    console.error('Falha ao inicializar o dashboard:', error);
    window.location.href = '/pages/login.html';
  }
}   

document.addEventListener('DOMContentLoaded', initDashboard);

document.addEventListener('DOMContentLoaded', carregarAlunos);

    async function carregarAlunos() {
        try {
            // 1. O JS pede os dados ao ficheiro PHP
            const response = await fetch('alunos.php');
            const alunos = await response.json();

            const tbody = document.getElementById('tabela-alunos-corpo');
            tbody.innerHTML = ''; // Limpa tabela atual

            // 2. Loop para criar as linhas
            alunos.forEach(aluno => {
                // Lógica de cores e textos (igual à que tinhas no design)
                const corEstado = aluno.estado === 'Ativo' ? '#00c851' : '#ff4444'; 
                const textoBotao = aluno.estado === 'Ativo' ? 'Bloquear' : 'Desbloquear';
                
                // Criar o HTML da linha
                const linha = `
                    <tr>
                        <td>${aluno.nome}</td>
                        <td>${aluno.numero_aluno}</td>
                        <td>${aluno.tipo}</td>
                        <td>
                            <span style="color: ${corEstado}; font-size: 1.2em;">●</span> 
                            ${aluno.estado}
                        </td>
                        <td>${aluno.senhas}</td>
                        <td>
                            <button class="btn-editar" onclick="editarAluno(${aluno.id})">Editar</button>
                            <button class="btn-bloquear" onclick="alterarEstado(${aluno.id})">${textoBotao}</button>
                        </td>
                    </tr>
                `;
                
                // Inserir na tabela
                tbody.innerHTML += linha;
            });

        } catch (error) {
            console.error('Erro ao carregar alunos:', error);
        }
    }

    // Funções placeholder para os botões (para configurar depois)
    function editarAluno(id) {
        console.log("Editar aluno ID:", id);
        // window.location.href = `editar_aluno.html?id=${id}`;
    }

    function alterarEstado(id) {
        console.log("Alterar estado ID:", id);
        // Aqui farias outro fetch para atualizar a base de dados
    }