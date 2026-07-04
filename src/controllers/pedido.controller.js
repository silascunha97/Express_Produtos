const AppDataSource = require('../configs/database');
const { Pedido } = require('../entities/Pedido.entities');
const { ItemPedido } = require('../entities/ItemPedido');
const { Produto } = require('../entities/Product.entities');

const criarPedido = async (req, res) => {
  // Criamos uma QueryRunner para gerenciar a transação manualmente
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const { itens } = req.body;
    const usuarioId = req.usuarioLogado.id; // Injetado pelo middleware de autenticação JWT

    let valorTotalPedido = 0;
    const itensParaSalvar = [];

    // 1. Validar estoque e preços de cada item de forma sequencial
    for (const item of itens) {
      const produto = await queryRunner.manager.findOneBy(Produto, { id: item.id_produto });

      if (!produto) {
        throw new Error(`Produto com ID ${item.id_produto} não foi encontrado.`);
      }

      if (produto.estoque < item.quantidade) {
        throw new Error(`Estoque insuficiente para o produto: ${produto.name}. Disponível: ${produto.estoque}`);
      }

      // Decrementa o estoque do produto temporariamente na transação
      produto.estoque -= item.quantidade;
      await queryRunner.manager.save(Produto, produto);

      // Calcula o valor acumulado baseado no preço atual do produto
      const precoUnitario = parseFloat(produto.price);
      valorTotalPedido += precoUnitario * item.quantidade;

      // Cria a instância do ItemPedido associando o produto e o preço histórico
      const novoItem = queryRunner.manager.create(ItemPedido, {
        produto: produto,
        quantidade: item.quantidade,
        preco_unitario: precoUnitario
      });

      itensParaSalvar.push(novoItem);
    }

    // 2. Criar e salvar o cabeçalho do Pedido
    const novoPedido = queryRunner.manager.create(Pedido, {
      valor_total: valorTotalPedido,
      usuario: { id: usuarioId }
    });
    
    const pedidoSalvo = await queryRunner.manager.save(Pedido, novoPedido);

    // 3. Vincular os itens ao pedido salvo e persistir
    for (const item of itensParaSalvar) {
      item.pedido = pedidoSalvo;
      await queryRunner.manager.save(ItemPedido, item);
    }

    // Se tudo deu certo, consolida as alterações no banco de dados
    await queryRunner.commitTransaction();

    res.status(201).json({
      message: 'Pedido realizado com sucesso!',
      id_pedido: pedidoSalvo.id,
      total: valorTotalPedido
    });

  } catch (error) {
    // Se qualquer validação falhar ou o estoque acabar, desfaz as alterações de estoque
    await queryRunner.rollbackTransaction();
    res.status(400).json({ error: error.message || 'Erro ao processar o checkout.' });
  } finally {
    // Libera a conexão do banco de dados de volta para o Pool
    await queryRunner.release();
  }
};

const listarMeusPedidos = async (req, res) => {
  try {
    const usuarioId = req.usuarioLogado.id;
    const pedidoRepository = AppDataSource.getRepository(Pedido);

    const pedidos = await pedidoRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: { itens: { produto: true } },
      order: { criado_em: 'DESC' },
    });

    res.status(200).json(pedidos);
  } catch (error) {
    console.error('Erro ao buscar histórico de pedidos:', error);
    res.status(500).json({ error: 'Erro interno ao buscar histórico de pedidos.' });
  }
};

module.exports = { criarPedido, listarMeusPedidos };