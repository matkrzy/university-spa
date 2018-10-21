export const validateMaxConnections = (index, key) => (value, values) => {
  const connections = Number(values[key][index].connections);

  if (!value) {
    return 'invalid value';
  }

  if (value <= 0) {
    return 'value should be greater than 0';
  }

  if (!connections) return undefined;

  if (value < connections) {
    return `You have already ${connections} connections`;
  }

  return undefined;
};
