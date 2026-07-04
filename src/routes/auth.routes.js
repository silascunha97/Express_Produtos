const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppDataSource = require('../configs/database');
const { User } = require('../entities/Usuers.entities');

const router = Router();

/**
 * @openapi
 * /auth/registrar:
 *   post:
 *     tags:
 *       - Autenticação
 *     summary: Registra um novo usuário com senha criptografada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioCadastro'
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso.
 *       400:
 *         description: E-mail já cadastrado.
 *       500:
 *         description: Erro ao registrar usuário.
 */
router.post('/auth/registrar', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    // Verifica se o e-mail já existe
    const usuarioExistente = await userRepository.findOneBy({ email });
    if (usuarioExistente) return res.status(400).json({ error: 'E-mail já cadastrado.' });

    // 💡 Criptografa a senha com um fator de custo 10 (Salt)
    const saltHashedPassword = await bcrypt.hash(password, 10);

    const novoUsuario = userRepository.create({
      name,
      email,
      password: saltHashedPassword
    });

    await userRepository.save(novoUsuario);
    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
});

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Autenticação
 *     summary: Autentica o usuário e retorna o JWT Bearer Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['email', 'password']
 *             properties:
 *               email: { type: string, format: email, example: 'augusto@email.com' }
 *               password: { type: string, format: password, example: 'senha123' }
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioRespostaLogin'
 *       401:
 *         description: Credenciais inválidas.
 *       500:
 *         description: Erro ao processar login.
 */
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    const usuario = await userRepository.findOneBy({ email });
    if (!usuario) return res.status(401).json({ error: 'Credenciais inválidas.' });

    // 💡 Compara a senha enviada com o hash salvo no banco
    const senhaCorreta = await bcrypt.compare(password, usuario.password);
    if (!senhaCorreta) return res.status(401).json({ error: 'Credenciais inválidas.' });

    // Gera o token JWT incluindo informações úteis no payload (expira em 2 horas)
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Retorna o padrão do Bearer Token
    res.status(200).json({
      token_type: 'Bearer',
      access_token: token,
      expires_in: '2h'
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar login.' });
  }
});

module.exports = router;