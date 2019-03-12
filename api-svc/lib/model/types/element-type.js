module.exports = ({
  model,
  logger,
  log = logger.of('types/element-type')
}) => log.debug('init') || model.declare('elementType', {
  tableName: 'element_type',
  idAttribute: 'element_type_id',
  elements() {
      return this.hasMany('element', 'element_type_id')
  }
}, {
  all() {
      return this.forge()
        .orderBy('element_type_id', 'ASC')
        .fetchAll({withRelated:{ 
          elements: q => q.orderBy('element_id', 'ASC')
        }})
  }
});
