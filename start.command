#!/bin/bash
echo "A iniciar o servidor PHP..."
echo "Raiz do site definida para a pasta 'src'."
echo
echo "Abre este link no browser:"
echo "http://localhost:3000/pages/login.html"
echo

# Caminho para o PHP do MAMP
/Applications/MAMP/bin/php/php8.1.31/bin/php -S localhost:3000 -t /Users/iurinovas/Escola/IPS/Internet-Of-Things-Project/Plataforma-Senhas-Estudantes/src
