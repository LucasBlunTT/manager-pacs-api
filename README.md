# Manager PACS API

## Descrição
Este projeto é uma API desenvolvida para gerenciar e consultar informações relacionadas a sistemas PACS (Picture Archiving and Communication System). A aplicação foi construída utilizando **Node.js**, **TypeScript**, **Express**, **TypeORM** e **PostgreSQL**, com foco em funcionalidades como relatórios volumétricos, gerenciamento de registros de exames e monitoramento de espaço em disco.

---

## 🛠 Tecnologias Utilizadas
- **Node.js**
- **TypeScript**
- **Express.js**
- **TypeORM**
- **PostgreSQL**
- **Fast XML Parser**
- **Nodemailer**
- **Winston para logs**
- **JWT (Json Web Token)**

---

## 📌 Funcionalidades Principais

✅ **Relatórios Volumétricos:** Geração de relatórios sobre modalidades de exames, quantidade de estudos e tamanho total dos arquivos.  
✅ **Gerenciamento de Registros de Exames:** Reset de registros de exames com base em número de acesso ou intervalo de datas.  
✅ **Monitoramento de Espaço em Disco:** Verificação do espaço total e livre no disco ativo.  
✅ **Leitura de Configurações XML:** Extração de configurações de conexão com o banco de dados a partir de arquivos XML.  
✅ **Envio de Emails:** Envio de emails utilizando templates HTML.  
✅ **Logs:** Registro de logs detalhados para monitoramento e depuração.  

---

## 📂 Estrutura de Pastas
/project
│   README.md    # Documentação do projeto
│   package.json # Dependências do projeto
│   tsconfig.json # Configuração TypeScript
│   .env         # Variáveis de ambiente
│
├── src
│   ├── config         # Configurações do projeto
│   │   ├── winston.ts # Configuração de logs
│   ├── controllers    # Controladores das rotas
│   │   ├── AuthController.ts
│   │   ├── MovementController.ts
│   │   ├── ProductController.ts
│   │   ├── UserController.ts
│   ├── database       # Configuração do banco de dados e migrations
│   │   ├── migrations
│   │   │   ├── 1739911773763-CreateTableUsers.ts
│   │   │   ├── 1740078759121-CreateTableBranches.ts
│   │   │   ├── 1740078766058-CreateTableDrivers.ts
│   │   │   ├── 1740086343920-CreateTableProducts.ts
│   │   │   ├── 1740165198083-CreateTableMovements.ts
│   │   ├── data-source.ts
│   ├── entities       # Modelos de entidades TypeORM
│   │   ├── Branch.ts
│   │   ├── Driver.ts
│   │   ├── Movement.ts
│   │   ├── Product.ts
│   │   ├── User.ts
│   ├── middlewares    # Middleware de segurança e autenticação
│   │   ├── verifyAdminOrDriver.ts
│   │   ├── verifyAuthentication.ts
│   │   ├── verifyBranch.ts
│   ├── routes        # Definição das rotas do Express
│   │   ├── auth.routes.ts
│   │   ├── movements.routes.ts
│   │   ├── product.routes.ts
│   │   ├── user.routes.ts
│   ├── services      # Regras de negócio
│   │   ├── AuthService.ts
│   │   ├── MovementService.ts
│   │   ├── ProductService.ts
│   │   ├── UserService.ts
│   ├── util         # Utilitários gerais
│   │   ├── SendEmail.ts
│   ├── express.d.ts
│   ├── index.ts


---

## 📦 Instalação e Execução do Projeto

### 🔹 1. Clone o repositório
```sh
https://github.com/LucasBlunTT/manager-pacs-api.git
cd manager-pacs-api