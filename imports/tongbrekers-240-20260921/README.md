# Tongbrekers — 240 kaarten aangesloten

Bron: [Taalroute Tongbrekers Definitieve Bank 2026 09 21](https://docs.google.com/document/d/1an4zsAiWIlaSmouU5mlXv1h2B4BVH19UtUMX8nI1QKY/edit), bijgewerkt 21 september 2026 14:14:55 UTC. `source.txt` bewaart de volledige opgehaalde tekst, alleen regeleinden zijn genormaliseerd. Kaartteksten, klankvallen en moeilijkheden zijn letterlijk uit deze bron overgenomen.

| Brongroep | Kaarten | Instapniveau |
|---|---:|---|
| A0 | 60 | A0 |
| A1 | 60 | A1 |
| A2 | 60 | A2 |
| B1–C2, gedeelde bank | 60 | B1 |
| Totaal | 240 | |

De hogere bank wordt één keer opgeslagen, niet viermaal gekopieerd. De niveau-indeling is volgens de bron een praktische redactionele inschatting, geen officiële ERK-classificatie. Het bestaande filter **t/m niveau** geeft met deze bank 60, 120, 180 en vervolgens 240 kaarten bij B1–C2. Dat is cumulatief; iedere afzonderlijke brongroep bevat 60 kaarten.

## Integratiestatus

De volledige bank is aangesloten op `data/tongbrekers.json`, de geladen JS-bundle en de audiomatrix: 240 kaarten en 240 opnames. De 94 eerdere opnames zijn exact behouden; de 146 aanvullingen zijn voltooid. Geen kaarttekst is gewijzigd. De vorige 161 records/142 speelbare kaarten zijn veilig bewaard in `before-activation-20260921/`, met hashes en broncommit.

Opgeslagen Tongbrekers-posities worden op kaart-ID overgezet, rekening houdend met het eerdere filter. Valt de oude kaart buiten de nieuwe selectie, dan verschijnt een melding en start de selectie bij de eerste kaart. Groepen, bordstanden en overige instellingen worden niet gewijzigd. De kleine migratiebundle bevat alleen oude IDs, niveaus en moeilijkheid, geen oude kaartteksten of oude applicatie.

Lokale inhouds-, audio-, filter-, regressie-, lint-, type- en buildcontroles zijn geslaagd. De complete browsercontroles draaien vóór samenvoegen via GitHub Actions; de publicatie volgt via main. `imports/` en de back-up komen niet in de online build. Zie `INTEGRATIEVERSLAG.md` en de bijbehorende PR voor de werkelijk uitgevoerde controles en publicatiestatus.

## Bestanden

- `tongbrekers-240.json`: 240 volledige records in de bestaande bankstructuur, met extra bronnummering en `soundFocus`.
- `tongbrekers-240.js`: dezelfde 240 records als direct bruikbare `window.DIGIBORD_DATA.tongueBank`-bundle. Andere runtimebanken blijven intact.
- `source.txt` en `manifest.json`: herkomst, brondatum, hashes, tellingen en eerlijke integratiestatus.
- `migration.json`: 94 behouden IDs bij exact gelijke tekst, 146 nieuwe IDs en 67 eerdere records die niet in deze definitieve selectie staan. 21 bestaande kaarten krijgen volgens de nieuwe bron een andere niveau-/moeilijkheidsindeling. Geen oude ID wordt aan een andere tekst toegewezen.
- `audio-plan.json`: 94 bestaande opnames zijn op exacte tekst en bestandshash gecontroleerd. Alle 146 aanvullingen zijn nu gekoppeld: 140 nieuw gegenereerde opnames en zes exact passende opnames teruggevonden in de ElevenLabs-geschiedenis. Geen ontbrekende audio meer.
- `tongbrekers-audio-240.json`: de volledige audiomatrix met stemmen, modellen, bronbestanden, duur, volume en bestandshashes.
- `AUDIOVERSLAG.md`: uitgevoerde audiocontroles en status.
- `validate.cjs`: controleert alle bronteksten, tellingen, unieke IDs/teksten, JSON/bundle-pariteit, audioverwijzingen, 28 filtercombinaties en alle 240 teksten met de bestaande renderfuncties.

Controle vanuit de repository:

```sh
node imports/tongbrekers-240-20260921/validate.cjs
```

## Aansluiting bij daadwerkelijke inbouw

1. Maak een nieuwe back-up van de dan actieve Tongbrekers-JSON, JS-bundle en audiomatrix. Bewaar oudere gegevens als historie.
2. Alle 240 kaarten hebben audio. Behoud de aangeleverde bestanden en controleer de hashes met de pakketvalidator. De oorspronkelijke 94 opnames zijn byte voor byte behouden.
3. Gebruik deze JSON als nieuwe bron voor `data/tongbrekers.json` en de overeenkomstige JS-bundle voor `data/tongbrekers.js`. Neem `tongbrekers-audio-240.json` over als `data/tongbrekers-audio.json` en werk de cacheversie in `index.html` bij. Wijzig geen andere kaartfamilies of bordbanken.
4. Werk de Tongbrekers-tests bewust bij naar deze nieuwe bron: de oude 88-recordindeling en 142-/161-tellingen horen bij de voorgaande bank. Behoud de tests voor andere families, opnames, filters, terugzetten en voortgang.
5. Controleer de actieve kaart-ID en huidige filters/voortgang bij een bankwissel. Een verdwenen kaart mag niet ongemerkt naar een andere tekst op dezelfde positie verwijzen.
6. Draai de inhouds-, regressie-, browser- en buildcontroles. Test alle 240 kaarten en lange hogere-niveaukaarten in de browser. De rendertest in dit pakket vervangt die volledige integratiecontrole niet.
7. Publiceer pas na de afgesproken controle via de bestaande PR/main-route.

Geen menselijke review of lespilot is door deze technische voorbereiding uitgevoerd of als afgerond geregistreerd. De door het document opgegeven redactionele status is behouden als broninformatie.
