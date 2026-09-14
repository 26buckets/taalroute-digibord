DigiBoardNewWorld.create({
  "id": "spreektijd-smalltalk",
  "label": "Spreektijd · Smalltalk",
  "anchors": [
    [
      286,
      839
    ],
    [
      395,
      786
    ],
    [
      441,
      735
    ],
    [
      484,
      684
    ],
    [
      522,
      635
    ],
    [
      550,
      588
    ],
    [
      574,
      543
    ],
    [
      598,
      496
    ],
    [
      618,
      454
    ],
    [
      644,
      416
    ],
    [
      666,
      389
    ],
    [
      688,
      369
    ],
    [
      833,
      328
    ],
    [
      872,
      357
    ],
    [
      914,
      385
    ],
    [
      960,
      416
    ],
    [
      1006,
      452
    ],
    [
      1062,
      490
    ],
    [
      1116,
      527
    ],
    [
      1158,
      562
    ],
    [
      1174,
      603
    ],
    [
      1158,
      651
    ],
    [
      1234,
      617
    ],
    [
      1303,
      593
    ],
    [
      1370,
      568
    ],
    [
      1433,
      545
    ],
    [
      1453,
      491
    ],
    [
      1434,
      451
    ],
    [
      1416,
      415
    ],
    [
      1412,
      383
    ],
    [
      1430,
      346
    ],
    [
      1456,
      309
    ],
    [
      1480,
      275
    ],
    [
      1506,
      246
    ],
    [
      1521,
      206
    ]
  ],
  "passages": [
    {
      "id": "buurtpoort",
      "kind": "tunnel",
      "to": 12,
      "label": "De buurtpoort",
      "enter": [
        [
          688,
          369
        ],
        [
          688,
          357
        ],
        [
          686,
          343
        ]
      ],
      "exit": [
        [
          830,
          305
        ],
        [
          831,
          317
        ],
        [
          833,
          328
        ]
      ],
      "labelPos": [
        1024,
        255
      ],
      "icon": "move-down",
      "hiddenLabel": "In de doorgang",
      "description": "Tussen vak 11 en 12 loopt de pion door de buurtpoort. Hij verdwijnt in de doorgang en komt via de andere opening terug op het pad. Dit kost één gewone stap, ook bij een grotere worp.",
      "from": 11
    }
  ],
  "masks": [
    {
      "id": "poort-in",
      "path": "M619 395 L619 340 Q630 299 665 298 Q699 301 709 334 L709 389 L695 385 L694 339 Q689 321 667 321 Q645 322 644 344 L645 395Z",
      "area": [
        618,
        297,
        711,
        402
      ],
      "frontY": 408
    },
    {
      "id": "poort-uit",
      "path": "M798 320 L798 285 Q809 256 835 257 Q857 261 868 287 L868 318 L853 318 L852 287 Q845 273 835 275 Q818 276 815 289 L815 319Z",
      "area": [
        795,
        253,
        869,
        323
      ],
      "frontY": 339
    },
    {
      "id": "brugleuning",
      "path": "M1239 650 L1243 610 L1253 608 L1254 644 L1272 637 L1313 621 L1355 602 L1398 583 L1444 560 L1478 540 L1480 506 L1490 503 L1493 556 L1483 560 L1480 548 L1400 590 L1314 629 L1253 653 L1251 665 L1240 669Z M1250 614 L1483 508 L1486 514 L1251 621Z M1305 590 L1312 587 L1314 628 L1307 631Z M1363 564 L1370 561 L1372 602 L1365 605Z M1422 537 L1429 534 L1431 574 L1424 578Z",
      "area": [
        1235,
        501,
        1495,
        672
      ],
      "frontY": 2000
    }
  ],
  "waypoints": {
    "20": [
      [
        1174,
        603
      ],
      [
        1169,
        627
      ],
      [
        1158,
        651
      ]
    ],
    "21": [
      [
        1158,
        651
      ],
      [
        1181,
        643
      ],
      [
        1210,
        626
      ],
      [
        1234,
        617
      ]
    ]
  },
  "previews": [
    {
      "id": "parkbrug",
      "label": "Over de parkbrug",
      "icon": "route",
      "to": 25,
      "description": "De pion loopt om het einde van de leuning en over het houten dek, tussen beide brugleuningen.",
      "from": 20
    },
    {
      "id": "buurtpoort",
      "kind": "tunnel",
      "to": 12,
      "label": "De buurtpoort",
      "enter": [
        [
          688,
          369
        ],
        [
          688,
          357
        ],
        [
          686,
          343
        ]
      ],
      "exit": [
        [
          830,
          305
        ],
        [
          831,
          317
        ],
        [
          833,
          328
        ]
      ],
      "labelPos": [
        1024,
        255
      ],
      "icon": "move-down",
      "hiddenLabel": "In de doorgang",
      "description": "Tussen vak 11 en 12 loopt de pion door de buurtpoort. Hij verdwijnt in de doorgang en komt via de andere opening terug op het pad. Dit kost één gewone stap, ook bij een grotere worp.",
      "from": 11
    }
  ],
  "title": "Smalltalk — De ontmoetingsbuurt",
  "count": 33,
  "shapes": [
    "square",
    "circle",
    "diamond",
    "triangle",
    "square",
    "circle",
    "diamond",
    "triangle",
    "square",
    "diamond",
    "triangle",
    "triangle",
    "diamond",
    "circle",
    "square",
    "triangle",
    "diamond",
    "circle",
    "triangle",
    "circle",
    "triangle",
    "triangle",
    "square",
    "triangle",
    "diamond",
    "triangle",
    "square",
    "circle",
    "diamond",
    "triangle",
    "square",
    "circle",
    "diamond"
  ],
  "size": [
    55,
    38
  ],
  "paintedRoute": true,
  "image": "spreektijd-smalltalk-speelroute",
  "content": {
    "schemaVersion": 1,
    "id": "spreektijd-smalltalk-v1",
    "version": "1.0.0",
    "title": "Smalltalk — De ontmoetingsbuurt",
    "product": "Taalroute Praatpad",
    "level": "A2",
    "routeId": "a1-a2",
    "routeLabel": "A1 → A2",
    "goal": "Dagelijkse gesprekken voeren: iets vragen, reageren en samen een keuze of afspraak maken.",
    "duration": "Afhankelijk van de oefening en het aantal beurten.",
    "groupSize": "2–30 deelnemers",
    "literacy": "Korte instructies lezen; de docent kan ze voorlezen.",
    "methodLinks": [],
    "finish": 34,
    "coordinates": [
      [
        0.17105263157894737,
        0.8916046758767269
      ],
      [
        0.23624401913875598,
        0.8352816153028693
      ],
      [
        0.263755980861244,
        0.7810839532412327
      ],
      [
        0.2894736842105263,
        0.7268862911795961
      ],
      [
        0.31220095693779903,
        0.6748140276301806
      ],
      [
        0.32894736842105265,
        0.6248671625929861
      ],
      [
        0.34330143540669855,
        0.5770456960680127
      ],
      [
        0.3576555023923445,
        0.5270988310308182
      ],
      [
        0.3696172248803828,
        0.4824654622741764
      ],
      [
        0.38516746411483255,
        0.44208289054197664
      ],
      [
        0.39832535885167464,
        0.41339001062699254
      ],
      [
        0.41148325358851673,
        0.39213602550478216
      ],
      [
        0.49820574162679426,
        0.3485653560042508
      ],
      [
        0.5215311004784688,
        0.3793836344314559
      ],
      [
        0.5466507177033493,
        0.40913921360255046
      ],
      [
        0.5741626794258373,
        0.44208289054197664
      ],
      [
        0.6016746411483254,
        0.48034006376195537
      ],
      [
        0.6351674641148325,
        0.5207226354941552
      ],
      [
        0.6674641148325359,
        0.5600425079702445
      ],
      [
        0.6925837320574163,
        0.5972369819341127
      ],
      [
        0.7021531100478469,
        0.640807651434644
      ],
      [
        0.6925837320574163,
        0.691817215727949
      ],
      [
        0.7380382775119617,
        0.6556854410201913
      ],
      [
        0.7793062200956937,
        0.6301806588735388
      ],
      [
        0.819377990430622,
        0.6036131774707758
      ],
      [
        0.8570574162679426,
        0.5791710945802337
      ],
      [
        0.8690191387559809,
        0.5217853347502657
      ],
      [
        0.8576555023923444,
        0.47927736450584485
      ],
      [
        0.84688995215311,
        0.4410201912858661
      ],
      [
        0.8444976076555024,
        0.4070138150903294
      ],
      [
        0.8552631578947368,
        0.36769394261424015
      ],
      [
        0.8708133971291866,
        0.3283740701381509
      ],
      [
        0.8851674641148325,
        0.2922422954303932
      ],
      [
        0.9007177033492823,
        0.2614240170031881
      ],
      [
        0.909688995215311,
        0.21891604675876727
      ]
    ],
    "tasks": [
      {
        "id": "t01",
        "number": 1,
        "title": "Een vrije middag",
        "type": "vertel",
        "goalIds": [
          "plannen"
        ],
        "instruction": "Je bent morgenmiddag vrij. Stel voor om samen iets te doen.",
        "partner": "Vraag hoe laat. Spreek samen een tijd af.",
        "printSummary": "Je bent morgenmiddag vrij. Stel voor om samen iets te doen. Partner: Vraag hoe laat. Spreek samen een tijd af.",
        "printShort": "Je bent morgenmiddag vrij. Stel voor om samen iets te doen.",
        "help": "Zullen we morgen …? Om … uur?",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je bent morgenmiddag vrij. Stel voor om samen iets te doen.",
            "support": "Zullen we morgen …? Om … uur?"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je bent morgenmiddag vrij. Stel voor om samen iets te doen."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Vertel ook wat je doet als het regent."
          }
        },
        "teacherCriterion": "Doet een voorstel en bevestigt samen een tijd.",
        "channels": [
          "digital",
          "print"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t02",
        "number": 2,
        "title": "Een pen lenen",
        "type": "vraag",
        "goalIds": [
          "vragen"
        ],
        "instruction": "Je bent in de les en hebt geen pen. Vraag je buurman of buurvrouw om een pen.",
        "partner": "Je hebt een extra pen. Geef antwoord.",
        "printSummary": "Je bent in de les en hebt geen pen. Vraag je buurman of buurvrouw om een pen. Partner: Je hebt een extra pen. Geef antwoord.",
        "printShort": "Je bent in de les en hebt geen pen. Vraag je buurman of buurvrouw om een pen.",
        "help": "Mag ik je pen lenen? Dank je wel.",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je bent in de les en hebt geen pen. Vraag je buurman of buurvrouw om een pen.",
            "support": "Mag ik je pen lenen? Dank je wel."
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je bent in de les en hebt geen pen. Vraag je buurman of buurvrouw om een pen."
          },
          "extra": {
            "label": "Extra",
            "instruction": "De ander heeft geen pen over. Zoek samen een andere oplossing."
          }
        },
        "teacherCriterion": "Stelt een begrijpelijke vraag en reageert op het antwoord.",
        "channels": [
          "digital",
          "print"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t03",
        "number": 3,
        "title": "Naar de markt",
        "type": "kies",
        "goalIds": [
          "kiezen"
        ],
        "instruction": "Je gaat naar de markt. Kies: met de fiets of met de bus. Vertel waarom.",
        "partner": "Vraag hoe lang de reis duurt.",
        "printSummary": "Je gaat naar de markt. Kies: met de fiets of met de bus. Vertel waarom. Partner: Vraag hoe lang de reis duurt.",
        "printShort": "Je gaat naar de markt. Kies: met de fiets of met de bus. Vertel waarom.",
        "help": "Zullen we met de … gaan? Dat is …",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je gaat naar de markt. Kies: met de fiets of met de bus. Vertel waarom.",
            "support": "Zullen we met de … gaan? Dat is …"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je gaat naar de markt. Kies: met de fiets of met de bus. Vertel waarom."
          },
          "extra": {
            "label": "Extra",
            "instruction": "De bus is duurder, maar het regent. Bespreek of je keuze verandert."
          }
        },
        "teacherCriterion": "Maakt een keuze, geeft een reden en reageert op de vraag.",
        "channels": [
          "digital",
          "print"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t04",
        "number": 4,
        "title": "De afspraak",
        "type": "losop",
        "goalIds": [
          "plannen",
          "vragen"
        ],
        "instruction": "Je hebt woensdag om tien uur een afspraak. Je kunt dan niet. Vraag om een andere tijd.",
        "partner": "Je kunt woensdag om twee uur of donderdag om elf uur. Zoek samen een tijd.",
        "printSummary": "Je hebt woensdag om tien uur een afspraak. Je kunt dan niet. Vraag om een andere tijd. Partner: Je kunt woensdag om twee uur of donderdag om elf uur. Zoek samen een tijd.",
        "printShort": "Je hebt woensdag om tien uur een afspraak. Je kunt dan niet. Vraag om een andere tijd.",
        "help": "Kan het woensdag om …? Dus we spreken af …",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je hebt woensdag om tien uur een afspraak. Je kunt dan niet. Vraag om een andere tijd.",
            "support": "Kan het woensdag om …? Dus we spreken af …"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je hebt woensdag om tien uur een afspraak. Je kunt dan niet. Vraag om een andere tijd."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Je kunt allebei niet op de voorgestelde tijden. Stel ieder een andere mogelijkheid voor."
          }
        },
        "teacherCriterion": "Vraagt om wijziging en bevestigt samen een nieuwe dag en tijd.",
        "channels": [
          "digital",
          "print"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t05",
        "number": 5,
        "title": "Gisteren",
        "type": "vertel",
        "goalIds": [
          "vertellen"
        ],
        "instruction": "Vertel twee dingen die je gisteren hebt gedaan.",
        "partner": "Vraag met wie. Vertel daarna iets over jouw dag.",
        "printSummary": "Vertel twee dingen die je gisteren hebt gedaan. Partner: Vraag met wie. Vertel daarna iets over jouw dag.",
        "printShort": "Vertel twee dingen die je gisteren hebt gedaan.",
        "help": "Gisteren heb ik … Met … En jij?",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Vertel twee dingen die je gisteren hebt gedaan.",
            "support": "Gisteren heb ik … Met … En jij?"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Vertel twee dingen die je gisteren hebt gedaan."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Vertel wat goed ging en wat je de volgende keer anders zou doen."
          }
        },
        "teacherCriterion": "Noemt twee gebeurtenissen en beantwoordt een vervolgvraag.",
        "channels": [
          "digital",
          "print"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t06",
        "number": 6,
        "title": "Samen oefenen",
        "type": "kies",
        "goalIds": [
          "kiezen",
          "plannen"
        ],
        "instruction": "Je wilt samen Nederlands oefenen. Kies: samen koken of wandelen. Vertel waarom.",
        "partner": "Vraag wanneer de ander dit wil doen.",
        "printSummary": "Je wilt samen Nederlands oefenen. Kies: samen koken of wandelen. Vertel waarom. Partner: Vraag wanneer de ander dit wil doen.",
        "printShort": "Je wilt samen Nederlands oefenen. Kies: samen koken of wandelen. Vertel waarom.",
        "help": "Zullen we samen …? Wanneer kun jij?",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je wilt samen Nederlands oefenen. Kies: samen koken of wandelen. Vertel waarom.",
            "support": "Zullen we samen …? Wanneer kun jij?"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je wilt samen Nederlands oefenen. Kies: samen koken of wandelen. Vertel waarom."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Jullie kiezen allebei iets anders. Zoek een plan waar jullie allebei tevreden mee zijn."
          }
        },
        "teacherCriterion": "Kiest een activiteit, geeft een reden en bespreekt een moment.",
        "channels": [
          "digital",
          "print"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t07",
        "number": 7,
        "title": "In de bibliotheek",
        "type": "vraag",
        "goalIds": [
          "vragen"
        ],
        "instruction": "Je boek moet vandaag terug. Vraag of je het langer mag lenen.",
        "partner": "Je werkt in de bibliotheek. Het mag nog één week. Vertel tot wanneer.",
        "printSummary": "Je boek moet vandaag terug. Vraag of je het langer mag lenen. Partner: Je werkt in de bibliotheek. Het mag nog één week. Vertel tot wanneer.",
        "printShort": "Je boek moet vandaag terug. Vraag of je het langer mag lenen.",
        "help": "Mag ik dit boek langer lenen? Tot wanneer?",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je boek moet vandaag terug. Vraag of je het langer mag lenen.",
            "support": "Mag ik dit boek langer lenen? Tot wanneer?"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je boek moet vandaag terug. Vraag of je het langer mag lenen."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Het boek is gereserveerd. Bespreek wanneer je een ander boek kunt ophalen."
          }
        },
        "teacherCriterion": "Vraagt om verlenging en controleert wanneer het boek terug moet.",
        "channels": [
          "digital",
          "print"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t08",
        "number": 8,
        "title": "Te laat",
        "type": "losop",
        "goalIds": [
          "plannen"
        ],
        "instruction": "Je bent onderweg naar een vriend. Je komt twintig minuten later. Bel je vriend en vertel dit.",
        "partner": "Vraag hoe laat de ander er dan is. Jullie hadden om drie uur afgesproken.",
        "printSummary": "Je bent onderweg naar een vriend. Je komt twintig minuten later. Bel je vriend en vertel dit. Partner: Vraag hoe laat de ander er dan is. Jullie hadden om drie uur afgesproken.",
        "printShort": "Je bent onderweg naar een vriend. Je komt twintig minuten later. Bel je vriend en vertel dit.",
        "help": "Sorry, ik kom om 15.20 uur. Is dat goed?",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je bent onderweg naar een vriend. Je komt twintig minuten later. Bel je vriend en vertel dit.",
            "support": "Sorry, ik kom om 15.20 uur. Is dat goed?"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je bent onderweg naar een vriend. Je komt twintig minuten later. Bel je vriend en vertel dit."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Je vriend moet om half vier weg. Spreek af wat jullie nu doen."
          }
        },
        "teacherCriterion": "Meldt de vertraging en stemt de nieuwe aankomsttijd af.",
        "channels": [
          "digital",
          "print"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t09",
        "number": 9,
        "title": "Een fijne plek",
        "type": "vertel",
        "goalIds": [
          "vertellen"
        ],
        "instruction": "Vertel over een plek in je buurt waar je graag komt.",
        "partner": "Vraag wat je daar kunt doen.",
        "printSummary": "Vertel over een plek in je buurt waar je graag komt. Partner: Vraag wat je daar kunt doen.",
        "printShort": "Vertel over een plek in je buurt waar je graag komt.",
        "help": "Ik kom graag bij … Daar kun je …",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Vertel over een plek in je buurt waar je graag komt.",
            "support": "Ik kom graag bij … Daar kun je …"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Vertel over een plek in je buurt waar je graag komt."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Leg uit voor wie deze plek geschikt is en voor wie minder."
          }
        },
        "teacherCriterion": "Beschrijft een plek en een activiteit.",
        "channels": [
          "digital",
          "print"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t10",
        "number": 10,
        "title": "Iets drinken",
        "type": "vraag",
        "goalIds": [
          "vragen"
        ],
        "instruction": "Je bent in een café. Bestel iets te drinken en vraag wat het kost.",
        "partner": "Je werkt in het café. Noem een drankje en bedenk een prijs.",
        "printSummary": "Je bent in een café. Bestel iets te drinken en vraag wat het kost. Partner: Je werkt in het café. Noem een drankje en bedenk een prijs.",
        "printShort": "Je bent in een café. Bestel iets te drinken en vraag wat het kost.",
        "help": "Mag ik …? Hoeveel kost dat?",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je bent in een café. Bestel iets te drinken en vraag wat het kost.",
            "support": "Mag ik …? Hoeveel kost dat?"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je bent in een café. Bestel iets te drinken en vraag wat het kost."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Je bestelling is niet beschikbaar. Vraag naar een alternatief en kies opnieuw."
          }
        },
        "teacherCriterion": "Bestelt, vraagt de prijs en reageert passend.",
        "channels": [
          "digital",
          "print"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t11",
        "number": 11,
        "title": "Een cadeautje",
        "type": "kies",
        "goalIds": [
          "kiezen"
        ],
        "instruction": "Je zoekt een cadeautje voor een buurman of buurvrouw. Kies: bloemen of iets lekkers. Vertel waarom.",
        "partner": "Vraag waar je het cadeau wilt kopen.",
        "printSummary": "Je zoekt een cadeautje voor een buurman of buurvrouw. Kies: bloemen of iets lekkers. Vertel waarom. Partner: Vraag waar je het cadeau wilt kopen.",
        "printShort": "Je zoekt een cadeautje voor een buurman of buurvrouw. Kies: bloemen of iets lekkers. Vertel waarom.",
        "help": "Ik kies …, want … Waar kopen we het?",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je zoekt een cadeautje voor een buurman of buurvrouw. Kies: bloemen of iets lekkers. Vertel waarom.",
            "support": "Ik kies …, want … Waar kopen we het?"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je zoekt een cadeautje voor een buurman of buurvrouw. Kies: bloemen of iets lekkers. Vertel waarom."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Je weet niet wat de buurman of buurvrouw lekker vindt. Bespreek hoe je daar rekening mee houdt."
          }
        },
        "teacherCriterion": "Maakt een keuze en licht die eenvoudig toe.",
        "channels": [
          "digital",
          "print"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t12",
        "number": 12,
        "title": "Verkeerde tas",
        "type": "losop",
        "goalIds": [
          "oplossen"
        ],
        "instruction": "Je pakt in de les per ongeluk de tas van een ander. De ander ziet het. Wat zeg je?",
        "partner": "Het is jouw tas. Reageer en help de ander de eigen tas zoeken.",
        "printSummary": "Je pakt in de les per ongeluk de tas van een ander. De ander ziet het. Wat zeg je? Partner: Het is jouw tas. Reageer en help de ander de eigen tas zoeken.",
        "printShort": "Je pakt in de les per ongeluk de tas van een ander. De ander ziet het. Wat zeg je?",
        "help": "Sorry, dat is jouw tas. Mijn tas is …",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je pakt in de les per ongeluk de tas van een ander. De ander ziet het. Wat zeg je?",
            "support": "Sorry, dat is jouw tas. Mijn tas is …"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je pakt in de les per ongeluk de tas van een ander. De ander ziet het. Wat zeg je?"
          },
          "extra": {
            "label": "Extra",
            "instruction": "De ander schrikt en reageert boos. Leg rustig uit wat er is gebeurd."
          }
        },
        "teacherCriterion": "Biedt excuses aan en helpt het misverstand oplossen.",
        "channels": [
          "digital",
          "print"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t13",
        "number": 13,
        "title": "Bij de bakker",
        "type": "vraag",
        "goalIds": [
          "vraag"
        ],
        "instruction": "Je wilt een brood kopen. Vraag welke broden er nog zijn.",
        "partner": "Je bent de bakker. Noem twee soorten brood. Vraag hoeveel de ander wil.",
        "help": "Heeft u nog …? Ik wil graag …",
        "printSummary": "Je wilt een brood kopen. Vraag welke broden er nog zijn. Partner: Je bent de bakker. Noem twee soorten brood. Vraag hoeveel de ander wil.",
        "printShort": "Je wilt een brood kopen. Vraag welke broden er nog zijn.",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je wilt een brood kopen. Vraag welke broden er nog zijn.",
            "support": "Heeft u nog …? Ik wil graag …"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je wilt een brood kopen. Vraag welke broden er nog zijn."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Het gekozen brood is op. Kies samen iets anders."
          }
        },
        "teacherCriterion": "Voert de genoemde spreekhandeling uit en reageert op de partner.",
        "channels": [
          "digital"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t14",
        "number": 14,
        "title": "De bus gemist",
        "type": "losop",
        "goalIds": [
          "losop"
        ],
        "instruction": "Je hebt de bus gemist. Je vriend wacht bij de markt. Bel en vertel wat er is gebeurd.",
        "partner": "De volgende bus komt over een kwartier. Bespreek waar jullie elkaar ontmoeten.",
        "help": "Ik heb de bus gemist. Kun je …?",
        "printSummary": "Je hebt de bus gemist. Je vriend wacht bij de markt. Bel en vertel wat er is gebeurd. Partner: De volgende bus komt over een kwartier. Bespreek waar jullie elkaar ontmoeten.",
        "printShort": "Je hebt de bus gemist. Je vriend wacht bij de markt. Bel en vertel wat er is gebeurd.",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je hebt de bus gemist. Je vriend wacht bij de markt. Bel en vertel wat er is gebeurd.",
            "support": "Ik heb de bus gemist. Kun je …?"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je hebt de bus gemist. Je vriend wacht bij de markt. Bel en vertel wat er is gebeurd."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Je vriend kan niet lang wachten. Maak een nieuw plan."
          }
        },
        "teacherCriterion": "Voert de genoemde spreekhandeling uit en reageert op de partner.",
        "channels": [
          "digital"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t15",
        "number": 15,
        "title": "Sleutels kwijt",
        "type": "vertel",
        "goalIds": [
          "vertel"
        ],
        "instruction": "Vertel je buurman of buurvrouw waar je vandaag bent geweest. Je zoekt je sleutels.",
        "partner": "Vraag waar de ander de sleutels voor het laatst heeft gezien. Bedenk waar je kunt zoeken.",
        "help": "Eerst was ik … Daarna …",
        "printSummary": "Vertel je buurman of buurvrouw waar je vandaag bent geweest. Je zoekt je sleutels. Partner: Vraag waar de ander de sleutels voor het laatst heeft gezien. Bedenk waar je kunt zoeken.",
        "printShort": "Vertel je buurman of buurvrouw waar je vandaag bent geweest. Je zoekt je sleutels.",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Vertel je buurman of buurvrouw waar je vandaag bent geweest. Je zoekt je sleutels.",
            "support": "Eerst was ik … Daarna …"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Vertel je buurman of buurvrouw waar je vandaag bent geweest. Je zoekt je sleutels."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Je vindt de sleutels niet. Bespreek wie kan helpen."
          }
        },
        "teacherCriterion": "Voert de genoemde spreekhandeling uit en reageert op de partner.",
        "channels": [
          "digital"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t16",
        "number": 16,
        "title": "Het gaat regenen",
        "type": "kies",
        "goalIds": [
          "kies"
        ],
        "instruction": "Jullie willen buiten afspreken, maar het gaat regenen. Kies: het café of de bibliotheek. Geef een reden.",
        "partner": "Vertel welke plek jij kiest. Spreek samen een plek af.",
        "help": "Ik kies …, omdat …",
        "printSummary": "Jullie willen buiten afspreken, maar het gaat regenen. Kies: het café of de bibliotheek. Geef een reden. Partner: Vertel welke plek jij kiest. Spreek samen een plek af.",
        "printShort": "Jullie willen buiten afspreken, maar het gaat regenen. Kies: het café of de bibliotheek. Geef een reden.",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Jullie willen buiten afspreken, maar het gaat regenen. Kies: het café of de bibliotheek. Geef een reden.",
            "support": "Ik kies …, omdat …"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Jullie willen buiten afspreken, maar het gaat regenen. Kies: het café of de bibliotheek. Geef een reden."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Het café is vol. Verander samen het plan."
          }
        },
        "teacherCriterion": "Voert de genoemde spreekhandeling uit en reageert op de partner.",
        "channels": [
          "digital"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t17",
        "number": 17,
        "title": "Een pakket ophalen",
        "type": "vraag",
        "goalIds": [
          "vraag"
        ],
        "instruction": "Je pakket is bij je buurman of buurvrouw bezorgd. Vraag wanneer je het kunt ophalen.",
        "partner": "Je bent nu weg. Je bent vanavond vanaf zeven uur thuis. Maak een afspraak.",
        "help": "Kan ik mijn pakket … ophalen?",
        "printSummary": "Je pakket is bij je buurman of buurvrouw bezorgd. Vraag wanneer je het kunt ophalen. Partner: Je bent nu weg. Je bent vanavond vanaf zeven uur thuis. Maak een afspraak.",
        "printShort": "Je pakket is bij je buurman of buurvrouw bezorgd. Vraag wanneer je het kunt ophalen.",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je pakket is bij je buurman of buurvrouw bezorgd. Vraag wanneer je het kunt ophalen.",
            "support": "Kan ik mijn pakket … ophalen?"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je pakket is bij je buurman of buurvrouw bezorgd. Vraag wanneer je het kunt ophalen."
          },
          "extra": {
            "label": "Extra",
            "instruction": "De ander kan vanavond niet. Zoek een ander moment."
          }
        },
        "teacherCriterion": "Voert de genoemde spreekhandeling uit en reageert op de partner.",
        "channels": [
          "digital"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t18",
        "number": 18,
        "title": "De planten verzorgen",
        "type": "losop",
        "goalIds": [
          "losop"
        ],
        "instruction": "Je bent drie dagen weg. Vraag je buurman of buurvrouw om je planten water te geven. Leg uit waar ze staan.",
        "partner": "Je kunt één keer komen. Vraag hoeveel water de planten nodig hebben.",
        "help": "Zou je …? Ze staan …",
        "printSummary": "Je bent drie dagen weg. Vraag je buurman of buurvrouw om je planten water te geven. Leg uit waar ze staan. Partner: Je kunt één keer komen. Vraag hoeveel water de planten nodig hebben.",
        "printShort": "Je bent drie dagen weg. Vraag je buurman of buurvrouw om je planten water te geven. Leg uit waar ze staan.",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je bent drie dagen weg. Vraag je buurman of buurvrouw om je planten water te geven. Leg uit waar ze staan.",
            "support": "Zou je …? Ze staan …"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je bent drie dagen weg. Vraag je buurman of buurvrouw om je planten water te geven. Leg uit waar ze staan."
          },
          "extra": {
            "label": "Extra",
            "instruction": "De buurman of buurvrouw heeft geen sleutel. Regel hoe de buurman of buurvrouw binnenkomt."
          }
        },
        "teacherCriterion": "Voert de genoemde spreekhandeling uit en reageert op de partner.",
        "channels": [
          "digital"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t19",
        "number": 19,
        "title": "Een brief versturen",
        "type": "vraag",
        "goalIds": [
          "vraag"
        ],
        "instruction": "Je wilt een brief naar een ander land sturen. Vraag bij het postpunt wat je moet doen.",
        "partner": "Je werkt bij het postpunt. Vraag naar welk land de brief moet. Vertel dat er een postzegel op moet.",
        "help": "Ik wil deze brief naar … sturen. Wat heb ik nodig?",
        "printSummary": "Je wilt een brief naar een ander land sturen. Vraag bij het postpunt wat je moet doen. Partner: Je werkt bij het postpunt. Vraag naar welk land de brief moet. Vertel dat er een postzegel op moet.",
        "printShort": "Je wilt een brief naar een ander land sturen. Vraag bij het postpunt wat je moet doen.",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je wilt een brief naar een ander land sturen. Vraag bij het postpunt wat je moet doen.",
            "support": "Ik wil deze brief naar … sturen. Wat heb ik nodig?"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je wilt een brief naar een ander land sturen. Vraag bij het postpunt wat je moet doen."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Vraag ook waar je de brief kunt inleveren."
          }
        },
        "teacherCriterion": "Voert de genoemde spreekhandeling uit en reageert op de partner.",
        "channels": [
          "digital"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t20",
        "number": 20,
        "title": "Bewegen in de buurt",
        "type": "vertel",
        "goalIds": [
          "vertel"
        ],
        "instruction": "Vertel welke sport of beweging je leuk vindt en waar je dat in de buurt kunt doen.",
        "partner": "Vraag hoe vaak de ander dat doet. Vertel daarna wat jij graag doet.",
        "help": "Ik vind … leuk. Ik doe dat …",
        "printSummary": "Vertel welke sport of beweging je leuk vindt en waar je dat in de buurt kunt doen. Partner: Vraag hoe vaak de ander dat doet. Vertel daarna wat jij graag doet.",
        "printShort": "Vertel welke sport of beweging je leuk vindt en waar je dat in de buurt kunt doen.",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Vertel welke sport of beweging je leuk vindt en waar je dat in de buurt kunt doen.",
            "support": "Ik vind … leuk. Ik doe dat …"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Vertel welke sport of beweging je leuk vindt en waar je dat in de buurt kunt doen."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Nodig de ander uit om een keer mee te doen."
          }
        },
        "teacherCriterion": "Voert de genoemde spreekhandeling uit en reageert op de partner.",
        "channels": [
          "digital"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t21",
        "number": 21,
        "title": "Een kort bospad",
        "type": "kies",
        "goalIds": [
          "kies"
        ],
        "instruction": "Je ziet een kort pad dat drie vakken verder uitkomt. Leg uit waar jullie naartoe gaan.",
        "partner": "Herhaal de route en vraag wat jullie daarna doen.",
        "help": "We gaan naar … Daarna …",
        "printSummary": "Je ziet een kort pad dat drie vakken verder uitkomt. Leg uit waar jullie naartoe gaan. Partner: Herhaal de route en vraag wat jullie daarna doen.",
        "printShort": "Je ziet een kort pad dat drie vakken verder uitkomt. Leg uit waar jullie naartoe gaan.",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je ziet een kort pad dat drie vakken verder uitkomt. Leg uit waar jullie naartoe gaan.",
            "support": "We gaan naar … Daarna …"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je ziet een kort pad dat drie vakken verder uitkomt. Leg uit waar jullie naartoe gaan."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Vertel ook hoe de langere route loopt."
          }
        },
        "teacherCriterion": "Brengt de eigen boodschap over en reageert passend op de gesprekspartner.",
        "channels": [
          "digital"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t22",
        "number": 22,
        "title": "De afvalbak is vol",
        "type": "losop",
        "goalIds": [
          "losop"
        ],
        "instruction": "Je wilt afval wegbrengen, maar de bak is vol. Vraag je buurman of buurvrouw waar een andere bak staat.",
        "partner": "Je weet een andere bak bij het plein. Leg uit waar die staat.",
        "help": "Deze bak is vol. Weet jij …?",
        "printSummary": "Je wilt afval wegbrengen, maar de bak is vol. Vraag je buurman of buurvrouw waar een andere bak staat. Partner: Je weet een andere bak bij het plein. Leg uit waar die staat.",
        "printShort": "Je wilt afval wegbrengen, maar de bak is vol. Vraag je buurman of buurvrouw waar een andere bak staat.",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je wilt afval wegbrengen, maar de bak is vol. Vraag je buurman of buurvrouw waar een andere bak staat.",
            "support": "Deze bak is vol. Weet jij …?"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je wilt afval wegbrengen, maar de bak is vol. Vraag je buurman of buurvrouw waar een andere bak staat."
          },
          "extra": {
            "label": "Extra",
            "instruction": "De ander begrijpt de weg niet. Leg het nog een keer anders uit."
          }
        },
        "teacherCriterion": "Voert de genoemde spreekhandeling uit en reageert op de partner.",
        "channels": [
          "digital"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t23",
        "number": 23,
        "title": "De weg naar het plein",
        "type": "vraag",
        "goalIds": [
          "vraag"
        ],
        "instruction": "Je bent nieuw in de buurt. Vraag hoe je bij het plein komt.",
        "partner": "Het plein is na de brug rechts. Leg de weg uit. Vraag of het duidelijk is.",
        "help": "Hoe kom ik bij …? Dus eerst …?",
        "printSummary": "Je bent nieuw in de buurt. Vraag hoe je bij het plein komt. Partner: Het plein is na de brug rechts. Leg de weg uit. Vraag of het duidelijk is.",
        "printShort": "Je bent nieuw in de buurt. Vraag hoe je bij het plein komt.",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je bent nieuw in de buurt. Vraag hoe je bij het plein komt.",
            "support": "Hoe kom ik bij …? Dus eerst …?"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je bent nieuw in de buurt. Vraag hoe je bij het plein komt."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Herhaal de route om te controleren of je het goed begrijpt."
          }
        },
        "teacherCriterion": "Voert de genoemde spreekhandeling uit en reageert op de partner.",
        "channels": [
          "digital"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t24",
        "number": 24,
        "title": "Een buurman of buurvrouw helpen",
        "type": "kies",
        "goalIds": [
          "kies"
        ],
        "instruction": "Je buurman of buurvrouw is net verhuisd. Kies hoe je wilt helpen: dozen dragen of spullen uitpakken. Leg je keuze uit.",
        "partner": "Vertel welke hulp je nodig hebt. Spreek af wanneer jullie beginnen.",
        "help": "Ik kan helpen met … Wanneer …?",
        "printSummary": "Je buurman of buurvrouw is net verhuisd. Kies hoe je wilt helpen: dozen dragen of spullen uitpakken. Leg je keuze uit. Partner: Vertel welke hulp je nodig hebt. Spreek af wanneer jullie beginnen.",
        "printShort": "Je buurman of buurvrouw is net verhuisd. Kies hoe je wilt helpen: dozen dragen of spullen uitpakken. Leg je keuze uit.",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je buurman of buurvrouw is net verhuisd. Kies hoe je wilt helpen: dozen dragen of spullen uitpakken. Leg je keuze uit.",
            "support": "Ik kan helpen met … Wanneer …?"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je buurman of buurvrouw is net verhuisd. Kies hoe je wilt helpen: dozen dragen of spullen uitpakken. Leg je keuze uit."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Je kunt maar een halfuur helpen. Kies samen wat eerst moet."
          }
        },
        "teacherCriterion": "Voert de genoemde spreekhandeling uit en reageert op de partner.",
        "channels": [
          "digital"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t25",
        "number": 25,
        "title": "Een avondwandeling",
        "type": "kies",
        "goalIds": [
          "kies"
        ],
        "instruction": "Je wilt na het eten wandelen. Kies samen een route door het park of langs het water.",
        "partner": "Vertel welke route jij prettig vindt en waarom.",
        "help": "Ik loop liever …, want …",
        "printSummary": "Je wilt na het eten wandelen. Kies samen een route door het park of langs het water. Partner: Vertel welke route jij prettig vindt en waarom.",
        "printShort": "Je wilt na het eten wandelen. Kies samen een route door het park of langs het water.",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je wilt na het eten wandelen. Kies samen een route door het park of langs het water.",
            "support": "Ik loop liever …, want …"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je wilt na het eten wandelen. Kies samen een route door het park of langs het water."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Het wordt donker. Pas jullie plan samen aan."
          }
        },
        "teacherCriterion": "Voert de spreekhandeling uit en reageert op de partner.",
        "channels": [
          "digital"
        ],
        "literacy": "Docent leest voor of deelnemer leest de opdracht",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t26",
        "number": 26,
        "title": "Bij het bezoekerscentrum",
        "type": "losop",
        "goalIds": [
          "losop"
        ],
        "instruction": "Je wilt iets vragen bij het bezoekerscentrum, maar de balie is gesloten. Bespreek wat je kunt doen.",
        "partner": "Stel voor waar jullie informatie kunnen zoeken.",
        "help": "Misschien staat het …",
        "printSummary": "Je wilt iets vragen bij het bezoekerscentrum, maar de balie is gesloten. Bespreek wat je kunt doen. Partner: Stel voor waar jullie informatie kunnen zoeken.",
        "printShort": "Je wilt iets vragen bij het bezoekerscentrum, maar de balie is gesloten. Bespreek wat je kunt doen.",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je wilt iets vragen bij het bezoekerscentrum, maar de balie is gesloten. Bespreek wat je kunt doen.",
            "support": "Misschien staat het …"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je wilt iets vragen bij het bezoekerscentrum, maar de balie is gesloten. Bespreek wat je kunt doen."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Er hangt geen informatie. Bedenk een andere mogelijkheid."
          }
        },
        "teacherCriterion": "Brengt de eigen boodschap over en reageert passend op de gesprekspartner.",
        "channels": [
          "digital"
        ],
        "literacy": "Docent leest voor of deelnemer leest de opdracht",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t27",
        "number": 27,
        "title": "Een buurman of buurvrouw uitnodigen",
        "type": "vraag",
        "goalIds": [
          "vraag"
        ],
        "instruction": "Je wilt je buurman of buurvrouw uitnodigen om thee te drinken. Vraag wanneer die tijd heeft.",
        "partner": "Je kunt vandaag niet. Stel een ander moment voor.",
        "help": "Heb je tijd om …?",
        "printSummary": "Je wilt je buurman of buurvrouw uitnodigen om thee te drinken. Vraag wanneer die tijd heeft. Partner: Je kunt vandaag niet. Stel een ander moment voor.",
        "printShort": "Je wilt je buurman of buurvrouw uitnodigen om thee te drinken. Vraag wanneer die tijd heeft.",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je wilt je buurman of buurvrouw uitnodigen om thee te drinken. Vraag wanneer die tijd heeft.",
            "support": "Heb je tijd om …?"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je wilt je buurman of buurvrouw uitnodigen om thee te drinken. Vraag wanneer die tijd heeft."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Jullie eerste twee voorstellen passen niet. Vind toch een moment."
          }
        },
        "teacherCriterion": "Voert de spreekhandeling uit en reageert op de partner.",
        "channels": [
          "digital"
        ],
        "literacy": "Docent leest voor of deelnemer leest de opdracht",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t28",
        "number": 28,
        "title": "Een fijne herinnering",
        "type": "vertel",
        "goalIds": [
          "vertel"
        ],
        "instruction": "Vertel over een plek waar je vroeger graag kwam. Wat deed je daar?",
        "partner": "Vraag met wie de ander daar kwam en reageer op het antwoord.",
        "help": "Vroeger ging ik vaak naar …",
        "printSummary": "Vertel over een plek waar je vroeger graag kwam. Wat deed je daar? Partner: Vraag met wie de ander daar kwam en reageer op het antwoord.",
        "printShort": "Vertel over een plek waar je vroeger graag kwam. Wat deed je daar?",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Vertel over een plek waar je vroeger graag kwam. Wat deed je daar?",
            "support": "Vroeger ging ik vaak naar …"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Vertel over een plek waar je vroeger graag kwam. Wat deed je daar?"
          },
          "extra": {
            "label": "Extra",
            "instruction": "Vergelijk die plek met een plek in je huidige buurt."
          }
        },
        "teacherCriterion": "Voert de spreekhandeling uit en reageert op de partner.",
        "channels": [
          "digital"
        ],
        "literacy": "Docent leest voor of deelnemer leest de opdracht",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t29",
        "number": 29,
        "title": "Een vrije middag",
        "type": "vertel",
        "goalIds": [
          "plannen"
        ],
        "instruction": "Je bent morgenmiddag vrij. Stel voor om samen iets te doen.",
        "partner": "Vraag hoe laat. Spreek samen een tijd af.",
        "printSummary": "Je bent morgenmiddag vrij. Stel voor om samen iets te doen. Partner: Vraag hoe laat. Spreek samen een tijd af.",
        "printShort": "Je bent morgenmiddag vrij. Stel voor om samen iets te doen.",
        "help": "Zullen we morgen …? Om … uur?",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je bent morgenmiddag vrij. Stel voor om samen iets te doen.",
            "support": "Zullen we morgen …? Om … uur?"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je bent morgenmiddag vrij. Stel voor om samen iets te doen."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Vertel ook wat je doet als het regent."
          }
        },
        "teacherCriterion": "Doet een voorstel en bevestigt samen een tijd.",
        "channels": [
          "digital",
          "print"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t30",
        "number": 30,
        "title": "Een pen lenen",
        "type": "vraag",
        "goalIds": [
          "vragen"
        ],
        "instruction": "Je bent in de les en hebt geen pen. Vraag je buurman of buurvrouw om een pen.",
        "partner": "Je hebt een extra pen. Geef antwoord.",
        "printSummary": "Je bent in de les en hebt geen pen. Vraag je buurman of buurvrouw om een pen. Partner: Je hebt een extra pen. Geef antwoord.",
        "printShort": "Je bent in de les en hebt geen pen. Vraag je buurman of buurvrouw om een pen.",
        "help": "Mag ik je pen lenen? Dank je wel.",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je bent in de les en hebt geen pen. Vraag je buurman of buurvrouw om een pen.",
            "support": "Mag ik je pen lenen? Dank je wel."
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je bent in de les en hebt geen pen. Vraag je buurman of buurvrouw om een pen."
          },
          "extra": {
            "label": "Extra",
            "instruction": "De ander heeft geen pen over. Zoek samen een andere oplossing."
          }
        },
        "teacherCriterion": "Stelt een begrijpelijke vraag en reageert op het antwoord.",
        "channels": [
          "digital",
          "print"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t31",
        "number": 31,
        "title": "Naar de markt",
        "type": "kies",
        "goalIds": [
          "kiezen"
        ],
        "instruction": "Je gaat naar de markt. Kies: met de fiets of met de bus. Vertel waarom.",
        "partner": "Vraag hoe lang de reis duurt.",
        "printSummary": "Je gaat naar de markt. Kies: met de fiets of met de bus. Vertel waarom. Partner: Vraag hoe lang de reis duurt.",
        "printShort": "Je gaat naar de markt. Kies: met de fiets of met de bus. Vertel waarom.",
        "help": "Zullen we met de … gaan? Dat is …",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je gaat naar de markt. Kies: met de fiets of met de bus. Vertel waarom.",
            "support": "Zullen we met de … gaan? Dat is …"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je gaat naar de markt. Kies: met de fiets of met de bus. Vertel waarom."
          },
          "extra": {
            "label": "Extra",
            "instruction": "De bus is duurder, maar het regent. Bespreek of je keuze verandert."
          }
        },
        "teacherCriterion": "Maakt een keuze, geeft een reden en reageert op de vraag.",
        "channels": [
          "digital",
          "print"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t32",
        "number": 32,
        "title": "De afspraak",
        "type": "losop",
        "goalIds": [
          "plannen",
          "vragen"
        ],
        "instruction": "Je hebt woensdag om tien uur een afspraak. Je kunt dan niet. Vraag om een andere tijd.",
        "partner": "Je kunt woensdag om twee uur of donderdag om elf uur. Zoek samen een tijd.",
        "printSummary": "Je hebt woensdag om tien uur een afspraak. Je kunt dan niet. Vraag om een andere tijd. Partner: Je kunt woensdag om twee uur of donderdag om elf uur. Zoek samen een tijd.",
        "printShort": "Je hebt woensdag om tien uur een afspraak. Je kunt dan niet. Vraag om een andere tijd.",
        "help": "Kan het woensdag om …? Dus we spreken af …",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Je hebt woensdag om tien uur een afspraak. Je kunt dan niet. Vraag om een andere tijd.",
            "support": "Kan het woensdag om …? Dus we spreken af …"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Je hebt woensdag om tien uur een afspraak. Je kunt dan niet. Vraag om een andere tijd."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Je kunt allebei niet op de voorgestelde tijden. Stel ieder een andere mogelijkheid voor."
          }
        },
        "teacherCriterion": "Vraagt om wijziging en bevestigt samen een nieuwe dag en tijd.",
        "channels": [
          "digital",
          "print"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      },
      {
        "id": "t33",
        "number": 33,
        "title": "Gisteren",
        "type": "vertel",
        "goalIds": [
          "vertellen"
        ],
        "instruction": "Vertel twee dingen die je gisteren hebt gedaan.",
        "partner": "Vraag met wie. Vertel daarna iets over jouw dag.",
        "printSummary": "Vertel twee dingen die je gisteren hebt gedaan. Partner: Vraag met wie. Vertel daarna iets over jouw dag.",
        "printShort": "Vertel twee dingen die je gisteren hebt gedaan.",
        "help": "Gisteren heb ik … Met … En jij?",
        "variants": {
          "instap": {
            "label": "Met hulp",
            "instruction": "Vertel twee dingen die je gisteren hebt gedaan.",
            "support": "Gisteren heb ik … Met … En jij?"
          },
          "basis": {
            "label": "Basis",
            "instruction": "Vertel twee dingen die je gisteren hebt gedaan."
          },
          "extra": {
            "label": "Extra",
            "instruction": "Vertel wat goed ging en wat je de volgende keer anders zou doen."
          }
        },
        "teacherCriterion": "Noemt twee gebeurtenissen en beantwoordt een vervolgvraag.",
        "channels": [
          "digital",
          "print"
        ],
        "literacy": "Korte instructies lezen of docent leest voor",
        "assets": [],
        "level": "A2",
        "routeId": "a1-a2"
      }
    ]
  }
});
