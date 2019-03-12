module.exports = ({
  config,
  logger,
  model,
  app         = require('express')(),
  cors        = require('cors'),
  bodyParser  = require('body-parser'),
  reqLog      = require('express-pino-logger'),
  io          = require('socket.io'),
}) => {
    app.disable('x-powered-by');
    app.disable('etag');
    app.use(cors());
    app.use(bodyParser.json());
    app.use(reqLog({logger}));

    app.get('/lookups', (q, a, n) => {
        model.lookupsView()
        .then(v => a.json(v))
        .catch(n)
    });

    app.get('/log', ({query:{t,f}}, a, n) => {
        model.logView({to:t, from:f})
        .then(v => a.json(v))
        .catch(n)
    });
    


    app.use((q, a) => a.status(404).json({msg: 'no such endpoint', path: q.url}));
    app.use((err, req, res, n) => {
        req.log.error({err}, 'error');
        try {
            res.status(err.statusCode || 500)
            .json({error: err.toJSON()});
        } catch(ex) {
            res.end( inspect(err) )
        }
    });

    const web = require('http').createServer(app);

    {
      const log = logger.of('sockets');
      let socket_id = 0;
      const channel = io(web).on('connection', (skt) => {
          skt.id = ++socket_id;
          log.info({socket_id}, 'user connected: %s', skt.id);

          skt.on('disconnect', () => {
              console.log({socket_id: skt.id}, 'user disconnected: %s', skt.id);
          });
          
          setTimeout(() => skt.emit('welcome', {foo: 'bar'}), 100);
      });

      web.msg = (type, msg) => channel.emit(type, msg);
    }
    
    return web;
};
