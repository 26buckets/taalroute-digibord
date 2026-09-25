# Taalroute DigiBord V01.25

Deze branch bevat de actuele V01.25-app met de bewaarde oudere inhoud. De oude app is gearchiveerd onder tag `archive/pre-v0124-20260921`.

- Bewaar de bestaande vormgeving en werking tenzij de gebruiker om een wijziging vraagt. Lees [VORMGEVING.md](VORMGEVING.md) bij wijzigingen aan uiterlijk of uitleg: hergebruik de vier goedgekeurde woordlogo’s in assets/guidance/.
- Tongbrekers blijven groot volgens de vaste maten in VORMGEVING.md. Niet verkleinen bij algemene kaart- of schermwijzigingen; tests/tongbrekers-browser.cjs bewaakt dit. Alleen wijzigen op expliciet verzoek van Nico.
- Lees BANKEN-V2-INTEGRATIE.md voor inhoudelijke wijzigingen. De canonieke banken in Lessen/, data/opdrachtenbank.json, data/snelvragen.json en data-bundle.js moeten gelijk blijven. Wijzig geen borgingshash om een fout te omzeilen.
- Lees [INHOUDSNIVEAUS.md](INHOUDSNIVEAUS.md) voor niveaukeuzes en volgende bankaansluitingen: A1/A1+ delen de basis, relatieve bijzin vanaf B1, groei tot C1 per concrete oefening. De gebruiker heeft deze indeling gedelegeerd.
- Voer npm test, npm run test:activities, npm run lint, npm run types en npm run build uit. Browsercontroles: npm run test:banks:browser, npm run smoke en npm run test:tongue:browser.
- Alleen dist/ wordt gepubliceerd. Geen oude applicatie, historische databestanden, tests, verslagen of back-ups toevoegen aan dist/.
- Behoud lokale groepen, pionnen, instellingen en voortgang. Maak vóór gegevensvervanging een nieuwe back-up.
- Publicatie alleen met expliciete toestemming. Controleer na publicatie de daadwerkelijke publieke app.

- Inhoudsreviews op verzoek van Nico (23 september): combineer verwante onderdelen tot werksets van 90–120 opdrachten. Beoordeel iedere opdracht afzonderlijk; voer bouwen, verplichte spelcontroles en verslag één keer per groter blok uit. De kleine historische dertigsets zijn geen verplichte stopmomenten.

- Vaste woordkeuze op verzoek van Nico (24 september): gebruik bij een persoon die naast iemand woont altijd **buurman** of **buurvrouw**, nooit de verkorte enkelvoudsvorm. Dit geldt voor opdrachten, antwoorden, hulp, instellingen, verslagen en gesproken tekst. Bewaar historische bronnen en lesreferenties; de gedeelde tekstweergave gebruikt de afgesproken woordkeuze, ook bij hervatten. `tests/wording.cjs` en `tests/wording-browser.cjs` bewaken dit.

- Publicatie vanaf 25 september: alleen de volledig nagekeken 1.440 Er/Zullen/Zouden en 2.621 Snelvragen. ReleasePolicy beperkt de gezamenlijke selectie én klassieke ingangen; andere bronnen/lessen blijven bewaard maar verborgen. Geen niveau-, instelling- of URL-keuze mag ongecontroleerde inhoud weer zichtbaar maken. Archive-regressietests gebruiken expliciet DigiBordArchiveReview in een aparte testbrowser; tests/release-browser.cjs toetst de echte standaard zonder die vlag.

- Vaste opdrachtopmaak (25 september): alle verplichte oefenwoorden, begin-/eindwoorden, keuzeopties bij ‘Kies:’ en aangehaalde termen waarover de vraag gaat krijgen nadruk volgens VORMGEVING.md. Gebruik de gedeelde contentPromptHtml-weergave in alle geschikte spellen en voorbereiding; laat omliggende instructies normaal. Controleer nieuwe instructievormen vóór publicatie.

- Publieke tekst: geen interne nakijk-, bron- of ontwikkelstatus in de live app. Komende activiteiten zijn grijs, uitgeschakeld en tonen Binnenkort op de afbeelding. Zie de vaste regel in VORMGEVING.md; controleer ook hervatten en het inhoudsoverzicht.
