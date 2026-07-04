FROM node:22-alpine
WORKDIR /app

# bcrypt já traz binário pré-compilado para linux-musl-x64, então não é
# necessário instalar toolchain de build (python3/make/g++) nesta imagem.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
