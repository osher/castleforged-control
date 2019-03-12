module.exports = require('../lib/map-roles')(
  [ [ 300, "reporter"
    , "npc", "medic", "core team", "redcaps"
    ]
  , [ 301, "medic staff"
    , "medic"
    ]
  , [ 351, "in-play place"
    , "camps", "castle", "town", "groups", "roads"
    ]
  , [ 314, "off-play place"
    , "off-play places"
    ]
  , [ 333, "any place"
    , "camps", "castle", "town", "groups", "roads", "off-play places"
    ]
  , [ 344, "gate"
    , "camps", "castle"
    ]
  , [ 373, "gate damage"
    , "gates damage"
    ]
  , [ 377, "side"
    , "camps", "groups"
    ]
  , [ 348, "flag owner"
    , "camps"
    ]
  , [ 343, "castle holder"
    , "camps", "castle"
    ]
  , [ 391, "mineral production"
    , "mineral production"
    ]
  , [ 361, "requester"
    , "groups", "characters"
    ]
  ]
);

