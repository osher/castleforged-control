module.exports = (roles
, { rows
  , element   = require('../data/elements')
  , camelize  = require('lodash/camelCase')
  , chalk: 
    { gray
    }         = require('chalk')
  , assign    = Object.assign
  } = {}
) => {
    if (!rows) rows = {}
    if (!rows.role) rows.role = []
    if (!rows.element_type_x_role) rows.element_type_x_role = []

    const role = assign({}, { all: rows.role })

    roles.forEach(
      ( [ role_id
        , role_name
        , ...elementTypes
        ]
      ) => {
          rows.role.push(
            { role_name, role_id }
          )

          const curRole = 
            role[ role_id ] =
              role[ role_name ] =
                role[camelize(role_name) ] =
                  { role_id
                  , role_name
                  , types: { all: [] }
                  }

          elementTypes.forEach(
            (element_type_id) => {
                const elementType = element.type[element_type_id];
                if (!elementType) throw new Error(
                  [ 'Error: element-type not found'
                  , `role ${role_name}(${role_id})`
                  , `tries to link with: ${element_type_id}`
                  , 'but there is no such element-type'
                  ].join('\n')
                )

                curRole.types.all.push(
                  curRole.types[ elementType.element_type_id ] =
                    curRole.types[ elementType.element_type_name ] =
                      curRole[ camelize(elementType.element_type_name) ] =
                        elementType
                )

                rows.element_type_x_role.push(new Row(
                  { __logTitle: 'type_x_role'
                  , __logValue: role_name + gray(' can be of ') + elementType.element_type_name 
                  , role_id
                  , element_type_id: elementType.element_type_id
                  }
                ))

            }
          )
      }
    )

    function Row(props) {
        Object.assign(this, props)
        const cfg = { configurable: true, enumerable: false }
        Object.defineProperties(this,
          { __logTitle: cfg
          , __logValue: cfg
          , elementTypes: cfg
          }
        )
    }

    return {
      rows: () => rows
    , role
    }
}
