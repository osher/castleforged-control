exports.seed =
  require('../lib/seed-runner')
  .seed(
    require('config').database.data
  );
