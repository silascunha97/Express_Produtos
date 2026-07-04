const { Router } = require('express');
const AppDataSource = require('../configs/database');
const { Produto } = require('../entities/Product_entities');

const router = Router();

/**
 * @openapi
 * /produtos:
 *   get:
 *     tags:
 *       - Produtos
 *     summary: Recupera a lista de produtos via TypeORM
 *     description: Retorna todos os produtos mapeados a partir do Postgres no Docker.
 *     responses:
 *       200:
 *         description: Lista de produtos obtida com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 *       500:
 *         description: Erro interno ao buscar produtos.
 */
router.get('/produtos', async (req, res) => {
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
});

/**
 * @openapi
 * /produtos:
 *   post:
 *     tags:
 *       - Produtos
 *     summary: Cria um novo produto
 *     description: Persiste um novo produto no Postgres via TypeORM.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoInput'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       500:
 *         description: Erro interno ao criar produto.
 */
router.post('/produtos', async (req, res) => {
  try {
    const { name, price } = req.body;

    // 1. Pegue o repositório da Entidade
    const produtoRepository = AppDataSource.getRepository(Produto);

    // 2. Crie uma nova instância da entidade Produto
    const novoProduto = produtoRepository.create({ name, price });

    // 3. Salve o novo produto no banco de dados
    const produtoSalvo = await produtoRepository.save(novoProduto);

    res.status(201).json(produtoSalvo);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro interno ao criar produto.' });
  }
});

/**
 * @openapi
 * /produtos/{id}:
 *   get:
 *     tags:
 *       - Produtos
 *     summary: Recupera um produto pelo ID
 *     description: Busca um único produto no Postgres via TypeORM.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto.
 *     responses:
 *       200:
 *         description: Produto encontrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno ao buscar produto.
 */
router.get('/produtos/:id', async (req, res) => {
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
});

/**
 * @openapi
 * /produtos/{id}:
 *   put:
 *     tags:
 *       - Produtos
 *     summary: Atualiza um produto pelo ID
 *     description: Atualiza os campos de um produto existente no Postgres via TypeORM.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoInput'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno ao atualizar produto.
 */
router.put('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

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

    // 4. Salve as alterações no banco de dados
    const produtoAtualizado = await produtoRepository.save(produto);

    res.status(200).json(produtoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar produto.' });
  }
});

/**
 * @openapi
 * /produtos/{id}:
 *   delete:
 *     tags:
 *       - Produtos
 *     summary: Remove um produto pelo ID
 *     description: Remove um produto existente do Postgres via TypeORM.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto.
 *     responses:
 *       200:
 *         description: Produto removido com sucesso.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno ao remover produto.
 */
router.delete('/produtos/:id', async (req, res) => {
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
});

module.exports = router;