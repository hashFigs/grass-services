module.exports = {
    type: 'object',
    required: ['address1', 'city', 'zipCode'],
    properties: {
      address1: {
        type: 'string',
        minLength: 5,
      },
      city: {
        type: 'string',
        minLength: 1,
      },
      zipCode: {
        type: 'string',
        minLength: 1,
      },
      userId:{
        type: 'string'
      }
    },
  };