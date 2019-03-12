// Update with your config settings.
// Update with your config settings.
const config = require('./lib/config');

module.exports = {
  development: {
    client:     config.database.client,
    connection: config.database.connection
  }
};
