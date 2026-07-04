const permitirApenas = (...rolesPermitidos) => (req, res, next) => {
  const roleDoUsuario = req.usuarioLogado?.role;

  if (!rolesPermitidos.includes(roleDoUsuario)) {
    return res.status(403).json({ error: 'Acesso negado. Você não tem permissão para executar esta ação.' });
  }

  next();
};

module.exports = { permitirApenas };
