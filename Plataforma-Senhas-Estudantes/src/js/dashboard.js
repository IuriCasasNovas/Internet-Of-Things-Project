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
    
    const greeting = document.getElementById('greeting-name');
    if (greeting) greeting.textContent = `Olá, ${primeiroNome}!`;

    const profileName = document.getElementById('profile-name');
    if (profileName) profileName.textContent = user.nome;

    const footerUsername = document.getElementById('footer-username');
    if (footerUsername) footerUsername.textContent = user.nome;

    updateProfilePictures(user.foto);

  } catch (error) {
    console.error("Erro ao atualizar a UI:", error, user);
  }
}

async function loadSenhasDisponiveis() {
  try {
    const response = await fetch('/api/senhas/disponiveis');
    if (!response.ok) {
      console.error('Não foi possível carregar a quantidade de senhas.');
      return;
    }
    
    const data = await response.json();
    const quantidadeElement = document.getElementById('senhas-quantidade');
    if (quantidadeElement) {
      quantidadeElement.textContent = data.quantidade;
    }

  } catch (error) {
    console.error('Erro de rede ao buscar senhas:', error);
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

async function uploadProfilePic(file) {
  const formData = new FormData();
  formData.append('profilePic', file); 

    try {
      const response = await fetch('/api/profile/picture', {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Upload bem-sucedido:', data.message);
      updateProfilePictures(data.newPath);
      document.getElementById('confirm-modal').style.display = 'none';
      ficheiroSelecionado = null; 
    } else {
      alert(`Erro no upload: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro de rede ao enviar a foto:', error);
    alert('Erro de rede ao enviar a foto. Tente novamente.');
  }
}

function attachEventListeners() {
  const profilePic = document.getElementById('profile-pic');
  const logoutButton = document.getElementById('logout-button');
  const footerLogout = document.getElementById('footer-logout');
  const uploadModal = document.getElementById('upload-modal');
  const confirmModal = document.getElementById('confirm-modal');
  const fileInput = document.getElementById('file-input');
  const previewImage = document.getElementById('preview-image');
  const confirmUploadBtn = document.getElementById('confirm-upload');
  const cancelUpload1Btn = document.getElementById('cancel-upload-1');
  const cancelUpload2Btn = document.getElementById('cancel-upload-2');

  if (logoutButton) logoutButton.addEventListener('click', handleLogout);
  if (footerLogout) {
    footerLogout.addEventListener('click', (e) => {
      e.preventDefault(); 
      handleLogout();     
    });
  }

  if (profilePic) {
    profilePic.style.cursor = 'pointer';
    profilePic.addEventListener('click', () => {
      if(uploadModal) uploadModal.style.display = 'flex';
    });
  }

  if (cancelUpload1Btn) {
    cancelUpload1Btn.addEventListener('click', () => {
      if(uploadModal) uploadModal.style.display = 'none';
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        ficheiroSelecionado = file;
        previewImage.src = URL.createObjectURL(file); 
        if(uploadModal) uploadModal.style.display = 'none';
        if(confirmModal) confirmModal.style.display = 'flex';
      }
    });
  }

  if (cancelUpload2Btn) {
    cancelUpload2Btn.addEventListener('click', () => {
      if(confirmModal) confirmModal.style.display = 'none';
      if(uploadModal) uploadModal.style.display = 'flex';
      ficheiroSelecionado = null;
      fileInput.value = null; 
    });
  }

  if (confirmUploadBtn) {
    confirmUploadBtn.addEventListener('click', () => {
      if (ficheiroSelecionado) {
        uploadProfilePic(ficheiroSelecionado);
      }
    });
  }
}

async function initDashboard() {
  try {
    const response = await fetch('/api/me'); 
    if (!response.ok) {
      window.location.href = '/pages/login.html';
      return; 
    }

    const data = await response.json();
    updateUI(data.user); 
    
    loadSenhasDisponiveis(); 
    
    attachEventListeners();

  } catch (error) {
    console.error('Falha ao inicializar o dashboard:', error);
    window.location.href = '/pages/login.html';
  }
}

document.addEventListener('DOMContentLoaded', initDashboard);