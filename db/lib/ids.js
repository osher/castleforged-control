const next = (name) => ids[name] = curr(name) + 1;
const curr = (name) => ids[name] || (ids[name] = 0);
const _of = (name, id) => ids[name] = id;
const ids = module.exports = { curr, next, of: _of };
