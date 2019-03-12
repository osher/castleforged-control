Object.assign( require('knex/lib/schema/tablebuilder').prototype, {
  nopki,
  pki,
  pki_big,
  pki_tiny,
  pkc,
  pks,
  fki,
  fki_big,
  fki_tiny,
  fkc,
  fks,
  yesNo,
  char: _char,
  double,
  natural,
  time,
  tinyInt
})

function nopki() {
    this.engine('Innodb')
    this.charset('UTF8')
}

function pki(pkName, {incr = true} = {}) {
    this.nopki()
    return (incr
      ? this.increments(pkName)
      : this.integer(pkName, 10).unsigned().unique().notNullable()
    ).primary()
}

function pki_big(pkName) {
    this.nopki()
    return this.bigincrements(pkName).primary()
}

function pki_tiny(pkName) {
    this.nopki()
    return this.specificType(pkName, 'tinyint(3)').unsigned().primary()
}


function pkc(col, len) {
    this.nopki()
    return this.char(col, len).notNullable().primary()
}

function pks(col, len) {
    this.nopki()
    return this.string(col, len).notNullable().primary()
}


function fki(tbl, options = {}) {
    if ('string' == typeof options) options = { nullability: options }
    const { 
      col = tbl + '_id',
      ref = col,
      onDelete = 'RESTRICT',
      nullability = 'notNullable' 
    } = options
    return this.integer(col, 10).unsigned()
    .references(ref).inTable(tbl)[nullability]()
    .onDelete(onDelete)
}

function fki_big(tbl, nullability = 'notNullable', col) {
    if (!col) col = tbl + '_id';
    return this.bigInteger(col, 20).references(col).inTable(tbl)[nullability]()
}

function fki_tiny(tbl, nullability = 'nullable', col) {
    if (!col) col = tbl + '_id';
    return this.tinyInt(col).references(col).inTable(tbl)[nullability]()
}

function fks(tbl, col, len, nullability = 'nullable') {
    const options = 
      'string' == typeof col
        ? //i.e col is a column name and more args may follow
          { col, len, nullability }
        : //i.e col is options object
          col 
    ;({ col, len, nullability = 'nullable', onDelete = 'RESTRICT'} = options)
    
    if (nullability != 'nullable' && nullability != 'notNullable') {
        throw new Error("TableBuilder~fks(tbl, col, len, nullability) - must be 'nullable' or 'notNullable', got: " + nullability)
    }
    return this.string(col, len)[nullability]()
      .references(tbl + '.' + col)
}

function fkc(tbl, col, len, nullability) {
    const options = 
      'string' == typeof col
        ? //i.e col is a column name and more args may follow
          { col, len, nullability }
        : //i.e col is options object
          col 
    ;({ col, len, nullability = 'nullable', onDelete = 'RESTRICT'} = options)
    return this.char(col, len, nullability)
      .references(tbl + '.' + col)
      .onDelete(onDelete)
}

function yesNo(name, dflt) {
    return this.char(name, 1, 'notNullable')
      .defaultTo(dflt || 'Y')
      .references('truth_code').inTable('truth')
}

function _char(name, len, nullability = 'nullable') {
    if (nullability != 'nullable' && nullability != 'notNullable') {
        throw new Error("TableBuilder~char(name, len, nullability) - must be 'nullable' or 'notNullable', got: " + nullability)
    }
    return this.specificType(name, 'char(' + len + ')')[ nullability ]()
}

function natural(name, len = 10, nullability = 'nullable', dflt = null) {
    if (nullability != 'nullable' && nullability != 'notNullable') {
        throw new Error("TableBuilder~natural(name, len, nullability) - must be 'nullable' or 'notNullable', got: " + nullability)
    }
    return this.integer(name, len).unsigned()[nullability]().defaultTo(dflt)
}

function time(name, nullability = 'nullable') {
    if (nullability != 'nullable' && nullability != 'notNullable') {
        throw new Error("TableBuilder~time(name, nullability) - must be 'nullable' or 'notNullable', got: " + nullability)
    }
    return this.bigInteger(name, 15).unsigned()[nullability]()
}

function double(name) {
    return this.specificType(name, 'double')
}

function tinyInt(name) {
    return this.specificType(name, 'tinyInt(3)').unsigned()
}

