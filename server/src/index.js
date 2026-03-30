require('dotenv').config();
require('./config/database'); // triggers schema init
const app = require('./app');
const { PORT } = require('./config/env');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
