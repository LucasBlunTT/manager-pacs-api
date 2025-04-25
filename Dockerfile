# Use uma imagem base menor e otimizada
FROM node:20

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie apenas os arquivos necessários para instalar dependências
COPY package.json yarn.lock ./

# Instale as dependências
RUN yarn install

# Copie apenas o código compilado
COPY build/ ./build/

# Copie o arquivo otodata-ds.xml para o diretório de build
COPY src/config/otodata-ds.xml build/config/otodata-ds.xml

# Exponha a porta que o servidor usará
EXPOSE 3333

# Comando para iniciar o servidor
CMD ["yarn", "start"]
