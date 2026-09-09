# 🚀 Projeto Full Stack Dockerizado

Este é um projeto Full Stack com arquitetura moderna e totalmente distribuída, utilizando **Containers Docker** para garantir a consistência do ambiente de desenvolvimento à produção.

## 🌐 Arquitetura do Ecossistema

O projeto é dividido em três camadas independentes e isoladas:

1. **Frontend (Interface):** Hospedado de forma estática no **GitHub Pages**.
2. **Backend (API):** Encapsulado em um container **Docker** e hospedado no **Render**.
3. **Database (Banco de Dados):** Banco NoSQL em nuvem gerenciado pelo **MongoDB Atlas**.


---

## 🐋 Utilização do Docker neste projeto (Vantagens Práticas)

A inclusão do Docker no Backend trouxe melhorias estratégicas para o ciclo de vida da aplicação:

* **Paridade entre Ambientes:** O ambiente de execução na máquina local é 100% idêntico ao servidor de produção do Render, eliminando o clássico erro *"funciona na minha máquina"*.
* **Portabilidade de Nuvem:** O backend tornou-se independente de provedor. Caso seja necessário migrar do Render para a AWS ou Google Cloud, nenhuma linha de código precisará ser alterada — basta mover o container.
* **Isolamento de Dependências:** O runtime da linguagem e as dependências ficam trancados dentro do container, sem poluir o sistema operacional da máquina host.
* **Setup em 1 Clique:** Qualquer desenvolvedor pode rodar o backend localmente sem precisar instalar ferramentas ou linguagens globais em seu computador.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3, JavaScript (GitHub Pages)
* **Backend:** Node.js / Express *(ou adicione sua tecnologia de preferência)* rodando dentro de um container Linux Alpine.
* **DevOps:** Docker, Render Cloud
* **Banco de Dados:** MongoDB Atlas (Mongoose)

---

## 🚀 Como Rodar o Backend Localmente com Docker

Para testar o ambiente idêntico ao de produção no seu computador, certifique-se de ter o **Docker** instalado e siga os passos:

### 1. Clonar o repositório
```bash
git clone https://github.com
cd NOME_DO_REPOSITORIO/backend
```

### 2. Construir a Imagem Docker
```bash
docker build -t meu-backend-app .
```

### 3. Rodar o Container
Para iniciar o servidor passando a conexão com o MongoDB Atlas com segurança por variável de ambiente:

```bash
docker run -d \
  -p 3000:3000 \
  -e MONGODB_URI="sua_string_de_conexao_do_mongodb_atlas" \
  --name backend-rodando \
  meu-backend-app
```

O seu backend estará respondendo em `http://localhost:3000`.

---

## 📦 Estrutura do Dockerfile Utilizado

O container foi construído focando em performance e leveza utilizando uma imagem base otimizada (`alpine`):

```dockerfile
# 1. Imagem ultra-leve da linguagem
FROM node:20-alpine

# 2. Diretório de trabalho isolado
WORKDIR /usr/src/app

# 3. Cache de dependências
COPY package*.json ./
RUN npm install --production

# 4. Cópia segura dos arquivos do servidor
COPY . .

# 5. Inicialização da API
CMD ["npm", "start"]
```

---

## 🔒 Configuração de Segurança (CORS)

Como o frontend e o backend estão em servidores diferentes, o backend utiliza a política de **CORS (Cross-Origin Resource Sharing)** para permitir conexões seguras. 

No código do backend, a liberação está configurada de forma explícita para aceitar requisições apenas da URL oficial do GitHub Pages:

```javascript
const cors = require('cors');

const corsOptions = {
  origin: 'https://github.io', // URL final do seu GitHub Pages (sem a barra "/" no final)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions));
```

---

## ⚙️ Guia de Manutenção: Variáveis de Ambiente

Nenhuma credencial sensível (como senhas do banco de dados ou chaves de criptografia) fica salva no código ou dentro do Dockerfile. Tudo é gerenciado externamente.

### Como adicionar novas variáveis no futuro (Ex: chaves JWT, APIs terceiras):

1. **Localmente (Docker CLI):** Ao rodar o container na sua máquina, injete a nova variável adicionando a flag `-e` no comando de inicialização:
   ```bash
   docker run -d -p 3000:3000 -e MONGODB_URI="..." -e MINHA_NOVA_CHAVE="valor_secreto" meu-backend-app
   ```
2. **Em Produção (Painel do Render):**
   * Acesse o painel do seu Web Service no **Render**.
   * No menu lateral esquerdo, clique na aba **Environment**.
   * Clique em **Add Environment Variable**.
   * Preencha os campos `Key` e `Value` com as novas configurações.
   * Clique em **Save Changes**. O Render criará um novo build do container aplicando as novas chaves imediatamente.

---

## 💡 Notas de Produção (Render Free Tier)
Como o backend está hospedado no plano gratuito do Render, o container entra em modo de suspensão (*sleep*) após 15 minutos de inatividade. A primeira requisição feita pelo Frontend (GitHub Pages) após esse período pode demorar cerca de **50 segundos** para responder enquanto o container Docker é reinicializado automaticamente.