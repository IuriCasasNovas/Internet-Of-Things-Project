/**
 * 
 * @param {object} user 
 */
function updateUI(user) {
 
  const primeiroNome = user.nome.split(' ')[0];


  const greeting = document.getElementById('greeting-name');
  if (greeting) greeting.textContent = `Olá, ${primeiroNome}!`;

  const profileName = document.getElementById('profile-name');
  if (profileName) profileName.textContent = user.nome;

  const footerUsername = document.getElementById('footer-username');
  if (footerUsername) footerUsername.textContent = user.nome;

  const profilePic = document.getElementById('profile-pic');
  if (profilePic) {
    if (user.foto) {
      profilePic.src = user.foto;
    } else {
      profilePic.src = '../img/default-profile.png'; 
    }
  }
}

async function handleLogout() {
  try {
    const response = await fetch('/logout', { method: 'POST' });
    const data = await response.json();
    
    if (response.ok) {
      console.log('Logout bem-sucedido. Redirecionando...');
      window.location.href = data.redirectTo; 
    }
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  
  try {
    const response = await fetch('/api/me'); 
    
    if (response.ok) {
      const data = await response.json();
      updateUI(data.user);
      
      loadSenhasDisponiveis(); 


    } else {
      console.warn('Utilizador não autenticado. Redirecionando para login.');
      window.location.href = '/pages/login.html';
    }
  } catch (error) {
    console.error('Erro ao buscar dados do utilizador:', error);
    window.location.href = '/pages/login.html';
  }

  
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) logoutButton.addEventListener('click', handleLogout);

  const footerLogout = document.getElementById('footer-logout');
  if (footerLogout) {
    footerLogout.addEventListener('click', (e) => {
      e.preventDefault(); 
      handleLogout();     
    });
  }
});

async function loadSenhasDisponiveis() {
  try {
    const response = await fetch('/api/senhas/disponiveis');
    
    if (response.ok) {
      const data = await response.json();
      
      const quantidadeElement = document.getElementById('senhas-quantidade');
      if (quantidadeElement) {
        quantidadeElement.textContent = data.quantidade;
      }
    } else {
      console.error('Não foi possível carregar a quantidade de senhas.');
    }
  } catch (error) {
    console.error('Erro ao buscar senhas:', error);
  }
}