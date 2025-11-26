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