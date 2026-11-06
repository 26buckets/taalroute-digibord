# Actief — leskeuze en bruikbare leshulp

Datum: 6 november 2026. Status: lokaal uitgevoerd; Nico heeft livepublicatie expliciet opgedragen. Zie publication/ACTIEF-KAARTEN-20261106.md voor de latere aanvullingen over scrollen, spelling en kaartopmaak. De livecontrole is geslaagd en vastgelegd in publication/ACTIEF-KAARTEN-LIVE-20261106.json.

## Aanleiding en resultaat

Snelvragen opende de lesvoorbereiding, maar de uitklaplijst kon grammatica tonen terwijl Vertel al gekozen was. De gekozen familie wordt nu ook zichtbaar geopend. Zelfstandige kaartspellen blijven direct starten; de menutekst legt dat verschil uit. Het bestaande werkproces en de schermindeling zijn behouden.

De voorbereiding onderscheidt de beschikbare opdrachtenvoorraad van het aantal opdrachten in de gekozen les. Bij Snelvragen wordt gerekend met ongeveer één minuut per opdracht: vijf minuten geeft vijf kaarten, tien minuten tien kaarten. De tijd is een schatting; het tempo in de klas kan verschillen. De bestaande selectie zelf is ongewijzigd.

De herhaalde kernboodschaptekst is bij de 3.500 Snelvragen vervangen door afzonderlijke leshulp: een leerdoel, bruikbare taalsteun, werkvorm, docenthandeling en bespreekvraag. Er zijn 375 concrete zinstarters voor de eerste drie bronroutes en 125 concrete situatiekoppelingen voor de hogere routes. Werkvorm en algemene docenthandeling worden per opdrachttype gedeeld; dit zijn niet 3.500 onafhankelijk geschreven lesplannen. De overzichtspagina, Hulp bij de kaart en Bespreek samen gebruiken dezelfde koppeling.

## Bron en behoud

Repository: 26buckets/taalroute-digibord. Werkbranch: codex/actief-leshulp-20261106. Basis: f2d8708, afstammeling van de livecommit 1479e8ff6bfc09c8cf605fe124030b22878230a2, release 1.25.1. De 94 opgehaalde live-JavaScriptbestanden waren bytegelijk aan de basis.

De canonieke opdrachtenbank, opdrachtteksten, antwoorden, inhoudsversies, niveaus, vrijgavegrenzen, audio en lokale opslag zijn behouden. De aanvullende hulp geldt uitsluitend bij een exacte overeenkomst van bronversie, itemversie, opdrachttekst en bank. Bestaande opgeslagen lessen worden niet naar nieuwe opdrachten omgezet. Nieuwe module: quick-lesson-guidance.js; aanvullende teksten: data/quick-lesson-cases.js. inhoudscontrole.json bevat de 3.500 opdracht-/hulpkoppelingen voor redactionele controle en herstel.

## Controle

De volledige lokale unitreeks, lint, typecontrole, activiteiten op zes schermformaten, de bouw inclusief bron-/audiobewaking, bankbrowsercontrole en opdrachtenoverzicht zijn geslaagd. E1-browsercontrole: 11.338 opdrachten, 117 bank-/route-/vrijgavecombinaties, 560 kaarten, bewaren/hervatten en memory geslaagd. De gerichte browsercontrole op de bron en de uiteindelijke bouw bewijst het kiezen van Snelvragen, 5 en 10 kaarten, de nieuwe leshulp, ongewijzigde sessiegegevens en desktop/mobiel zonder horizontale overloop.

De volledige lokale smoke-reeks is geslaagd, waaronder 1.440 grammaticaopdrachten op vijf spelweergaven (7.200 weergaven), bestaande navigatie, selectie en opgeslagen voortgang. De tongbrekercontrole is geslaagd: 240 kaarten, 28 filtercombinaties, beide goedgekeurde audiotempo’s, terugzetten, hervatten, zeven andere spellen en acht schermformaten. De actuele schermvoorbeelden staan in het opleverpakket.

De publicatiecontractcontrole slaagt. Bij de eerste uitvoering blokkeerde de publicatievrijgavetest op de bevriezing. Na Nico’s expliciete publicatieopdracht is een begrensde vrijgave voorbereid en getest; de oorspronkelijke herstelbasis blijft behouden. De gecontroleerde versie is na Nico’s expliciete opdracht via main gepubliceerd; er zijn geen GitHub Actions gestart. De bestaande workflow is alleen handmatig beschikbaar; er is geen zware cloudcontrole toegevoegd.

## Grenzen en volgende stap

Dit is een redactionele en technische verbetering, geen onafhankelijke B1-certificering of praktijkproef in de klas. Bestaande opdrachtteksten zijn niet herschreven. Een docent moet nog in gebruik beoordelen of de steunzinnen en tijdschatting passen bij diens groep. De vaste ontwerpbasis is gelezen; dit losse hulpmiddel introduceert geen nieuw cursusprogramma of nieuwe boekdoelen.

Nico heeft de door PUBLICATIE.md vereiste expliciete opdracht inmiddels gegeven. De begrensde vrijgave, hercontrole van de livebasis en canonieke publicatieroute blijven verplicht. De oorspronkelijke vastzetbestanden en herstelbasis blijven behouden.
