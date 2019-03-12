module.exports = ({
  config: {
    database: {
      client,
      connection
    }, 
    debug: {
      knex: debug
    }
  },
  logger,
  log = logger.of('lib/db'),
  //---
  knex = require('knex')
}) => {
    const db = knex({client, connection, debug});

    return db
      .select(1) //test db connection
      .then(() => log.debug('db connected') || db)
}
