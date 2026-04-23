const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./modules/auth/presentation/routes/auth.routes');
const inventoryRoutes = require('./modules/inventory/presentation/routes/inventory.routes');
const usersRoutes = require('./modules/users/presentation/routes/users.routes');
const tiersRoutes = require('./modules/tiers/presentation/routes/tiers.routes');
const notFound = require('./core/middleware/not-found');
const errorHandler = require('./core/errors/error-handler');
const swaggerSpec = require('./core/config/swagger');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/tiers', tiersRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
