require('dotenv').config();
require('reflect-metadata');

const fs = require('fs');
const path = require('path');
const AppDataSource = require('../src/configs/database');
const { Produto } = require('../src/entities/Product.entities');

async function seedProdutos() {
  const caminhoArquivo = path.join(__dirname, '..', 'produtos-teste.json');
  const produtosParaInserir = JSON.parse(fs.readFileSync(caminhoArquivo, 'utf-8'));

  await AppDataSource.initialize();
  const produtoRepository = AppDataSource.getRepository(Produto);

  let criados = 0;
  let atualizados = 0;

  for (const dadosProduto of produtosParaInserir) {
    const existente = await produtoRepository.findOneBy({ name: dadosProduto.name });

    if (existente) {
      existente.price = dadosProduto.price;
      existente.estoque = dadosProduto.estoque;
      await produtoRepository.save(existente);
      atualizados += 1;
      continue;
    }

    await produtoRepository.save(produtoRepository.create(dadosProduto));
    criados += 1;
  }

  console.log(`Seed concluído: ${criados} produto(s) criado(s), ${atualizados} já existente(s) atualizado(s) com preço/estoque da massa de teste.`);
  await AppDataSource.destroy();
}

seedProdutos().catch((error) => {
  console.error('Erro ao popular produtos:', error);
  process.exit(1);
});
