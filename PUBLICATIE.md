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
