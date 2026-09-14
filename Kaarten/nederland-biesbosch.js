DigiBoardDutchWorld.create({
  "id": "nederland-biesbosch",
  "slug": "biesbosch",
  "anchors": [
    [
      160,
      771
    ],
    [
      153,
      708
    ],
    [
      218,
      677
    ],
    [
      291,
      648
    ],
    [
      334,
      608
    ],
    [
      295,
      566
    ],
    [
      252,
      533
    ],
    [
      232,
      494
    ],
    [
      240,
      457
    ],
    [
      278,
      427
    ],
    [
      330,
      403
    ],
    [
      386,
      383
    ],
    [
      446,
      366
    ],
    [
      501,
      358
    ],
    [
      1508,
      424
    ],
    [
      1000,
      550
    ],
    [
      960,
      574
    ],
    [
      919,
      598
    ],
    [
      986,
      628
    ],
    [
      1068,
      636
    ],
    [
      1149,
      652
    ],
    [
      1237,
      684
    ],
    [
      1329,
      721
    ],
    [
      1395,
      766
    ],
    [
      1463,
      815
    ],
    [
      1527,
      865
    ],
    [
      1434,
      557
    ],
    [
      1489,
      534
    ],
    [
      1537,
      509
    ],
    [
      1562,
      475
    ],
    [
      1543,
      446
    ],
    [
      1051,
      269
    ],
    [
      1107,
      260
    ],
    [
      1157,
      252
    ],
    [
      1209,
      246
    ],
    [
      1263,
      235
    ],
    [
      1311,
      219
    ],
    [
      1346,
      199
    ],
    [
      1379,
      181
    ],
    [
      1415,
      164
    ],
    [
      1490,
      145
    ]
  ],
  "passages": [
    {
      "id": "pont-13",
      "kind": "ferry",
      "to": 14,
      "label": "Pont naar het wilgeneiland",
      "enter": [
        [
          501,
          358
        ],
        [
          562,
          351
        ],
        [
          606,
          343
        ]
      ],
      "water": [
        [
          606,
          343
        ],
        [
          738,
          385
        ],
        [
          902,
          380
        ],
        [
          1100,
          369
        ],
        [
          1300,
          345
        ],
        [
          1440,
          325
        ],
        [
          1570,
          321
        ],
        [
          1632,
          346
        ],
        [
          1635,
          380
        ]
      ],
      "exit": [
        [
          1635,
          380
        ],
        [
          1595,
          379
        ],
        [
          1585,
          414
        ],
        [
          1537,
          428
        ],
        [
          1508,
          424
        ]
      ],
      "labelPos": [
        743,
        264
      ],
      "from": 13,
      "icon": "ship",
      "description": "Deze passage hoort bij de stap van vak 13 naar 14. Ook bij een grotere worp wordt de passage gebruikt.",
      "duration": 8911,
      "timeline": [
        0.07939603015014979,
        0.8835207136858397
      ]
    },
    {
      "id": "doorgang-2",
      "kind": "tunnel",
      "to": 15,
      "label": "Wilgentunnel",
      "enter": [
        [
          1508,
          424
        ],
        [
          1513,
          419
        ],
        [
          1513,
          409
        ]
      ],
      "exit": [
        [
          1005,
          525
        ],
        [
          1006,
          539
        ],
        [
          1000,
          550
        ]
      ],
      "labelPos": [
        1265,
        453
      ],
      "optional": false,
      "boat": false,
      "hiddenLabel": "In de doorgang",
      "from": 14,
      "icon": "move-down",
      "description": "Deze passage hoort bij de stap van vak 14 naar 15. Ook bij een grotere worp wordt de passage gebruikt.",
      "duration": 4300,
      "timeline": [
        0.15116279069767444,
        0.3604651162790698,
        0.6395348837209303,
        0.8488372093023256
      ]
    },
    {
      "id": "pont-30",
      "kind": "ferry",
      "to": 31,
      "label": "Pont naar de uitkijkroute",
      "enter": [
        [
          1543,
          446
        ],
        [
          1585,
          432
        ],
        [
          1595,
          409
        ],
        [
          1610,
          383
        ],
        [
          1640,
          380
        ]
      ],
      "water": [
        [
          1640,
          380
        ],
        [
          1632,
          346
        ],
        [
          1570,
          321
        ],
        [
          1440,
          325
        ],
        [
          1300,
          345
        ],
        [
          1140,
          366
        ],
        [
          1030,
          351
        ],
        [
          975,
          321
        ],
        [
          981,
          286
        ]
      ],
      "exit": [
        [
          981,
          286
        ],
        [
          1008,
          277
        ],
        [
          1051,
          269
        ]
      ],
      "labelPos": [
        1427,
        326
      ],
      "from": 30,
      "icon": "ship",
      "description": "Deze passage hoort bij de stap van vak 30 naar 31. Ook bij een grotere worp wordt de passage gebruikt.",
      "duration": 6522,
      "timeline": [
        0.13238678465170536,
        0.8926743218902884
      ]
    }
  ],
  "masks": [
    {
      "id": "doorgang-2-mond-0",
      "path": "M1485 421V359H1538V421H1532V365H1491V421Z",
      "area": [
        1485,
        359,
        1538,
        421
      ],
      "frontY": 2000,
      "portal": true
    },
    {
      "id": "doorgang-2-mond-1",
      "path": "M956 558V477H1024V558H1018V483H962V558Z",
      "area": [
        956,
        477,
        1024,
        558
      ],
      "frontY": 2000,
      "portal": true
    },
    {
      "id": "brug-front",
      "path": "M1001.7 640.5 L1074.7 650.5 L1075.3 645.5 L1002.3 635.5Z M1074.4 650.4 L1148.4 669.4 L1149.6 664.6 L1075.6 645.6Z M1148.1 669.3 L1229.1 701.3 L1230.9 696.7 L1149.9 664.7Z M1228.5 701.0 L1337.5 784.0 L1340.5 780.0 L1231.5 697.0Z",
      "area": [
        1002,
        638,
        1339,
        782
      ],
      "frontY": 2000,
      "bridge": true
    }
  ],
  "waypoints": {
    "25": [
      [
        1527,
        865
      ],
      [
        1580,
        874
      ],
      [
        1625,
        830
      ],
      [
        1632,
        774
      ],
      [
        1607,
        731
      ],
      [
        1567,
        687
      ],
      [
        1515,
        650
      ],
      [
        1472,
        615
      ],
      [
        1460,
        586
      ],
      [
        1434,
        557
      ]
    ]
  },
  "previews": [
    {
      "id": "brug-17",
      "to": 24,
      "label": "Over de kreekbrug",
      "icon": "route",
      "description": "De pion volgt het brugdek tussen de leuningen.",
      "from": 17
    },
    {
      "id": "pont-13",
      "kind": "ferry",
      "to": 14,
      "label": "Pont naar het wilgeneiland",
      "enter": [
        [
          501,
          358
        ],
        [
          562,
          351
        ],
        [
          606,
          343
        ]
      ],
      "water": [
        [
          606,
          343
        ],
        [
          738,
          385
        ],
        [
          902,
          380
        ],
        [
          1100,
          369
        ],
        [
          1300,
          345
        ],
        [
          1440,
          325
        ],
        [
          1570,
          321
        ],
        [
          1632,
          346
        ],
        [
          1635,
          380
        ]
      ],
      "exit": [
        [
          1635,
          380
        ],
        [
          1595,
          379
        ],
        [
          1585,
          414
        ],
        [
          1537,
          428
        ],
        [
          1508,
          424
        ]
      ],
      "labelPos": [
        743,
        264
      ],
      "from": 13,
      "icon": "ship",
      "description": "Deze passage hoort bij de stap van vak 13 naar 14. Ook bij een grotere worp wordt de passage gebruikt.",
      "duration": 8911,
      "timeline": [
        0.07939603015014979,
        0.8835207136858397
      ]
    },
    {
      "id": "doorgang-2",
      "kind": "tunnel",
      "to": 15,
      "label": "Wilgentunnel",
      "enter": [
        [
          1508,
          424
        ],
        [
          1513,
          419
        ],
        [
          1513,
          409
        ]
      ],
      "exit": [
        [
          1005,
          525
        ],
        [
          1006,
          539
        ],
        [
          1000,
          550
        ]
      ],
      "labelPos": [
        1265,
        453
      ],
      "optional": false,
      "boat": false,
      "hiddenLabel": "In de doorgang",
      "from": 14,
      "icon": "move-down",
      "description": "Deze passage hoort bij de stap van vak 14 naar 15. Ook bij een grotere worp wordt de passage gebruikt.",
      "duration": 4300,
      "timeline": [
        0.15116279069767444,
        0.3604651162790698,
        0.6395348837209303,
        0.8488372093023256
      ]
    },
    {
      "id": "pont-30",
      "kind": "ferry",
      "to": 31,
      "label": "Pont naar de uitkijkroute",
      "enter": [
        [
          1543,
          446
        ],
        [
          1585,
          432
        ],
        [
          1595,
          409
        ],
        [
          1610,
          383
        ],
        [
          1640,
          380
        ]
      ],
      "water": [
        [
          1640,
          380
        ],
        [
          1632,
          346
        ],
        [
          1570,
          321
        ],
        [
          1440,
          325
        ],
        [
          1300,
          345
        ],
        [
          1140,
          366
        ],
        [
          1030,
          351
        ],
        [
          975,
          321
        ],
        [
          981,
          286
        ]
      ],
      "exit": [
        [
          981,
          286
        ],
        [
          1008,
          277
        ],
        [
          1051,
          269
        ]
      ],
      "labelPos": [
        1427,
        326
      ],
      "from": 30,
      "icon": "ship",
      "description": "Deze passage hoort bij de stap van vak 30 naar 31. Ook bij een grotere worp wordt de passage gebruikt.",
      "duration": 6522,
      "timeline": [
        0.13238678465170536,
        0.8926743218902884
      ]
    }
  ],
  "depthModel": "thresholds",
  "routeRevision": "20260914-routelogica-3",
  "image": "nederland-biesbosch-route-v2",
  "label": "Biesbosch",
  "title": "Biesbosch — tussen kreken en wilgen",
  "count": 39,
  "shapes": [
    "circle",
    "square",
    "diamond",
    "circle",
    "square",
    "diamond",
    "triangle",
    "circle",
    "square",
    "triangle",
    "diamond",
    "square",
    "circle",
    "diamond",
    "diamond",
    "circle",
    "triangle",
    "circle",
    "square",
    "triangle",
    "diamond",
    "circle",
    "square",
    "triangle",
    "diamond",
    "square",
    "triangle",
    "diamond",
    "circle",
    "square",
    "circle",
    "square",
    "triangle",
    "diamond",
    "circle",
    "square",
    "diamond",
    "triangle",
    "circle"
  ],
  "size": [
    50,
    32
  ],
  "paintedRoute": true,
  "routeNote": "Volg de genummerde speelroute. De extra doorgangen worden aangegeven met hun vertrek- en aankomstvak. Bij een extra route kun je ook op je vak blijven en gewoon verder spelen.",
  "content": {
    "schemaVersion": 1,
    "id": "nederland-biesbosch-v1",
    "version": "1.0.0",
    "title": "Biesbosch — tussen kreken en wilgen",
    "product": "Taalroute Praatpad",
    "level": "A2",
    "routeId": "a1-a2",
    "routeLabel": "A1 → A2",
    "goal": "Dagelijkse gesprekken voeren: iets vragen, reageren en samen een keuze of afspraak maken.",
    "duration": "Afhankelijk van de oefening en het aantal beurten.",
    "groupSize": "2–30 deelnemers",
    "literacy": "Korte instructies lezen; de docent kan ze voorlezen.",
    "methodLinks": [],
    "finish": 40,
    "coordinates": [
      [
        0.09569377990430622,
        0.8193411264612115
      ],
      [
        0.09150717703349283,
        0.7523910733262487
      ],
      [
        0.1303827751196172,
        0.7194473963868225
      ],
      [
        0.17404306220095694,
        0.6886291179596175
      ],
      [
        0.19976076555023922,
        0.6461211477151966
      ],
      [
        0.17643540669856458,
        0.6014877789585548
      ],
      [
        0.1507177033492823,
        0.5664187035069076
      ],
      [
        0.13875598086124402,
        0.5249734325185972
      ],
      [
        0.14354066985645933,
        0.485653560042508
      ],
      [
        0.16626794258373206,
        0.4537725823591923
      ],
      [
        0.19736842105263158,
        0.42826780021253985
      ],
      [
        0.23086124401913877,
        0.4070138150903294
      ],
      [
        0.26674641148325356,
        0.3889479277364506
      ],
      [
        0.2996411483253589,
        0.3804463336875664
      ],
      [
        0.9019138755980861,
        0.4505844845908608
      ],
      [
        0.5980861244019139,
        0.5844845908607864
      ],
      [
        0.5741626794258373,
        0.6099893730074389
      ],
      [
        0.5496411483253588,
        0.6354941551540914
      ],
      [
        0.5897129186602871,
        0.667375132837407
      ],
      [
        0.638755980861244,
        0.6758767268862912
      ],
      [
        0.687200956937799,
        0.6928799149840595
      ],
      [
        0.7398325358851675,
        0.7268862911795961
      ],
      [
        0.7948564593301436,
        0.7662061636556854
      ],
      [
        0.8343301435406698,
        0.8140276301806588
      ],
      [
        0.875,
        0.8660998937300743
      ],
      [
        0.9132775119617225,
        0.9192348565356004
      ],
      [
        0.8576555023923444,
        0.59192348565356
      ],
      [
        0.8905502392344498,
        0.5674814027630181
      ],
      [
        0.9192583732057417,
        0.5409139213602551
      ],
      [
        0.9342105263157895,
        0.5047821466524973
      ],
      [
        0.9228468899521531,
        0.47396386822529224
      ],
      [
        0.6285885167464115,
        0.2858660998937301
      ],
      [
        0.6620813397129187,
        0.2763018065887354
      ],
      [
        0.6919856459330144,
        0.2678002125398512
      ],
      [
        0.7230861244019139,
        0.2614240170031881
      ],
      [
        0.7553827751196173,
        0.24973432518597238
      ],
      [
        0.7840909090909091,
        0.23273113708820403
      ],
      [
        0.8050239234449761,
        0.21147715196599362
      ],
      [
        0.8247607655502392,
        0.19234856535600425
      ],
      [
        0.8462918660287081,
        0.1742826780021254
      ],
      [
        0.8911483253588517,
        0.15409139213602552
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
      },
      {
        "id": "t34",
        "number": 34,
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
        "id": "t35",
        "number": 35,
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
        "id": "t36",
        "number": 36,
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
        "id": "t37",
        "number": 37,
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
        "id": "t38",
        "number": 38,
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
        "id": "t39",
        "number": 39,
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
      }
    ]
  }
});
