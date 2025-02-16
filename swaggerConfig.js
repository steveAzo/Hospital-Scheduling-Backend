const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config()

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hospital-Scheduling Test API',
      version: '1.0.0',
      description: 'API documentation for Hospital-Scheduling Test API',
    },
    servers: [
      {
        url: process.env.BASEURL || "https://hospital-scheduling-backend.onrender.com/",
        description: 'Development server',
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
  apis: ['./src/swaggerRoutes/*.js'], // Ensure this path matches your route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
