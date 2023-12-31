const passport = require('passport');
const local = require('passport-local');
const github = require('./passportGithub');

const userManager = require('../managers/userManager');
const { hashPassword, isValidPassword } = require('../utils/passwordUtils');

const LocalStrategy = local.Strategy;

const signup = async (req, email, password, done) => {
  const { email: _email, password: _password, password2: _password2, ...user } = req.body;

  const _user = await userManager.getByEmail(email);

  if (_user) {
    console.log('usuario ya existe');
    return done(null, false);
  };

  try {
    const newUser = await userManager.create({
      ...user,
      email,
      password: hashPassword(password),
    });

    console.log(newUser);

    // TODO: Borrar el password
    return done(null, {
      name: newUser.firstname,
      id: newUser._id,
      ...newUser._doc
    });

  } catch(e) {
    console.log('ha ocurrido un error');
    done(e, false);
  };
};
const login = async (email, password, done) => {
  try {
    const _user = await userManager.getByEmail(email);

    if (!_user) {
      console.log('usuario no existe')
      return done(null, false)
    }

    if (!password) {
      return done(null, false)
    }

    if(!isValidPassword(password, _user.password)) {
      console.log('credenciales no coinciden')
      return done(null, false)
    }

    // TODO: borrar password
    done(null, _user)

  } catch(e) {
    console.log('ha ocurrido un error')
    done(e, false)
  }
}

const init = () => {
  /// options por default
  /// { usernamField: 'username', passwordField: 'password' }
  passport.use('local-signup', new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, signup))
  passport.use('local-login', new LocalStrategy({ usernameField: 'email' }, login))

  // registramos nuestra estrategia en passport
  passport.use('github', github)
}

module.exports = init;
