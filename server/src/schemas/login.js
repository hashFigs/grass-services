module.exports = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        minLength: 5,
      },
      password: {
        type: 'string',
        minLength: 5,
      },
    },
  };
  