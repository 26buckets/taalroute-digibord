# Taalroute DigiBord V01.24

De volledige actuele app, met curriculum, kaartspellen, speelborden, dobbelspellen, woorden en zinnen en de vernieuwde opdrachtenbanken.

## Ontwikkelen en controleren

`npm ci`, gevolgd door `npm test`, `npm run test:activities`, `npm run lint`, `npm run types` en `npm run build`.

Serveer `dist/` met een lokale webserver. De app heeft geen externe runtime-afhankelijkheden. Browserchecks staan in de GitHub workflow en gebruiken Chrome.

## Banken

960 gespreksopdrachten en 240 aparte Snelvragen. `npm run check:banks` vergelijkt de canonieke JSON en browserbundles in `Lessen/` met de actieve losse data en ingebouwde runtime. Zie BANKEN-V2-INTEGRATIE.md. Tongbrekers heeft een eigen bank: 161 bronrecords, waarvan 142 speelbare tongbrekers en 19 bewaarde uitspraakzinnen.

## Publiceren en terugzetten

De bestaande Cloudflare Worker `taalroute-digibord` publiceert uitsluitend `dist/`. Na alle controles: `npx wrangler@4.135.0 deploy`. Publicatie vereist toestemming; GitHub CI publiceert niet zelfstandig.

De oude app blijft volledig bereikbaar in Git onder `archive/pre-v0124-20260921`. Er staan geen oude applicatiebestanden in deze nieuwe publicatiemap. Bestaande hoofdingangen Praatpad.html en Start-Praatpad.html verwijzen naar de nieuwe startpagina.

Voor onmiddellijk herstel naar de voorafgaande Cloudflare-versie: `npx wrangler@4.135.0 rollback 0e86621f-e71f-4195-89c3-a7b58bcb04f5`. Leg een herstelactie vast; synchroniseer daarna bewust met Git. Wis geen browseropslag.
