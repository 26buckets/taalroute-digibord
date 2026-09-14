# Controle — vier speelbare Spreektijd-kaarten

Datum: 14 september 2026. Omgeving: lokale Chrome, bestaande Digibord-app. Geen publicatie.

## Geslaagd

- Vier kaartmodules met 33, 30, 16 en 17 opdrachtvakken. Start en finish staan apart.
- Alle opeenvolgende routebenen: 1.001 meetpunten per richting, geldige coördinaten, aangesloten begin/eindpunten en geen zichtbare sprong tijdens de tunnelbeweging.
- Vier doorgangen: volledige onzichtbaarheid in het midden, pion vóór de rand in de buitenste in- en uitloop, juiste eindpositie.
- Voorbeelden behouden de sessie; annuleren en Terug herstellen de beurt; minder beweging bereikt dezelfde bestemming; finish werkt.
- Een worp van drie loopt door een doorgang en daarna verder; beide bruggen worden ook bij passeren gebruikt.
- Kaart en opdracht blijven op hun plek tijdens de beweging.
- Vijf schermbreedtes: 320, 390, 768, 1280 en 1920 pixels. Alle ankers binnen de kaart, afbeeldingen geladen, geen horizontale pagina-overloop.
- Bestaande niveaus A0/A1/A2/B1 blijven op alle vier kaarten beschikbaar.
- Visuele inspectie van de vier kaarten, de vijf tunnelfasen en de twee bruggen. Bij Afspraak zijn de ankers van de eerste tien tegels na pixelcontrole nader afgestemd; de gerichte kaarttest is daarna opnieuw geslaagd.
- Alle vier Open speelkaart-links in het overzicht openen de juiste module op poort 61381; de nummers blijven onder de pion; labels bij randen zijn naar vrije ruimte verplaatst.
- 844 bestaande bestanden onder Kaarten zijn bytegelijk aan de eerdere versie e938597 (register en gedeelde bewegingsmodule uitgezonderd). Alle 22 eerdere registerregels en vormreeksen zijn inhoudelijk identiek.
- Het gecombineerde overzicht houdt 30 fantasiebeelden, 20 Nederlandse ontwerpen en 4 Spreektijd-kaarten apart. Bladeren binnen de collectie, Escape, bestandslinks en vijf schermbreedtes zijn gecontroleerd.

## Brede appcontrole

Alle onderdelen van de volledige npm-testreeks slaagden tot de laatste laagcontrole. Die vond een nummerlaag vóór de pion op de nieuwe kaarten. Na herstel is tests/layers.cjs opnieuw voor alle 26 kaarten geslaagd. Alle overige checks uit de volledige reeks waren geslaagd, waaronder bediening, opslag, audio, opdrachten, kaartfamilie, ruimtelijke werking en stabiele opmaak. De Afspraakkaart is na de ankercorrectie ook afzonderlijk opnieuw gecontroleerd.

De oorspronkelijke volledige run eindigde dus met een fout; de gerichte hercontrole na herstel eindigde zonder fouten. Beide logbestanden zijn bewaard.

Details van de kaartcontrole staan in Kaarttest.json en Kaarttest-afspraak-na-correctie.json. Testuitvoer: npm-test.log en layers-na-herstel.log. Screenshots staan lokaal onder tests/artifacts/spreektijd-kaarten/.

## Afbakening

Dit is een technische en eigen visuele controle, geen docentpilot. De nieuwe routes gebruiken de bestaande algemene opdrachten. Er is geen nieuwe Spreektijd-opdrachtenbank of hoofdstukkoppeling goedgekeurd of gepubliceerd met deze wijziging.
