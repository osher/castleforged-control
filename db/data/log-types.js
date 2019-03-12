module.exports = require('../lib/map-logTypes')(
  [ [ "base", ""
    , { by        : [ "elm", "reporter", "מדווח" ]
      , pos       : [ "elm", "anyPlace", "מיקום דיווח" ]
      }
    ]
  , [ "text", "הודעה"
    , { msg       : [ "txt" ]
      }
    ]
  , [ "siegeDeclared", "הכרזת מצור"
    , { camp      : [ "elm", "flagOwner", "מכריז" ]
      , trg       : [ "elm", "gate", "שער מטרה" ]
      }
    ]
  , [ "forceDepart", "כח יצא"
    , { from      : [ "elm", "inPlayPlace", "ממקום" ]
      , to        : [ "elm", "inPlayPlace", "למקום" ]
      , members   : [ "lst", "side", "משתתפים" ]
      }
    ]
  , [ "forceSighted", "כח נצפה"
    , { at        : [ "elm", "inPlayPlace", "במקום" ]
      , to        : [ "elm", "inPlayPlace", "במקום" ]
      , members   : [ "lst", "side", "משתתפים" ]
      }
    ]
  , [ "forceArrive", "כח הגיע"
    , { at        : [ "elm", "inPlayPlace", "למקום" ]
      , members   : [ "lst", "side", "משתתפים" ]
      }
    ]
  , [ "siegeStart", "מצור החל"
    , { gate      : [ "elm", "gate", "שער" ]
      }
    ]
  , [ "gateDamage", "שער ניזוק"
    , { gate      : [ "elm", "gate", "שער נזוק" ]
      , dmg       : [ "elm", "gateDamage", "נזק" ]
      }
    ]
  , [ "siegeCombat", "קרב שערים התחיל" 
    , { gate      : [ "elm", "gate", "שער" ]
      }
    ]
  , [ "rndCombat", "קרב ספונטני התחיל" 
    , { at        : [ "elm", "inPlayPlace", "במקום" ]
      }
    ]
  , [ "flagChange", "דגל חדש בטירה"
    , { new       : [ "elm", "flagOwner", "דגל נכנס" ]
      , old       : [ "elm", "flagOwner", "דגל יוצא" ]
      }
    ]
  , [ "mineralWon", "מינרל יוצר"
    , { at        : [ "elm", "inPlayPlace", "במקום" ]
      , flag      : [ "elm", "flagOwner", "לזכות" ]
      , prod      : [ "elm", "mineralProduction", "באמצעות" ]
      }
    ]
  , [ "mineralSel", "מינרל נשלח"
    , { from      : [ "elm", "inPlayPlace", "ממקום" ]
      , to        : [ "elm", "flagOwner", "למקום" ]
      }
    ]
  , [ "endCombat", "קרב הסתיים"
    , { at        : [ "elm", "inPlayPlace", "במקום" ]
      , won       : [ "lst", "side", "מנצחים" ]
      , lost      : [ "lst", "side", "מפסידים" ]
      , dead      : [ "lst", "side", "מתים" ]
      }
    ]
  ]
);

