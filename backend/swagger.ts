import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '0.1.0',
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const specs = swaggerJSDoc(options);

