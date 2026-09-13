# Bos: langs de boom bij vak 31–36

Lokale correctie, 13 september 2026. Niet gepubliceerd.

De boomlaag bedekte de pion ook wanneer het pad bij vak 34 vóór de wortels langs loopt. Daarnaast verwees het voorbeeld ‘Langs de boom’ nog naar vak 1–3.

De bestaande boom behoudt positie en afbeelding. In `Kaarten/ruimtewerking.js` heeft deze boom een eigen dieptedrempel op y=527, tussen vak 33 (y=497) en vak 34 (y=557). De schermpositie wordt teruggerekend naar de oorspronkelijke kaartcoördinaten. Daardoor werkt dezelfde overgang tijdens bewegen, stilstaan, teruglopen en op verschillende schermformaten. Vak 31–33 behoudt de achterlaag, vak 34–35 krijgt de voorlaag; voorbij de boom bij 36 is geen overlap meer. De tunnelregels blijven voorgaan tijdens tunnelbewegingen.

Het voorbeeld in `Kaarten/bos-bosroute.js` volgt nu vak 31–36.

## Controle

`tests/forest-tree.cjs` is geslaagd: stationaire pionnen op vak 31–36 bij 788 en 1672 px vensterbreedte; een echte worp van 30 naar 36; bemonstering van de diepte tijdens lopen; het voorbeeld vooruit en achteruit; dezelfde opgeslagen spelstand na beide voorbeelden; geen browserfouten.

De close-ups van vak 33 en 34 zijn visueel gecontroleerd. De bestaande les in de lokale preview is behouden.

Volledige `npm test`: geslaagd, alle 23 onderdelen. Dit omvat alle elf kaartwerelden, tunnelmonden, labels, voorgrondlagen, voorbeeldbewegingen, annuleren, opslag, spelvormen, toetsenbord en geluid.

![Vak 33: achter de boom](vak-33.png)
![Vak 34: vóór de wortels](vak-34.png)
