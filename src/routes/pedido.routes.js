const { Router } = require('express');
const { criarPedido, listarMeusPedidos } = require('../controllers/pedido.controller');
const { autenticarBearerToken } = require('../middlewares/auth.middleware');
const { validarPayloadPedido } = require('../middlewares/pedido.middleware');

const router = Router();

/**
 * @openapi
 * /pedidos:
 *   post:
 *     summary: Realiza o checkout do carrinho de compras
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [itens]
 *             properties:
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [id_produto, quantidade]
 *                   properties:
 *                     id_produto:
 *                       type: integer
 *                       example: 1
 *                     quantidade:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Pedido faturado e estoque atualizado com sucesso.
 *       400:
 *         description: Erro na validação de estoque ou payload inválido.
 *       401:
 *         description: Não autorizado. Token ausente ou inválido.
 */
router.post('/pedidos', autenticarBearerToken, validarPayloadPedido, criarPedido);

/**
 * @openapi
 * /pedidos:
 *   get:
 *     summary: Lista o histórico de pedidos do usuário autenticado
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos do usuário, com itens e produtos relacionados.
 *       401:
 *         description: Não autorizado. Token ausente ou inválido.
 */
router.get('/pedidos', autenticarBearerToken, listarMeusPedidos);

module.exports = router;