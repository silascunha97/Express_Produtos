const { Router } = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = Router();

// 💡 GOOGLE: Rota que inicia o redirecionamento para a tela do Google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// 💡 GOOGLE CALLBACK: Para onde o Google envia o usuário com o código de acesso
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // O usuário autenticado fica disponível em req.user graças ao Passport
    const usuario = req.user;

    // Gera o seu token JWT interno do E-commerce
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Redireciona de volta para o seu Frontend passando o token na URL (ou via Cookies)
    res.redirect(`http://localhost:3000/api-docs/?token=${token}`);
  }
);

// 💡 INSTAGRAM: Rota que inicia o redirecionamento
router.get('/auth/instagram', passport.authenticate('instagram', { session: false }));

router.get('/auth/instagram/callback', 
  passport.authenticate('instagram', { failureRedirect: '/login', session: false }),
  (req, res) => {
    res.json({ message: 'Autenticado via Instagram', data: req.user });
  }
);

module.exports = router;