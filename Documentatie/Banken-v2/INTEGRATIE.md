# DigiBord — één inhoudelijke bankbasis

Peildatum: 21 september 2026. De GitHub-bankbron en de werkende lokale DigiBord Complete V01.24 hebben dezelfde bankinhoud. De app-shells zijn verschillend; dit document maakt geen aanspraak op UI-pariteit of livepublicatie.

## Geconstateerde beginsituatie

GitHub `main` stond op `7a738865cadb151622721241de816f690a655d9b` (PR 5). De lokale app op poort 8899 draaide uit `Taalroute-DigiBord-V01.24`, een zelfstandige map zonder `.git`.

- A1 → A1+ v2: wel op GitHub, nog niet lokaal. Alle 240 opdrachten, situaties, hulpteksten, modellen, oefendoelen en extra stappen verschilden.
- A1 → A2 en A2 → B1 v2: kernteksten al lokaal aanwezig. De lokale app had bovendien 638 betere velden die nog niet op GitHub stonden: 240 hulpteksten, 240 criteria en 158 partnerinstructies. Deze zijn op ID en veld teruggebracht naar de GitHub-bron.
- A0 → A1: beide versies hadden de oude bank.
- Directe vragen: 240 records in de oude GitHub-app, nog geen bank of bediening in V01.24.
- De Kaartenkast van 320 kaarten, de 30 woordkaarten, nieuwe activiteiten, curriculum, borden en vormgeving zijn andere gegevens en blijven behouden.

## Nieuwe bankinhoud

| Bank | Aantal | Verdeling | Wijziging |
|---|---:|---|---|
| A0 → A1 v2 | 240 | 60 per vorm, 40 per onderwerp | Alle records herzien; 228 nieuwe opdrachtformuleringen, 12 bruikbare formuleringen behouden |
| A1 → A1+ v2 | 240 | 60 per vorm, 40 per onderwerp | Volledige PR-5-inhoud ongewijzigd overgenomen naar de lokale app |
| A1 → A2 v2 | 240 | 60 per vorm, 40 per onderwerp | Kernteksten behouden; lokale hulp-, criterium- en partnercorrecties behouden |
| A2 → B1 v2 | 240 | 60 per vorm, 40 per onderwerp | Kernteksten behouden; 74 lokale partnercorrecties behouden |
| Snelvraagbank v2 | 240 | 60 per route, 15 per vorm | Alle records gelezen en ondersteuningsvelden herzien; 41 vraagformuleringen veranderd, 199 bruikbare vragen behouden |

Alle 1.200 bestaande kaart-ID's blijven behouden. A0 → A1 heeft 240 unieke opdrachten en 238 unieke modellen. De Snelvraagbank heeft 240 unieke vragen en 239 unieke modellen. Korte functionele uitdrukkingen mogen terugkomen: tekstuele uniciteit is geen reden om een beginnerstaak moeilijker te maken. Er zijn geen verzonnen extra kaarten om aantallen te vullen.

A0 → A1 vraagt één mededeling, vraag, keuze of verzoek. De docent kan vooraf voorlezen en mondeling voordoen; A0 is geen zelfstandige leestoets. Verplichte redenen en extra gegevens horen niet bij de kern. A1 → A1+ biedt meer eigen gegevens of een kleine uitbreiding. De bestaande hogere banken blijven referentie, geen automatische tekstmal. Dit zijn didactische routes, geen officiële ERK-toetsen. De boekreeksen en routes boven B1 vallen buiten deze revisie.

Snelvragen worden rechtstreeks aan de cursist gesteld. Vierkant betekent daar **Beantwoord** en ruit **Reageer**. De gesprekbank vraagt onder meer zelf vragen formuleren. Alleen **Mix van beide** combineert beide voorraden. De 320 Kaartenkast-kaarten worden niet bij deze 1.200 bordkaarten geteld.

## Drie redactierondes en bewijsgrens

1. Alle A0-kaarten herschreven of bewust behouden op betekenis, vorm en variatie; alle directe vragen en modellen gelezen. De tien formuliercorrecties en vele identieke leen-/winkelopdrachten zijn vervangen door uiteenlopende eenvoudige taalhandelingen.
2. Opdracht, situatie, hulp, mogelijk antwoord, partner en observeerbaar doel op elkaar afgestemd. Bij Snelvragen zijn onduidelijke verwijzingen en strijdige vervolgvoorstellen hersteld; bij een ontkennend antwoord is een onmogelijke ervaringsvraag niet verplicht.
3. IDs, verdelingen, bronbehoud, modellen, korte instructies, browserweergave en import gecontroleerd. De lokale renderer is met alle 1.200 records getest; beide applicaties zijn op alle vier routes en vormen gecontroleerd.

Dit zijn eigen AI-redactie en technische controle. Geen onafhankelijke menselijke review of lespilot uitgevoerd. De status `review3-go` is uitsluitend die afgebakende redactionele/technische status. De CSV's en reviewbestanden zijn leesbare exports van dezelfde bankbron, geen afzonderlijke productiebanken. Oudere Google Sheets zijn historische reviews; ze zijn in deze opdracht niet overschreven en zijn geen invoerbron voor de runtime.

## Bestandsketen en bescherming

| Kanaal | Gesprekbank | Snelvraagbank |
|---|---|---|
| GitHub-bron | `Lessen/opdrachtenmatrix.json` | `Lessen/directe-vragen.json` |
| GitHub-runtime | `Lessen/opdrachtenmatrix-data.js` | `Lessen/directe-vragen-data.js` |
| Lokale V01.24 | `data/opdrachtenbank.json` | `data/snelvragen.json` |
| Lokale browserbundel | `DIGIBORD_DATA.taskBank` | `DIGIBORD_DATA.directBank` |
| Lokale build | dezelfde bestanden onder `dist/` | dezelfde bestanden onder `dist/` |

`manifest.json` legt beide bronhashes vast. `npm run check:banks` vergelijkt de inhoud, IDs, verdeling en gegenereerde browserdata. De lokale build voert deze controle vóór het bouwen uit. Oude bankbestanden terugzetten zonder bewuste herziening laat de controle mislukken. De guard is geen server-side branchbeveiliging en kan geen willekeurige force-push of bewust verwijderen van tests verhinderen.

`node scripts/sync-banks.cjs /pad/naar/de/lokale-app` synchroniseert alleen de twee banken en hun records in de self-contained bundel. Het controleert bron én huidige doelrevisie en maakt eerst een bankback-up. Onbekende of lokaal gewijzigde bankversies worden geweigerd; vergelijk die eerst per ID/veld. Bouw daarna de lokale app opnieuw om `dist/` en een nieuwe ZIP bij te werken. Oude ZIP's blijven historische back-ups.

Bij het later overbrengen van de volledige V01.24-app naar GitHub: begin vanaf actuele `main`, behoud de bankbron en guard, breng de nieuwe app-shell gericht over en controleer de twee bron-/runtimeketens opnieuw. Een volledige mapkopie over een verouderde checkout is geen veilige integratieprocedure. Bankpariteit betekent niet dat de gehele nieuwe V01.24-interface al op GitHub staat.

## Uitgevoerde controles

- Matrix, Nederlandse taalregressies, IDs en veldvalidatie.
- Alle 1.200 kaarten via de V01.24-renderer: opdracht, situatie, hulp, model, partner en criterium.
- 96 volledige trekcycli: gesprek, direct en mix × vier routes × vier vormen × twee cycli. Geen herhaling vóór uitputting; geen onbedoelde vermenging.
- Echte bediening: oefening en niveau wisselen, andere opdracht, verouderde opgeslagen tekst vervangen op ID, herladen, Terug, verborgen voorbeeld en onveranderde pionstanden.
- 32 combinaties bank × route × vorm via de GitHub-app en de bestaande Snelvraag-UI-test.
- Lokale lint-, type-, regressie- en buildcontrole; overige activiteiten en schermbreedtes 390, 1024 en 1440 pixels.
- De brede GitHub-regressiesuite draait daarnaast vóór samenvoegen. De verouderde stoeltekst in `quick-lesson-ui.cjs` is vervangen door controle van het gekozen kaart-ID en de actuele broninhoud; selectie, zoekresultaat, niveauovergang en pionbehoud blijven getest.

Actuele uitvoer en definitieve commit staan in het opleververslag van de taak. Geen handmatige Cloudflare-publicatie uitgevoerd.
