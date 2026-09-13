DigiBoardNewWorld.create({
  "id": "station-perronroute",
  "label": "Station · kort",
  "title": "Station · naar het perron",
  "count": 16,
  "size": [
    86,
    57
  ],
  "image": "station-speelroute",
  "anchors": [
    [
      351,
      555
    ],
    [
      347,
      642
    ],
    [
      446,
      698
    ],
    [
      560,
      729
    ],
    [
      684,
      742
    ],
    [
      808,
      720
    ],
    [
      914,
      694
    ],
    [
      1018,
      657
    ],
    [
      1112,
      620
    ],
    [
      1178,
      324
    ],
    [
      1080,
      300
    ],
    [
      983,
      278
    ],
    [
      890,
      256
    ],
    [
      792,
      230
    ],
    [
      694,
      210
    ],
    [
      596,
      188
    ],
    [
      500,
      165
    ],
    [
      406,
      137
    ]
  ],
  "masks": [
    {
      "id": "tunnel",
      "path": "M1002 456 L1084 422 L1210 447 L1273 549 L1264 637 L1248 637 L1249 559 Q1244 493 1176 470 Q1104 446 1061 504 L1060 589 L1034 604 L1025 527 Z",
      "area": [
        995,
        420,
        1290,
        645
      ],
      "frontY": 610
    },
    {
      "id": "trap",
      "path": "M1199 277 L1222 270 L1252 286 L1252 318 L1381 344 L1381 307 L1423 309 L1476 284 L1476 307 L1423 343 L1416 363 L1380 358 L1199 321 Z",
      "area": [
        1190,
        250,
        1485,
        365
      ],
      "frontY": 365
    }
  ],
  "passages": [
    {
      "id": "voetgangerstunnel",
      "kind": "tunnel",
      "from": 8,
      "to": 9,
      "label": "Voetgangerstunnel",
      "enter": [
        [
          1112,
          620
        ],
        [
          1144,
          591
        ],
        [
          1180,
          552
        ],
        [
          1204,
          522
        ]
      ],
      "exit": [
        [
          1334,
          310
        ],
        [
          1314,
          288
        ],
        [
          1280,
          266
        ],
        [
          1240,
          251
        ],
        [
          1146,
          278
        ],
        [
          1178,
          324
        ]
      ],
      "icon": "move-down",
      "description": "Tussen vak 8 en 9 loopt de pion de tunnel in. Onder de grond is hij onzichtbaar. Via de trap komt hij op het perron. Dit kost één gewone stap."
    }
  ],
  "content": {
    "schemaVersion": 1,
    "id": "station-perronroute-v1",
    "version": "1.0.0",
    "title": "Station · naar het perron",
    "product": "Taalroute Praatpad",
    "level": "A2",
    "routeId": "a1-a2",
    "routeLabel": "A1 → A2",
    "goal": "Dagelijkse gesprekken voeren: iets vragen, reageren en samen een keuze of afspraak maken.",
    "duration": "Richtduur 5–10 minuten met één gedeelde pion; afhankelijk van de oefening en het aantal beurten.",
    "groupSize": "2–30 deelnemers",
    "literacy": "Korte instructies lezen; de docent kan ze voorlezen.",
    "methodLinks": [],
    "finish": 17,
    "coordinates": [
      [
        0.20992822966507177,
        0.589798087141339
      ],
      [
        0.2075358851674641,
        0.6822529224229543
      ],
      [
        0.26674641148325356,
        0.7417640807651434
      ],
      [
        0.3349282296650718,
        0.7747077577045696
      ],
      [
        0.4090909090909091,
        0.7885228480340064
      ],
      [
        0.48325358851674644,
        0.7651434643995749
      ],
      [
        0.5466507177033493,
        0.7375132837407014
      ],
      [
        0.6088516746411483,
        0.6981934112646121
      ],
      [
        0.6650717703349283,
        0.6588735387885228
      ],
      [
        0.7045454545454546,
        0.3443145589798087
      ],
      [
        0.645933014354067,
        0.3188097768331562
      ],
      [
        0.5879186602870813,
        0.29543039319872477
      ],
      [
        0.5322966507177034,
        0.2720510095642933
      ],
      [
        0.47368421052631576,
        0.24442082890541977
      ],
      [
        0.4150717703349282,
        0.22316684378320936
      ],
      [
        0.35645933014354064,
        0.1997874601487779
      ],
      [
        0.29904306220095694,
        0.17534537725823593
      ],
      [
        0.24282296650717702,
        0.14558979808714134
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
      }
    ]
  },
  "previews": [
    {
      "id": "voetgangerstunnel",
      "kind": "tunnel",
      "from": 8,
      "to": 9,
      "label": "Voetgangerstunnel",
      "enter": [
        [
          1112,
          620
        ],
        [
          1144,
          591
        ],
        [
          1180,
          552
        ],
        [
          1204,
          522
        ]
      ],
      "exit": [
        [
          1334,
          310
        ],
        [
          1314,
          288
        ],
        [
          1280,
          266
        ],
        [
          1240,
          251
        ],
        [
          1146,
          278
        ],
        [
          1178,
          324
        ]
      ],
      "icon": "move-down",
      "description": "Tussen vak 8 en 9 loopt de pion de tunnel in. Onder de grond is hij onzichtbaar. Via de trap komt hij op het perron. Dit kost één gewone stap."
    }
  ],
  "shapes": [
    "circle",
    "square",
    "triangle",
    "diamond",
    "circle",
    "square",
    "triangle",
    "diamond",
    "circle",
    "square",
    "triangle",
    "diamond",
    "circle",
    "square",
    "triangle",
    "diamond"
  ],
  "paintedRoute": true
});
