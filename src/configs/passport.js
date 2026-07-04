const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const AppleStrategy = require('passport-apple');
const AppDataSource = require('./database');
const { User } = require('../entities/Usuers.entities');

// --- ESTRATÉGIA GOOGLE ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      // Busca se o usuário já existe pelo e-mail do Google
      let user = await userRepository.findOneBy({ email: profile.emails[0].value });

      if (!user) {
        // Se não existir, cria um novo usuário vinculado
        user = userRepository.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: 'OAUTH_USER_EXTERNAL' // Senha dummy já que o login é social
        });
        await userRepository.save(user);
      }
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// --- ESTRATÉGIA INSTAGRAM ---
passport.use(new InstagramStrategy({
    clientID: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    callbackURL: process.env.INSTAGRAM_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    // O Instagram não fornece o e-mail nativamente na API básica, apenas o username.
    // Você precisará mapear pelo ID do Instagram ou solicitar o e-mail no passo seguinte.
    return done(null, profile);
  }
));

module.exports = passport;