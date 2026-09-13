# Woordspel in Praatpad

Woordspel is ingebouwd in Start-Praatpad.html. Kies Instellingen → Spelvorm → Woordspel. Stel daar oefenvorm, niveau, serie en opdracht in. Bij Bouw een zin kun je daar ook de namen van de zinsdelen aanzetten. Klik op Speel Woordspel om te beginnen. De speeltafel bevat de spelbediening; Spelinstellingen brengt je terug naar dit centrale instellingenpaneel.

Vier spelvormen: Maak en verander, Beschrijf en raad, Combineer en beschrijf en Bouw een zin. De eerste collectie bevat 13 werkwoorden, 5 zelfstandige naamwoorden met 7 passende eigenschappen, 16 raadwoorden en 12 bouwzinnen. A1–B2 zijn didactische startinstellingen; het niveau van een oefening hangt ook af van de opdracht en begeleiding. De Excel-verzameling is nog niet geïmporteerd.

Woorden vastzetten, afzonderlijk vervangen, zes opdrachten kiezen of werpen, voorbeelden onthullen en zinsdelen aantikken/verslepen zijn beschikbaar. De docent en cursisten beoordelen de gesproken antwoorden samen.

## Onderhoud

- woordspel-content.js: eigen startcollectie en opdrachten; gescheiden van de bediening.
- woordspel.js: speeltafel, bediening, validatie en hervatten.
- woordspel.css: vormgeving die aansluit op Praatpad.
- Start-Praatpad.html: laadt de twee scripts en bevat de kleine PraatpadWordspelHost-brug. Behoud die integratie bij het opnieuw samenstellen van het HTML-bestand.
- De module leest/schrijft uitsluitend data.wordspel binnen de bestaande lesopslag. De bestaande reservekopiefunctie neemt dit veld automatisch mee. Pionnen, geschiedenis, groepen en beelddobbelsteen blijven behouden.
- Voorbeelden en onthulde raadwoorden worden bij herladen afgedekt. Woordkeuzes, vastzetten en gedeeltelijk gebouwde zinnen blijven bewaard.
- Bewaar de map Woordspel naast Start-Praatpad.html. De module heeft geen internetverbinding of account nodig.

Getest op 12 september 2026: alle spelvormen en niveaus, filters, vastzetten, voorbeelden, alle zes worpen, aantikken, slepen, toetsenbord, herladen, twee vensters, reservekopie, ongeldige opgeslagen modulegegevens, direct openen vanaf schijf en schermen van 360 tot 1920 pixels breed. De speeltafel past op de geteste digibordformaten vanaf 1024×768 en 1280×720. Dit zijn functionele controles; een lespilot met cursisten blijft de volgende inhoudelijke stap.

De gekozen spelvorm staat in settings.diceStyle (numbers, verbs of wordgame). De les opent na herladen met de gekozen spelvorm. De module-instellingen staan in data.wordspel. Getest na deze integratie: alle vier oefenvormen en niveaus, wisselen tussen de drie spelvormen, zes opdrachtworpen, labels, herladen, bewaarde bord- en beeldvoortgang, synchronisatie tussen vensters en desktop/mobiele opmaak.


## Vrij instelbare speeltafel

Bij Maak en verander bepaalt de docent welke van zeven kaartsoorten meedoen, onafhankelijk van het niveau. De vaste leesvolgorde is subject → werkwoord → tijd → aanvulling → plaats → tweede werkwoord → verbinding. Er moet minstens één kaart blijven staan. De instellingen bieden ook snelle combinaties en aparte keuzes voor kaartsoortnamen en voorbeeldhulp.

woordspel-table.js bevat de bijpassende aanvullingen, tijden, plaatsen en verbindingen, de keuzeregels en de voorbeeldzinnen. Het bestand wordt na woordspel-content.js en voor woordspel.js geladen. De bestaande opslagversie wordt uitgebreid met state.table; oude lessen behouden twee kaarten. Voortgang, keuzevakken, hulpinstellingen en vastzetten worden bewaard en meegenomen in reservekopieën.

Met de tweede werkwoordkaart aan vormt het eerste werkwoord een passend paar: hebben + gewerkt, zijn + opgestaan of willen + werken. Kies in de instellingen een voltooid deelwoord of infinitief. Bij een specifieke opdracht kan de vorm vaststaan. Bij werkwoorden met zich wordt de hele basisvorm ook op de tweede kaart vermeld. De cursist vervoegt het eerste werkwoord en bepaalt zelf de uiteindelijke woordvolgorde; de tafel is geen automatische beoordeling van een gelegde zin.

Vastgezette aanvullingen en plaatsen beperken de mogelijke werkwoorden. Een vastgezet tweede werkwoord houdt ook de bijbehorende woordkeuze vast. Opdrachtworpen kiezen uit opdrachten die passen bij de vaste kaarten. Expliciete nieuwe instellingen kunnen een niet-passende kaart loslaten; het instellingenpaneel meldt dat.

Gecontroleerd met 34.290 combinaties van kaartselectie, niveau, opdracht en werkwoord, plus gerichte controles op inversie bij jij, wederkerige en scheidbare werkwoorden, voltooid deelwoord/infinitief, passende hulpwerkwoorden, vaste kaarten, opdrachtkeuze en oude/onvolledige opslag. Kaartselectie, bewaren, voorbeeldweergave en instellingen zijn ook in de app gecontroleerd.
