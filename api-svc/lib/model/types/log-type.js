module.exports = ({
  model,
  logger,
  log = logger.of('types/logType')
}) => model.declare('logType', {
  tableName: 'log_type',
  idAttribute: 'log_type_id',
  roles() {
      return this.hasMany('logTypeRole', 'log_type_id')
  }
}, {
  all() {
      return this.forge()
      .orderBy('log_type_id', 'ASC')
      .fetchAll({withRelated:{
        roles: q => q.orderBy('rank', 'ASC')
      }})
  }
});
