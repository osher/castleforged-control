module.exports = ({
  model,
  logger,
  log = logger.of('types/logTypeRole')
}) => log.debug('init') || model.declare('logTypeRole', {
  tableName: 'log_type_x_role',
  idAttribute: 'log_type_x_role_id'
});

