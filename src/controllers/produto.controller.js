const AppDataSource = require('../configs/database');
const { Produto } = require('../entities/Product.entities');

async function listarProdutos(req, res) {
  try {
    // 1. Pegue o repositório da Entidade
    const produtoRepository = AppDataSource.getRepository(Produto);

    // 2. Use os métodos do TypeORM (Ele gera o SQL correto por debaixo dos panos)
    const produtos = await produtoRepository.find();

    res.status(200).json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro interno ao buscar produtos.' });
  }
}

async function criarProduto(req, res) {
  try {
    const { name, price, estoque } = req.body;

    // 1. Pegue o repositório da Entidade
    const produtoRepository = AppDataSource.getRepository(Produto);

    // 2. Crie uma nova instância da entidade Produto
    const novoProduto = produtoRepository.create({ name, price, estoque });

    // 3. Salve o novo produto no banco de dados
    const produtoSalvo = await produtoRepository.save(novoProduto);

    res.status(201).json(produtoSalvo);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro interno ao criar produto.' });
  }
}

async function buscarProdutoPorId(req, res) {
  try {
    const { id } = req.params;

    // 1. Pegue o repositório da Entidade
    const produtoRepository = AppDataSource.getRepository(Produto);

    // 2. Use o método findOne para buscar o produto pelo ID
    const produto = await produtoRepository.findOne({ where: { id: parseInt(id) } });

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    res.status(200).json(produto);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ error: 'Erro interno ao buscar produto.' });
  }
}

async function atualizarProduto(req, res) {
  try {
    const { id } = req.params;
    const { name, price, estoque } = req.body;

    // 1. Pegue o repositório da Entidade
    const produtoRepository = AppDataSource.getRepository(Produto);

    // 2. Busque o produto pelo ID
    const produto = await produtoRepository.findOne({ where: { id: parseInt(id) } });

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    // 3. Atualize os campos do produto
    produto.name = name !== undefined ? name : produto.name;
    produto.price = price !== undefined ? price : produto.price;
    produto.estoque = estoque !== undefined ? estoque : produto.estoque;

    // 4. Salve as alterações no banco de dados
    const produtoAtualizado = await produtoRepository.save(produto);

    res.status(200).json(produtoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar produto.' });
  }
}

async function removerProduto(req, res) {
  try {
    const { id } = req.params;

    // 1. Pegue o repositório da Entidade
    const produtoRepository = AppDataSource.getRepository(Produto);

    // 2. Busque o produto pelo ID
    const produto = await produtoRepository.findOne({ where: { id: parseInt(id) } });

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    // 3. Remova o produto do banco de dados
    await produtoRepository.remove(produto);

    res.status(200).json({ message: 'Produto removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    res.status(500).json({ error: 'Erro interno ao remover produto.' });
  }
}

module.exports = {
  listarProdutos,
  criarProduto,
  buscarProdutoPorId,
  atualizarProduto,
  removerProduto,
};
