const { EntitySchema } = require('typeorm');

const ItemPedido = new EntitySchema({
  name: 'ItemPedido',
  tableName: 'itens_pedido',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    quantidade: {
      type: 'int',
    },
    preco_unitario: {
      type: 'decimal',
      precision: 10,
      scale: 2,
    },
  },
  relations: {
    // Muitos itens pertencem a um único Pedido (Many-to-One)
    pedido: {
      type: 'many-to-one',
      target: 'Pedido',
      joinColumn: { name: 'id_pedido' },
      onDelete: 'CASCADE',
    },
    // Muitos itens apontam para um único Produto (Many-to-One)
    produto: {
      type: 'many-to-one',
      target: 'Produto', // Nome da entidade que definimos em Produto.js
      joinColumn: { name: 'id_produto' },
    },
  },
});

module.exports = { ItemPedido };