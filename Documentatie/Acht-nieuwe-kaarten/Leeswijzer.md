# Acht nieuwe geschilderde speelkaarten

Status: **KANDIDAAT · lokaal gebouwd · niet gepubliceerd**. Uitbreiding van de bestaande app op 14 september 2026, na de expliciete opdracht om alle acht voorgestelde kaarten volledig speelbaar te maken in de stijl van Haven en Rotterdam.

Open `http://127.0.0.1:61381/Praatpad.html?kaart=buurttuin-kasroute`, of kies **Bediening → Wissel kaart**. De kiezer bevat 22 kaarten. Dezelfde vier vormen, vier niveauroutes, oefeningen en pionindelingen blijven beschikbaar. De kaart bepaalt het decor en de looproute, niet het taalniveau of het onderwerp van de opdrachten.

| Kaart | Vakken | Looproute en diepte |
| --- | ---: | --- |
| Buurttuin · kort | 12 | Open tuinpad naar de kas, onder een begroeide bonenboog door. De houten boog vormt een voorgrondlaag. |
| Bibliotheek · kort | 16 | Van de ingang via brede gangen langs boekenkasten naar de leesplek. Boekenkast en plant hebben voorgrondlagen. |
| Museum | 20 | Door de open zalen langs vitrines, schilderijen en sculpturen. Vitrine en sculptuur hebben voorgrondlagen. |
| Onderwaterwereld | 24 | Glazen wandelbuis langs koraal en een wrak naar een zeelaboratorium. Koraaltunnel 14→15 met afzonderlijke monden en volledige onzichtbaarheid. |
| Jungle | 28 | Diagonale klim door het regenwoud, hangbrug 12→13 en doorgang achter de waterval 20→21 naar het veldstation. |
| Woestijn | 24 | Van nederzetting door zandstenen rotsen en duinen naar de oase. Zandsteendoorgang 11→12. |
| Kasteel | 30 | Via de korte ophaalbrug 3→4 over de muren en door de overdekte poort 23→24 naar de grote zaal. |
| Bergdorp | 28 | Twee dorpshellingen met een diepe kloof ertussen. Kabelbaan 14→15, zichtbaar instappen, meereizen en uitstappen. |

Alle vakken, symbolen, start/finish en het verbindende pad zijn **meegeschilderd in de definitieve PNG**. De app tekent geen zichtbare losse vectorvakken over deze beelden. Onzichtbare klikvlakken, optionele nummerlabels en de pion liggen op dezelfde afgestemde coördinaten. Voorgrondlagen hergebruiken uitsneden van het definitieve schilderwerk; de cabine is een bewegend object met een achter- en voorzijde.

De passages horen bij de **gewone opeenvolgende route**. Doorlopen met een hogere worp activeert ze ook. Ze kosten één gewone stap tussen hun twee vakken. Er zijn geen extra sprongen, terugstuurvakken of strafbeurten. Voorbeelden bij Speciale plekken veranderen de lesstand niet. Minder beweging behoudt dezelfde bestemming. De 5–10 minuten voor korte kaarten is een richtduur bij één gedeelde pion, afhankelijk van de gekozen oefening; geen gemeten klasproef.

## Bestanden en productie

- Acht modules en bijbehorende stijlen: `Kaarten/{kaart-id}.js` en `.css`.
- Definitieve beelden: `Kaarten/assets/{kaart-id}/{kaart-id}-speelroute.png`.
- Gedeelde beweging: `Kaarten/nieuwe-werelden.js`. De kabelbaan is een toevoeging; de bestaande lift en tunnels behouden hun werking.
- Registratie: `Kaarten/register.js` en `Lessen/kaartvormen.js`.
- De bestaande ingang `Praatpad.html` gebruikt een vernieuwde mediaversie, zodat lokale previews de nieuwe modules laden.
- Nieuwe controle: `tests/eight-worlds.cjs`, opgenomen in `npm test`.
- Productie met de ingebouwde imagegen-tool. Exacte eerste prompts staan in [Beeldprompts.json](Beeldprompts.json); gerichte correcties in [Beeldcorrecties.json](Beeldcorrecties.json). [Beeldbronnen.json](Beeldbronnen.json) koppelt de uiteindelijke bestanden aan hun gegenereerde bronnen.
- De geometriegidsen zijn uitsluitend productiehulpmiddelen; de definitieve app toont het schilderwerk. Ze staan samen met de routeplanning onder `Routeontwerp/`.

De eerdere veertien kaartmodules en beelden blijven ongewijzigd ten opzichte van appcommit `fc46fb2`. Het register wordt uitgebreid en de gedeelde engine krijgt alleen de ondersteuning voor de nieuwe passages en hun eigen labelposities. De bestaande opdrachtenbanken en lesopslag blijven behouden. Latere publicatie is een afzonderlijke handeling.
