const express = require('express');
const app = express();
const port = 3000;

const OpenApiValidator = require('express-openapi-validator');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

const swaggerDocument = yaml.load('./openapi.yaml');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(
    OpenApiValidator.middleware({
        apiSpec: './openapi.yaml',
        validateRequests: true,
        validateResponses: true,
        ignorePaths: /.*\/api-docs.*/,
    })
);
app.use((err, req, res, next) => {
    res.status(err.status).json({
        message: err.message,
        errors: err.errors
    });
});

app.get('/hello', (req, res) => {
    res.json({ message: 'Hello World' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`OpenAPI documentation: http://localhost:${port}/api-docs`);
})
