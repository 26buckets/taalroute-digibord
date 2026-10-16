# Canonieke publicatie — herstel 16 oktober 2026

Gebruik uitsluitend de actuele `main` van `26buckets/taalroute-digibord`. Deze bevat de bestaande goedgekeurde V01.25 plus de publicatie van de 480 tongbrekeropnamen, de gedeelde header en Taalroute-audiometadata. Oudere checkouts moeten eerst bijgewerkt worden.

Voor publicatie: lees de publieke `/release.json`, haal `origin/main` op, controleer dat de lokale bron beide bevat, voer de verplichte lokale checks uit, commit en push samenhangend. Voer na de commit `npm run build` uit. Daarna gebruikt `npm run deploy` uitsluitend `wrangler.jsonc` en publiceert uitsluitend de gecontroleerde bouw; zware controles worden niet onnodig opnieuw uitgevoerd. Iedere aangeboden bestandsbyte wordt opnieuw vergeleken met de bron en de bouwvingerafdruk. De build controleert de vaste functies en audiohashes en schrijft een release-vingerafdruk. De publicatiecontrole vereist een schone checkout, exact de actuele `origin/main`, afstamming van de goedgekeurde audiovrijgave en afstamming van de huidige livecommit. Een onbekende liveversie blokkeert publicatie. Gebruik geen alternatieve configuratie zonder deze controle.

De eenmalige `DIGIBORD_INITIAL_RECOVERY=1` is uitsluitend voor de vastgestelde V01.24-terugval: de controle accepteert dan alleen de exact vastgelegde verkeerde apphash. Zodra een geldige release.json online staat, geldt altijd de afstammingscontrole. Dit is geen algemene rollbackoptie.

Na publicatie: controleer `/release.json`, de echte navigatie, Oefenen, Mijn lessen, instellingen, bronbanken, bewaren/hervatten en aangeboden audio. Bewaar bron en herstelgegevens in de bestaande Drive-projectmap. GitHub Actions blijft uit; zware checks draaien lokaal. De bestaande workflow bevat alleen nog een korte handmatig te starten contracttest en publiceert niets.

Incident: op 14 oktober 2026 om 21:45:04 CEST is bij audiometadataherstel de V01.24-hoofdbranch gepubliceerd als Cloudflare-versie `b4692503-e146-40ce-8360-c2633cf0a4f1`. De voorgaande V01.25-publicatie was `fe1b6f78-e2f7-4f38-98a8-ed8e31aa299b` van 13 oktober 20:36 CEST. De headerpublicaties van 16 oktober bouwden voort op die oudere bron. De tests van V01.24 konden groen zijn omdat vergelijking met de bestaande livefuncties ontbrak. De oplossing is bronconsolidatie plus een functioneel publicatiecontract en een controle op de livecommit; alleen een versielabel wijzigen lost dit niet op.

Historische originele audio blijft ongewijzigd buiten dist voor de bevroren inhoudsborging. De 480 werkelijk aangeboden opnamen bevatten Taalroute-merkvelden en zijn verliesloos gecontroleerd tegen de originelen.

---

# WZ-vrijgave — 3 oktober 2026

Opdracht van Nico: sluit de 2.698 goedgekeurde WZ-opdrachten aan, publiceer en voer daarna de livecontrole uit. Dit vult de eerdere vrijgave aan.

| Leerroute | Vrij oefenen | Gericht oefenen | Actief |
|---|---:|---:|---:|
| A0 → A1 | 535 | 0 | 535 |
| A1 → A2 | 1.276 | 93 | 1.369 |
| A2 → B1 | 708 | 86 | 794 |
| Totaal | 2.519 | 179 | 2.698 |

862 afgewezen records blijven buiten selectie. De vijf oorspronkelijke banken en historische versies blijven bewaard. Nieuwe lessen gebruiken uitsluitend versie `2026-10-03.wz.release.1`. Oude WZ-lessen worden niet stilzwijgend vervangen; ze blijven opgeslagen en zijn zonder vrijgave van hun eigen tekstversie niet speelbaar. Bestaande vrijgegeven grammatica-, Snelvragen- en kaartlessen blijven behouden.

## Bediening

Spelen → Grammatica en zinsbouw opent dezelfde docentcatalogus als Oefenen: negen categorieën, onderwerp, niveau, oefenvorm en starten. Grammatica en Woorden en zinnen delen één vindstructuur; hun bronbanken en vrijgave blijven intact. Bij Oefendoel betekent Vrij oefenen uitsluitend FREE. Een concreet oefendoel selecteren maakt alleen de passende GUIDED-opdrachten toegankelijk. De keuze wordt in de les en voortgang bewaard. Kleine selecties kunnen hun werkelijke duur onder 30 seconden gebruiken. Open opdrachten worden samen besproken, zonder automatische goed/foutbeoordeling. Zie [de informatiearchitectuur](docs/GRAMMATICA-CATALOGUS.md) en [de volledige mapping](docs/GRAMMATICA-MAPPING.md).


## Historisch publicatiebesluit (vervangen waar hierboven aangevuld)

# DigiBord 1.25 — alleen nagekeken inhoud

Besluit van Nico, 25 september 2026. Publiceer de nieuwe voorbereiding, selectie en instellingen met uitsluitend de volledig nagekeken inhoud voor docenten.

- Beschikbaar: 1.440 Er/Zullen/Zouden en 2.621 Snelvragen = 4.061 opdrachten.
- Verborgen, bewaard: de overige 4.353 aangesloten opdrachten. De 771 uitgestelde Snelvragen blijven als bronvoorraad buiten de aansluiting.
- `release-policy.js` wijst de twee concrete nagekeken bankversies aan. Dezelfde grens geldt voor selectie, catalogus, mixen, klassieke spelingangen en hervatten. De korte standaardroute blijft onderwerp → niveau → spel.
- Een oude les met niet-nagekeken tekst wordt niet gewist of naar andere inhoud omgezet; zij blijft opgeslagen en voorlopig verborgen. Eerdere teksten met dezelfde volledig nagekeken itemversie blijven bruikbaar. De bronbanken en alle historische revisies blijven behouden voor herstel en latere review.
- De vaste grote tongbrekerstijl en opnamen blijven in de bron. Tongbrekers worden niet aangeboden zolang die reeks niet volgens de huidige volledige review is vrijgegeven.
- Er is geen knop, URL-parameter of opgeslagen instelling om verborgen voorraad voor docenten aan te zetten. Geautomatiseerde archiefcontroles gebruiken in een aparte testbrowser `DigiBordArchiveReview=true` vóór het laden. Dit is een publicatiefilter in een statische app, geen beveiliging van vertrouwelijke bronbestanden.

Navigatie blijft zichtbaar, ook op smalle schermen. Mijn lessen en Mijn collectie zijn bereikbaar; de collectie biedt groepen en gecontroleerd hervatten. Woorden en zinnen staat als niet-beschikbare tegel met ‘Nog niet nagekeken’; Live blijft ‘Binnenkort’. ‘Verder waar je was’ blijft zichtbaar en is uitgeschakeld zonder geschikte opgeslagen les. Dit geeft geen toegang tot verborgen opdrachten.

`npm run test:release:browser` controleert de echte standaard, zonder archiefvlag: 4.061 beschikbare opdrachten, zichtbare navigatie en duidelijke niet-beschikbare ingangen, mixen, bewaren en hervatten van goedgekeurde lessen, en het behouden maar niet afspelen van een oude WZ-les. De bestaande suites blijven de bewaarde bronvoorraad en oude weergaven controleren. `npm run test:practice:browser` controleert bediening en vaste vormgeving; `tests/practice-advance-browser.cjs` gebruikt de echte vrijgegeven selectie.

Historische situatie vóór 16 oktober: V01.25 stond op `codex/digibord-v1.25` en de audiovrijgave op `publish/tongbrekers-twee-tempos`, terwijl `main` verouderd bleef. Deze scheiding veroorzaakte de terugval en is vervangen door de canonieke `main` hieronder. Alleen `dist/` is de publicatiebouw. De publicatie gebeurt via de bestaande Cloudflare Worker `taalroute-digibord`.

De volledige bronvoorraad, eerdere verslagen en chat-afspraken staan op Drive:
https://drive.google.com/drive/folders/1LertxIY2VeDDWewY4dZK6JOGjdZ6Vu25
Lees de nieuwste START-HIER en publicatie-aanvulling vóór verderwerken. Git bevat de app en tests; Drive bevat ook de volledige projectoverdracht, boekanalyses en overige bronnen buiten de repository.
