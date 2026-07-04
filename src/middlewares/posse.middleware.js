const AppDataSource = require('../configs/database');
const { Produto } = require('../entities/Product.entities');

const garantirDonoDoProduto = async (req, res, next) => {
  try {
    const produtoId = parseInt(req.params.id, 10);
    const { id: usuarioLogadoId, role } = req.usuarioLogado;

    const produtoRepository = AppDataSource.getRepository(Produto);
    const produto = await produtoRepository.findOne({
      where: { id: produtoId },
      relations: { vendedor: true },
    });

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    // Administradores podem alterar qualquer produto (moderação)
    if (role === 'admin') {
      req.produtoBuscado = produto;
      return next();
    }

    if (!produto.vendedor || produto.vendedor.id !== usuarioLogadoId) {
      return res.status(403).json({
        error: 'Acesso negado. Você não tem permissão para alterar um produto que não é seu.',
      });
    }

    req.produtoBuscado = produto;
    next();
  } catch (error) {
    console.error('Erro ao validar posse do produto:', error);
    res.status(500).json({ error: 'Erro interno ao validar posse do recurso.' });
  }
};

module.exports = { garantirDonoDoProduto };
