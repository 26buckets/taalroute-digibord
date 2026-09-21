# Technische integratie Tongbrekers 240 — 21 september 2026

- Oude bank: 161 records, 142 speelbare tongbrekers en 19 bewaarde uitspraakzinnen.
- Nieuwe actieve bank: 240 unieke, brongetrouwe tongbrekers; 60 per brongroep A0, A1, A2 en B1–C2. Cumulatieve filters: 60 / 120 / 180 / 240.
- Audio: 94 eerdere opnames byte voor byte behouden; 146 aanvullingen gekoppeld (140 nieuw, zes teruggevonden). Alle 240 hashes en tekstkoppelingen gecontroleerd. Geen ontbrekende opname.
- Back-up: `before-activation-20260921/`, inclusief bank, browserbundle, audiomatrix en manifest met broncommit, datum, tellingen en hashes.
- Runtime: `data/tongbrekers.json`, `data/tongbrekers.js`, `data/tongbrekers-audio.json`; cacheverwijzingen in `index.html` vernieuwd. De bronrecords in het importpakket en de actieve bank zijn exact gelijk.
- Voortgang: migratie op bestaand kaart-ID met de eerdere selectiegegevens; verdwenen of uitgefilterde kaart geeft een melding. Andere spellen, bordstanden en deelnemers blijven behouden.
- Controle: bronvalidator, alle 240 rendereruitvoeren, 28 filtercombinaties, audiobestanden, terugzetgedrag en regressies van zeven andere families geslaagd. `npm test`, lint, types, build, deploymentcontrole en activiteiteninhoud lokaal geslaagd.
- Browsercontrole: volledige bestaande GitHub Actions-suite vereist vóór samenvoegen, inclusief alle 240 kaarten, filters, audiofouten, herladen, terug, zes schermmaten, borden, Verhaalworp, WZ en de recent gepubliceerde C1-bank. Geen lokale browsercontrole geclaimd: deze sessie blokkeert de lokale server en file-URL. De PR/checkresultaten leggen de uiteindelijke CI-status vast.
- Technische status: geïntegreerd en lokaal gevalideerd; externe browsertest en online verificatie volgen in de PR en taakoplevering.
- Menselijke review: niet door deze taak uitgevoerd. Lespilot: niet uitgevoerd. Geen volledige menselijke luisterreview geclaimd.
- Publicatie: door gebruiker opgedragen; pas na geslaagde controles samenvoegen en werkelijke website controleren. De gepubliceerde commit wordt in de taakoplevering vermeld.

## Publicatie geblokkeerd in deze sessie

De lokale release bevat ook main-commit `8e836c6` (C1-bank). Alle lokale controles zijn opnieuw geslaagd. De sessie is daarna beperkt tot lokale schrijftoegang zonder netwerkrechten voor de terminal; GitHub-schrijfopdrachten via de connector worden geweigerd met `MCP tool call requires approval, but approval policy is never`. Er is geen PR aangemaakt en geen wijziging naar main gepubliceerd door deze taak. De externe browsercontroles en publieke verificatie zijn nog niet uitgevoerd. Hervat vanuit branch `codex/tongbrekers-240-online` zodra GitHub-schrijf- en netwerktoegang zijn toegestaan; publiceer pas na de volledige controles.
