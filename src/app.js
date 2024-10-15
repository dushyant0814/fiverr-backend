const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const { getProfile } = require('./middleware/getProfile');
const contractRoutes = require('./routes/contract');
const jobRoutes = require('./routes/job');
const profileRoutes = require('./routes/profile');
const adminRoutes = require('./routes/admin');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(errorHandler);
app.use(bodyParser.json());
// dependency injection
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use(getProfile);
app.use('/contracts', contractRoutes);
app.use('/jobs', jobRoutes);
app.use('/profiles', profileRoutes);
app.use('/admin', adminRoutes);

module.exports = app;