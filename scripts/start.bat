@echo off
echo 🚀 Iniciando Quiz Builder Backend...

REM Verificar se o Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não está instalado. Por favor, instale o Node.js primeiro.
    pause
    exit /b 1
)

REM Verificar se o MySQL está rodando
echo 🔍 Verificando conexão com MySQL...
mysql -u root -e "SELECT 1;" >nul 2>&1
if errorlevel 1 (
    echo ❌ Não foi possível conectar ao MySQL. Certifique-se de que o MySQL está rodando.
    echo 💡 Dica: Inicie o MySQL com: net start mysql
    pause
    exit /b 1
)

echo ✅ MySQL está rodando

REM Instalar dependências
echo 📦 Instalando dependências...
call npm install

REM Criar arquivo .env se não existir
if not exist .env (
    echo 📝 Criando arquivo .env...
    copy env.example .env
    echo ✅ Arquivo .env criado. Configure as variáveis de ambiente se necessário.
)

REM Executar script SQL para criar tabelas
echo 🗄️ Configurando banco de dados...
mysql -u root < scripts/create-tables.sql

REM Compilar o projeto
echo 🔨 Compilando o projeto...
call npm run build

REM Iniciar a aplicação
echo 🎉 Iniciando a aplicação...
echo 📚 Documentação Swagger: http://localhost:3000/api
echo 🛑 Para parar a aplicação, pressione Ctrl+C
call npm run start:dev 