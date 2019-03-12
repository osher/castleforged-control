module.exports = ({
  model,
  logger,
  log = logger.of('types/log')
}) => log.debug('init') || model.declare('log', {
  tableName: 'log',
  idAttribute: 'log_id',

  details() {
      return this.hasMany('logDetail', 'log_id')
  }
}, {
  page() {
      return this.forge()
        .orderBy('log_id', 'DESC')
        .fetchAll({withRelated: {
            'details': q => q.orderBy('prop')
        }})
  }
});
