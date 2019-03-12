module.exports = (ioc) => {
    const {assign} = Object;
    const {
      config: {
        web: {
          port
        }
      },
      logger,
      log      = logger.of('lib'),

      Promise,
      model    = require('./model'),
      web      = require('./web'),
      db       = require('./db')
    } = ioc;
    let svr = null;
    log.debug('initalizing');

    return db(ioc)
    .then(db => {
        log.debug('db initialized');
        return model(assign(ioc, {db}));
    })
    .then(model => {
        log.debug('model initialized');
        return web(assign(ioc, {model}));
    })
    .then(web => {
        log.debug('web initialized');
        ioc.web = web;
        return {start, stop}
    });

    function start() {
        log.debug('starting...');
        return new Promise(
          (acc, rej) => svr = ioc.web.listen(port, err => err ? rej(err) : acc(svr))
        ).then(svr => log.info('started') || svr);
    }

    function stop() {
        log.debug('stopping...');
        ioc.db && ioc.db.client.pool.destroy();
        return svr
          ? Promise.promisify(svr.close, {context: svr})()
          : Promise.resolve();
    }
};
