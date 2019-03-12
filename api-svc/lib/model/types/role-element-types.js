module.exports = ({
  model,
  logger,
  log = logger.of('types/roleElementTypes')
}) => log.debug('init') || model.declare('roleElementTypes', {
  tableName: 'element_type_x_role',

  elementType() {
      return this.hasOne('elementType', 'element_type_id', 'element_type_id')
  },
  role() {
      return this.hasOne('role', 'role_id', 'role_id')
  }
});

