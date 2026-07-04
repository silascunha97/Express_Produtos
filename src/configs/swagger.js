const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path'); // Módulo nativo do Node para manipulação de caminhos

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Comercial de Produtos',
      version: '1.0.0',
      description: 'Documentação robustaizada com Express e Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local de Desenvolvimento',
      },
    ],
    tags: [
      {
        name: 'Produtos',
        description: 'Operações relacionadas aos produtos',
      },
      {
        name: 'Autenticação',
        description: 'Operações de registro e login de usuários',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Produto: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Teclado Mecânico',
            },
            price: {
              type: 'number',
              format: 'decimal',
              example: 199.9,
            },
          },
        },
        ProdutoInput: {
          type: 'object',
          required: ['name', 'price'],
          properties: {
            name: {
              type: 'string',
              example: 'Teclado Mecânico',
            },
            price: {
              type: 'number',
              format: 'decimal',
              example: 199.9,
            },
          },
        },
        UsuarioCadastro: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Augusto' },
            email: { type: 'string', format: 'email', example: 'augusto@email.com' },
            password: { type: 'string', format: 'password', example: 'senha123' },
          },
        },
        UsuarioRespostaLogin: {
          type: 'object',
          properties: {
            token_type: { type: 'string', example: 'Bearer' },
            access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            expires_in: { type: 'string', example: '2h' },
          },
        },
      },
    },
  },
  // path.join resolve o caminho de forma absoluta independente de onde o comando 'node' foi disparado
  apis: [path.join(__dirname, '..', 'routes', '*.js')], 
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = swaggerDocs;