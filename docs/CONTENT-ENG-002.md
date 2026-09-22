# CONTENT ENG 002 Bestaande spelmotoren aansluiten, Fase 1 QUIZ

Status: technisch groen op pull request 28, niet gemerged naar main.

## Doel

CONTENT ENG 002 sluit bestaande DigiBord spelmotoren één voor één aan op het open platform uit CONTENT ENG 001.

Fase 1 sluit de bestaande Categorieënquiz aan zonder de quiz te kopiëren en zonder een aparte grammaticaquizbank te maken.

## Resultaat

QUIZ heeft nu:

integrationStatus CONTENT_READY

contentSessionEnabled true

ondersteunde organisatievorm groepen

dezelfde SessionConfig als BOARD, WHEEL, CARDS en DICE

dezelfde selected_item_ids bij gelijke selectie en seed

geen eigen grammatica contentbank

## Twee beoordelingspaden

Gesloten keuzevragen

De quiz toont de canonieke options.

Het canonieke correct_answer bepaalt het juiste antwoord.

Een correct antwoord kent de punten van het vak toe.

Open en tekstuele opdrachten

Het team geeft eerst zelf antwoord.

Voor TEXT_INPUT en TEXT_ORDER kan het antwoord worden vastgelegd.

Daarna wordt het canonieke modelantwoord of mogelijke voorbeeld getoond.

De docent beoordeelt Goed of Niet goed.

Open opdrachten worden dus niet via exacte tekenreeksvergelijking beoordeeld.

## Spelverantwoordelijkheid

QUIZ blijft eigenaar van:

quizbord

categorieën

punten

teams

beurtwisseling

score

De contentruntime blijft eigenaar van:

content_item_id

prompt

options

correct_answer

model_answer

InteractionType

InteractionRenderer

SessionConfig

## Organisatieguard

De huidige bestaande categorieënquiz is een twee-teamsspel.

Daarom wordt QUIZ in CONTENT UI 001 alleen aangeboden bij organisatievorm Groepen.

Een directe SessionConfig met QUIZ en een niet ondersteunde organisatievorm wordt door de runtime geweigerd.

## Compatibiliteit

QUIZ ondersteunt voor GRAM PB 001 de huidige universele renderers:

OPEN_PROMPT

CHOICE

TEXT_INPUT

TEXT_ORDER

Daarmee hoeft de gedeelde sessiepool niet te worden versmald tot alleen meerkeuzevragen.

## Technisch bewijs

Geteste commit:
b02063ba799d18bb1491e8d1134e3e0817223602

GitHub Actions run:
35718568068

Eindstatus:
SUCCESS

Expliciete bewijzen:

PASS: CONTENT ENG 002 QUIZ uses the shared SessionConfig, full PB001 renderer coverage, team-only organization guard and no content copies.

PASS: full GRAM PB001 browser runtime across BOARD WHEEL CARDS DICE QUIZ, automatic and teacher-scored quiz paths, ORDER adapter, MODAAL and restore.

PASS: CONTENT UI full PB001 topics, levels, MODAAL, ORDER, strict no-fallback, shared sessions, dynamic five-engine registry, organization-aware QUIZ and duo mode.

De bestaande zeven activiteitenspellen en de brede DigiBord regressies blijven groen.

## Volgende fase

CONTENT ENG 002 Fase 2 SEQUENCE.

Doel:

de bestaande Rangschikken motor aansluiten op canonieke IT_008_ORDER zonder eigen inhoudskopieën.

Daarna:

MATCH

MEMORY

SORT

Per aansluiting blijft gelden dat de engine alleen CONTENT_READY wordt wanneer runtime, browserflow en bestaande regressies groen zijn.

## Releasegrens

Deze poort geeft technische bouwvrijgave op pull requestniveau.

Main is niet automatisch gewijzigd.

Merge, IMPORT_READY en productierelease blijven afzonderlijke besluiten.
