module.exports = (entries
, { rows
  , ixElement = require('../data/elements').element
  , ixType    = require('../data/log-types').types
  , camelize  = require('lodash/camelCase')
  , ms        = require('ms')
  , chalk:
    { gray
    }         = require('chalk')
  , assign    = Object.assign
  } = {}
) => {
    if (!rows) rows = {}
    if (!rows.log) rows.log = []
    if (!rows.log_detail) rows.log_detail = []

    let log_id = 0
    let log_time = 0;

    entries.forEach(
      ( [ logTime, logTypeCode
        , props
        ]
      ) => {
          const curType = ixType[logTypeCode]
          if (!curType) throw new Error(
            [ 'Error: log-type not found'
            , `log at ${logTime}`
            , `with props: ${JSON.stringify(props)}`
            , `tries to link with: ${logTypeCode}`
            , 'but there is not such log-type'
            ].join('\n')
          )

          'number' == typeof(logTime)
            ? log_time += logTime
            : log_time += ms(logTime)

          const log_type_code = curType.code

          rows.log.push(new Row(
            { log_type_code
            , log_time
            , log_id:         ++log_id
            , __logValue:     curType.code + gray(", ") + "+" + logTime
            }
          ));

          Object.keys(props).forEach(
            (prop) => {
                const val = props[prop]
                if ('object' != typeof val)
                    return detailRow({log_type_code, prop, val});

                Object.keys(val).forEach(
                  v => detailRow(
                    { log_type_code
                    , prop
                    , val: v
                    , subVal: val[v]
                    }
                  )
                )
            }
          )

          function detailRow(
            { log_type_code
            , prop
            , val
            , subVal
            }
          ) {
              let element_id
                , suplNumber
                , suplText

              const element = ixElement[val]
              if (element) {
                  element_id = element.element_id
                  'number' == typeof subVal
                    ? suplNumber = subVal
                    : suplText = subVal
              } else {
                  'number' == typeof val
                    ? suplNumber = val
                    : suplText = val
              }

              rows.log_detail.push(new Row(
                { __logTitle: `${log_type_code}.${prop}`
                , __logValue: `${val} ${subVal || ''}`
                , log_id
                , prop
                , element_id
                , suplNumber
                , suplText
                }
              ))
          }
      }
    );

    return {
      rows: () => rows
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
