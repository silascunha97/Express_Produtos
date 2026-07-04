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
    },
    role: {
      type: 'varchar',
      default: 'cliente',
    },
  },
});
 
module.exports = { User };