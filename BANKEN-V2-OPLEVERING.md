# DigiBord — banken v2 en lokale synchronisatie

Gecontroleerd op 21 september 2026.

## Resultaat

Alle vier gespreksbanken en de Snelvraagbank hebben dezelfde inhoud op GitHub en in de actieve lokale DigiBord Complete V01.24. De afzonderlijke Kaartenkast, woordkaarten, nieuwe activiteiten, borden, curriculum en nieuwste lokale bediening zijn behouden.

| Bank | Kaarten | GitHub `main` | Actieve lokale V01.24 |
|---|---:|---|---|
| A0 → A1 v2 | 240 | Gereed | Geïntegreerd en getest |
| A1 → A1+ v2 | 240 | PR 5 behouden | Achterstand hersteld |
| A1 → A2 v2 | 240 | Kernteksten behouden | Gelijk aan bron |
| A2 → B1 v2 | 240 | Kernteksten behouden | Gelijk aan bron |
| Snelvraagbank v2 | 240 | Gereed | Aparte oefening beschikbaar |

Totaal: 960 gesprekskaarten en 240 Snelvragen. Alle 1.200 bestaande IDs behouden. De 638 lokale hulp-, criterium- en partnercorrecties zijn ook naar de GitHub-bron teruggebracht.

A0 → A1: alle 240 kaarten herzien; 228 opdrachtformuleringen gewijzigd en 12 behouden. Snelvragen: alle 240 records gereviewd; 41 vraagformuleringen gewijzigd en 199 behouden. Dit betreft AI-redactie en technische controle; geen onafhankelijke menselijke review of lespilot.

## Welke lokale app is bijgewerkt?

De actieve map is:

`/Users/nicoknoester/Documents/Codex/2026-09-20/referenced-chatgpt-conversation-this-is-an/outputs/Taalroute-DigiBord-V01.24`

De app werkt via [de bestaande lokale server](http://127.0.0.1:8899/index.html), en rechtstreeks via `index.html` in die map. Het tabblad van de lokale server is herladen. Ververs een eventueel al geopend rechtstreeks lokaal tabblad zelf om ook daar de nieuwe versie te laden. Op een speelbord kies je **Bordopties → Oefening → Snelvragen**. Per geselecteerde route zijn er 240 gesprekskaarten, 60 Snelvragen of 300 in de expliciete mix.

De nieuwe ZIP bevat dezelfde actuele app en alle benodigde bestanden voor offline gebruik. Ontwikkelafhankelijkheden, tijdelijke testafbeeldingen en de dubbele `dist`-map zijn weggelaten. `index.html` is de ingang. Broncontroles en tests zijn wel opgenomen; controlesommen zijn na het verpakken gecontroleerd.

De bestaande algemene download `Taalroute-DigiBord-V01.24.zip` is eveneens bijgewerkt; de vorige ZIP is apart bewaard. Oudere V01.16–V01.18-browserpagina's en benoemde momentopnames zoals `bankenherstel`, `contextknoppen` en `compleet` blijven historische versies. Gebruik die niet als bron voor een nieuwe publicatie.

Ook de twee gevonden, schone GitHub-werkmappen zijn zonder overschrijven van lokale wijzigingen bijgewerkt naar dezelfde mergecommit:

- `2026-09-12/ik-wil-een-volgend-onderdeel-maken/outputs/DigiBoard` — stond nog op `7b6597a`.
- `2026-09-21/referenced-chatgpt-conversation-this-is-an-5/work/github-main` — stond nog op `a48bdbe`.

Beide paden liggen onder `/Users/nicoknoester/Documents/Codex/`. De bankcontrole is in beide mappen uitgevoerd.

## GitHub en publicatie

[PR 6](https://github.com/26buckets/taalroute-digibord/pull/6) is gemerged. Mergecommit: `01ea4702aaa4d02731a25063dcfb52b6db2affc7`.

De volledige V01.24-interface is nog een afzonderlijke lokale ontwikkelversie. Deze PR brengt de bankinhoud en bescherming op GitHub; hij vervangt niet de GitHub-app door de volledige lokale app.

De live bankbestanden op `digibord.taalroute.nl` konden bij deze controle niet rechtstreeks worden gelezen: de server gaf HTTP 403. De live inhoud is daarom niet als gelijk bevestigd. Er is geen handmatige Cloudflare-publicatie uitgevoerd; de bestaande automatische Cloudflare-build is een afzonderlijk kanaal.

## Voorkomen dat werk verloren gaat

- De bankbronnen, browserbundels en lokale build worden op inhoud, IDs en vastgelegde hashes gecontroleerd. Afwijkingen laten de test of lokale bouw stoppen.
- Een bewuste banksynchronisatie controleert eerst bron en doel, maakt een back-up, behoudt andere spelgegevens en vernieuwt de bundelcontrole en browsercacheverwijzing.
- De bestaande bestanden vóór deze integratie zijn bewaard. De nieuwe ZIP is een volledige appback-up van de eindstand.
- Voor een latere integratie van de volledige lokale app: start vanaf actuele `main`, breng de interface gericht over en behoud de bankbron en controles. Deze instructie staat ook in `AGENTS.md` bij beide versies.

Dit voorkomt ongemerkt terugzetten binnen de gecontroleerde werkwijze. Het is geen serverbeveiliging tegen het bewust verwijderen van controles of een force-push.

## Bewijs

- Volledige GitHub-regressiesuite en aanvullende banksmokes: groen op PR 6. Dezelfde 38 bestaande checks zijn over twee geïsoleerde jobs verdeeld, nadat de eerdere enkele job de limiet van 30 minuten bereikte. Geen controles geschrapt.
- Matrix, taalregressies, aantallen, unieke IDs, verdeling en bron-/bundelgelijkheid: groen.
- Lokale V01.24: alle 1.200 records door de echte opdracht-, hulp-, partner- en voorbeeldweergave; 96 volledige trekcycli zonder voortijdige herhaling.
- Niveau en oefening wisselen, herladen, Terug, verborgen voorbeelden en behoud van pionstanden: groen.
- Lokale tests, lint, types en build: groen; bankcontrole ook op de gebouwde `dist`-versie.
- 163 geometriecontroles van de speelborden; alle zeven nieuwe activiteiten en schermbreedtes van 320–1920 pixels: groen.
- Losse bankbestanden en de runtime van de uiteindelijke lokale app zijn gelijk aan de GitHub-bron.

Zie `Integratie-en-bronbehoud.md`, de CSV's en de JSON-reviewbestanden voor kaartniveau en de afbakening van de review.
