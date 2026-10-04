# P0 contentbehoud — 4 oktober 2026

Nieuwe functies en Taalworp-uitbreiding zijn geblokkeerd totdat `npm run test:p0`, de volledige toepasselijke tests, build en live pariteit PASS zijn. Geen gedeeltelijke publicatie.

## Bevroren bewijs

`tests/fixtures/p0/released-570.json` is rechtstreeks uit de uitgevoerde runtime van commit 8d764b404f146702c4646542c0de79215fbde8ec geëxporteerd, niet uit de huidige runtime. Die stand bevat de 570 op 2 oktober vrijgegeven IDs en de op 3 oktober vastgelegde zes publieke routes, plus de shuffle- en kaartweergavecorrectie. De kaartgegevens, bundel en gesprekreview zijn byte-ongewijzigd sinds vrijgave 8147769aa0eab1b0c710b193f7af395128ac1f56. Drive CHAT-OVERDRACHT (1Oh1crwgXhuchG04rhkSQ55es2S3uvZZF) bevestigt beide publicaties. Daarom is 8d764b4 de historische runtimebaseline; 8147769 is het oorspronkelijke inhoudsvrijgavebewijs.

De werkbasis is f21103512bfa3ce65871bf5b77cd08c0161032f0, de nieuwere bewezen publicatie op codex/digibord-v1.25. CONTENT 001 / 09_E1_SLUITMATRIX bevestigt deployment 808f0406-9f2d-4d1d-8558-05285e59ab58. De nieuwere E1.0-bronbesluiten blijven leidend; oud bronmateriaal wordt niet over nieuwere inhoud geschreven.

Per familie bevat een afzonderlijk JSON-manifest de historische records, exacte goedgekeurde huidige records, routeprojecties in FREE en begeleide modus, en een ID-gebonden wijzigingsbesluit. De goedgekeurde projectie is eenmalig gereconstrueerd uit de historische baseline plus de onafhankelijk gedownloade canonieke R014.1/E1-bron 1Gm9SgeC6vpnEeIWdlseYUnmxHpwrJhSK en de bestaande E1-reviewvelden. De download is inhoudelijk exact gelijk aan de bestaande E1-bronsnapshot. Test/build hebben GEEN update- of accept-current-modus. Hashes beschermen iedere snapshot; een wijziging vraagt een expliciet nieuw bronbesluit en beoordeling van de diff.

## Geregistreerde besluiten

- E1_SOURCE_FIELDS_AND_GATES: de 240 actuele niet-tong-/niet-story-kaarten gebruiken exact de bronvelden, route en FREE/GUIDED-keuze uit R014.1 E1.0 en KAART 520 final closure E1.0. De adapter normaliseert route/targetLevel/version en e1FinalStatus=RELEASE voor de runtime; de oorspronkelijke bronstatus blijft in de bronsnapshot en de FREE/GUIDED-poort blijft ongewijzigd.
- E1_ROUTE_GATE: de 240 tongbrekers behouden hun oorspronkelijke IDs, teksten en audio. De E1-routeclassificatie vervangt de oudere cumulatieve routeprojectie. De 50 kaarten Nederlands tussen de regels behouden hun inhoud; hun E1-routes zijn A2→B1 (19) en B1→B2 (31). Geen C2-route toegevoegd.
- STORY40_BLOCKED: de 40 eerdere Story Cards blijven fysiek bewaard, maar zijn bewust verborgen. De actuele Drive-sluitmatrix bevat expliciet REOPENED_FOR_STORYCARD_REDESIGN / BLOCKED en vereist STORY CARDS 004 → renderer → conversie → volledige review. Dit P0 heropent of overschrijft dat productbesluit niet. Daarom betekent de poort **570 historische kaarten verantwoord = 530 actief + 40 verklaard geblokkeerd**, niet 570 speelbaar.
- P0_MEDIA_RESTORE: herstel uitsluitend bestaande visualRebus-objecten per stabiele ID uit de bewezen vrijgave. Alle tien beeldbestanden hebben dezelfde SHA-256 als het canonieke Drive-register 1qA_L7Blxy5eGq5i6cCO9ukHhu7xlvLyf. Beeldmetadata mag de nieuwere canonieke titel, instructie, situatie en taakcontext niet vervangen. Geen nieuwe beelden of kaartinhoud.

## Oorzaak en telling

De E1-adapter verving kaarten door bronrecords waarin de app-specifieke visualRebus-objecten ontbreken. Daardoor bleven de PNGs in assets aanwezig maar verdwenen alle tien koppelingen. tests/rebussen.cjs controleerde uitsluitend de oude JSON/bundel met een hard gecodeerd aantal 10 en zag de uitgevoerde E1-runtime niet. Die test was bovendien geen verplicht onderdeel van build/test.

De familie heeft historisch én canoniek 40 kaarten. De historische routeverdeling was 5/12/7/6/10; het actuele E1-bronbesluit geeft 5/12/7/8/8 over de vijf niet-Alpha-routes. Twee kaarten zijn daardoor bewust van de hoogste naar de voorlaatste publieke route verplaatst. E1 maakt 24 FREE en 16 GUIDED. De waargenomen 5/12/7 zijn de drie lage routes, geen totale familiegrootte. De bredere Drive-beeldbank bevat 282 rebussen; 272 hebben geen vrijgegeven koppeling aan een van deze 40 IDs. Het register vermeldt dat de apppublicatie tijdens die opslagronde niet veranderde. TR-REBUS-KORT-beelden mogen daarom niet zonder bronkoppeling als extra goedgekeurde kaarten worden ingevoegd.

## Poort

`npm run test:p0` toetst bronintegriteit, alle kaartvelden, exacte IDs/families/routes, FREE/GUIDED-beschikbaarheid, behoud van alle 250 eerdere mediabestanden en de uitgevoerde runtime. `npm run build` voert dezelfde poort vóór én na het bouwen uit. Het shrink report bevat toegevoegd, gewijzigd, verplaatst, verborgen, media verloren, verwijderd en alle geregistreerde verschillen. Geen onverklaarde verandering is toegestaan. Mutatietests bewijzen dat verwijderen, verbergen, overschrijven, dubbele IDs, onverwachte toevoegingen en mediaverlies falen.

De bestaande dirty selector-checkout is niet gewijzigd. Een patch en archief van ongecommit werk zijn in de P0-werkmap bewaard. Geen nieuwe inhoudelijke review of menselijke klasproef geclaimd.

## Afzonderlijke technische regressietests

De oude release-/route-/shuffle-/WZ-tests verwachtten nog de aantallen en cumulatieve tongbrekerroutes van vóór f211035. Ze toetsen nu de bestaande E1-vrijgave (9578 FREE / 1760 GUIDED in de gezamenlijke voorbereiding), zonder wijziging van runtime-inhoud of poorten. De structurele historische kaarttest blijft via DigiBordArchiveReview de oude 280 kaarten inclusief Story40 toetsen; tests/p0-cards-browser.cjs toetst daarnaast alle 530 huidige actieve kaarten, op vier schermformaten. De oude cards-release-test verwijst naar die volledige brongebonden opvolger. CI installeert Chrome vóór build, omdat de P0-buildpoort de echte runtime inspecteert.

Alle 570 historische records zijn individueel verantwoord. Sinds 8d764b4 zijn 480 records door de bestaande E1-adapter van metadata/bronvelden voorzien, 401 route- of modeprojecties veranderd en 40 Story Cards bewust verborgen. Deze wijzigingen zijn geregistreerd per ID; de P0-wijziging zelf herstelt uitsluitend tien mediakoppelingen en behoudt de actuele broninstructies. Geen overige bronvelden veranderd. De overige 272 beeldbankassets blijven zonder nieuwe kaartkoppeling bewaard op Drive.
