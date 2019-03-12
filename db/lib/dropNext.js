const log = console.log
const dropNext = (knex) => (p, table) =>
    p.then(() => {
        log('dropping (if exist) -', table)
        return knex.schema.dropTableIfExists(table)
    })

module.exports = dropNext