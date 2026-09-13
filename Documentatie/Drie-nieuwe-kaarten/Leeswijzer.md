# Markt, Station en Poolwereld

Status: **lokaal gebouwd in de bestaande Digibord-app**. Deze uitbreiding is niet gepusht of gepubliceerd. De elf eerdere kaarten zijn vastgezet en behouden.

| Kaart | Opdrachtvakken | Route en beweging |
| --- | ---: | --- |
| Markt · kort | 12 | Open route van de kade, langs marktkramen, naar het plein. De pion loopt om de uitstalling heen en gedeeltelijk achter de broodkraamluifel. |
| Station · kort | 16 | Stationshal → voorplein → voetgangerstunnel → perron. Tussen 8 en 9 verdwijnt de pion onder de grond en komt hij via de perrontrap weer boven. |
| Poolwereld | 30 | Sneeuwpad → sneeuwtunnel 12–13 → sneeuwhelling → gletsjerlift 24–25 → onderzoeksstation. De cabine en pion gaan samen verticaal omhoog. |

Start en finish tellen niet mee als opdrachtvak. Alle nieuwe routes lopen vooruit; er zijn geen terugstuurvakken, beurt-overslaan-vakken of lange omwegen. Een tunnel- of liftpassage verbindt twee opeenvolgende vakken en kost één gewone stap. Bij een grotere worp volgt de pion de passage onderweg. Er zijn dus geen onzichtbare extra stappen.

De richtduur van de korte kaarten is 5–10 minuten met één gedeelde pion. Dat is geen tijdslimiet of gemeten lesduur: langere opdrachten en afzonderlijke beurten voor veel pionnen kosten meer tijd.

## Openen

Gebruik de bestaande app en **Bediening → Wissel kaart**. De kiezer toont veertien kaarten. Markt en Station zijn herkenbaar aan ‘kort’ en hun aantal vakken.

- [Markt](http://127.0.0.1:61381/Praatpad.html?kaart=markt-pleinroute)
- [Station](http://127.0.0.1:61381/Praatpad.html?kaart=station-perronroute)
- [Poolwereld](http://127.0.0.1:61381/Praatpad.html?kaart=pool-ijsroute)

Via **Speciale plekken** kun je de luifel, tunnel of lift bekijken zonder de spelstand te wijzigen. De tunnel- en liftlabels op de kaart openen dezelfde uitleg. Vaknummers uit toont enkele oriëntatiepunten en de passagevakken; aan toont de hele reeks.

## Dezelfde lesbediening

Alle drie kaarten gebruiken de bestaande niveauroutes A0–A1, A1–A1+, A1–A2 en A2–B1, de vier vormen en de vier oefeningen: Directe vragen, Gesprek oefenen, Mix van beide en Zinnen maken. De opdrachtenmatrix en zinnenvoorraad zijn ongewijzigd. Werkvorm, pionindeling, namen, hulp en docentaanpak blijven onafhankelijk van de kaart.

Spatie gooit; één klik op het witte opdrachtvlak vergroot/verkleint de opdracht. De grote dobbelsteen, fullscreen, gedeelde instellingen, eigen spelstand per kaart en Terug blijven werken.

## Opbouw en afbakening

Het vaste pad, alle gekleurde vakken en start/finish zijn onderdeel van de definitieve kaartafbeelding. Er liggen geen zichtbare vectorvakken boven op de kaart. Onzichtbare klikvlakken en optionele vaknummers volgen de geschilderde vakken. De meetpunten zijn na beeldproductie op de geschilderde centra afgestemd; de volgorde en aantallen blijven gelijk.

De drie geschilderde achtergronden zijn gemaakt met de ingebouwde imagegen-tool, met Bos als stijlreferentie. Daarna zijn alleen de nieuwe beelden gericht aangepast: een zichtbare perrontrap en een veilige sneeuwhelling met een lege liftmast. De originele elf beelden en kaartmodules zijn niet aangepast.

De routepunten, voorgrondmaskers en bewegingsgegevens staan in drie zelfstandige gegevensmodules onder `Kaarten`. De gedeelde nieuwe renderer gebruikt dezelfde beeldcoördinaten voor het speelbord en de pion. Geknipte voorgrondweergaven van hetzelfde kaartbeeld leggen de luifel, tunnelranden en traprand vóór de pion. Voor tunnelmonden schakelt de pion pas naar de achterlaag wanneer hij klein genoeg binnen de opening staat. Buiten de mond staat hij voor de rand, ook bij een omgekeerde voorbeeldbeweging.

De lift heeft een achterwand, een voorste hekwerklaag en een pion daartussen. Lift en pion delen één positie tijdens de verticale rit. Minder beweging slaat de animatie over en bewaart dezelfde eindstand.

Zie [Beeldproductie.json](Beeldproductie.json) voor bronprompts en definitieve bestanden; [QA.md](QA.md) voor de controles.
