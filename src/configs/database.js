require('reflect-metadata');
const { DataSource } = require('typeorm');
const { Produto } = require('../entities/Product_entities'); // Vamos criar a entidade a seguir

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'augusto',
  password: 'ApoloCreed',
  database: 'api_produtos',
  synchronize: true, // Em desenvolvimento, cria/atualiza as tabelas automaticamente. Nunca use true em produção!
  logging: false,    // Altere para true se quiser ver os SQLs gerados no terminal
  entities: [Produto],
  subscribers: [],
  migrations: [],
});

module.exports = AppDataSource;