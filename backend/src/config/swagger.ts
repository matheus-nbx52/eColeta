import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API eColeta',
      version: '1.0.0',
      description: 'Documentação da API para gestão de coleta.',
      contact: {
        name: 'eColeta',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  
  apis: [path.resolve(__dirname, '../routes/*.ts')], 
};

export const swaggerSpec = swaggerJSDoc(options);