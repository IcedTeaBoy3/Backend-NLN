const userRoutes = require('./UserRoute');
const productRoutes = require('./ProductRoute');
const orderRoutes = require('./OrderRoute');
const dashboardRoutes = require('./DashboardRoute');
const routes = (app) => {
    app.use('/api/users', userRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/dashboard', dashboardRoutes);
}
module.exports = routes;