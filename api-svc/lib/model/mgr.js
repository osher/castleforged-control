module.exports = ({
  config,
  db,
  logger,
  log = logger.of('./lib/model/mgr'),
  
  //----
  camelCase       = require('lodash/camelcase'),
  //snakeCase       = require('lodash/snakecase'),
  CheckIt         = require('checkit'),
  bookshelf       = require('bookshelf'),
  modelBaseFcty   = require('bookshelf-modelbase'),
}) => {
    const {assign}  = Object;
    const enums = {};

    const mgr = bookshelf(db)
      .plugin(['registry']);

    mgr.models = {mgr};

    const modelBase = modelBaseFcty(mgr);

    assign(mgr, {
      of: (name) => mgr._models[name],
      enumOf: (name) => enums[name],
      declare: (name, protos, statics) => {
        const { initialize, checkSchema, checkSchemaConditionally = [] } = protos;
        assign(protos, {
          hasTimestamps: false,
          initialize:
            initialize 
              ? function overridenInitialize() { this.on('saving', this.checkSchema); initialize.apply(this) }
              : function initialize() { this.on('saving', this.checkSchema) },
          checkSchema:  schemaCheck(checkSchema, checkSchemaConditionally)
        });

        return mgr.model(name, modelBase.extend(protos, statics))
      },
      lookup: (name, protos, statics, {load = true} = {}) => {
          const en = enums[name] = newEnum();
          if (!('hasTimestamps' in protos)) protos.hasTimestamps = false;
          const lookup = assign( Bookshelf.declare(
              name,
              assign({hasTimestamps: false}, protos),
              statics
            ), {
              types: [],
              reload: function () {
                return this.findAll().then(rows => {
                    const id = protos.idAttribute;
                    rows.forEach(row => this.types.push( en[row.get(id)] = row.attributes ));
                    Log.silly('lookup loaded: ', name);
                })
              }
            }
          );
          let p
          if (false !== load)
              p = lookup.reload().catch(err => {
                Log.error('problems loading lookup rows of', { table: protos.tableName, err: err.logForm()})
              })
          return load == 'promise'
            ? p.then(() => lookup)
            : lookup
      }
    });

    return {
      load,
      loadAsync: models => Promise.resolve(load(models))
    };
    
    function load(models) {
        if (!Array.isArray(models)) models = [models];
        return models.reduce(
          (models, m) =>
            assign(models,
              {[camelCase(m)]:
                require(`./types/${m}`)({model: mgr, logger})
              }
            ),
          mgr.models
        )
    }

    function schemaCheck (rules, maybes = []) {
        const validation = new CheckIt(rules);
        maybes.forEach(({when, then}) => validation.maybe(then, when));
        return (model) => validation.run(model.attributes)
    };

    function newEnum() {
        const _enum = {};
        Object.defineProperty(_enum, 'has', {
          enumerable: false, configurable: false, writable: false,
          value: (v) => _enum[v] || false
        });
        return _enum
    }
};
