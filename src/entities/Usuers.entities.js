const { EntitySchema } = require('typeorm');


const User = new EntitySchema({
  name: 'Usuarios',
  tableName: 'usuarios',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'varchar',
    },
    email: {
      type: 'varchar',
      unique: true,
    },
    password: {
      type: 'varchar',
      select: false, // nunca retorna o hash da senha por padrão em find()/findOne(), mesmo via relations
    },
    role: {
      type: 'varchar',
      default: 'cliente',
    },
    claims: {
      type: 'simple-array',
      default: 'comprar',
    },
  },
});
 
module.exports = { User };