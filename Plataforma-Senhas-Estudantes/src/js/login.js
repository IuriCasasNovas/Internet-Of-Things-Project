document.addEventListener('DOMContentLoaded', () => {
  
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      errorMessage.textContent = '';

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('../api/login.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({ 
            email_Pessoa: email, 
            password_Pessoa: password 
          }) 
        });

        const data = await response.json();

        if (response.ok) {
          try {

            if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
            if (data.role) localStorage.setItem('role', data.role);
          } catch (e) {
            console.warn('Não foi possível guardar dados do utilizador no localStorage:', e);
          }
          window.location.href = data.redirectTo;
        } else {
          errorMessage.textContent = data.message;
        }

      } catch (error) {
        console.error('Erro ao tentar fazer login:', error);
        errorMessage.textContent = 'Não foi possível ligar ao servidor.';
      }
    });
  }
});