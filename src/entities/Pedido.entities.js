const { EntitySchema } = require('typeorm');

const Pedido = new EntitySchema({
  name: 'Pedido',
  tableName: 'pedidos',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    valor_total: {
      type: 'decimal',
      precision: 10,
      scale: 2,
    },
    criado_em: {
      type: 'timestamp',
      createDate: true, // O TypeORM preenche a data atual automaticamente
    },
  },
  relations: {
    // Um Pedido pertence a um Usuário (Many-to-One)
    usuario: {
      type: 'many-to-one',
      target: 'Usuarios', // Nome da entidade registrado em Usuers.entities.js (name: 'Usuarios')
      joinColumn: { name: 'id_usuario' }, // Nome da FK no banco de dados
      onDelete: 'CASCADE', // Se o usuário for deletado, os pedidos somem (opcional)
    },
    // Un Pedido tem muitos Itens (One-to-Many)
    itens: {
      type: 'one-to-many',
      target: 'ItemPedido', // Nome da entidade alvo
      inverseSide: 'pedido', // Nome do campo inverso lá na entidade ItemPedido
    },
  },
});

module.exports = { Pedido };