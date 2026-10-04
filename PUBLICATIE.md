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

GitHub: gebruik branch `codex/digibord-v1.25` van `26buckets/taalroute-digibord`. Alleen `dist/` is de publicatiebouw. Hoofdbranch `main` is niet automatisch bijgewerkt door een push naar de ontwikkelbranch. De publicatie gebeurt via de bestaande Cloudflare Worker `taalroute-digibord`.

De volledige bronvoorraad, eerdere verslagen en chat-afspraken staan op Drive:
https://drive.google.com/drive/folders/1LertxIY2VeDDWewY4dZK6JOGjdZ6Vu25
Lees de nieuwste START-HIER en publicatie-aanvulling vóór verderwerken. Git bevat de app en tests; Drive bevat ook de volledige projectoverdracht, boekanalyses en overige bronnen buiten de repository.

## Navigatievervolg — 4 oktober 2026

Het vervolg op de grammaticacatalogus maakt de kaart-, bord- en dobbelingangen contextueel, met behoud van niveau en een terugknop naar de eigen categorie. Oefenen heet Les samenstellen; Mijn collectie heet Voortgang en groepen. De algemene catalogus behoudt de oefenvormkeuze, de kaartingang gebruikt dezelfde catalogus met Kaarten als vaste spelvorm. Dit vervangt de eerdere beschrijving van alle ingangen als dezelfde algemene voorbereiding. Zie [NAVIGATIE.md](docs/NAVIGATIE.md). Samen met de catalogus integreren; geen zelfstandige publicatie op een oudere basis.
