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
    estoque: {
      type: 'int',
      default: 0,
    },
    description: {
      type: 'text',
      nullable: true,
    },
  },
  relations: {
    // Um Produto pode estar em muitos ItensPedido (One-to-Many)
    itensPedido: {
      type: 'one-to-many',
      target: 'ItemPedido', // Nome da entidade alvo
      inverseSide: 'produto', // Nome do campo inverso lá na entidade ItemPedido
    },
    // Muitos produtos pertencem a um único vendedor (Many-to-One)
    vendedor: {
      type: 'many-to-one',
      target: 'Usuarios', // Nome da entidade registrado em Usuers.entities.js (name: 'Usuarios')
      joinColumn: { name: 'id_vendedor' },
      onDelete: 'CASCADE',
    },
  },
});

module.exports = { Produto };