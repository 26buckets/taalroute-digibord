# CONTENT ENG 001 Universeel GameEngine en InteractionRenderer Register

Status: implementatie op pull request 28, nog niet gemerged naar main.

## Doel

CONTENT ENG 001 voorkomt dat BOARD, WHEEL en CARDS een vaste architectuurgrens worden.

De runtime kent voortaan twee registers:

GameEngineRegistry

InteractionRendererRegistry

De selectiemotor vraagt capabilities op. Nieuwe spelmotoren worden geregistreerd en hoeven niet als speciale uitzondering in de contentbank of contentcatalogus te worden ingebouwd.

## Architectuur

ContentItem

InteractionType

InteractionRenderer

SelectionEngine

SessionConfig

GameEngine

De InteractionRenderer bepaalt hoe één opdracht technisch wordt uitgevoerd. De GameEngine bepaalt spelverloop, beurt, toeval, score, presentatie en varianten.

## Bestaande DigiBord inventaris

BOARD
Classificatie: GameEngine
Status: CONTENT_READY

WHEEL
Classificatie: GameEngine
Status: CONTENT_READY

CARDS
Classificatie: GameEngine
Status: CONTENT_READY

DICE
Classificatie: GameEngine
Status: CONTENT_READY
Functie: vierde onafhankelijke bewijsengine voor canonieke contentsessies

QUIZ
Classificatie: GameEngine
Status: EXISTING_SPECIALIZED

MEMORY
Classificatie: GameEngine plus InteractionRenderer
Status: EXISTING_SPECIALIZED

MATCH
Classificatie: GameEngine plus InteractionRenderer
Status: EXISTING_SPECIALIZED

SORT
Classificatie: GameEngine plus InteractionRenderer
Status: EXISTING_SPECIALIZED

SEQUENCE
Classificatie: GameEngine plus InteractionRenderer
Status: EXISTING_SPECIALIZED

RIDDLE
Classificatie: GameEngine
Status: EXISTING_SPECIALIZED

TAALWORP
Classificatie: GameEngine plus gespecialiseerd contentproduct
Status: SPECIALIZED_PRODUCT

STORY_DICE
Classificatie: GameEngine plus gespecialiseerd contentproduct
Status: SPECIALIZED_PRODUCT

WORDS
Classificatie: contentproduct plus uitvoeringsmotor
Status: SPECIALIZED_PRODUCT

Een bestaande spelvorm wordt niet automatisch als universeel compatibel aangemerkt. Het register maakt zichtbaar wat al bestaat en wat nog een contentadapter nodig heeft.

## GameEngine contract

Een geregistreerde engine bevat minimaal:

id
label
description
classification
integrationStatus
contentSessionEnabled
version
capabilities
variants
existingSurface

De centrale runtime selecteert de contentengines via contentSessionEnabled.

## InteractionRenderer contract

De eerste generieke rendererfamilies zijn:

OPEN_PROMPT

CHOICE

TEXT_INPUT

TEXT_ORDER

Iedere renderer registreert:

id
label
capabilities
interactions
optionele adapter

De compatibility resolver controleert daarna of de gekozen GameEngine alle capabilities van de vereiste InteractionRenderer ondersteunt.

## Vierde engine bewijs

DICE is toegevoegd als vierde universele contentengine.

DICE gebruikt dezelfde SessionConfig en dezelfde selected_item_ids als BOARD, WHEEL en CARDS.

De dobbelsteen bepaalt alleen de voortgang binnen de geselecteerde sessiepool.

DICE maakt geen nieuwe grammaticaopdrachten en bezit geen eigen contentbank.

## CONTENT UI 001

CONTENT UI 001 leest zijn spelvormen niet meer uit de contentcatalogus.

De contentcatalogus beheert alleen:

contentfamilies
onderwerpen
selectieprofielen
niveaus
subonderwerpen
oefenfocus
productievorm
moeilijkheid
tijdsduur
organisatievorm

De beschikbare spelmotoren komen uitsluitend uit GameEngineRegistry.

Daarmee kan een nieuwe contentengine worden toegevoegd zonder de docentselectiearchitectuur te dupliceren.

## Acceptatiecriteria

1. De runtime bevat geen vaste architectuurlijst met uitsluitend BOARD, WHEEL en CARDS.
2. GameEngines worden via één register gevonden.
3. InteractionRenderers worden via één register gevonden.
4. Compatibility werkt op capabilities.
5. De contentcatalogus bezit geen tweede engineconfiguratie.
6. CONTENT UI 001 toont dynamisch alle contentSessionEnabled engines.
7. BOARD, WHEEL, CARDS en DICE ontvangen dezelfde SessionConfig.
8. Dezelfde content_item_ids worden door de vier engines gebruikt.
9. DICE gebruikt geen inhoudskopie.
10. Bestaande gespecialiseerde spellen zijn geïnventariseerd zonder valse compatibiliteitsclaim.
11. Een onbekend InteractionType is niet compatibel totdat een renderer is geregistreerd.
12. Een onbekende GameEngine is niet compatibel.
13. De bestaande DigiBord regressies blijven groen.
14. Main wordt niet automatisch gewijzigd.

## Volgende uitbreidingen

Na deze poort kunnen bestaande gespecialiseerde spelmotoren één voor één op het generieke register worden aangesloten.

Logische kandidaten:

QUIZ
SEQUENCE
MATCH
MEMORY
SORT

Iedere aansluiting vereist alleen de passende renderercontracten en engine capabilities. Canonieke taalcontent wordt niet gekopieerd.

## Releasegrens

Een groene CONTENT ENG 001 poort is technische bouwvrijgave op pull requestniveau.

Merge naar main en productierelease blijven afzonderlijke besluiten.
