# DigiBord 1.25 — gedeelde inhoudsmotor

Gebouwd op ontwikkelversie `455b4076a768e3e148d6b6cb11148e0b238f325b`, de branch van PR #28. De release bouwt voort op de zes bestaande aansluitingen. Er is geen productiepublicatie uitgevoerd.

## Wat is gebouwd

- Grammatica (1.440 opdrachten), Woorden en zinnen (680) en de 30 bestaande woordraadsels staan in één register. Bronbestanden blijven intact; adapters projecteren ze naar dezelfde inhoudsstructuur.
- Vanuit Oefenen, een speltegel of Meer activiteiten volgt dezelfde voorbereiding. Geavanceerde keuzes staan onder Meer opties. Onverenigbare keuzes blijven zichtbaar in de samenvatting; er wordt nooit ongemerkt inhoud weggelaten. De UI biedt expliciete passende oefenfocus-keuzes aan waar beschikbaar.
- Speelbord, draaischijf, kaarten, dobbelspel, quiz en rangschikken blijven beschikbaar. Koppelen/memory vereisen brongetrouwe, unieke paren. Sorteren vereist expliciete categorieën en een geldig antwoord. Raad het woord vereist echte bronaanwijzingen. Quiz blijft een groepsactiviteit.
- Mijn lessen bewaart selectieregels. Start trekt een nieuwe selectie. Recent bewaart een onveranderlijke sessie met versiegebonden inhoudsverwijzingen en afzonderlijke, beperkte voortgang. Ga verder, dezelfde opdrachten opnieuw en nieuwe opdrachten zijn drie verschillende acties.
- Favorieten zijn verwijzingen; mixen combineren scopes, niveaus en gewichten zonder kopieën. De verdeling respecteert grenzen over overlappende scopes heen.
- Nieuwe gegevens staan in native IndexedDB; bestaande appopslag blijft staan. Revisiecontrole vindt atomair in één schrijftransactie plaats. Er zijn geen nieuwe afhankelijkheden toegevoegd.
- De 320 bestaande dobbeltexturen worden over HTTP op aanvraag geladen. De geëxtraheerde PNG-bytes worden tegen de oorspronkelijke bundel gecontroleerd. Openen via file:// behoudt de oude inline textures.

## Bronstatus en didactische grenzen

De WZ-adapter gebruikt de actuele, al gecorrigeerde `Lessen/woorden-zinnen.json` via de bestaande browserbundel. De oorspronkelijke Drive-sheet is dubbel gecontroleerd; lokale correcties worden niet teruggedraaid. WZ bevat 202 open opdrachten. Die krijgen geen automatische goed/foutscore. De route A0→A1 blijft een groeiroute met drie moeilijkheidsbanden; Basis is de instap.

Review3 PASS en klaar voor implementatie zijn bronvoorwaarden, geen vervanging voor menselijke review of een pilot. WZ blijft `pilot_only`; bestaande `source_review`-velden blijven behouden. De oude raadsels hebben `LEGACY_PRESERVED` en Niveauvrij, omdat hun CEFR-niveau niet is vastgesteld. Er is geen niveau of goedkeuring verzonnen.

Bronnen: [WZ-masterbank](https://docs.google.com/spreadsheets/d/14BWnJEpoph7EJoizneSZibl70gA1_ToQkjloXRAbnlw/edit), [UI002A opslagcontract 0.3](https://docs.google.com/document/d/1GG6eC7q2Fr3E_dSoZJgI96FyW25p17Dvxt8U5HReV_I/edit), [UI002B vrijgave](https://docs.google.com/document/d/1nbDVWnYu9f9vMFR4oPKkukcjAmo7BOdudZcUTWmMyaQ/edit).

## Eén nieuwe bank aansluiten

Lever een bank in het gevalideerde canonieke formaat aan, eventueel via een bronadapter. Registreer eenmaal bij het opstarten:

```js
ContentUI.registerBank(bank, {
  familyId: 'mijn-familie',
  label: 'Mijn inhoud',
  description: 'Wat de docent hiermee kan oefenen.',
  defaultDifficulty: 'basis'
});
```

Dezelfde registratie vult het runtime-register en de zichtbare familie, onderwerpen, niveaus en subonderwerpen. Geen speltegels, selectiemotoren of opslagformaten aanpassen. Het bestand moet uiteraard met de app worden meegeleverd en geladen. Elke opdracht heeft een uniek stabiel ID, bank-ID, inhoudsversie, didactische metadata, rechten- en reviewstatus, interactietype en geschatte duur nodig. Nieuwe interactiesoorten hebben wel een expliciete renderer/aansluiting nodig; alleen een nieuw onderwerp of niveau niet.

De browserproef registreert één extra bank en bewijst dat beide docentroutes dezelfde IDs opleveren, beschikbaar in zeven geschikte spelvormen. Dezelfde bank wordt terecht geweigerd voor sorteren en raadsels. Productie bevat deze proefbank niet.

## Bewaren, hervatten en terugzetten

`taalroute-v0124-backup-before-v0125` bevat vóór appinitialisatie een ongewijzigde kopie van de bestaande taalroute-opslag. De oude sleutels worden niet verwijderd. Een mislukte back-up blokkeert appschrijfacties. De nieuwe database heet `taalroute-lessons-v1`.

Voortgang bevat uitsluitend toegestane velden: kaartposities, anonieme beurten/pionposities, gevonden paren, volgorde, onthulde aanwijzingen en groepsquizscores. Namen, deelnemer-ID's, vrije antwoorden en individuele scores komen niet in de nieuwe lessenopslag. Bestaande persoonlijke instellingen blijven in hun oorspronkelijke opslag, inclusief de lokale reservekopie.

Ga verder herstelt dezelfde opdrachten en versie plus voortgang. Opnieuw spelen gebruikt nieuwe sessie-identiteit, dezelfde inhoud en ronde nul. Nieuwe opdrachten gebruikt dezelfde selectieregels met een nieuwe seed en actuele beschikbaarheid. Soft-deprecated inhoud is uitgesloten van nieuwe selecties maar mag historisch worden hervat volgens het bewaarde beleid. Hard-revoked inhoud blokkeert. Een ontbrekende oorspronkelijke versie wordt zichtbaar geblokkeerd, nooit door huidige inhoud vervangen.

Bewaar bij een code-rollback beide opslagsoorten en de reservekopie. Zet geen andere browseropslag blind terug. Oud bordspel en een nieuwe inhoudssessie gebruiken afzonderlijk bewaarde bordstanden; terugkeer naar het oude spel herstelt de oude stand.

## Validatie

`npm test`, `npm run lint`, `npm run types`, `npm run build`, `node tests/deployment.cjs` en de verplichte browsercontroles horen bij deze release. De typescontrole betreft de bestaande getypeerde viewport-module; de overige JavaScriptcontrole bestaat uit lint, unit- en browsertests.

Nieuwe controles dekken bronbehoud, open scoring, niveaugrenzen, dezelfde selectie tussen routes en spellen, één extra bankregistratie, gemengde families, gewichten/overlap, versiebehoud en intrekking, immutable snapshots, permissies, twee gelijktijdige IndexedDB-wijzigingen, privacy, herladen/hervatten, exact opnieuw spelen, complete match/memory/sorteerrondes, de draaischijf, raadselonthulling, mixbewerking en behoud van oude bordstanden/instellingen.

Bestaande suites dekken speelborden/fullscreen, alle activiteiten, 1.200 bankkaarten, Tongbrekers/audio, Verhaalworp, WZ, C1, Taalworp, kaartleesbaarheid en niveaus. Breedtes lopen van mobiel tot 1.920 px. De daadwerkelijke gebouwde `dist/` wordt eveneens getest. Bronhashbewaking is niet aangepast.

## Bewuste grenzen

- Opslag is lokaal per browser/apparaat. Geen schoolaccounts, synchronisatie of backendrechten. De eigenarenvelden en dienstregels bereiden het goedgekeurde opslagcontract voor, maar zijn geen beveiliging tegen iemand met lokale ontwikkelaarstoegang.
- Oude inhoudsversies worden niet automatisch gedownload of gearchiveerd. Wanneer ze niet meer meegeleverd worden, blokkeert historisch hervatten duidelijk.
- Bestaande gespecialiseerde spellen zoals Taalworp en Verhaalworp behouden hun eigen inhoudslogica.
- Browsercontroles op digibordformaten zijn geen fysieke digibordpilot. Touchvertraging, hardwareprestaties en didactische pilot blijven op het echte bord te beoordelen vóór productiepublicatie.
