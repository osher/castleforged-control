const dropNext = require('../lib/dropNext')
const log = console.log

const seed = require('../lib/seed-runner').seed;
const insertData = module => seed({ directory: './data', load: [ module ]})

exports.up = (knex, Promise) =>
  Promise.resolve()

  // --- elements ---------------
  .then( () => log('create table - element_type') )
  .then( () => knex.schema.createTable('element_type', (t) => {
      t.pki('element_type_id')
      t.string('element_type_name', 31)
      t.string('descr', 127)
  }))

  .then( () => log('create table - elements') )
  .then( () => knex.schema.createTable('element', (t) => {
      t.pki('element_id')
      t.fki('element_type')
      t.string('element_name', 31).notNullable().unique()
      t.string('comments', 511)
  }))

  .then(() => insertData('elements')(knex, Promise))

  // --- roles ---------------
  .then( () => log('create table - role') )
  .then( () => knex.schema.createTable('role', (t) => {
      t.pki('role_id')
      t.string('role_name', 31)
  }))

  .then( () => log('create table - element_type_x_role') )
  .then( () => knex.schema.createTable('element_type_x_role', (t) => {
      t.fki('role')
      t.fki('element_type')
      t.primary(['role_id', 'element_type_id'])
  }))

  .then(() =>insertData('roles')(knex, Promise))

  // --- log types ---------------
  .then( () => log('create table - log_type') )
  .then( () => knex.schema.createTable('log_type', (t) => {
      t.pki('log_type_id')
      t.string('log_type_code', 15).unique().notNullable()
      t.string('log_type_title', 127)
  }))

  .then( () => log('create table - log_type_x_role') )
  .then( () => knex.schema.createTable('log_type_x_role', (t) => {
      t.pki('log_type_x_role_id')
      t.fki('log_type')
      t.fki('role', 'nullable')
      t.string('prop', 7).notNullable()
      t.char('ctrl', 3).notNullable() //"elm", "lst", "txt"
      t.string('title', 15)
      t.tinyInt('rank').notNullable()
  }))

  .then(() => insertData('log-types')(knex, Promise))

  // --- log ---------------
  .then( () => log('create table - log') )
  .then( () => knex.schema.createTable('log', (t) => {
      t.pki('log_id')
      t.time('log_time', 'notNullable')
      t.fks('log_type', 'log_type_code', 15, 'notNullable')
  }))

  .then( () => log('create table - log_detail') )
  .then( () => knex.schema.createTable('log_detail', (t) => {
      t.pki('log_detail_id')
      t.fki('log')
      t.string('prop', 7).notNullable()
      t.fki('element', 'nullable')
      t.integer('suplNumber', 8)
      t.string('suplText', 511)
  }))

  //--- catch rollback & reject
  .catch(e =>
    log('ROLLING BACK', __filename) ||
    exports.down(knex, Promise)
    .then(() => log('ROLLED BACK', __filename))
    .then(() => Promise.reject(e))
  );

exports.down = (knex, Promise) =>
  [ 'log_detail'
  , 'log'
  , 'log_type_x_role'
  , 'log_type'
  , 'element_type_x_role'
  , 'role'
  , 'element'
  , 'element_type'
  ].reduce(
    dropNext(knex)
  , Promise.resolve()
  );
