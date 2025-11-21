@echo off
echo A iniciar o servidor PHP...
echo A RAIS do site foi definida para a pasta 'src'.
echo.
echo Acede a este link (mais curto):
echo http://localhost:3000/pages/login.html
echo.
"C:\MAMP\bin\php\php8.1.0\php.exe" -S localhost:3000 -t Plataforma-Senhas-Estudantes/src
pause