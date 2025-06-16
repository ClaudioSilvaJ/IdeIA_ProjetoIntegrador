const isDevelopment = process.env.NODE_ENV === "development";

export const WhenDevelopment = {
  render(node) {
    return isDevelopment ? node : undefined;
  },

  run(block) {
    if (isDevelopment) {
      return block();
    }
  },

  use(valueToUse, _else) {
    return isDevelopment ? valueToUse : _else;
  },
};