# 1. Baixa a imagem oficial do Node.js
FROM node:20-alpine

# 2. Cria o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# 3. Copia os arquivos de dependências
COPY package*.json ./

# 4. Instala as dependências do projeto
RUN npm install --production

# 5. Copia o restante do código do backend
COPY . .

# 6. Informa a porta que o container vai expor (o Render gerencia isso automaticamente, mas é boa prática)
EXPOSE 10000

# 7. Comando para iniciar o seu servidor backend
CMD ["npm", "start"]
