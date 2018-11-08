const validateBoolOption = (name, value, defaultValue) => {
  if (typeof value === 'undefined') {
    value = defaultValue;
  }

  if (typeof value !== 'boolean') {
    throw new Error(`Preset react-app: '${name}' option must be a boolean.`);
  }

  return value;
};

const validatePlatform = (name, value) => {
  if (value !== 'node' && value !== 'web') {
    throw new Error(
      `Babel preset Dufl "${name}" option must be "node" or "web".`,
    );
  }

  return value;
};

module.exports = { validateBoolOption, validatePlatform };
