# Coordinates are hand-registered on the retained 1672 x 941 paintings.
from pathlib import Path
import json, math
P=lambda s:[list(map(int,p.split(','))) for p in s.split()]
C=[]
def kaart(slug,route,forms):
 c=dict(id='nederland-'+slug,slug=slug,anchors=P(route),shapeString=forms,passages=[],masks=[],waypoints={},previews=[],depthModel='thresholds');C.append(c);return c
def tunnel(c,n,to,label,enter,exit,box1,box2,labelPos,optional=False,boat=False):
 p=dict(id='doorgang-'+str(len(c['passages'])+1),kind='tunnel',from_=n,to=to,label=label,enter=P(enter),exit=P(exit),labelPos=labelPos,optional=optional,boat=boat,hiddenLabel='Onder de huizen' if boat else 'In de doorgang');p['from']=p.pop('from_');c['passages'].append(p)
 for i,b in enumerate([box1,box2]):
  if not b:continue
  l,t,r,bottom=b;w=6
  path=f'M{l} {bottom}V{t}H{r}V{bottom}H{r-w}V{t+w}H{l+w}V{bottom}Z'
  c['masks'].append(dict(id=p['id']+'-mond-'+str(i),path=path,area=[l,t,r,bottom],frontY=2000,portal=True))
 return p
def rail(c,id,points,width=4):
 ps=P(points);parts=[]
 for a,b in zip(ps,ps[1:]):
  dx,dy=b[0]-a[0],b[1]-a[1];d=math.hypot(dx,dy);ox,oy=-dy/d*width/2,dx/d*width/2
  parts.append('M'+' L'.join(f'{x:.1f} {y:.1f}' for x,y in [(a[0]+ox,a[1]+oy),(b[0]+ox,b[1]+oy),(b[0]-ox,b[1]-oy),(a[0]-ox,a[1]-oy)])+'Z')
 xs=[p[0] for p in ps];ys=[p[1] for p in ps];c['masks'].append(dict(id=id,path=' '.join(parts),area=[min(xs),min(ys),max(xs),max(ys)],frontY=2000,bridge=True))
def way(c,n,s):c['waypoints'][str(n)]=P(s)
def bridge(c,a,b,label):c['previews'].append(dict(id='brug-'+str(a),from_=a,to=b,label=label,icon='route',description='De pion volgt het brugdek tussen de leuningen.'))
def ferry(c,n,to,label,enter,water,exit,labelPos):
 c['passages'].append(dict(id='pont-'+str(n),kind='ferry',from_=n,to=to,label=label,enter=P(enter),water=P(water),exit=P(exit),labelPos=labelPos))
# Delft: complete upper canal route; the lower stairwell is an optional quay passage.
c=kaart('delft','155,829 245,760 298,718 347,678 403,640 456,608 521,573 594,539 648,515 681,505 795,485 839,454 875,425 909,399 972,380 1036,360 1627,600 1612,560 1601,522 1588,485 1575,453 1540,421 1495,395 1453,374 1409,354 1370,337 1377,309','t s d c t s d s t s c d t s c t d c s t d c s t d')
way(c,9,'681,505 720,505 758,499 795,485');way(c,15,'1036,360 1092,357 1150,378 1204,399 1270,410 1380,439 1500,464 1533,515 1555,584 1582,624 1627,600')
tunnel(c,4,16,'Kadepassage','403,640 430,717 512,771 591,852 717,897 737,866 751,825','1176,858 1187,926 1280,930 1380,890 1475,834 1537,752 1582,645 1627,600',[650,740,823,879],[1087,787,1280,932],[953,902],True)
rail(c,'brug-front','521,641 548,586 609,548 652,524 698,502 743,493 781,515 820,532',4);bridge(c,5,10,'Over de grachtbrug')
# Leiden: main bridge/stair route with the garden tunnel as a selectable side passage.
c=kaart('leiden','1545,839 1500,773 1457,728 1409,685 1357,645 1309,603 1247,563 1190,521 1139,487 1085,458 1002,435 919,421 837,406 790,385 735,360 672,233 679,208 692,185 707,166 784,155','t s c d t s c d t s c d t s c d s t')
way(c,14,'735,360 715,335 692,305 667,277 670,249 672,233')
tunnel(c,10,14,'Tuintunnel','1002,435 919,421 837,406 790,385 735,360 663,353 630,423 563,450 519,421 472,394 414,374 355,360 293,347 213,347 142,385 148,486 173,566 228,614 298,670 348,753 401,817 401,776 405,736 421,705 447,679 447,657','733,651 738,673 764,695 807,726 850,762 908,798 978,830 1058,859 1125,887 1110,921 966,928 798,927 622,925 503,896 447,858 402,817 348,753 298,670 228,614 173,566 148,486 142,385 213,347 293,347 355,360 414,374 472,394 519,421 563,450 630,423 663,353 735,360',[363,592,493,712],[695,587,822,696],[611,609],True)
rail(c,'brug-front','861,439 890,423 940,433 992,453 1048,478 1115,520 1180,568',4);bridge(c,6,12,'Over de singelbrug')
# Haarlem: from the quay, over the drawbridge, through the warehouse.
c=kaart('haarlem','137,840 255,819 317,787 389,744 438,700 442,650 435,597 522,585 769,522 833,513 893,503 1097,480 1176,469 1238,457 1279,426 1310,394 1351,365 1380,337 1504,158 1529,180 1574,193 1630,200 1588,146','t s c d t s d t s c d t s c t d t c s t d')
way(c,7,'522,585 598,562 670,544 724,533 769,522');way(c,10,'893,503 961,503 1022,491 1097,480')
tunnel(c,17,18,'Pakhuispassage','1380,337 1385,329 1385,309','1469,139 1482,150 1504,158',[1308,257,1409,353],[1441,94,1484,152],[1220,280])
rail(c,'brug-front','560,578 608,563 663,548 712,537 756,530 893,511 956,513 1017,504 1075,491',4);rail(c,'brug-staander','712,541 715,421',8);rail(c,'brug-staander2','956,515 955,393',8);bridge(c,7,11,'Over de ophaalbrug')
# Amersfoort: grass-wall passage, land gate and brick bridge.
c=kaart('amersfoort','382,827 268,774 220,728 194,685 209,644 255,600 306,558 337,519 341,480 318,443 286,426 304,196 267,209 228,226 185,247 136,268 88,289 475,419 545,399 606,385 661,371 706,361 751,346 748,321 953,769 988,723 1037,670 1073,616 1094,567 1119,519 1158,480 1209,445 1264,421 1333,402 1401,391 1565,413 1569,376 1545,348 1509,322 1474,301 1417,266','t s c t s c t s d s c t s c d t t c d s t d t d t s c d s t c s t d t s c d t')
tunnel(c,10,11,'Door de stadswal','286,426 287,410 286,392','294,168 297,187 304,196',[245,339,330,423],[269,131,321,183],[453,296])
way(c,16,'88,289 60,311 122,310 212,287 324,253 422,236 438,265 425,349 406,412 475,419')
tunnel(c,23,24,'Door de Koppelpoort','748,321 748,313 749,295','1291,311 1358,332 1435,370 1490,405 1484,438 1396,458 1300,488 1215,558 1150,654 1080,735 1002,793 953,769',[720,264,780,334],None,[816,240])
way(c,34,'1401,391 1469,383 1521,390 1565,413');rail(c,'brug-front','1124,671 1161,604 1204,536 1254,487 1310,456 1380,435 1455,421 1512,409',4);bridge(c,25,35,'Over de stenen brug')
# Dordrecht.
c=kaart('dordrecht','110,847 179,781 222,739 263,693 304,650 355,609 415,576 487,561 655,491 688,465 718,436 746,407 998,442 962,471 925,503 884,533 1017,489 1083,504 1162,515 1245,510 1296,480 1339,442 1370,409 1407,381 1447,357 1512,326','s c d t s c t t d c t t d c s s t c d t s c d s')
way(c,7,'487,561 536,552 601,540 650,529 667,513 655,491');way(c,15,'884,533 938,529 988,505 1017,489')
tunnel(c,11,12,'Pakhuizenpassage','746,407 746,395 744,376','1026,411 1015,429 998,442',[700,324,779,399],[972,353,1060,443],[855,343]);rail(c,'brug-front','541,576 600,555 674,535 721,518',4);bridge(c,7,8,'Over de draaibrug')
# Den Bosch: optional boat journey underneath the houses, with real boarding.
c=kaart('den-bosch','305,790 445,740 531,702 618,672 698,632 775,601 855,574 942,552 1009,526 1046,495 1083,465 1091,430 1048,378 1084,355 1131,328 1177,304 1221,282 1276,266 1338,248 1404,231 1520,220','s d t s d c s d t c s c t s d c t s d')
way(c,11,'1091,430 1095,409 1072,395 1048,378')
p=tunnel(c,1,10,'Varen onder de huizen','445,740 429,677 371,637 319,594 268,551 318,512 369,477 428,461 481,458 536,455 554,429 577,400','1295,625 1250,667 1170,674 1110,641 1112,614 1119,581 1110,512 1083,465',[520,307,646,433],[1231,547,1362,675],[743,452],True,True)
p['boardAt']=8;p['landAt']=3
rail(c,'brug-front','641,701 698,668 762,636 833,601 900,578 977,558',4);bridge(c,2,8,'Over de Binnendieze')
# Groningen.
c=kaart('groningen','148,815 250,750 318,716 384,682 438,643 457,600 466,561 479,525 504,491 523,460 736,547 794,568 850,590 907,612 983,613 1058,610 1120,587 1151,551 1185,515 1221,481 1250,451 1287,425 1320,402 1356,380 1383,363 1412,347 1440,310','c t s c d t s c t t c d c s t d s t c d s t c d t')
way(c,9,'523,460 553,474 599,490 663,509 703,529 736,547')
tunnel(c,14,20,'Pleinonderdoorgang','983,613 1080,630 1175,614 1286,610 1345,590 1357,557','1054,515 1071,548 1120,539 1164,486 1250,451',[1255,493,1451,615],[941,446,1145,554],[1516,596],True)
rail(c,'brug-front','552,499 613,514 676,537 737,559 793,586 851,612',4);bridge(c,9,13,'Over de museumbrug')
# Maastricht.
c=kaart('maastricht','149,839 263,795 236,754 217,710 206,670 210,628 218,587 237,553 273,523 332,501 397,481 459,462 522,447 586,431 646,418 706,404 765,391 822,379 874,369 919,359 967,351 1012,346 1058,338 1376,558 1390,534 1543,466 1551,433 1546,398 1528,367 1505,343 1481,322 1455,290','c t s c d t s c d t s d c s t d c t s t d c t c c d t s c d')
way(c,22,'1058,338 1103,331 1152,332 1191,363 1223,414 1267,470 1298,514 1343,554 1376,558')
tunnel(c,24,25,'Kademuurpassage','1390,534 1381,519 1381,504','1519,553 1514,574 1500,603 1460,619 1430,592 1430,536 1452,498 1500,481 1543,466',[1360,474,1403,531],[1487,513,1545,580],[1327,614])
rail(c,'brugmuur','337,520 526,469 713,424 900,387 1068,358',5);bridge(c,8,22,'Over de Sint-Servaasbrug')
# Nijmegen: lower quay, a wall tunnel, stairs and park bridge.
c=kaart('nijmegen','1309,859 1210,787 1161,749 1118,697 1084,650 1088,611 1126,583 1159,560 632,458 592,478 554,503 615,532 679,558 751,585 823,611 898,646 977,678 1054,716 845,367 790,350 736,336 682,322 649,302 649,279 680,265 725,252 1225,210 1273,220 1323,232 1386,243 1448,255 1531,319 1514,347 1416,391 1334,392 1255,384 1189,367 1132,351 1549,269','d t s c d t s s c s t d c s t d c c d t s c d t c c s t d c s d t s c d t')
tunnel(c,7,8,'Walpassage','1159,560 1160,548 1160,532','654,429 645,446 632,458',[1092,476,1201,566],[595,374,686,449],[923,502])
way(c,17,'1054,716 1054,667 1004,613 905,561 838,529 845,492 882,438 910,402 874,382 845,367')
way(c,25,'725,252 782,248 840,228 916,197 1026,181 1141,185 1225,210')
way(c,30,'1448,255 1483,276 1510,296 1531,319');way(c,32,'1514,347 1472,375 1416,391')
way(c,37,'1132,351 1088,328 1037,312 982,301 925,298 883,307 845,293 849,262 916,231 1041,210 1140,215 1230,252 1350,279 1443,300 1500,293 1549,269')
rail(c,'parkbrug-front','884,295 937,289 993,299 1051,321',4);bridge(c,37,38,'Over de parkbrug')
# Deventer: ferry is on the ordinary route, then warehouse tunnel.
c=kaart('deventer','138,816 246,781 299,753 348,730 389,700 425,666 474,641 518,621 563,603 1007,434 1013,414 1019,394 1028,374 1035,355 1045,338 896,316 896,327 905,340 922,348 1324,413 1397,406 1435,392 1465,376 1490,359 1458,343 1443,326 1445,311 1535,326','c s d t s c d t d s c s t d d s c t c t d c s d t s')
ferry(c,8,9,'Met het pontje over de IJssel','563,603 616,582 670,563','670,563 756,541 853,520 928,486 957,464','957,464 984,449 1007,434',[799,617])
tunnel(c,14,15,'Pakhuizenpassage','1045,338 1047,330 1045,319','895,306 895,313 896,316',[1019,301,1066,346],[872,279,916,325],[1111,297])
way(c,18,'922,348 1000,366 1100,390 1199,414 1263,425 1324,413')
# Kinderdijk: full pumping-station route; tunnel is a short optional return through the dike.
c=kaart('kinderdijk','1474,831 1488,754 1473,707 1462,655 1443,607 1420,560 1355,532 1290,508 1234,484 1180,460 1130,440 797,345 754,334 707,325 610,425 554,407 500,389 444,373 400,355 443,329 474,301 428,282 385,265 342,248 296,232 254,219 215,206 198,198 128,172','c d t s c d t s c t t c t s c d t s c d t s c d t s c')
way(c,10,'1130,440 1095,439 1096,427 1130,403 1124,358 1070,332 960,317 873,333 797,345');way(c,13,'707,325 662,325 602,326 554,345 574,392 610,425')
tunnel(c,1,14,'Dijktunnel','1488,754 1453,777 1404,758 1350,715 1308,679 1270,650 1252,638 1252,620','661,395 657,410 610,425',[1202,566,1305,646],[627,352,700,419],[982,583],True)
# Zaanse Schans.
c=kaart('zaanse-schans','192,841 488,866 407,813 329,765 404,719 486,680 563,648 1068,511 970,500 886,474 807,448 737,423 670,395 613,372 571,345 531,318 506,289 489,264 1170,412 1214,439 1236,480 1301,446 1368,420 1419,388 1463,355 1504,325 1555,275','d s c d t s s c d t s c d t s c t t c s t d s c t')
way(c,0,'192,841 267,880 374,910 449,909 488,866');way(c,6,'563,648 619,614 673,586 724,560 779,546 850,540 961,531 1068,511')
tunnel(c,17,18,'Door de werkplaats','489,264 485,253 484,238','1153,391 1160,404 1170,412',[441,194,527,269],[1134,328,1208,419],[840,300])
rail(c,'brug-front','658,646 692,626 752,599 811,582',5);rail(c,'brug-paal','663,652 663,541',7);rail(c,'brug-paal2','753,599 753,508',7);bridge(c,6,7,'Over de houten ophaalbrug')
# Afsluitdijk.
c=kaart('afsluitdijk','154,825 270,754 337,715 401,676 462,637 522,601 585,569 647,535 710,555 773,547 839,529 897,508 946,487 988,466 1190,389 1227,367 1260,348 1294,330 1330,312 1363,292 1398,247 1428,229 1452,210 1465,190 1494,158','d s t c d s t c d s c d t c d t c d s d t c d')
tunnel(c,13,14,'Onder de onderhoudsstrook','988,466 1036,475 1076,464 1094,445 1100,419','1322,264 1351,285 1330,331 1254,379 1190,389',[965,361,1169,456],[1237,225,1394,286],[1035,572])
way(c,19,'1363,292 1385,270 1398,247')
# Neeltje Jans.
c=kaart('neeltje-jans','1525,873 1433,841 1382,819 1306,790 1234,765 1161,739 1106,711 1078,676 1078,646 1089,625 1103,608 1115,599 452,409 437,425 429,444 434,471 460,500 494,527 539,555 590,579 645,602 706,626 766,650 826,677 883,702 943,721 1238,534 1177,516 1116,500 1055,480 989,460 929,441 872,417 816,394 757,375 701,354 647,332 595,316 539,296 485,280 434,264 386,248 338,235 299,219 281,198 259,182 234,170 153,160','c t s c d t s c d s t t d c s t d c s t d c s t d t s c d t s c d t s c d t s c d t s c d t')
tunnel(c,11,12,'Door de deltawerken','1115,599 1124,594 1129,581','459,396 456,404 452,409',[1034,545,1154,630],[403,349,489,429],[783,499])
way(c,25,'943,721 995,740 1008,695 988,628 1005,554 1168,557 1238,534')
# Giethoorn: main village footpath through the boathouse. Painted side bridge is a preview loop.
c=kaart('giethoorn','155,827 275,760 349,717 419,676 478,632 512,588 521,548 522,512 553,479 599,451 655,426 712,402 754,381 784,359 1253,276 1283,287 1336,281 1383,269 1432,253 1465,224 1441,199 1403,188 1358,181 1556,234','c d t s c d t s c t d c t t c s d t s d t s')
tunnel(c,13,14,'Door het boothuis','784,359 789,350 787,337','1262,260 1257,271 1253,276',[725,286,812,369],[1238,210,1301,277],[1075,180])
way(c,22,'1358,181 1384,168 1446,179 1498,202 1556,234')
# Biesbosch: two actual water crossings connect all painted island paths.
c=kaart('biesbosch','160,771 153,708 218,677 291,648 334,608 295,566 252,533 232,494 240,457 278,427 330,403 386,383 446,366 501,358 1508,424 1000,550 960,574 919,598 989,632 1066,643 1150,657 1237,684 1329,721 1395,766 1463,815 1527,865 1434,557 1489,534 1537,509 1562,475 1543,446 1051,269 1107,260 1157,252 1209,246 1263,235 1311,219 1346,199 1379,181 1415,164 1490,145','c s d c s d t c s t d s c d d c t c s t d c s t d s t d c s c s t d c s d t c')
ferry(c,13,14,'Pont naar het wilgeneiland','501,358 562,351 606,343','606,343 738,353 902,352 1100,340 1324,330 1493,340 1578,380','1578,380 1563,405 1537,420 1508,424',[743,264])
tunnel(c,14,15,'Wilgentunnel','1508,424 1513,419 1513,409','1005,525 1006,539 1000,550',[1485,359,1538,421],[956,477,1024,558],[1265,453])
way(c,25,'1527,865 1590,874 1630,802 1640,695 1640,625 1575,582 1490,571 1434,557')
ferry(c,30,31,'Pont naar de uitkijkroute','1543,446 1587,443 1613,418','1613,418 1600,359 1490,320 1314,312 1140,307 1000,303 981,286','981,286 1008,277 1051,269',[1427,326])
rail(c,'brug-front','1002,638 1075,648 1149,667 1230,699 1339,782',5);bridge(c,17,24,'Over de kreekbrug')
# Texel: dune route with optional underground detour.
c=kaart('texel','197,768 315,709 397,667 461,632 518,598 580,565 631,530 658,497 662,465 659,429 666,396 693,370 731,350 827,327 878,339 929,352 985,369 1054,388 1118,408 1189,410 1259,398 1325,379 1386,355 1435,330 1469,304 1474,278 1456,252 1421,232 1388,219 1469,205','d c s t d c s t d c s t d t s c d t s c d t s c d t c t')
way(c,12,'731,350 779,334 827,327')
tunnel(c,5,20,'Duintunnel','580,565 585,639 671,750 751,871 808,833 820,785 833,745 846,713 851,690 854,672','1399,670 1419,703 1440,735 1460,771 1474,811 1514,865 1580,802 1580,693 1500,608 1370,552 1307,477 1259,398',[786,622,910,708],[1357,601,1458,691],[1130,751],True)
rail(c,'brug-front','789,344 871,365 953,388 1049,420',5);bridge(c,12,18,'Over de duinbrug')
# Valkenburg.
c=kaart('valkenburg','1300,846 1231,800 1181,774 1130,750 1082,728 1035,700 1014,672 1000,646 982,619 961,595 950,576 962,562 340,285 300,301 343,313 395,323 446,296 461,267 483,233 500,203 516,176 531,153 535,129 516,111 491,98 1065,208 1035,187 1077,162','c d t s c s t d c s d c t s c d t c s t d c s t s d')
tunnel(c,11,12,'Door de mergelgrot','962,562 963,552 965,534','341,262 339,277 340,285',[916,476,1033,600],[306,202,382,279],[766,479])
way(c,24,'491,98 546,83 620,97 684,125 754,142 842,160 925,179 997,192 1065,208')
# Muiderslot: garden bank tunnel, approach bridge and castle gate.
c=kaart('muiderslot','330,825 797,832 883,807 936,770 985,735 1042,711 1106,697 1169,685 1253,668 1318,653 1385,638 1428,612 1446,576 1463,545 1481,515 1505,490 1529,470 140,584 166,606 196,628 236,650 294,667 364,678 437,677 511,663 576,639 614,600 637,569 667,537 696,508 725,480 754,453 780,428 807,407 885,308 913,306 924,272','c d s c d t s c d t s c d t s c s c t d c s t d s c t s c d t s c c s')
way(c,0,'330,825 405,851 500,866 611,881 705,876 797,832')
tunnel(c,16,17,'Door de tuinwal','1529,470 1536,462 1543,445','141,566 139,577 140,584',[1510,413,1571,468],[115,532,161,585],[1099,831])
tunnel(c,33,34,'Door de slotpoort','807,407 820,384 824,356','866,311 875,314 885,308',[791,310,850,391],None,[929,534])
rail(c,'slotbrug-front','645,572 699,519 751,463 799,417 844,387',4);bridge(c,27,33,'Over de slotbrug')
# Veluwe.
c=kaart('veluwe','1522,854 1404,825 1319,791 1246,748 1228,699 1267,654 1306,615 1312,574 1275,535 1219,500 1166,470 1106,449 1054,430 1006,415 955,403 911,385 901,367 865,349 836,332 525,259 476,253 432,239 397,220 351,205 298,198 248,189 199,181 127,163','t c d t s c d t s c d t s c d t s d s t s c d t s c')
tunnel(c,18,19,'Zandheuveltunnel','836,332 831,325 827,313','496,225 501,242 525,259',[802,270,890,338],[466,178,536,238],[707,211])
rail(c,'zandbrug-front','818,397 864,408 925,427 1009,452 1097,481 1156,511',5);bridge(c,9,15,'Over de zandbrug')

# Small alignment refinements against the actual painted shape interiors.
corrections=[{'id': 'nederland-leiden', 'node': 11, 'old': [919, 421], 'new': [922, 418], 'shape': 'circle'}, {'id': 'nederland-amersfoort', 'node': 10, 'old': [286, 426], 'new': [276, 430], 'shape': 'square'}, {'id': 'nederland-amersfoort', 'node': 11, 'old': [304, 196], 'new': [304, 198], 'shape': 'circle'}, {'id': 'nederland-den-bosch', 'node': 5, 'old': [775, 601], 'new': [772, 601], 'shape': 'diamond'}, {'id': 'nederland-den-bosch', 'node': 7, 'old': [942, 552], 'new': [941, 551], 'shape': 'square'}, {'id': 'nederland-den-bosch', 'node': 15, 'old': [1177, 304], 'new': [1179, 304], 'shape': 'diamond'}, {'id': 'nederland-nijmegen', 'node': 7, 'old': [1159, 560], 'new': [1158, 567], 'shape': 'square'}, {'id': 'nederland-deventer', 'node': 12, 'old': [1028, 374], 'new': [1032, 374], 'shape': 'square'}, {'id': 'nederland-deventer', 'node': 14, 'old': [1045, 338], 'new': [1045, 341], 'shape': 'diamond'}, {'id': 'nederland-giethoorn', 'node': 22, 'old': [1358, 181], 'new': [1365, 171], 'shape': 'square'}, {'id': 'nederland-biesbosch', 'node': 19, 'old': [1150, 657], 'new': [1149, 652], 'shape': 'triangle'}, {'id': 'nederland-biesbosch', 'node': 20, 'old': [1066, 643], 'new': [1068, 636], 'shape': 'square'}, {'id': 'nederland-biesbosch', 'node': 21, 'old': [989, 632], 'new': [986, 628], 'shape': 'circle'}, {'id': 'nederland-muiderslot', 'node': 34, 'old': [885, 308], 'new': [883, 305], 'shape': 'circle'}, {'id': 'nederland-veluwe', 'node': 11, 'old': [1106, 449], 'new': [1106, 450], 'shape': 'diamond'}, {'id': 'nederland-veluwe', 'node': 12, 'old': [1054, 430], 'new': [1054, 427], 'shape': 'triangle'}, {'id': 'nederland-veluwe', 'node': 13, 'old': [1006, 415], 'new': [1006, 411], 'shape': 'square'}, {'id': 'nederland-veluwe', 'node': 14, 'old': [955, 403], 'new': [959, 399], 'shape': 'circle'}, {'id': 'nederland-veluwe', 'node': 19, 'old': [525, 259], 'new': [525, 258], 'shape': 'square'}]
for fix in corrections:
 c=next(c for c in C if c['id']==fix['id']);old=fix['old'];new=fix['new'];idx=c['anchors'].index(old) if old in c['anchors'] else fix['node'];c['anchors'][idx]=new
 for p in c['passages']:
  for key in ['enter','exit','water']:
   if key in p:p[key]=[new if pt==old else pt for pt in p[key]]
 for key,points in c['waypoints'].items():c['waypoints'][key]=[new if pt==old else pt for pt in points]
c=next(c for c in C if c['slug']=='muiderslot');ss=c['shapeString'].split();ss[1]='t';c['shapeString']=' '.join(ss)

# Nijmegen uses the park bridge before the finish, without a loop through the finish.
c=next(c for c in C if c['slug']=='nijmegen')
old=c['anchors'];forms=c['shapeString'].split();indices=list(range(1,26))+list(range(37,30,-1))
c['anchors']=[old[0]]+[old[n] for n in indices]+[old[-1]]
c['shapeString']=' '.join(forms[n-1] for n in indices)
c['waypoints']={'17':c['waypoints']['17']}
way(c,25,'725,252 775,265 818,280 856,299 891,293 930,296 973,305 1018,320 1063,332 1102,336 1132,351')
c['masks']=[m for m in c['masks'] if m['id']!='parkbrug-front']
rail(c,'parkbrug-front','835,291 884,276 937,278 993,289 1051,309',4)
way(c,30,'1416,391 1472,375 1514,347')
way(c,32,'1531,319 1544,294 1549,269')
c['previews']=[];bridge(c,25,26,'Over de parkbrug')

if __name__=='__main__':
 Path('work/nederland-speelbaar/routes.json').write_text(json.dumps(C,ensure_ascii=False,indent=2));print([(c['slug'],len(c['anchors'])-2,len(c['shapeString'].split())) for c in C])
