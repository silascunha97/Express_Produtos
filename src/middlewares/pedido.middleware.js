const validarPayloadPedido = (req, res, next) => {
  const { itens } = req.body;

  if (!itens || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ error: 'O pedido deve conter pelo menos um produto no array "itens".' });
  }

  for (const item of itens) {
    if (!item.id_produto || typeof item.quantidade !== 'number' || item.quantidade <= 0) {
      return res.status(400).json({ 
        error: 'Cada item deve conter um "id_produto" válido e uma "quantidade" maior que zero.' 
      });
    }
  }

  next(); // Dados estruturados com sucesso, pode seguir para o controller
};

module.exports = { validarPayloadPedido };