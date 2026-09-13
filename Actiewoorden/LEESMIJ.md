# 54 actiewoorden in Praatpad

De collectie bevat 54 oorspronkelijke SVG-iconen in negen reeksen van zes. Er zijn 48 nieuwe beelden getekend. De zes eerdere iconen zijn meegenomen; het slaapbeeld heeft nu geen letters meer.

Open in Praatpad het tandwiel → Spelvorm → **54 actiewoorden · negen dobbelstenen**.

- **Werp alle negen** laat alle dobbelstenen tegelijk rollen, met verschillende draairichtingen, aantallen omwentelingen, snelheden en kleine startverschillen.
- Elke dobbelsteen heeft zijn eigen reeks van zes. Daardoor zijn de negen getoonde actiewoorden onderling verschillend.
- Een volgende worp verandert alle negen beelden. Het programma kiest combinaties zonder herhaling binnen de lopende generatiecyclus. Het geheugen blijft na herladen bewaard.
- **Toon de woorden** geeft de namen als spreeksteun. Tik op een dobbelsteen voor een groter beeld.
- Via het tandwiel kies je **naast elkaar** of **drie rijen van drie**. Op een klein scherm kun je de enkele rij horizontaal verschuiven.
- **Vorige worp** herstelt de vorige tafel. De volgende nieuwe worp gaat verder met nog niet gebruikte combinaties.
- De bestaande geluidskeuze, pauzeknop en instelling voor minder beweging werken mee.

Het beeld is een spreeksteun. Vooral bedanken, maken, kopen en vragen kunnen ook andere passende benoemingen oproepen. De tekeningen zijn visueel gecontroleerd, maar nog niet met een klas op herkenning beproefd.

## Bestanden

- `overzicht.html`: alle negen beeldreeksen bekijken.
- `iconen/`: de 54 losse SVG-bestanden, AW-01 tot en met AW-54.
- `vervolglijst.md`: voorstel voor 36 volgende actiewoorden; deze zijn nog niet getekend.

## Hoe de afwisseling werkt

Dit is een gestuurde educatieve worp, geen simulatie van negen onafhankelijke eerlijke dobbelstenen. Het systeem doorloopt een met een willekeurige sleutel gehusselde volgorde van de 6⁹ mogelijke combinaties. Kandidaten met een onveranderd beeld worden overgeslagen. Elke index wordt maar één keer bezocht, dus een uitgegeven combinatie keert binnen die cyclus niet terug. Na uitputting van de eindige cyclus begint een nieuwe gehusselde cyclus. Omdat combinaties worden overgeslagen, worden niet alle 10.077.696 mogelijkheden daadwerkelijk getoond. De draai-animatie wordt onafhankelijk van de inhoud gekozen.

## Gecontroleerd

- 54 unieke iconen, negen reeksen van zes, controle op een gezamenlijk beeldenoverzicht.
- 300.000 opeenvolgende testworpen, verdeeld over drie sleutels: geen herhaalde combinatie binnen elke testreeks en iedere dobbelsteen verandert.
- Opslaan, herladen, vorige worp, vergroting en wisselen tussen de drie spelvormen.
- Negen gelijktijdige animaties, brede tafel en smalle weergave, minder beweging en de alternatieve weergave zonder WebGL.
