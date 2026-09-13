# Controleverslag · drie nieuwe kaarten

**Uitkomst:** lokale kandidaat gereed. Geen push of publicatie uitgevoerd voor deze uitbreiding.

## Getest

Alle 25 testonderdelen van `npm test` zijn uitgevoerd en geslaagd. De eerste volledige run stopte bij een oude testaanname dat iedere kaart meer dan twintig vakken heeft. Die aanname is vervangen door controle tegen het exacte aantal vakken in het appregister. Het betreffende onderdeel is opnieuw uitgevoerd, gevolgd door de resterende onderdelen. Na de laatste aanpassing van de looplijnen is ook de volledige nieuwe-kaartencontrole opnieuw geslaagd. De cachecontrole is opnieuw uitgevoerd. Na de gebruikerscorrectie zijn pad en vakken meegeschilderd, is de vectorlaag verwijderd en is de nieuwe-kaartencontrole opnieuw uitgevoerd.

- **Geschilderde route:** de definitieve PNG’s bevatten zichtbaar alle twaalf, zestien en dertig vakken, de verbindende route en start/finish. De telling en vier vormreeksen zijn visueel gecontroleerd. De app gebruikt geen losse zichtbare vectorvakken; dit wordt ook automatisch gecontroleerd. De klik-/pioncentra zijn op het schilderwerk afgestemd.
- **Aantallen:** Markt 12, Station 16, Poolwereld 30; plus een start en finish per kaart. Veertien opties in beide kaartkiezers.
- **Behoud:** alle 807 bestaande kaartbestanden, buiten het uitbreidbare register, zijn byte voor byte gelijk aan tag `kaartbasis-11-werelden-2026-09-13`. De elf oorspronkelijke registerregels en vormreeksen zijn inhoudelijk gelijk. De bestaande opdrachtenbanken zijn niet gewijzigd.
- **Route:** alle routepunten en tussenpunten zijn eindig en sluiten aan. Alle stappen zijn in beide richtingen op 1.001 tijdstippen bemonsterd. Geen zichtbare sprongen tijdens de nieuwe tunnelpassages.
- **Tunnels:** 8–9 bij Station en 12–13 bij Poolwereld. Inlopen, volledige onzichtbaarheid, verschijnen en uitlopen werken. De pion staat buiten de mond vóór de rand. Beide monden zijn ook visueel van dichtbij gecontroleerd.
- **Lift:** tussen 24 en 25; verticale beweging met gelijke coördinaten voor pion en platform, achterwand achter de pion en hekwerk ervoor. Instappen en uitstappen sluiten op de route aan.
- **Markt:** luifelvoorgrond en looplijn om de uitstalling visueel gecontroleerd. Geen extra verplaatsingen, terugstuurvakken of strafbeurten.
- **Spel:** echte worp over iedere nieuwe passage, juiste eindpositie, Terug na een worp, afbreken tijdens een passage, minder beweging, finish bij een hogere worp en voorbeeld zonder wijziging van de spelstand.
- **Lesbediening:** vier niveaus op iedere nieuwe kaart; bestaande controles voor alle oefeningen, 20 pionnen, gedeelde pion, klassikale spreker, parallelle ronde, hulp/voorbeeld, niveauwissels, geluid, herladen en afzonderlijke kaartvoortgang geslaagd.
- **Vormgeving:** 390, 768, 1280 en 1920 px voor de nieuwe kaarten. Geen horizontale pagina-overloop. Routepunten blijven binnen de kaart. De bestaande header-/menutest controleert ook smalle schermen, donker/licht, tekstvergroting, toetsenbord en fullscreen.
- **Stabiliteit:** het kaartkader verandert niet tijdens een nieuwe tunnel-/liftrit. De bestaande schaaltest slaagt tijdens echte worpen op alle veertien kaarten bij 767 × 889 px. Fullscreen en de gewone appbediening blijven werken.
- **Labels/lagen:** bestaande ruimtelijke controle en pionlaagcontrole slagen op alle veertien kaarten. Geen botsende kaartlabels en vaknummers in de geteste schermmaten. Geen dubbele DOM-ID's of ontbrekende nieuwe media.
- **Browser:** de nieuwe kaarten zijn ook via Bediening → Wissel kaart in de lokale in-app-browser geopend.

## Gemeten kaartkader

Bij een venster van **1600 × 1000 px** is het kaartkader op alle drie nieuwe kaarten **1600 × 792 px**, vanaf **y = 60 px**. Het volledige geschilderde beeld van **1672 × 941 px** wordt hierin zonder uitsnijden of vervormen geplaatst: circa **1407,3 × 792 px**. De resterende ruimte ligt aan weerszijden. De bestaande opdrachtstrook blijft **148 px** hoog.

De korte kaarten gebruiken grotere klikvlakken dan Poolwereld: Markt **86 × 60**, Station **86 × 57**, Poolwereld **62 × 44** in beeldcoördinaten. Schermmaten volgen dezelfde schaal als het kaartbeeld.

## Voorbeelden

- [Markt](Voorbeelden/Markt.png)
- [Station](Voorbeelden/Station.png)
- [Poolwereld](Voorbeelden/Poolwereld.png)
- [Machinaal controleverslag](QA-resultaten.json)

De richtduur van 5–10 minuten is een didactische inschatting, geen gemeten klasproef. Visuele diepte is gecontroleerd op de afgebeelde passages; de volledige bestaande kaartfamilie blijft onder de bestaande regressiecontroles vallen.
