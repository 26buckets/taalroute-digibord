# Spelroutes en niveaubehoud — 4 oktober 2026

Opdracht: pas het goedgekeurde navigatievoorstel toe en sluit aan op de nieuwe docentgerichte grammaticacatalogus. De startpagina, spelcategorieën, kaarten, afbeeldingen en spelweergaven blijven behouden.

## Aansluiting op de catalogus

Deze wijziging bouwt voort op `codex/grammar-teacher-catalog`, PR #31, gecontroleerde basis `64644be`. De negen categorieën, 39 onderwerpen, synoniemen, oefensoorten, bronmapping en bereikbaarheid blijven van `GrammarCatalog` afkomstig. De kaartingang gebruikt dezelfde geprojecteerde `grammar-guide`-familie, niet opnieuw de onderliggende familie `grammar`. De correctie voor oude opgeslagen mixen is meegenomen: bewerken behoudt de exacte bronnen, niveaus, weging en aantallen.

De navigatiewijziging vormt een vervolg op de catalogus-PR. Publiceer of merge haar niet los op een oudere basis. Controleer vóór integratie opnieuw de laatste cataloguscommit en voer de beide browsercontroles samen uit.

## Bestemmingen

| Ingang | Gedrag | Terug |
| --- | --- | --- |
| Kaartspellen → Snelvragen | Vier keuzen; Kaarten staat vast; Start kaartspel | Kaartspellen |
| Kaartspellen → Grammatica en zinsbouw | De gedeelde negen categorieën; Kaarten staat vast | Kaartspellen |
| Kaartspellen → Nederlands tussen de regels | Eigen onderwerp; Kaarten staat vast | Kaartspellen |
| Speelborden → Rotterdam of Zwolle | Gekozen bord en speelbordvorm staan vast; passende Snelvragen | Speelborden |
| Dobbelspellen → Dobbelen met opdrachten | Alleen onderwerpen/niveaus die bij DICE passen | Dobbelspellen |
| Grammatica en zinsbouw op de startpagina | De gedeelde catalogus inclusief oefensoorten en passende spelvormen | Spelen |
| Les samenstellen | Volledige lesmaker, inclusief opgeslagen voorkeur voor indeling | Spelen |

De gekozen spelroute blijft onder Spelen gemarkeerd. De bestaande voorbereidingscomponent wordt hergebruikt, met een contextuele titel, routepad en ouderknop; zij verplicht niet meer tot opnieuw kiezen van een spelvorm. In een vaste spelroute staan tijd, groepsvorm, bewaren en mixen achter Aanpassen en bewaren. Extra oefenfilters blijven toegankelijk.

## Niveau en voortgang

- Spelingangen nemen het actuele niveau bovenaan over.
- Een ander onderwerp of andere familie verandert het niveau niet stilzwijgend. Bij niet-beschikbaarheid blijft het gekozen niveau zichtbaar en wordt een bewuste keuze gevraagd.
- Een expliciete niveaukeuze in de voorbereiding blijft geldig bij terugkeer naar het menu. Hiervoor worden geen pionnen, bestaande opdrachten of bewaarde spelvoortgang gereset.
- Een eerder dobbelspel bepaalt niet de spelvorm bij een nieuwe grammatica-ingang.
- Terug naar dezelfde ingang bewaart onderwerp en aangepaste filters gedurende het bezoek. Een bewust gewijzigd globaal niveau bepaalt de volgende ingang.
- Bladeren en teruggaan vervangen nooit de actieve sessie. Opgeslagen lessen behouden hun exacte bronverwijzingen en hervatten na herladen.
- De historische archiefreview houdt haar bestaande testgedrag. Deze navigatiewijziging geeft geen extra inhoud vrij.

## Benamingen en opmaak

Oefenen heet in de hoofdnavigatie en bij de bijbehorende instellingen Les samenstellen. Mijn collectie heet Voortgang en groepen. De selector in het kaartmenu heet Begeleiding. Instructieteksten met het gewone werkwoord oefenen blijven staan.

De bestaande schermindeling blijft behouden. Op smalle schermen krijgen onderwerpnaam en niveaulabels elk een leesbare regel binnen dezelfde rij. De vier bestaande navigatieknoppen blijven op dezelfde plek; iconen staan op smalle schermen boven hun tekst om de langere benamingen te laten passen. Geen zijbalk of nieuwe pagina-indeling.

## Verificatie

`npm run test:navigation:browser` controleert de echte ingangen, actieve hoofdnavigatie, vaste spelvorm, behouden niveau, ouderknoppen, compatibele dobbelinhoud, gedeelde catalogus, behoud van de actieve les, herladen/hervatten en breedtes van 320 tot 1920 px.

`npm run test:grammar-catalog:browser` bewaakt onafhankelijk dat alle 7.148 grammatica-/zinsbouwopdrachten bereikbaar blijven, bronvelden en bronverwijzingen gelijk blijven, de 238 selecties werken en de negen categorieën intact zijn. De standaard inhouds-, P0-, rebus-, opslag-, spel- en bouwcontroles blijven verplicht.
