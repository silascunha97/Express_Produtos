const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./configs/swagger');
const produtoRoutes = require('./routes/produto.routes');

const app = express();

// Middlewares Globais
app.use(express.json());
app.use(morgan('dev')); // Log estruturado de requisições no terminal

// Rota da Documentação
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas da Aplicação
app.use(produtoRoutes);

// Fallback para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

module.exports = app;