require('error-stringify')({splitStackTrace:true, includeProto: true});
const {assign} = Object;
const ioc = {
  process, 
  Promise:  require('bluebird'),
  pkg:      require('../package'),
};

process.title = ioc.pkg.name;

const config = ioc.config = require('../lib/config')(ioc);
const logger = ioc.logger = require('../lib/logger')(ioc);
const log = logger;

if (config.debug.stackup) require('stackup');

const {
  signals: graceCount, 
  ms: graceTimeout
} = ioc.config.shutdown.grace;

log.level == 'debug'
  ? log.info({config}, 'initializing')
  : log.info('initializing');

process.on('uncaughtException', terminate('error'));
process.on('unhandledRejection', terminate('reject'));

require('../lib')(ioc)
.then((svc) => {
    ioc.svc = svc;

    process.on('SIGINT', terminate('SIGINT'));
    process.on('SIGTERM', terminate('SIGTERM'));
    process.on('exit', () => log.info('exitting'));

    log.info('starting up');
    return svc.start();
})
.then((svr) =>
  assign(ioc, {svr})
  && log.info({address: svr.address()}, 'web service started')
);

function terminate(cause) {
    return (errOrCode) => {
        const isErr = errOrCode instanceof Error;
        log[ isErr ? 'error' : 'warn' ](
          isErr
            ? { cause, err:  errOrCode }
            : { cause, code: errOrCode },
          'termination'
        );
        const count = terminate.count = (terminate.count || 0) + 1
        if (count >= graceCount) {
            terminated('UNGRACEFUL SHUTDOWN');
            return process.exit(1);
        }

        if (terminate.exitting) {
            return log.info('termination already in progress');
        }

        terminate.exitting = true;
        ioc.svc && ioc.svc.stop().then(terminated);
        setTimeout(() => terminated('grace timeout'), graceTimeout).unref()
    }
}

function terminated(e) {
    log[e ? 'error' : 'info' ]('terminated', e || 'OK')
}
