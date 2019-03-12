module.exports = (ioc) => {
    const {
      Promise,
      config,
      logger,
      log = logger.of('lib/model'),
      models = [
        'element-type',
        'element',
        'role',
        'role-element-types',
        'log-type',
        'log-type-roles',
        'log',
        'log-detail',
      ],
      //
      mockData = require('../../mock/data'),
      modelMgr = require('./mgr')
    } = ioc;

    const {assign} = Object;
    const numerically = (a,b) => a - b;
    const byId = ([a],[b]) => a - b;
    const mapper = {
      idName: ({attributes: {id, name}}) => [id, name],

      ids: ({attributes: {id}}) => id,

      elementType: ({
        attributes: { element_type_id: id, element_type_name: name, descr },
        relations: {elements: {models: elements}}
      }) => [ id, name, descr,
        ...elements.map(
          ({attributes: { element_id: id, element_name: name }}) =>
            [id, name]
        )
      ],

      role: ({
        attributes: { role_id, role_name },
        relations: {elementTypes: { models:elementTypes }}
      }) => [ role_id, role_name,
        ...elementTypes.map(({attributes: {element_type_id: id}}) => id)
      ],

      logType: ({
        attributes: { log_type_id: id, log_type_code: code, log_type_title: title },
        relations: { roles: { models: roles } }
      }) => [ id, code, title,
        roles.reduce(
          (props, {attributes:{prop, ctrl, role_id, title}}) =>
            assign(props, {[prop]: [ctrl, role_id, title]}),
          {}
        )
      ],

      logEntry: ({
        attributes: { log_id: id, log_time: time, log_type_code: code },
        relations: { details: { models: details } }
      }) => [id, time, code,
        details.reduce(
          (props, {attributes: {
            prop, element_id, suplNumber, suplText,
            data = suplNumber || suplText || null 
          }}) =>
            (  props[prop]
                ? 'object' == typeof props[prop]
                    ? props[prop][element_id] = data
                    : props[prop] = {
                       [props[prop]] : null,
                       [element_id]  : data
                      }
                : props[prop] =
                    data
                      ? {[element_id]: data}
                      : element_id,
               props
            ),
          {}
        )
      ]
    }

    log.debug('initializing');

    return modelMgr(ioc)
    .loadAsync(models)
    .then((model) => ({
      lookupsView: () => lookupsView(model), 
      logView: (q) => logView(model, q),
      createPotion: (potion) => createPotion(model, potion),
    }));

    function lookupsView({elementType, role, logType}) {
        log.debug('lookupsView');
        
        if (config.web.mockData) return Promise.resolve(mockData);

        return Promise.all([
          elementType.all(),
          role.all(),
          logType.all(),
        ]).then(([
          elementTypes,
          roles,
          logTypes,
        ]) => ({
          elements:       elementTypes.map(mapper.elementType),
          roles:          roles.map(mapper.role),
          logTypes:       logTypes.map(mapper.logType),
        }));
    }

    function logView({log}, {to:t, from:f}) {
        return log.page({to:t, from:f})
        .then(logEntries => logEntries.map(mapper.logEntry))
    }

    function createPotion(model, {
      name,
      by:     creator_name,
      descr:  description,
      effects
    }) {
        const potion = {
          name,
          by:     creator_name,
          descr:  description,
        };
        log.debug({potion, effects}, 'create potion');
        return model.mgr.transaction(transacting =>
          model.potion.forge({
            name,
            description,
            creator_name
          }).save(null, {transacting})
          .tap(potion => log.debug({potion: potion.toJSON}, "created potion") || Promise.all(
            effects.map(
              ([id, lvl]) => potion.related('effects').create({
                effect_id: id,
                effect_level: lvl
              }, {transacting})
              .then(() => log.debug({effect: {id,lvl}}, "created potion-effect"))
            )
          ))
        )
        .then(potion => potion.fetch({withRelated:['effects']}))
        .then(mapper.potion)
        .then(potion => {
            log.debug({potion}, 'created')
            return potion
        })
    }
};
