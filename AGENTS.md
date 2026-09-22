# Taalroute DigiBord V01.24

Deze repository bevat de volledige actieve V01.24-app. De oude app is gearchiveerd onder tag `archive/pre-v0124-20260921`.

- Bewaar de bestaande vormgeving en werking tenzij de gebruiker om een wijziging vraagt. Lees [VORMGEVING.md](VORMGEVING.md) bij wijzigingen aan uiterlijk of uitleg: hergebruik de vier goedgekeurde woordlogo’s in assets/guidance/.
- Lees BANKEN-V2-INTEGRATIE.md voor inhoudelijke wijzigingen. De canonieke banken in Lessen/, data/opdrachtenbank.json, data/snelvragen.json en data-bundle.js moeten gelijk blijven. Wijzig geen borgingshash om een fout te omzeilen.
- Voer npm test, npm run test:activities, npm run lint, npm run types en npm run build uit. Browsercontroles: npm run test:banks:browser, npm run smoke en npm run test:tongue:browser.
- Alleen dist/ wordt gepubliceerd. Geen oude applicatie, historische databestanden, tests, verslagen of back-ups toevoegen aan dist/.
- Behoud lokale groepen, pionnen, instellingen en voortgang. Maak vóór gegevensvervanging een nieuwe back-up.
- Publicatie alleen met expliciete toestemming. Controleer na publicatie de daadwerkelijke publieke app.
