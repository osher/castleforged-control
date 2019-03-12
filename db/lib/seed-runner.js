/* TBD - move this to some open-source.
Usage: 
exports.seed = require(' ... need a name for open-source ... ').seed(
  { from: 'lib'
  , load: ['roles', 'users', 'companies' ]
  }
);
*/

module.exports.seed = seed;
  
function seed(
  { directory = process.cwd()
  , from: dir = directory
  , load: moduleNames
  , logTitle  = '__logTitle'
  , logValue  = '__logValue'
  , descRow   = (table, row) => {
      if (row.toString !== objToStr) return row.toString()
      const field = row[logTitle] || Object.keys(row)[0]
      const value = row[logValue] || row[field]
      return format('   - %s.%s:',
        table, gray(field), yellow(value)
      )
    }
  , chalk: 
    { magenta , yellow  , green
    , cyan    , gray    , blue
    , bold
    }         = require('chalk')
  , resolve   = require('path').resolve
  , assign    = Object.assign
  , objToStr  = Object.prototype.toString
  , format    = require('util').format
  }
) {
    dir = resolve(dir)
    const inserts = {}
    const modules = moduleNames.map((module) => {
      let m = require( resolve(dir, module) )
      return 'function' == typeof m.init
        ? m.init()
        : m
    });
    
    return (knex, Promise) =>
      Promise.all(modules)
      .then((modules) => console.log(bold('\nemptying tables')) || modules)
      .then((modules) => modules
        .map(module => module.rows())
        .forEach((moduleRows) => 
          Object.keys(moduleRows).forEach(tableName => {
            const tableRows = inserts[tableName] || (inserts[tableName] = []);
            tableRows.push.apply(tableRows, moduleRows[tableName])
          })
        )
      )
      .then(() =>
        Object.keys(inserts)
        .reverse()
        .reduce(
          (p, table) => p
            .then(() => console.log('  clearing ', yellow(table)))
            .then(() => knex(table).del())
            .then(() => console.log(green('  OK\n')))
        , Promise.resolve()
        )
      )
      .then(() => console.log(bold('\npopulating tables')))
      .then(() =>
        Object.keys(inserts).reduce(
          (p, table) => p
            .then(() => console.log('  populating ', yellow(table)))
            .then(() =>
              inserts[table].reduce(
                (p, row) => p
                  .then( () => console.log(descRow(table, row)))
                  .then( () => knex(table).insert( row ))
              , p
              )
            )
            .then(() => console.log(green('  OK\n')))
        , Promise.resolve()
        )
      );
}
