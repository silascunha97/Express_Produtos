//libs e pacotes necessarios para funciomamento do aplicação
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
//configs
const swaggerDocs = require('./configs/swagger');
const produtoRoutes = require('./routes/produto.routes');
const authRoutes = require('./routes/auth.routes');
const passport = require('./configs/passport'); // Importa a configuração que criamos
const oauthRoutes = require('./routes/oauth.routes');



const app = express();

// Origens permitidas via .env (lista separada por vírgula). Sem a variável, libera geral (útil em dev).
const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim());

// Middlewares Globais
app.use(cors({
  origin: allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : '*',
}));
app.use(express.json());
app.use(morgan('dev')); // Log estruturado de requisições no terminal

// Rota da Documentação
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas da Aplicação
app.use(produtoRoutes);
app.use(authRoutes); // Adiciona as rotas de autenticação
app.use(passport.initialize()); //Inicializa o ciclo de vida do Passport

// Fallback para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

module.exports = app;