module.exports = (element_types
, { rows
  , camelize  = require('lodash/camelCase')
  , assign    = Object.assign
  } = {}
) => {
    if (!rows) rows = {};
    if (!rows.element_type) rows.element_type = [];
    if (!rows.element) rows.element = [];

    const type = assign({}, { all: rows.element_type });
    const element = assign({}, { all: rows.element });
    
    element_types.forEach(
      ( [ element_type_id
        , element_type_name
        , descr
        , ...typeElements
        ]
      ) => {
          rows.element_type.push(
            type[ element_type_id ] =
              type[ element_type_name ] =
                type[ camelize(element_type_name) ] =
                  { element_type_name
                  , element_type_id
                  , descr
                  }
          );
          typeElements.forEach(
            ([element_id, element_name, comments]) =>
              rows.element.push(
                element[ element_id ] = 
                  element[ element_type_name ] =
                    element[ camelize(element_type_name) ] =
                      { element_name
                      , element_id
                      , element_type_id
                      , comments
                      }
              )
          );
      }
    );

    return { 
      rows: () => rows
    , type
    , element
    }
}
