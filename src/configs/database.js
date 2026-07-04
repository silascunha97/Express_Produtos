require('reflect-metadata');
const { DataSource } = require('typeorm');
const { Produto } = require('../entities/Product.entities'); // Vamos criar a entidade a seguir
const { User } = require('../entities/Usuers.entities'); // Vamos criar a entidade a seguir
const { Pedido } = require('../entities/Pedido.entities');
const { ItemPedido } = require('../entities/ItemPedido');

const AppDataSource = new DataSource({
type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10), // Garante que a porta seja um número inteiro
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // Mantém a sincronização dinâmica baseada no ambiente (false em produção)
  synchronize: process.env.NODE_ENV === 'development', 
  logging: false,
  entities: [Produto, User, Pedido, ItemPedido],
  subscribers: [],
  migrations: [],
});

module.exports = AppDataSource;