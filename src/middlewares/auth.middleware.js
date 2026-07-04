const jwt = require('jsonwebtoken');

const autenticarBearerToken = (req, res, next) => {
  // 1. Obtém o cabeçalho Authorization
  const authHeader = req.headers['authorization'];

  // 2. Verifica se o cabeçalho existe e segue o padrão 'Bearer <token>'
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Acesso negado. Token não fornecido ou formato inválido (Padrão: Bearer <token>).' 
    });
  }

  // 3. Extrai apenas o hash do token (removendo a palavra 'Bearer ')
  const token = authHeader.split(' ')[1];

  try {
    // 4. Valida o token usando a chave secreta do .env
    const dadosDecodificados = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Injeta os dados do usuário (ex: id, role) dentro do objeto 'req'
    req.usuarioLogado = dadosDecodificados;

    // 6. Autoriza a requisição a seguir adiante
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
};

module.exports = { autenticarBearerToken };