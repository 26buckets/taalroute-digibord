# Controleverslag · acht nieuwe kaarten

**Status: KANDIDAAT · lokaal gereed · publicatie gesloten.**

De volledige `npm test`-reeks met **26 testonderdelen** is geslaagd. Vervolgens is de aanvullende controle met zeven hogere worpen door de tunnels, kabelbaan en bruggen geslaagd; deze staat nu ook in `npm test` als 27e onderdeel. De nieuwe acht-kaartencontrole is daarnaast afzonderlijk uitgevoerd. Na de visuele verfijning van de kasteelbrug is de gerichte Kasteel-controle opnieuw geslaagd. De volledige uitvoer staat in [Testuitvoer.txt](Testuitvoer.txt).

## Beelden en spelroute

- Alle acht definitieve beelden visueel gecontroleerd, zowel afzonderlijk als in het [kaartoverzicht](Kaartoverzicht.png). De reeks sluit aan bij de gedetailleerde geschilderde familie van Haven en Rotterdam.
- Exact 12, 16, 20, 24, 28, 24, 30 en 28 gekleurde vakken, met de vier vormen in de vastgelegde volgorde. Start en finish zijn aanvullend. De route en vakken zitten in het beeld; geen zichtbare losse vectorvakken.
- Pion- en klikcentra op de definitieve geschilderde tegels afgestemd. Onbedoelde zijroute bij Kasteel verwijderd; ontbrekend eindvak en verkeerde finish bij Bergdorp hersteld vóór integratie.
- Alle gewone stappen en passages op 1.001 tijdstippen in beide richtingen bemonsterd: juiste aansluitingen, eindpunten en eindige coördinaten; geen zichtbare positiesprongen.
- Tunnels volledig onzichtbaar in de ondergrondse fase. In- en uitloop en beide monden van Onderwaterwereld, Jungle, Woestijn en Kasteel visueel van dichtbij gecontroleerd. Voor de opening staat de pion vóór de rand; dieper in de opening geldt het masker.
- Junglebrug, kasteelbrug en bonenboog als echte beweging bekeken. De kasteelroute is na deze controle naar het midden van het houten dek verlegd en opnieuw gecontroleerd. Voorste constructies bedekken de pion waar nodig.
- Kabelbaan: instappen, schuin reizen en uitstappen; pion en cabine delen hun positie tijdens de rit. De cabine heeft een achter- en voorzijde. De pion past binnen de cabine. De geparkeerde cabine staat naast vak 14 en houdt het nummer leesbaar.
- Echte worpen over alle nieuwe tunnels en de kabelbaan, inclusief hoger doorlopen, terugnemen, afbreken tijdens de passage, minder beweging en finish bij een te hoge worp. Voorbeelden behouden de spelstand.

## App, schermen en behoud

- 22 kaarten in beide bestaande kiezers. In de in-app-browser bevestigd via **Bediening → Wissel kaart**; Buurttuin als speelbare lokale preview geopend.
- Vier niveaus A0/A1/A2/B1 beschikbaar op alle acht kaarten. De controles voor de vier niveauroutes, 960 gespreksopdrachten, 240 directe vragen, zinnen maken, werkvormen, 20 pionnen, beurtvolgorde, hulp/voorbeeld, opslaan/herladen en geluid zijn geslaagd.
- Nieuwe kaarten gecontroleerd op 320, 390, 768, 1280 en 1920 px breedte: geen horizontale pagina-overloop, route binnen het kaartvlak, correcte aantallen klikvlakken, unieke ID’s en geladen media zonder fouten.
- Kaart- en labelcontrole op alle 22 kaarten geslaagd bij 1600, 1024 en 390 px. Geen botsing tussen de zichtbare plaatslabels en vaknummers in deze controles.
- Werkelijke kaartgeometrie blijft gelijk tijdens worpen op alle 22 kaarten. De bestaande controles voor fullscreen, menu’s, focus, toetsenbord, opdrachtvergroting en bediening zijn geslaagd.
- Bij een venster van **1672 × 1149 px** meet het kaartvlak **1672 × 941 px**, vanaf y=60. Het volledige schilderwerk past daarin op 1:1-schaal. Bij **1600 × 1000 px** meet het vlak **1600 × 792 px**; het schilderwerk past zonder vervorming of uitsnijden. De opdrachtstrook blijft 148 px hoog.
- **820 bestaande kaartbestanden** zijn byte voor byte gelijk aan `fc46fb2`: de voorgaande veertien kaartmodules, stijlen en beelden. Uitzonderingen zijn het uitbreidbare register en de gedeelde engine. De eerdere veertien registerregels en alle eerdere vormreeksen zijn afzonderlijk inhoudelijk vergeleken en gelijk.

## Bewijs en grenzen

[Machinaal verslag van de acht kaarten](QA-resultaten.json), [beelden en bestandshashes](Beeldmanifest.json), [kasteelcontrole na de laatste aanpassing](Kasteel-eindcontrole.txt), [hogere worpen door passages](Doorgangscontrole.txt) en screenshots onder [Voorbeelden](Voorbeelden/) zijn lokaal bewaard.

De richtduur van korte kaarten is een lesinschatting en geen gemeten klasproef. De visuele controle omvat de volledige kaartbeelden en close-ups van de bijzondere passages; dit is geen claim dat ieder mogelijk scherm of iedere beweging met iedere pionverdeling afzonderlijk handmatig bekeken is. Er is niet gepusht of gepubliceerd.
