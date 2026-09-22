# Taalroute DigiBord V01.25

De volledige actuele app, met curriculum, kaartspellen, speelborden, dobbelspellen, woorden en zinnen en de vernieuwde opdrachtenbanken.

## Nieuwe motor in 1.25

Twee docentroutes komen samen in één voorbereiding. Grammatica, Woorden en zinnen en de bestaande woordraadsels gebruiken één selectie; tien spelvormen worden uitsluitend aangeboden wanneer ze de hele gekozen inhoud ondersteunen. Mijn lessen bewaart keuzes, recente sessies, favorieten en mixen op dit apparaat. De bestaande 1.24-opslag krijgt vóór de eerste wijziging een gecontroleerde reservekopie.

Zie [bouw- en overdrachtsnotitie](DIGIBORD-V1.25.md) voor bronstatus, bankregistratie, opslag, controles en grenzen.

## Ontwikkelen en controleren

`npm ci`, gevolgd door `npm test`, `npm run test:activities`, `npm run lint`, `npm run types` en `npm run build`.

Serveer `dist/` met een lokale webserver. De app heeft geen externe runtime-afhankelijkheden. Browserchecks staan in de GitHub workflow en gebruiken Chrome.

## Banken

960 gespreksopdrachten en 240 aparte Snelvragen. `npm run check:banks` vergelijkt de canonieke JSON en browserbundles in `Lessen/` met de actieve losse data en ingebouwde runtime. Zie BANKEN-V2-INTEGRATIE.md. Tongbrekers heeft een eigen bank: 161 bronrecords, waarvan 142 speelbare tongbrekers en 19 bewaarde uitspraakzinnen.

## Taalworp

Werkwoordsets kiezen en mengen via hetzelfde aanvinkmenu als Verhaalworp. Drie onderdelen: Basis (blauw, twee sets), Taalvorm (paars, vijf sets) en Thema’s (groen, zestien sets). Selectie toepassen maakt één voorraad zonder dubbele werkwoord-ID’s. Nieuwe werkwoordkaart trekt alleen een kaart; Gooien gebruikt ook de vrije taalstenen. Vastgezette kaarten en stenen blijven staan bij setwissels. De mix blijft bewaard bij hervatten; oude enkelvoudige selecties blijven werken.

`npm run test:taalworp:browser` controleert mengen, groepering, slotjes over setgrenzen, hervatten, Terug, oude opgeslagen spellen, kaart trekken, voorbeeld en schermformaten.

## Verhaalworp

320 unieke goedgekeurde beelden in tien speelbare sets: Basis (54), Acties (54), Dagelijks leven (36), Werk (54), Familie (6), Gevoelens (12), Lichaamsdelen (18), Beroepen (12), Dagelijkse aanvullingen (54) en Extra acties (22). Hand en oor zijn gedeeld met Lichaamsdelen; er zijn 322 setplaatsen, geen 322 verschillende beelden. De tien aanvullende acties zijn bij Extra acties ondergebracht. Vink één of meer sets aan en pas de selectie toe om hun beelden te mengen. Gedeelde beelden tellen één keer mee. Vastgezette beelden blijven bewaard bij een andere selectie, ook als hun set wordt uitgezet; vrije stenen komen uit de nieuwe selectie. Familie alleen ondersteunt drie of zes stenen; gemengde sets ook negen. Bestaande opgeslagen enkelvoudige selecties blijven werken.

Bron: [alle 320 goedgekeurde iconen op Drive](https://drive.google.com/drive/folders/1wDX2xZID6YvIMXjgIt5a7Gh2lTb-216f), goedgekeurd op 20 september 2026. De 176 toevoegingen zijn ongewijzigde PNG's, gecontroleerd tegen de bronhashes. De bestaande 144 records, bestanden en opgeslagen spel-ID's blijven behouden. `data/storydice.json` en de geladen `data/storydice.js` bevatten dezelfde gegevens. De laatste vult `DIGIBORD_DATA.storydice` na de bevroren basisbundel, volgens dezelfde laadwijze als Tongbrekers. De speelkeuze en Mijn collectie volgen hetzelfde setregister.

`npm run test:story:browser` controleert alle sets, afbeeldingsbestanden, worpen, slotjes, uitzetten, hervatten, Mijn collectie en schermformaten.

## Publiceren en terugzetten

De bestaande Cloudflare Worker `taalroute-digibord` publiceert uitsluitend `dist/`. Na alle controles: `npx wrangler@4.135.0 deploy`. Publicatie vereist toestemming; GitHub CI publiceert niet zelfstandig.

De oude app blijft volledig bereikbaar in Git onder `archive/pre-v0124-20260921`. Er staan geen oude applicatiebestanden in deze nieuwe publicatiemap. Bestaande hoofdingangen Praatpad.html en Start-Praatpad.html verwijzen naar de nieuwe startpagina.

Voor onmiddellijk herstel naar de voorafgaande Cloudflare-versie: `npx wrangler@4.135.0 rollback 0e86621f-e71f-4195-89c3-a7b58bcb04f5`. Leg een herstelactie vast; synchroniseer daarna bewust met Git. Wis geen browseropslag.
