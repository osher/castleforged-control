module.exports = ({
  model,
  logger,
  log = logger.of('types/element')
}) => log.debug('init') || model.declare('element', {
  tableName: 'element',
});
