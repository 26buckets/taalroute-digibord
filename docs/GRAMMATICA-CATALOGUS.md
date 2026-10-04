# Grammatica en zinsbouw

Opdracht van Nico, 4 oktober 2026. Gebouwd op `codex/digibord-v1.25`, basiscommit `d31f4ac89a7a2d105be37d341ac27809d5d81b4d`. Dit besluit vervangt de bronfamilies Grammatica en Woorden en zinnen als docentnavigatie. Het verandert geen inhoudelijke vrijgave.

## Navigatie

Eén ingang **Grammatica en zinsbouw**, zowel vanaf Spelen als in Oefenen. De bestaande voorbereiding en lesweergave blijven staan. De negen categorieën zijn:

1. Zinnen maken
2. Vragen stellen
3. Werkwoorden en tijden
4. Modale werkwoorden
5. Niet, geen en er
6. Bijzinnen en verbindingen
7. Relatieve zinnen
8. Woorden in de zin
9. Formuleren en samenhang

Een docent bereikt een bekend onderwerp met twee inhoudelijke keuzes: categorie → onderwerp. Zoeken geeft direct onderwerpen zonder extra categoriekeuze. Daarna volgen niveau → oefenvorm → starten. Bij Oefenvorm kiest de docent een beschikbare soort oefening, zoals invullen, herkennen of herschrijven, en de passende spelweergave. Het criterium maximaal drie keuzes betreft het bereiken van het onderwerp; de niveau- en oefenvormkeuze blijven expliciet. Een eerder ingestelde niveau-eerstweergave maakt van grammatica geen niveaubibliotheek meer. Instellingen voor andere inhoud en archiefcontroles blijven behouden.

Niveau filtert de gekozen inhoud. Alleen niveaus met beschikbare opdrachten worden aangeboden, met behoud van de zes bestaande routes en de individuele classificatie. GUIDED vraagt nog altijd een bewust gekozen Oefendoel; Vrij oefenen bevat uitsluitend FREE. Een kleine selectie onder 30 seconden krijgt een passende korte duur, zodat een geldige individuele opdracht niet door de duurkeuze onstartbaar wordt.

## Mapping en bronbehoud

[De volledige mapping](GRAMMATICA-MAPPING.md) is opgesteld vóór implementatie. De actuele 60 brononderwerpen worden samengebracht in 39 docentonderwerpen. Bij de vastgelegde basis zijn alle **7.148 beschikbare grammatica- en WZ-opdrachten** bereikbaar. De 862 afgewezen WZ-records blijven HARD_REVOKED en worden niet door een vindroute vrijgegeven.

`grammar-catalog.js` bevat de expliciete categorieën, docentonderwerpen, oorspronkelijke topic-ID’s en zoektermen. Er worden geen opdrachten gekopieerd of nieuwe bronbanken geregistreerd. De virtuele familie `grammar-guide` bestaat alleen in de presentatie. De selectiespecificatie verwijst naar de oorspronkelijke banken en topics. `ContentRuntime.selectionPool` verenigt deze op het bestaande `content_item_id`.

Een onderwerp kan in meerdere categorieën staan. De onderliggende selectie is identiek. Ook E1-hergebruik via `E1Release.reuse` telt mee; een verwijzing wordt geen tweede opdracht. Het bestaande runtimefilter blijft verantwoordelijk voor bankvrijgave, versies, revocatie, FREE/GUIDED, niveau en spelgeschiktheid.

De oorspronkelijke catalogus blijft intern beschikbaar voor oude concepten en lessen. Opgeslagen sessies behouden hun exacte bronverwijzingen, seed, kaartvolgorde, groepsgegevens en voortgang. Bij het bewerken staan bestaande mixkeuzes aangevinkt als Huidige keuze. Hun oorspronkelijke families, banken, topics, niveaus, wegingen en selectiegrenzen blijven exact bewaard; een samengevoegd docentonderwerp verbreedt een oude selectie niet stilzwijgend. De archiefbrowser behoudt zijn bestaande broncontroles; hij is geen docentinstelling.

## Labels en zoeken

De gedeelde labelresolver voorkomt de oude fout `topic_label || topicId`. Bekende codes krijgen expliciete Nederlandse namen, ook wanneer een bron een hoofdlettercode als label levert. Onbekende technische codes tonen **Onderwerp niet beschikbaar**; bron-ID’s blijven alleen in data en technische attributen staan. Oefendoelen met underscores krijgen leesbare spaties. Samenvattingen, spelkoppen, mixkeuzes, recente lessen en nieuwe bewaarnamen gebruiken dezelfde resolver. Bestaande zelfgeschreven lesnamen worden niet overschreven.

Zoeken is niet hoofdlettergevoelig, negeert accenten en leestekens en vereist alle ingevoerde woorden. Zoektermen zijn onder meer omdat/want/doordat, verleden tijd/imperfectum/perfectum, die/dat/betrekkelijke bijzin, vraagwoorden, inversie/tijd of plaats vooraan, niet/geen/ontkenning. Een zoekresultaat toont een docentonderwerp één keer, ongeacht het aantal categorieën.

## Snelle routes

Veel gebruikt, Recent gebruikt en Favorieten lezen uit de bestaande `LessonUI.service`. Er is geen nieuwe opslag of netwerkdienst.

- Veel gebruikt telt gestarte sessies per selectiespecificatie binnen de bewaarde geschiedenis op dit apparaat. Dit is geen totale gebruiksstatistiek na wissen of archiveren.
- Recent gebruikt toont de laatst gestarte passende selecties, zonder dubbele selecties.
- Favorieten toont bestaande bewaarde grammaticalessen en mixen die als favoriet zijn gemarkeerd. Bewaren en favoriet maken blijven via Mijn lessen beschikbaar. Favoriete spelvormen blijven in Mijn lessen staan.

Alle routes passen de bestaande vrijgavecontrole opnieuw toe. Lege lijsten en opslagfouten krijgen een leesbare melding. De docent kiest vanuit een snelle route opnieuw de oefenvorm; exact hervatten blijft via Mijn lessen en Verder waar je was beschikbaar.

## Regressiepoort

`tests/grammar-catalog.cjs` controleert de complete topicmapping, negen categorieën, zoektermen en ontbrekende/technische labels. `tests/grammar-catalog-browser.cjs` vergelijkt alle oorspronkelijke bronvelden en onveranderlijke verwijzingen met de vóór wijziging vastgelegde hashes. Hij controleert bereikbaarheid van elk beschikbaar ID via echte selectiespecificaties, alle guided-keuzes via de UI, spelgeschiktheid, categorieën, zoekresultaten, deduplicatie, opslag/hervatten, favorieten en breedtes 320–1920 px.

De baseline `tests/fixtures/grammar-catalog-baseline.json` is geen nieuwe inhoudsnorm. Verander hem niet om verlies te maskeren. Een nieuwe bronvrijgave vraagt een onderbouwde nieuwe inventarisatie. `tests/grammar-mix-browser.cjs` bewaakt daarnaast het ongewijzigd opslaan en bijwerken van oude mixen en het maken van nieuwe docentmixen. De bestaande inhouds-, P0-, E1-, bronbank-, lint-, type-, build- en browserpoorten blijven verplicht.

PR’s naar `codex/digibord-v1.25` draaien dezelfde volledige CI-poort als de bestaande releasebranch. De nieuwe catalogusregressie draait ook op de gebouwde `dist/`. Alleen `dist/` kan worden gepubliceerd; een reviewbranch of PR publiceert de app niet. Publicatie en merge volgen de bestaande regels na een volledig groene poort.

## Compatibiliteit met de tussentijds gepubliceerde indeling

Vóór publicatie is op 4 oktober 2026 Cloudflare-versie `db3ce795-0628-41c4-bf31-17448bb344b8` aangetroffen. Deze parallelle taxonomy-uitwerking gebruikt de bestaande bron-IDs en een extra `free_play_gate`-filter in bewaarde lessen. De catalogus vervangt die alternatieve navigatie, maar de gedeelde inhoudsmotor blijft dit filter ondersteunen: FREE en GUIDED worden niet stilzwijgend vermengd of verruimd. De oorspronkelijke route- en vrijgavecontroles blijven gelden. Twee selectievoorbeelden zijn vóór wijziging uit de openbare app vastgelegd in `tests/fixtures/published-taxonomy-selections.json`. De mixtest controleert hun exacte selectie, starten, opslaan, hervatten en opnieuw spelen.
