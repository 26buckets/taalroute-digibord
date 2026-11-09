# Actief — rustigere bediening, 9 november 2026

Status: werkende lokale appvoorvertoning. Niet gepubliceerd; de bestaande publicatiebevriezing blijft ongewijzigd.

## Opdracht en basis
Nico vraagt naar aanleiding van de desktop- en mobiele onderbalk om een rustigere vormgeving en vierkantere Taalroute-knoppen in de gehele app. Dit is een concrete vormgevingsopdracht. Livebasis: 9b3cf99802bffaad8b639cbe988cc86554b8fd2a. Alle 1.449 bestanden uit het opgehaalde live release-manifest zijn vergeleken met de uitgangscommit: geen afwijkingen. Werkbranch: style/actief-knoppen-20261109, afgeleid van de canonieke main.

De opgegeven map /Users/nicoknoester/Taalroute/Apps/Stijlsheet/digibord-settings ontbreekt op dit apparaat. De aanwezige settings/settings.css en open-quiet.css van de goedgekeurde actuele app zijn daarom als typografische en knopreferentie gelezen. Geen vergelijking met het ontbrekende reference.png geclaimd.

## Bereik
- Gedeelde knoppen: hoofdpagina, voorbereiden, lessen, collectie, spelkaarten, dobbelspellen, negen beschikbare lesvormen, instellingen, dialoogvensters, Zinnenbouwer en Meedoen.
- Hoeken van gewone bediening 5 px, vlakke primaire knop, rustige lijndruk, consistente focus. Spelpionnen, dobbelstenen, afbeeldingskaarten en woordkaarten behouden hun functie/vorm.
- Vorige, overzicht en volgende als één groep; de overige bediening op de tweede regel. Op mobiel drie leesbare rijen. Groeps-/spelersinformatie blijft zichtbaar waar die nodig is.
- Klassikaal niet tweemaal getoond naast elkaar. Bordstatus blijft behouden, omdat het bord daar geen spelvormkeuze heeft.
- Korte zichtbare knoppenamen met volledige toegankelijke namen. De les, spelvolgorde, scores, beurten en opslaglogica worden niet gewijzigd.
- Quiz gebruikt de bestaande gedeelde opdrachtweergave: leestekst, gemarkeerd doelwoord en stappen apart. De hele werkwoordsvorm blijft in de instructie; de vervoeging in het antwoord. Meerkeuzeopties en losse woorddelen worden niet dubbel weergegeven.

## Reviewronden
1. UI: verspreide bediening en dubbele klassikaal-aanduiding gevonden; gedeelde indeling en stijl aangepast. Desktop, mobiel en donkere stand bekeken.
2. Kritische tegencontrole: te brede Spelregels-knop op 320 px, verdwijnende actieve groepsnaam en donkere focusrand gevonden. Smalste bediening zonder extra pictogram, groepsnaam onder de keuzelijst, lichtere focusrand in donkere stand. Oude tekstweergave in quiz hersteld; dubbele keuze-/woordlijsten voorkomen.
3. Hercontrole: schermmatrix op 320–1440 px zonder overlappende onderbalkknoppen of horizontaal tekstverlies. Kleine/lage vensters behouden scrollruimte. Terug, vooruit, overzicht, hervatten en groepsbeurt gecontroleerd.

Alle drie ronden zijn door dezelfde agent uitgevoerd, geen onafhankelijke tweede reviewer. Niet op een fysiek digibord of met docenten getest. Geen volledige nieuwe inhoudelijke beoordeling van iedere opdracht geclaimd.

## Testomgeving
Uitgebreide controles lokaal. Geen nieuwe workflows, geen push en geen cloudrun voor deze wijziging. Bestaande workflow alleen handmatig, maximaal twee minuten. Eén bestaande testmock aangevuld met browser-microtaak en focus om de bestaande navigatieafhandeling werkelijk te kunnen uitvoeren; assertions behouden. Quizcontroles volgen nu de aparte leestekst en opdracht. Een controle voorkomt dubbele meerkeuzeopties.

Zie de gekoppelde aflevermap voor screenshots, controlelogboeken en herstelbundel. Publicatiebeveiliging, releasecontract, oorspronkelijke tag, media en databanken zijn niet aangepast.
