# GRAM PB 001 rollback

Deze branch publiceert niets live.

Pre import snapshot:
`a35961e4f210e553feefd80be52363a784eb5cbe`

Dat commit is de volledige CONTENT 000 ER B1 kandidaatstatus vóór GRAM IMP 002.

## Bankrollback

1. Stop vóór merge of deploy.
2. Vergelijk `staging/gram-pb001-manifest.json`.
3. Herstel de branch naar de pre import snapshot of revert de IMP 002 commits.
4. Controleer dat `data/content-vert001-er-b1.js` uit het basiscommit weer actief is en de nieuwe PB001 stagingbestanden niet geladen worden.
5. Draai `npm test`, `npm run smoke` en `npm run build`.
6. Publiceer nooit automatisch na rollback.

## Release rollback

De bestaande Cloudflare rollback uit de repository README blijft een aparte laatste noodrem. GRAM IMP 002 voert geen Cloudflare deploy uit en verandert geen liveversie.
