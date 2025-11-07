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
        const response = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password }) 
        });

        const data = await response.json();

        if (response.ok) {
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