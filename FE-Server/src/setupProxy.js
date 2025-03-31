const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');
dotenv.config();
module.exports = function (app) {
    app.use(
        '/Api',
        createProxyMiddleware({
            target: `http://${process.env.BACKEND_IP}:8089`,
            changeOrigin: true,
        }),
    );
};
