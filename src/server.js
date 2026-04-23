const { port, env } = require('./core/config/env');
const app = require('./app');

app.listen(port, () => {
  console.log(`ERP backend running on port ${port} in ${env} mode`);
});
