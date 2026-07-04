const app = require('./src/app');
const AppDataSource = require('./src/configs/database');

const PORT = process.env.PORT || 3000;

// Inicializa a conexão com o banco de dados primeiro
AppDataSource.initialize()
  .then(() => {
    console.log('⚡ Conexão com o Postgres via TypeORM estabelecida com sucesso!');
    
    // Inicia o servidor HTTP apenas se o banco conectar
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ativo em http://localhost:${PORT}`);
      console.log(`📝 Swagger UI disponível em http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error('❌ Erro durante a inicialização do Data Source do TypeORM:', error);
  });