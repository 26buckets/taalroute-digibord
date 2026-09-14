# Vier Spreektijd-kaarten — lokaal speelbaar

De bestaande Digibord-app bevat nu 26 kaarten. De vier nieuwe kaarten gebruiken de geschilderde achtergronden, met vaste klik- en pionposities op de tegels. Alle 22 oudere kaartmodules en beelden blijven behouden. Niet gepusht of gepubliceerd.

| Kaart | Opdrachtvakken | Gewone passage | Aanvullende diepte |
|---|---:|---|---|
| Smalltalk | 33 | Buurtpoort 11 → 12 | Parkbrug 20 → 25, voorste leuning |
| Werken in Nederland | 30 | Laadgang 10 → 11 | Loopbrug 21 → 26, winkel en boom langs het pad |
| Afspraak | 16 | Spoortunnel 10 → 11 | Beide tunnelranden, verzonken uitgang aan de overkant |
| Gezondheid en zorg | 17 | Zorggang 12 → 13 | Beide deurkaders en de verbindingsgang |

Start en finish zijn niet meegeteld als opdrachtvak. De eerdere 24 vakken per ontwerp waren een richtgetal. De speelbare versies volgen de zichtbare geschilderde tegels; er zijn geen extra vectorvakken over de afbeeldingen gelegd. De tuinbrug op de zorgkaart is een gewone tuinverbinding zonder spelvakken.

## Gebruik

Kies in de bestaande app Wissel kaart en vervolgens een Spreektijd-kaart. Gooien en spatie werken zoals op de andere kaarten. Speciale plekken toont de passage en een voorbeeld; het voorbeeld verandert de spelstand niet. Vaknummers schakelt de hele reeks in. Enkele oriëntatienummers en passage-eindpunten zijn standaard zichtbaar. De nummers blijven onder de pion; labels bij een rand krijgen vrije ruimte naast die rand.

Een doorgang verbindt opeenvolgende gewone vakken. Een worp die erlangs gaat gebruikt de doorgang en loopt daarna verder. Er is geen extra worp, strafbeurt of sprong nodig. Inlopen, verkleinen/afdekken, volledige onzichtbaarheid en uitlopen gebruiken dezelfde geometrie. De route kan ook achteruit worden doorlopen. Met minder beweging wordt dezelfde eindpositie bereikt zonder animatie. Terug kan een lopende passage annuleren.

## Inhoud en opslag

Dit is de gevraagde route- en passagebouw. De kaarten gebruiken de bestaande algemene oefeningen en niveaus van Digibord: Directe vragen, Met een gesprekspartner, Mix en Zinnen maken. Er is in deze stap geen nieuwe Spreektijd-opdrachtenbank of volledige hoofdstukkoppeling gebouwd. De omgeving is thematisch; de bestaande oefenkeuze blijft onafhankelijk. Per kaart wordt voortgang met een eigen opslagsleutel bewaard. Andere lessen en instellingen worden niet gereset.

## Bestanden

De vier kaartmodules staan onder Kaarten/spreektijd-*.js, hun stijlen onder Kaarten/spreektijd-*.css en de definitieve afbeeldingen onder Kaarten/assets/spreektijd-*/. Geometrie.json bevat alle ankers, vormen, looppaden, tunnelmonden en voorgrondmaskers. De bestaande register- en vormbestanden zijn uitgebreid. De app-loader en scripts hebben een nieuwe cacheversie. De gedeelde bewegingsmodule heeft alleen een optionele tekst voor de verborgen fase gekregen; bestaande kaarten behouden hun gedrag.

## Controle

Tests: spreektijd-worlds.cjs (coördinaten, heen/terug, volledig verdwijnen, landingspositie, voorbeelden zonder spelwijziging, annuleren, minder beweging, niveaus, schermmaten en finish), route-passages.cjs (grotere worp door de passage en verderlopen) en spreektijd-depth-visual.cjs (beelden van de vijf bewegingsfasen). De brede appcontrole gebruikt npm test. Het definitieve controleresultaat staat in QA.md. Beeldmateriaal staat onder tests/artifacts/spreektijd-kaarten/.
