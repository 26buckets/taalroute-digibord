# WZ-integratie — verificatie

Uitgevoerd op 21 september 2026 met Node.js 26.4.0 en de geïnstalleerde Google Chrome. Getest als lokale app, inclusief de gegenereerde `dist/`-build. Geen livepublicatie.

| Controle | Resultaat |
|---|---|
| `npm test` | PASS; WZ-schema, tellingen, bron-/bundelpariteit, antwoordmodelconsistentie, alle 680 WZ- en 28 historische items selecteerbaar; herhaalbare import zonder overschrijven; bestaande bank- en appcontroles |
| `npm run test:activities` | PASS; activiteiteninhoud en bediening van zeven spellen, hervatten, schermbreedtes 320–1920 en aangepaste bibliotheekroute naar taaldoelen |
| `npm run lint` | PASS |
| `npm run types` | PASS; bestaande scope is uitsluitend board-viewport.js |
| `npm run build` | PASS; schone runtimebuild, WZ-bronpariteit en ongewijzigde bestaande bankhashes |
| `npm run test:banks:browser` | PASS met CHROME_PATH; 1.200 kaarten, 96 trekcycli, route-/moduswissels, herladen, Terug, pionbehoud |
| `npm run smoke` | PASS; 2 geometriecontroles en nul browserfouten in de huidige standaardrun |
| `npm run test:tongue:browser` | PASS; 142 kaarten, 28 filtercombinaties, audio, herladen, andere spellen en schermbreedtes |
| `npm run test:words:browser` | PASS; alle 30 behouden kaarten, tikken/slepen/toetsenbord, 10 bijzinnen in beide standen, Terug, animatiebeveiliging en vier schermmaten |
| `BUILD_SMOKE=1 npm run test:wz:browser` | PASS; alle negen doelen via de interface, alle 680 WZ- en 28 historische renders, zeven vormen, niveaufilter, aanwijzingen/onthullen, open guard, gesloten antwoorden, hervatten/Terug, instellingen/pionbehoud, toetsenbord/tik en 1440/1024/390 pixels |
| Gerichte eindcontrole oorspronkelijke kaart op 1366×768 | PASS; inhoudshoogte 298 px binnen beschikbare 298 px; geen afgesneden spreekbediening |
| `git diff --check` | PASS |
| Visuele controle | Desktop en mobiel Raad bekeken; eerdere WZ-bouwkaart, smalle spreekkaart en oorspronkelijke bouwkaart eveneens bekeken |

Bij de eerste browserrun ontbrak de door Playwright verwachte gedownloade Chromium. De bestaande test ondersteunt CHROME_PATH; met de geïnstalleerde Chrome slaagde hij. Er is geen nieuwe browserafhankelijkheid toegevoegd. Een oude UI-test koos bovendien een verborgen dobbelspelknop uit de bibliotheek; de locator is beperkt tot de zichtbare knop. De test voor de bibliotheek verwacht nu bewust eerst het taaldoelenscherm.

Niet bewezen: menselijke taal-/didactiekvalidatie, CEFR-kalibratie, functioneren met echte leerders, volledige schermlezertest, zelfstandige A0-bruikbaarheid zonder docent, complete variantendekking, oude A1–B2-Woordspelvoortgang importeren of werking van een gepubliceerde website. Deze grenzen staan ook in het integratieplan.

Historische bronvergelijking: alle 28 geïmporteerde records zijn exact gelijk aan de uit de vastgezette archiefcommit afgeleide records. De oorspronkelijke 710 centrale records zijn bij de import identiek gebleven. De WZ-browsertest is toegevoegd aan de bestaande CI-workflow.
