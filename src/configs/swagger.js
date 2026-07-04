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
    ],
    components: {
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
      },
    },
  },
  // path.join resolve o caminho de forma absoluta independente de onde o comando 'node' foi disparado
  apis: [path.join(__dirname, '..', 'routes', '*.js')], 
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = swaggerDocs;