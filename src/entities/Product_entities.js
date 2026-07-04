const { EntitySchema } = require('typeorm');

// Como estamos usando JavaScript puro, usamos EntitySchema para definir a tabela.
// Se fosse TypeScript, usaríamos decoradores com classes (@Entity, @PrimaryGeneratedColumn, etc.)
const Produto = new EntitySchema({
  name: 'Produto',
  tableName: 'produtos',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'varchar',
    },
    price: {
      type: 'decimal',
      precision: 10,
      scale: 2,
    },
  },
});

module.exports = { Produto };