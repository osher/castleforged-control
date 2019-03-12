module.exports = ({
  model,
  logger,
  log = logger.of('types/logDetail')
}) => log.debug('init') || model.declare('logDetail', {
  tableName: 'log_detail',
  idAttribute: 'log_detail_id',
  element() {
    return this.hasOne('element', 'element_id', 'element_id')
  }
});
