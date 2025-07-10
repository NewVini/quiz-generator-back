#!/bin/bash

echo "🚀 Iniciando Quiz Builder Backend..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verificar se o MySQL está rodando
echo "🔍 Verificando conexão com MySQL..."
if ! mysql -u root -e "SELECT 1;" &> /dev/null; then
    echo "❌ Não foi possível conectar ao MySQL. Certifique-se de que o MySQL está rodando."
    echo "💡 Dica: Inicie o MySQL com: sudo service mysql start (Linux) ou brew services start mysql (macOS)"
    exit 1
fi

echo "✅ MySQL está rodando"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp env.example .env
    echo "✅ Arquivo .env criado. Configure as variáveis de ambiente se necessário."
fi

# Executar script SQL para criar tabelas
echo "🗄️  Configurando banco de dados..."
mysql -u root < scripts/create-tables.sql

# Compilar o projeto
echo "🔨 Compilando o projeto..."
npm run build

# Iniciar a aplicação
echo "🎉 Iniciando a aplicação..."
echo "📚 Documentação Swagger: http://localhost:3000/api"
echo "🛑 Para parar a aplicação, pressione Ctrl+C"
npm run start:dev 