DigiBoardNewWorld.create({
  "id": "spreektijd-werken",
  "label": "Spreektijd · Werken",
  "anchors": [
    [
      1463,
      877
    ],
    [
      1314,
      866
    ],
    [
      1191,
      844
    ],
    [
      1084,
      819
    ],
    [
      987,
      792
    ],
    [
      898,
      760
    ],
    [
      822,
      716
    ],
    [
      783,
      663
    ],
    [
      789,
      617
    ],
    [
      834,
      580
    ],
    [
      867,
      550
    ],
    [
      1110,
      642
    ],
    [
      1180,
      675
    ],
    [
      1236,
      672
    ],
    [
      1276,
      620
    ],
    [
      1319,
      574
    ],
    [
      1359,
      539
    ],
    [
      1540,
      390
    ],
    [
      1567,
      351
    ],
    [
      1488,
      327
    ],
    [
      1400,
      306
    ],
    [
      1338,
      276
    ],
    [
      1180,
      229
    ],
    [
      1112,
      211
    ],
    [
      1042,
      195
    ],
    [
      978,
      187
    ],
    [
      574,
      190
    ],
    [
      492,
      180
    ],
    [
      414,
      167
    ],
    [
      339,
      156
    ],
    [
      276,
      145
    ],
    [
      198,
      136
    ]
  ],
  "passages": [
    {
      "id": "laadgang",
      "kind": "tunnel",
      "to": 11,
      "label": "De laadgang",
      "enter": [
        [
          867,
          550
        ],
        [
          879,
          539
        ],
        [
          889,
          524
        ]
      ],
      "exit": [
        [
          1082,
          591
        ],
        [
          1090,
          619
        ],
        [
          1110,
          642
        ]
      ],
      "labelPos": [
        563,
        685
      ],
      "icon": "move-down",
      "hiddenLabel": "In de doorgang",
      "description": "Tussen vak 10 en 11 loopt de pion door de laadgang. Hij verdwijnt in de doorgang en komt via de andere opening terug op het pad. Dit kost één gewone stap, ook bij een grotere worp.",
      "from": 10
    }
  ],
  "masks": [
    {
      "id": "laadgang-in",
      "path": "M709 633 L709 493 L914 530 L914 632 L902 627 L900 542 L736 514 L736 633Z",
      "area": [
        705,
        488,
        918,
        637
      ],
      "frontY": 647
    },
    {
      "id": "laadgang-uit",
      "path": "M1061 633 L1065 529 L1119 503 L1121 600 L1109 608 L1109 533 L1084 544 L1084 636Z",
      "area": [
        1058,
        501,
        1125,
        639
      ],
      "frontY": 651
    },
    {
      "id": "winkelvoorgrond",
      "path": "M1388 544 L1365 479 L1366 434 L1517 388 L1672 350 L1672 742 L1530 681 L1388 585Z",
      "area": [
        1363,
        351,
        1672,
        742
      ],
      "frontY": 950
    },
    {
      "id": "boom-bruglinks",
      "path": "M604 238 L605 186 Q617 151 658 168 Q679 146 706 151 Q726 122 751 137 Q780 109 799 146 Q840 139 843 172 Q864 191 838 220 L800 254 L713 274 L675 250Z",
      "area": [
        603,
        111,
        865,
        277
      ],
      "frontY": 280
    },
    {
      "id": "brugleuning",
      "path": "M793 215 L795 169 L805 166 L806 204 L831 193 L864 185 L902 185 L944 194 L1001 208 L1061 224 L1120 240 L1181 258 L1231 275 L1285 299 L1289 272 L1298 269 L1299 312 L1290 312 L1286 305 L1229 283 L1180 266 L1118 248 L1060 232 L999 216 L942 202 L903 193 L866 193 L833 201 L806 215 L805 226 L794 229Z M803 171 L858 151 L891 149 L937 157 L995 171 L1057 188 L1116 204 L1180 222 L1234 242 L1293 273 L1291 279 L1232 250 L1178 229 L1114 212 L1055 195 L993 178 L935 164 L891 155 L859 157 L804 179Z",
      "area": [
        790,
        145,
        1302,
        316
      ],
      "frontY": 2000
    }
  ],
  "waypoints": {
    "16": [
      [
        1359,
        539
      ],
      [
        1413,
        497
      ],
      [
        1475,
        451
      ],
      [
        1518,
        420
      ],
      [
        1540,
        390
      ]
    ],
    "21": [
      [
        1338,
        276
      ],
      [
        1281,
        255
      ],
      [
        1233,
        240
      ],
      [
        1180,
        229
      ]
    ],
    "25": [
      [
        978,
        187
      ],
      [
        926,
        175
      ],
      [
        877,
        174
      ],
      [
        826,
        187
      ],
      [
        774,
        211
      ],
      [
        725,
        221
      ],
      [
        667,
        214
      ],
      [
        618,
        201
      ],
      [
        574,
        190
      ]
    ]
  },
  "previews": [
    {
      "id": "werkbrug",
      "label": "Over de loopbrug",
      "icon": "route",
      "to": 26,
      "description": "Van de kas over het stalen brugdek naar de kantine. De voorste leuning en de boom bedekken de pion op de juiste plekken.",
      "from": 21
    },
    {
      "id": "laadgang",
      "kind": "tunnel",
      "to": 11,
      "label": "De laadgang",
      "enter": [
        [
          867,
          550
        ],
        [
          879,
          539
        ],
        [
          889,
          524
        ]
      ],
      "exit": [
        [
          1082,
          591
        ],
        [
          1090,
          619
        ],
        [
          1110,
          642
        ]
      ],
      "labelPos": [
        563,
        685
      ],
      "icon": "move-down",
      "hiddenLabel": "In de doorgang",
      "description": "Tussen vak 10 en 11 loopt de pion door de laadgang. Hij verdwijnt in de doorgang en komt via de andere opening terug op het pad. Dit kost één gewone stap, ook bij een grotere worp.",
      "from": 10
    }
  ],
  "title": "Werken in Nederland — De werkdag",
  "count": 30,
  "shapes": [
    "square",
    "circle",
    "square",
    "triangle",
    "diamond",
    "circle",
    "square",
    "triangle",
    "diamond",
    "triangle",
    "circle",
    "square",
    "diamond",
    "triangle",
    "square",
    "circle",
    "triangle",
    "diamond",
    "triangle",
    "square",
    "circle",
    "diamond",
    "triangle",
    "square",
    "circle",
    "triangle",
    "circle",
    "square",
    "triangle",
    "diamond"
  ],
  "size": [
    55,
    38
  ],
  "paintedRoute": true,
  "image": "spreektijd-werken-speelroute",
  "content": {
    "schemaVersion": 1,
    "id": "spreektijd-werken-v1",
    "version": "1.0.0",
    "title": "Werken in Nederland — De werkdag",
    "product": "Taalroute Praatpad",
    "level": "A2",
    "routeId": "a1-a2",
    "routeLabel": "A1 → A2",
    "goal": "Dagelijkse gesprekken voeren: iets vragen, reageren en samen een keuze of afspraak maken.",
    "duration": "Afhankelijk van de oefening en het aantal beurten.",
    "groupSize": "2–30 deelnemers",
    "literacy": "Korte instructies lezen; de docent kan ze voorlezen.",
    "methodLinks": [],
    "finish": 31,
    "coordinates": [
      [
        0.875,
        0.9319872476089267
      ],
      [
        0.7858851674641149,
        0.9202975557917109
      ],
      [
        0.7123205741626795,
        0.8969181721572795
      ],
      [
        0.6483253588516746,
        0.8703506907545164
      ],
      [
        0.590311004784689,
        0.8416578108395324
      ],
      [
        0.5370813397129187,
        0.8076514346439958
      ],
      [
        0.4916267942583732,
        0.7608926673751328
      ],
      [
        0.46830143540669855,
        0.7045696068012752
      ],
      [
        0.47188995215311,
        0.6556854410201913
      ],
      [
        0.4988038277511962,
        0.6163655685441021
      ],
      [
        0.5185406698564593,
        0.5844845908607864
      ],
      [
        0.6638755980861244,
        0.6822529224229543
      ],
      [
        0.7057416267942583,
        0.7173219978746015
      ],
      [
        0.7392344497607656,
        0.71413390010627
      ],
      [
        0.7631578947368421,
        0.6588735387885228
      ],
      [
        0.7888755980861244,
        0.6099893730074389
      ],
      [
        0.812799043062201,
        0.5727948990435706
      ],
      [
        0.9210526315789473,
        0.41445270988310307
      ],
      [
        0.937200956937799,
        0.37300743889479276
      ],
      [
        0.8899521531100478,
        0.3475026567481403
      ],
      [
        0.8373205741626795,
        0.32518597236981933
      ],
      [
        0.8002392344497608,
        0.29330499468650373
      ],
      [
        0.7057416267942583,
        0.24335812964930925
      ],
      [
        0.6650717703349283,
        0.22422954303931988
      ],
      [
        0.6232057416267942,
        0.20722635494155153
      ],
      [
        0.5849282296650717,
        0.19872476089266738
      ],
      [
        0.34330143540669855,
        0.20191285866099895
      ],
      [
        0.2942583732057416,
        0.19128586609989373
      ],
      [
        0.24760765550239233,
        0.17747077577045697
      ],
      [
        0.2027511961722488,
        0.16578108395324123
      ],
      [
        0.16507177033492823,
        0.15409139213602552
      ],
      [
        0.11842105263157894,
        0.14452709883103082
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
      }
    ]
  }
});
