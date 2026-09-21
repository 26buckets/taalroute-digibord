# Tongbrekers — 240 kaarten klaar voor inbouw

Bron: [Taalroute Tongbrekers Definitieve Bank 2026 09 21](https://docs.google.com/document/d/1an4zsAiWIlaSmouU5mlXv1h2B4BVH19UtUMX8nI1QKY/edit), bijgewerkt 21 september 2026 14:14:55 UTC. `source.txt` bewaart de volledige opgehaalde tekst, alleen regeleinden zijn genormaliseerd. Kaartteksten, klankvallen en moeilijkheden zijn letterlijk uit deze bron overgenomen.

| Brongroep | Kaarten | Instapniveau |
|---|---:|---|
| A0 | 60 | A0 |
| A1 | 60 | A1 |
| A2 | 60 | A2 |
| B1–C2, gedeelde bank | 60 | B1 |
| Totaal | 240 | |

De hogere bank wordt één keer opgeslagen, niet viermaal gekopieerd. De niveau-indeling is volgens de bron een praktische redactionele inschatting, geen officiële ERK-classificatie. Het bestaande filter **t/m niveau** geeft met deze bank 60, 120, 180 en vervolgens 240 kaarten bij B1–C2. Dat is cumulatief; iedere afzonderlijke brongroep bevat 60 kaarten.

## Status en volgende push

Het pakket is voorbereid en technisch gevalideerd, maar niet aangesloten op de actieve app. De huidige 161 bronrecords/142 speelbare tongbrekers worden in deze opdracht niet vervangen. Dit pakket vervangt bij latere inbouw de volledige Tongbrekers-bank; voeg niet 240 kaarten aan de bestaande 142 toe.

Deze map is onderdeel van Git en gaat mee zodra de commit wordt gepusht. Dezelfde pakketcommit wordt ook opgenomen op de al voorbereide publicatietak `codex/taalmix-compleet`. De map `imports/` wordt niet door de productiebuild gepubliceerd of automatisch geladen. De eerstvolgende push uploadt dus het importpakket naar GitHub; spelen met de nieuwe bank vereist de hieronder beschreven aansluiting.

## Bestanden

- `tongbrekers-240.json`: 240 volledige records in de bestaande bankstructuur, met extra bronnummering en `soundFocus`.
- `tongbrekers-240.js`: dezelfde 240 records als direct bruikbare `window.DIGIBORD_DATA.tongueBank`-bundle. Andere runtimebanken blijven intact.
- `source.txt` en `manifest.json`: herkomst, brondatum, hashes, tellingen en eerlijke integratiestatus.
- `migration.json`: 94 behouden IDs bij exact gelijke tekst, 146 nieuwe IDs en 67 eerdere records die niet in deze definitieve selectie staan. 21 bestaande kaarten krijgen volgens de nieuwe bron een andere niveau-/moeilijkheidsindeling. Geen oude ID wordt aan een andere tekst toegewezen.
- `audio-plan.json`: 94 bestaande opnames zijn op exacte tekst en bestandshash gecontroleerd. Voor 146 nieuwe teksten ontbreekt nog een opname. Er zijn geen onjuiste opnames gekoppeld en er is geen nieuwe audio gegenereerd.
- `validate.cjs`: controleert alle bronteksten, tellingen, unieke IDs/teksten, JSON/bundle-pariteit, audioverwijzingen, 28 filtercombinaties en alle 240 teksten met de bestaande renderfuncties.

Controle vanuit de repository:

```sh
node imports/tongbrekers-240-20260921/validate.cjs
```

## Aansluiting bij daadwerkelijke inbouw

1. Maak een nieuwe back-up van de dan actieve Tongbrekers-JSON, JS-bundle en audiomatrix. Bewaar oudere gegevens als historie.
2. Rond de 146 ontbrekende opnames af volgens de bestaande audioafspraken, of leg bewust vast dat die kaarten zonder voorleesknop worden aangeboden. De huidige renderer schakelt voorlezen uit als `audio.src` ontbreekt. Dit pakket is tekstueel klaar; volledige audio is nog niet gereed.
3. Gebruik deze JSON als nieuwe bron voor `data/tongbrekers.json` en de overeenkomstige JS-bundle voor `data/tongbrekers.js`. Werk de audiomatrix en cacheversie in `index.html` bij. Wijzig geen andere kaartfamilies of bordbanken.
4. Werk de Tongbrekers-tests bewust bij naar deze nieuwe bron: de oude 88-recordindeling en 142-/161-tellingen horen bij de voorgaande bank. Behoud de tests voor andere families, opnames, filters, terugzetten en voortgang.
5. Controleer de actieve kaart-ID en huidige filters/voortgang bij een bankwissel. Een verdwenen kaart mag niet ongemerkt naar een andere tekst op dezelfde positie verwijzen.
6. Draai de inhouds-, regressie-, browser- en buildcontroles. Test alle 240 kaarten en lange hogere-niveaukaarten in de browser. De rendertest in dit pakket vervangt die volledige integratiecontrole niet.
7. Publiceer pas na de afgesproken controle via de bestaande PR/main-route.

Geen menselijke review of lespilot is door deze technische voorbereiding uitgevoerd of als afgerond geregistreerd. De door het document opgegeven redactionele status is behouden als broninformatie.
