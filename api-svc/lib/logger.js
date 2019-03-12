module.exports = ({
  pkg: {
    name,
    version
  },
  config: {
    logger: cfg
  },
  os: {
    hostname
  }         = require('os'),
  process   = global.process,
  outStream = process.stdout,
  pino      = require('pino'),
  srlz      = require('pino-std-serializers')
}) => {
    const {assign} = Object;
    const defaultLevel = cfg.levels.default;
    const toJSON = v => {
        const met = new Map();
        const toJSON = (v, p, sa) => v && 'object' == typeof v
            ? (sa = met.get(v))
                ? '>>seen-at:' + sa
                : met.set(v, p) && Object.keys(v).reduce((j, k) =>
                    ('_' == k[0] || 'undefined' == typeof v[k])
                        ? j
                        : assign(j, { [k]: toJSON(v[k], p + '.' + k) }),
                {}
                )
            : v;
        return toJSON(v);
    };
    const logger = pino({
      name,
      serializers: {
        err: (err) => console.log('SERZING ERR') || toJSON(err.toJSON()),
        req: srlz.req,
        res: srlz.res
      }
    }, outStream);

    logger.level = defaultLevel;

    enhancePinoPrototype(logger);

    return ['dev', 'development', undefined].includes(process.env.NODE_ENV)
      ? logger
      : logger.child({pkg: { name, version }});

    function enhancePinoPrototype(logger) {
        const proto = Object.getPrototypeOf(Object.getPrototypeOf(logger));

        proto.of = function log_of(name) {
            const logger = this.child({name});
            logger.level = cfg.levels[name] || defaultLevel;
            return logger;
        }
    }
};
