const exigirClaim = (claimNecessaria) => (req, res, next) => {
  const { claims, role } = req.usuarioLogado;

  // Administradores ignoram a checagem de claims (acesso de moderação)
  if (role === 'admin') {
    return next();
  }

  if (!claims || !claims.includes(claimNecessaria)) {
    return res.status(403).json({
      error: `Acesso negado. Seu usuário precisa da permissão de '${claimNecessaria}' para executar esta ação.`,
    });
  }

  next();
};

module.exports = { exigirClaim };
