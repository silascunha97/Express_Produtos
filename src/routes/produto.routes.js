const { Router } = require('express');
const { autenticarBearerToken } = require('../middlewares/auth.middleware');
const produtoController = require('../controllers/produto.controller');

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
router.get('/produtos', produtoController.listarProdutos);

/**
 * @openapi
 * /produtos:
 *   post:
 *     tags:
 *       - Produtos
 *     summary: Cria um novo produto
 *     description: Persiste um novo produto no Postgres via TypeORM.
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Token não fornecido ou inválido.
 *       500:
 *         description: Erro interno ao criar produto.
 */
router.post('/produtos', autenticarBearerToken, produtoController.criarProduto);

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
router.get('/produtos/:id', produtoController.buscarProdutoPorId);

/**
 * @openapi
 * /produtos/{id}:
 *   put:
 *     tags:
 *       - Produtos
 *     summary: Atualiza um produto pelo ID
 *     description: Atualiza os campos de um produto existente no Postgres via TypeORM.
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno ao atualizar produto.
 */
router.put('/produtos/:id', autenticarBearerToken, produtoController.atualizarProduto);

/**
 * @openapi
 * /produtos/{id}:
 *   delete:
 *     tags:
 *       - Produtos
 *     summary: Remove um produto pelo ID
 *     description: Remove um produto existente do Postgres via TypeORM.
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno ao remover produto.
 */
router.delete('/produtos/:id', autenticarBearerToken, produtoController.removerProduto);

module.exports = router;
