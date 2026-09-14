# Digibord — publicatie 14 september 2026

Op expliciet verzoek van de gebruiker zijn de volledige kaartuitbreiding, de Nederlandse reparaties, de categorieën en de laatste bedieningscorrecties naar GitHub gepusht en gepubliceerd.

- Website: https://digibord.taalroute.nl/
- GitHub: https://github.com/26buckets/taalroute-digibord — main.
- Gepubliceerde appbron: `fc2c9e6`.
- Cloudflare Worker: `taalroute-digibord`.
- Actieve deploymentversie: `b2bf8649-4159-4b24-80e4-8830563975f7`.
- Publicatie: 14 september 2026; 102 gewijzigde bestanden geüpload.

## Inhoud

46 unieke speelkaarten; de vorige GitHub-versie bevatte er 11. De 35 uitbreidingen en het Nederlandse routeherstel zijn nu meegenomen. Wissel kaart heeft Algemeen (6), Nederland (28), Fantasie & avontuur (8), Spreektijd (4) en Kort (12). Kort is de aanvullende selectie van kaarten met maximaal twintig vakken, zonder dubbele lessen of opslag.

De vrij beloopbare buitenkant van een tunnel houdt de pion zichtbaar na landen, herladen en bij de volgende stap. Een tijdelijke statusmelding blokkeert geen onderliggende routekeuze meer. Kaartnummers, kaartbeelden en routes zijn tijdens deze categorie-update behouden; de eerdere Nederlandse herstelbeelden zijn integraal gepubliceerd.

## Controle

Alle 37 lokale testscripts zijn geslaagd, met afzonderlijke afronding van enkele laatste scripts nadat testbrowsers onverwacht sloten. De 46 hoofdtrajecten en twintig tunnelmonden van de eerdere uitbreidingen zijn ook visueel bekeken. Zie Kaartbibliotheek-2026-09-14/QA.md.

Na publicatie zijn op het echte domein alle 46 kaarten geopend, de vijf categoriegroepen gecontroleerd, de korte kaartlink en browser-Terug bediend en Delft 15→16 met een zichtbaar varend pontje afgespeeld. Alle 99 gecontroleerde bron- en kaartbeeldbestanden zijn byte-identiek aan de lokale gepubliceerde versie. De bestandscontrole volgt HTTP-doorverwijzingen; een browsercache-/doorverwijsrespons zelf hoeft geen uitleesbare body te hebben. Er zijn geen resterende fouten in de online controle.

De homepage, index.html en Start-Praatpad.html verwijzen correct naar Praatpad.html met behoud van de gekozen kaartquery. Documentatie, tests en lokale werkbestanden blijven via .assetsignore buiten de openbare app. De bronnen en het QA-verslag staan wel op GitHub. De latere documentatiecommit wijzigt geen gepubliceerde appbestanden.

Deze notitie vervangt de eerdere lokale KANDIDAAT-status voor de hier genoemde kaarten en categorieën. Volgende wijzigingen worden niet automatisch gepubliceerd.
