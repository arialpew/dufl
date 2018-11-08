const DUFL = /^DUFL/i;

const getEnv = publicUrl => {
  const raw = Object.keys(process.env)
    .filter(key => DUFL.test(key))
    .reduce((env, key) => ({ ...env, [key]: process.env[key] }), {
      NODE_ENV: process.env.NODE_ENV || 'development',
    });

  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
};

module.exports = getEnv;
