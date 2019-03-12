module.exports = ({
  model,
  logger,
  log = logger.of('types/role')
}) => log.debug('init') || model.declare('role', {
  tableName: 'role',

  elementTypes() {
      return this.hasMany('roleElementTypes', 'role_id', 'role_id')
  }
}, {
  all() {
      return this.forge()
        .orderBy('role_id', 'ASC')
        .fetchAll({withRelated:{ 
          elementTypes: q => q.orderBy('element_type_id', 'ASC')
        }})
  }
});
