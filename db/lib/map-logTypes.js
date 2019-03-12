module.exports = (rawTypes
, { rows
  , ixRole    = require('../data/roles').role
  , camelize  = require('lodash/camelCase')
  , chalk:
    { gray
    }         = require('chalk')
  , assign    = Object.assign
  } = {}
) => {
    if (!rows) rows = {}
    if (!rows.log_type) rows.log_type = []
    if (!rows.log_type_x_role) rows.log_type_x_role = []

    let log_type_id = 0;
    let log_type_x_role_id = 8800;

    const types = assign({}, {all: []});
    let curType;

    rawTypes.forEach(
      ( [ log_type_code, log_type_title
        , logTypeRoles
        ]
      ) => {
          rows.log_type.push(
            { log_type_code
            , log_type_id:    ++log_type_id
            , log_type_title
            }
          );

          types.all.push(
            curType =
              types[ log_type_code ] =
                { code:   log_type_code
                , id:     log_type_id
                , title:  log_type_title
                , props:  {}
                }
          )

          Object.keys(logTypeRoles).forEach(
            (prop, ix) => {
                const [
                  ctrl, linkedRole, title, rank
                ] = logTypeRoles[prop]

                const role = ixRole[linkedRole] || {};
                if (linkedRole && !role.role_id) throw new Error(
                  [ 'Error: role not found'
                  , `log-type ${log_type_code}`
                  , `tries to link with: ${linkedRole}`
                  , 'but there is not such role'
                  ].join('\n')
                )

                rows.log_type_x_role.push(new Row(
                  { __logTitle: 'prop_x_role'
                  , __logValue: log_type_code + gray('.') + prop + gray(' - ') + role.role_name
                  , log_type_x_role_id: ++log_type_x_role_id
                  , log_type_id
                  , prop
                  , role_id: role.role_id
                  , ctrl
                  , title
                  , rank: rank || ix
                  }
                ))

                curType.props[prop] = log_type_x_role_id

            }
          )
      }
    )

    return {
      rows: () => rows
    , types
    }

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
}
