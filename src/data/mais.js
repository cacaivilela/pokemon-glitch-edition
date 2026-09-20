// AS QUE FALTAVAM: 523 espécies de Johto pra frente, montadas por
// tools/fetch_species.py a partir da PokeAPI (nome, tipos, atributos-base e
// evolução). Não são de Kanto: as de Johto moram no mato das ilhas SEVII —
// como no FireRed — e as outras vazam pela 011GLITCHDIMENSION110, por terreno
// (ver `MAIS_SEVII` e `MAIS_DIM`, montados em src/data/index.js).
// Formato igual ao de extra.js: dex NOME TIPO1[/TIPO2] HP ATK DEF SPA SPD SPE.
// Regenerar: python3 tools/fetch_species.py && python3 tools/fetch_sprites.py --mais
const TABLE = `
163 HOOTHOOT NORMAL/VOADOR 60 30 30 36 56 50
164 NOCTOWL NORMAL/VOADOR 100 50 50 86 96 70
169 CROBAT VENENO/VOADOR 85 90 80 70 80 130
170 CHINCHOU ÁGUA/ELÉTRICO 75 38 38 56 56 67
171 LANTURN ÁGUA/ELÉTRICO 125 58 58 76 76 67
175 TOGEPI FADA 35 20 65 40 65 20
176 TOGETIC FADA/VOADOR 55 40 85 80 105 40
179 MAREEP ELÉTRICO 55 40 40 65 45 35
180 FLAAFFY ELÉTRICO 70 55 55 80 60 45
181 AMPHAROS ELÉTRICO 90 75 85 115 90 55
182 BELLOSSOM PLANTA 75 80 95 90 100 50
185 SUDOWOODO PEDRA 70 100 115 30 65 30
186 POLITOED ÁGUA 90 75 75 90 100 70
190 AIPOM NORMAL 55 70 55 40 55 85
191 SUNKERN PLANTA 30 30 30 30 30 30
192 SUNFLORA PLANTA 75 75 55 105 85 30
196 ESPEON PSÍQUICO 65 65 60 130 95 110
197 UMBREON SOMBRIO 95 65 110 60 130 65
198 MURKROW SOMBRIO/VOADOR 60 85 42 85 42 91
199 SLOWKING ÁGUA/PSÍQUICO 95 75 80 100 110 30
203 GIRAFARIG NORMAL/PSÍQUICO 70 80 65 90 65 85
204 PINECO INSETO 50 65 90 35 35 15
205 FORRETRESS INSETO/AÇO 75 90 140 60 60 40
207 GLIGAR TERRA/VOADOR 65 75 105 35 65 85
208 STEELIX AÇO/TERRA 75 85 200 55 65 30
209 SNUBBULL FADA 60 80 50 40 40 30
210 GRANBULL FADA 90 120 75 60 60 45
212 SCIZOR INSETO/AÇO 70 130 100 55 80 65
213 SHUCKLE INSETO/PEDRA 20 10 230 10 230 5
223 REMORAID ÁGUA 35 65 35 65 35 65
224 OCTILLERY ÁGUA 75 105 75 105 75 45
225 DELIBIRD GELO/VOADOR 45 55 45 65 45 75
226 MANTINE ÁGUA/VOADOR 85 40 70 80 140 70
227 SKARMORY AÇO/VOADOR 65 80 140 40 70 70
228 HOUNDOUR SOMBRIO/FOGO 45 60 30 80 50 65
229 HOUNDOOM SOMBRIO/FOGO 75 90 50 110 80 95
230 KINGDRA ÁGUA/DRAGÃO 75 95 95 95 95 85
234 STANTLER NORMAL 73 95 62 85 65 85
236 TYROGUE LUTADOR 35 35 35 35 35 35
237 HITMONTOP LUTADOR 50 95 95 35 110 70
241 MILTANK NORMAL 95 80 105 40 70 100
242 BLISSEY NORMAL 255 10 10 75 135 55
243 RAIKOU ELÉTRICO 90 85 75 115 100 115
244 ENTEI FOGO 115 115 85 90 75 100
245 SUICUNE ÁGUA 100 75 115 90 115 85
249 LUGIA PSÍQUICO/VOADOR 106 90 130 90 154 110
250 HO-OH FOGO/VOADOR 106 130 90 110 154 90
261 POOCHYENA SOMBRIO 35 55 35 30 30 35
262 MIGHTYENA SOMBRIO 70 90 70 60 60 70
265 WURMPLE INSETO 45 45 35 20 30 20
266 SILCOON INSETO 50 35 55 25 25 15
267 BEAUTIFLY INSETO/VOADOR 60 70 50 100 50 65
268 CASCOON INSETO 50 35 55 25 25 15
269 DUSTOX INSETO/VENENO 60 50 70 50 90 65
270 LOTAD ÁGUA/PLANTA 40 30 30 40 50 30
271 LOMBRE ÁGUA/PLANTA 60 50 50 60 70 50
272 LUDICOLO ÁGUA/PLANTA 80 70 70 90 100 70
273 SEEDOT PLANTA 40 40 50 30 30 30
274 NUZLEAF PLANTA/SOMBRIO 70 70 40 60 40 60
275 SHIFTRY PLANTA/SOMBRIO 90 100 60 90 60 80
276 TAILLOW NORMAL/VOADOR 40 55 30 30 30 85
277 SWELLOW NORMAL/VOADOR 60 85 60 75 50 125
278 WINGULL ÁGUA/VOADOR 40 30 30 55 30 85
279 PELIPPER ÁGUA/VOADOR 60 50 100 95 70 65
280 RALTS PSÍQUICO/FADA 28 25 25 45 35 40
281 KIRLIA PSÍQUICO/FADA 38 35 35 65 55 50
282 GARDEVOIR PSÍQUICO/FADA 68 65 65 125 115 80
283 SURSKIT INSETO/ÁGUA 40 30 32 50 52 65
284 MASQUERAIN INSETO/VOADOR 70 60 62 100 82 80
285 SHROOMISH PLANTA 60 40 60 40 60 35
286 BRELOOM PLANTA/LUTADOR 60 130 80 60 60 70
287 SLAKOTH NORMAL 60 60 60 35 35 30
288 VIGOROTH NORMAL 80 80 80 55 55 90
289 SLAKING NORMAL 150 160 100 95 65 100
290 NINCADA INSETO/TERRA 31 45 90 30 30 40
291 NINJASK INSETO/VOADOR 61 90 45 50 50 160
293 WHISMUR NORMAL 64 51 23 51 23 28
294 LOUDRED NORMAL 84 71 43 71 43 48
295 EXPLOUD NORMAL 104 91 63 91 73 68
296 MAKUHITA LUTADOR 72 60 30 20 30 25
297 HARIYAMA LUTADOR 144 120 60 40 60 50
299 NOSEPASS PEDRA 30 45 135 45 90 30
300 SKITTY NORMAL 50 45 45 35 35 50
301 DELCATTY NORMAL 70 65 65 55 55 90
302 SABLEYE SOMBRIO/FANTASMA 50 75 75 65 65 50
303 MAWILE AÇO/FADA 50 85 85 55 55 50
304 ARON AÇO/PEDRA 50 70 100 40 40 30
305 LAIRON AÇO/PEDRA 60 90 140 50 50 40
306 AGGRON AÇO/PEDRA 70 110 180 60 60 50
307 MEDITITE LUTADOR/PSÍQUICO 30 40 55 40 55 60
308 MEDICHAM LUTADOR/PSÍQUICO 60 60 75 60 75 80
309 ELECTRIKE ELÉTRICO 40 45 40 65 40 65
310 MANECTRIC ELÉTRICO 70 75 60 105 60 105
311 PLUSLE ELÉTRICO 60 50 40 85 75 95
312 MINUN ELÉTRICO 60 40 50 75 85 95
313 VOLBEAT INSETO 65 73 75 47 85 85
314 ILLUMISE INSETO 65 47 75 73 85 85
315 ROSELIA PLANTA/VENENO 50 60 45 100 80 65
316 GULPIN VENENO 70 43 53 43 53 40
317 SWALOT VENENO 100 73 83 73 83 55
318 CARVANHA ÁGUA/SOMBRIO 45 90 20 65 20 65
319 SHARPEDO ÁGUA/SOMBRIO 70 120 40 95 40 95
320 WAILMER ÁGUA 130 70 35 70 35 60
321 WAILORD ÁGUA 170 90 45 90 45 60
322 NUMEL FOGO/TERRA 60 60 40 65 45 35
323 CAMERUPT FOGO/TERRA 70 100 70 105 75 40
324 TORKOAL FOGO 70 85 140 85 70 20
325 SPOINK PSÍQUICO 60 25 35 70 80 60
326 GRUMPIG PSÍQUICO 80 45 65 90 110 80
327 SPINDA NORMAL 60 60 60 60 60 60
328 TRAPINCH TERRA 45 100 45 45 45 10
329 VIBRAVA TERRA/DRAGÃO 50 70 50 50 50 70
330 FLYGON TERRA/DRAGÃO 80 100 80 80 80 100
331 CACNEA PLANTA 50 85 40 85 40 35
332 CACTURNE PLANTA/SOMBRIO 70 115 60 115 60 55
333 SWABLU NORMAL/VOADOR 45 40 60 40 75 50
334 ALTARIA DRAGÃO/VOADOR 75 70 90 70 105 80
335 ZANGOOSE NORMAL 73 115 60 60 60 90
336 SEVIPER VENENO 73 100 60 100 60 65
339 BARBOACH ÁGUA/TERRA 50 48 43 46 41 60
340 WHISCASH ÁGUA/TERRA 110 78 73 76 71 60
341 CORPHISH ÁGUA 43 80 65 50 35 35
342 CRAWDAUNT ÁGUA/SOMBRIO 63 120 85 90 55 55
343 BALTOY TERRA/PSÍQUICO 40 40 55 40 70 55
344 CLAYDOL TERRA/PSÍQUICO 60 70 105 70 120 75
349 FEEBAS ÁGUA 20 15 20 10 55 80
350 MILOTIC ÁGUA 95 60 79 100 125 81
351 CASTFORM NORMAL 70 70 70 70 70 70
352 KECLEON NORMAL 60 90 70 60 120 40
353 SHUPPET FANTASMA 44 75 35 63 33 45
354 BANETTE FANTASMA 64 115 65 83 63 65
355 DUSKULL FANTASMA 20 40 90 30 90 25
356 DUSCLOPS FANTASMA 40 70 130 60 130 25
357 TROPIUS PLANTA/VOADOR 99 68 83 72 87 51
358 CHIMECHO PSÍQUICO 75 50 80 95 90 65
359 ABSOL SOMBRIO 65 130 60 75 60 75
361 SNORUNT GELO 50 50 50 50 50 50
362 GLALIE GELO 80 80 80 80 80 80
363 SPHEAL GELO/ÁGUA 70 40 50 55 50 25
364 SEALEO GELO/ÁGUA 90 60 70 75 70 45
365 WALREIN GELO/ÁGUA 110 80 90 95 90 65
366 CLAMPERL ÁGUA 35 64 85 74 55 32
367 HUNTAIL ÁGUA 55 104 105 94 75 52
368 GOREBYSS ÁGUA 55 84 105 114 75 52
370 LUVDISC ÁGUA 43 30 55 40 65 97
371 BAGON DRAGÃO 45 75 60 40 30 50
372 SHELGON DRAGÃO 65 95 100 60 50 50
373 SALAMENCE DRAGÃO/VOADOR 95 135 80 110 80 100
374 BELDUM AÇO/PSÍQUICO 40 55 80 35 60 30
375 METANG AÇO/PSÍQUICO 60 75 100 55 80 50
376 METAGROSS AÇO/PSÍQUICO 80 135 130 95 90 70
377 REGIROCK PEDRA 80 100 200 50 100 50
378 REGICE GELO 80 50 100 100 200 50
379 REGISTEEL AÇO 80 75 150 75 150 50
380 LATIAS DRAGÃO/PSÍQUICO 80 80 90 110 130 110
381 LATIOS DRAGÃO/PSÍQUICO 80 90 80 130 110 110
385 JIRACHI AÇO/PSÍQUICO 100 100 100 100 100 100
396 STARLY NORMAL/VOADOR 40 55 30 30 30 60
397 STARAVIA NORMAL/VOADOR 55 75 50 40 40 80
398 STARAPTOR NORMAL/VOADOR 85 120 70 50 60 100
399 BIDOOF NORMAL 59 45 40 35 40 31
400 BIBAREL NORMAL/ÁGUA 79 85 60 55 60 71
401 KRICKETOT INSETO 37 25 41 25 41 25
402 KRICKETUNE INSETO 77 85 51 55 51 65
403 SHINX ELÉTRICO 45 65 34 40 34 45
404 LUXIO ELÉTRICO 60 85 49 60 49 60
405 LUXRAY ELÉTRICO 80 120 79 95 79 70
406 BUDEW PLANTA/VENENO 40 30 35 50 70 55
407 ROSERADE PLANTA/VENENO 60 70 65 125 105 90
412 BURMY INSETO 40 29 45 29 45 36
413 WORMADAM INSETO/PLANTA 60 59 85 79 105 36
414 MOTHIM INSETO/VOADOR 70 94 50 94 50 66
415 COMBEE INSETO/VOADOR 30 30 42 30 42 70
416 VESPIQUEN INSETO/VOADOR 70 80 102 80 102 40
417 PACHIRISU ELÉTRICO 60 45 70 45 90 95
418 BUIZEL ÁGUA 55 65 35 60 30 85
419 FLOATZEL ÁGUA 85 105 55 85 50 115
420 CHERUBI PLANTA 45 35 45 62 53 35
421 CHERRIM PLANTA 70 60 70 87 78 85
422 SHELLOS ÁGUA 76 48 48 57 62 34
423 GASTRODON ÁGUA/TERRA 111 83 68 92 82 39
424 AMBIPOM NORMAL 75 100 66 60 66 115
425 DRIFLOON FANTASMA/VOADOR 90 50 34 60 44 70
426 DRIFBLIM FANTASMA/VOADOR 150 80 44 90 54 80
427 BUNEARY NORMAL 55 66 44 44 56 85
428 LOPUNNY NORMAL 65 76 84 54 96 105
430 HONCHKROW SOMBRIO/VOADOR 100 125 52 105 52 71
431 GLAMEOW NORMAL 49 55 42 42 37 85
432 PURUGLY NORMAL 71 82 64 64 59 112
433 CHINGLING PSÍQUICO 45 30 50 65 50 45
434 STUNKY VENENO/SOMBRIO 63 63 47 41 41 74
435 SKUNTANK VENENO/SOMBRIO 103 93 67 71 61 84
437 BRONZONG AÇO/PSÍQUICO 67 89 116 79 116 33
438 BONSLY PEDRA 50 80 95 10 45 10
441 CHATOT NORMAL/VOADOR 76 65 45 92 42 91
442 SPIRITOMB FANTASMA/SOMBRIO 50 92 108 92 108 35
443 GIBLE DRAGÃO/TERRA 58 70 45 40 45 42
444 GABITE DRAGÃO/TERRA 68 90 65 50 55 82
445 GARCHOMP DRAGÃO/TERRA 108 130 95 80 85 102
447 RIOLU LUTADOR 40 70 40 35 40 60
448 LUCARIO LUTADOR/AÇO 70 110 70 115 70 90
449 HIPPOPOTAS TERRA 68 72 78 38 42 32
450 HIPPOWDON TERRA 108 112 118 68 72 47
451 SKORUPI VENENO/INSETO 40 50 90 30 55 65
452 DRAPION VENENO/SOMBRIO 70 90 110 60 75 95
453 CROAGUNK VENENO/LUTADOR 48 61 40 61 40 50
454 TOXICROAK VENENO/LUTADOR 83 106 65 86 65 85
455 CARNIVINE PLANTA 74 100 72 90 72 46
456 FINNEON ÁGUA 49 49 56 49 61 66
457 LUMINEON ÁGUA 69 69 76 69 86 91
458 MANTYKE ÁGUA/VOADOR 45 20 50 60 120 50
459 SNOVER PLANTA/GELO 60 62 50 62 60 40
460 ABOMASNOW PLANTA/GELO 90 92 75 92 85 60
462 MAGNEZONE ELÉTRICO/AÇO 70 70 115 130 90 60
463 LICKILICKY NORMAL 110 85 95 80 95 50
464 RHYPERIOR TERRA/PEDRA 115 140 130 55 55 40
465 TANGROWTH PLANTA 100 100 125 110 50 50
466 ELECTIVIRE ELÉTRICO 75 123 67 95 85 95
467 MAGMORTAR FOGO 75 95 67 125 95 83
468 TOGEKISS FADA/VOADOR 85 50 95 120 115 80
470 LEAFEON PLANTA 65 110 130 60 65 95
471 GLACEON GELO 65 60 110 130 95 65
472 GLISCOR TERRA/VOADOR 75 95 125 45 75 95
475 GALLADE PSÍQUICO/LUTADOR 68 125 65 65 115 80
476 PROBOPASS PEDRA/AÇO 60 55 145 75 150 40
477 DUSKNOIR FANTASMA 45 100 135 65 135 45
478 FROSLASS GELO/FANTASMA 70 80 70 80 70 110
480 UXIE PSÍQUICO 75 75 130 75 130 95
481 MESPRIT PSÍQUICO 80 105 105 105 105 80
482 AZELF PSÍQUICO 75 125 70 125 70 115
485 HEATRAN FOGO/AÇO 91 90 106 130 106 77
486 REGIGIGAS NORMAL 110 160 110 80 110 100
487 GIRATINA FANTASMA/DRAGÃO 150 100 120 100 120 90
488 CRESSELIA PSÍQUICO 120 70 110 75 120 85
489 PHIONE ÁGUA 80 80 80 80 80 80
490 MANAPHY ÁGUA 100 100 100 100 100 100
491 DARKRAI SOMBRIO 70 90 90 135 90 125
492 SHAYMIN PLANTA 100 100 100 100 100 100
494 VICTINI PSÍQUICO/FOGO 100 100 100 100 100 100
504 PATRAT NORMAL 45 55 39 35 39 42
505 WATCHOG NORMAL 60 85 69 60 69 77
506 LILLIPUP NORMAL 45 60 45 25 45 55
507 HERDIER NORMAL 65 80 65 35 65 60
508 STOUTLAND NORMAL 85 110 90 45 90 80
509 PURRLOIN SOMBRIO 41 50 37 50 37 66
510 LIEPARD SOMBRIO 64 88 50 88 50 106
511 PANSAGE PLANTA 50 53 48 53 48 64
512 SIMISAGE PLANTA 75 98 63 98 63 101
513 PANSEAR FOGO 50 53 48 53 48 64
514 SIMISEAR FOGO 75 98 63 98 63 101
515 PANPOUR ÁGUA 50 53 48 53 48 64
516 SIMIPOUR ÁGUA 75 98 63 98 63 101
517 MUNNA PSÍQUICO 76 25 45 67 55 24
518 MUSHARNA PSÍQUICO 116 55 85 107 95 29
519 PIDOVE NORMAL/VOADOR 50 55 50 36 30 43
520 TRANQUILL NORMAL/VOADOR 62 77 62 50 42 65
521 UNFEZANT NORMAL/VOADOR 80 115 80 65 55 93
522 BLITZLE ELÉTRICO 45 60 32 50 32 76
523 ZEBSTRIKA ELÉTRICO 75 100 63 80 63 116
524 ROGGENROLA PEDRA 55 75 85 25 25 15
525 BOLDORE PEDRA 70 105 105 50 40 20
526 GIGALITH PEDRA 85 135 130 60 80 25
527 WOOBAT PSÍQUICO/VOADOR 65 45 43 55 43 72
528 SWOOBAT PSÍQUICO/VOADOR 67 57 55 77 55 114
529 DRILBUR TERRA 60 85 40 30 45 68
530 EXCADRILL TERRA/AÇO 110 135 60 50 65 88
531 AUDINO NORMAL 103 60 86 60 86 50
532 TIMBURR LUTADOR 75 80 55 25 35 35
533 GURDURR LUTADOR 85 105 85 40 50 40
534 CONKELDURR LUTADOR 105 140 95 55 65 45
535 TYMPOLE ÁGUA 50 50 40 50 40 64
536 PALPITOAD ÁGUA/TERRA 75 65 55 65 55 69
537 SEISMITOAD ÁGUA/TERRA 105 95 75 85 75 74
538 THROH LUTADOR 120 100 85 30 85 45
539 SAWK LUTADOR 75 125 75 30 75 85
540 SEWADDLE INSETO/PLANTA 45 53 70 40 60 42
541 SWADLOON INSETO/PLANTA 55 63 90 50 80 42
542 LEAVANNY INSETO/PLANTA 75 103 80 70 80 92
543 VENIPEDE INSETO/VENENO 30 45 59 30 39 57
544 WHIRLIPEDE INSETO/VENENO 40 55 99 40 79 47
545 SCOLIPEDE INSETO/VENENO 60 100 89 55 69 112
546 COTTONEE PLANTA/FADA 40 27 60 37 50 66
547 WHIMSICOTT PLANTA/FADA 60 67 85 77 75 116
551 SANDILE TERRA/SOMBRIO 50 72 35 35 35 65
552 KROKOROK TERRA/SOMBRIO 60 82 45 45 45 74
553 KROOKODILE TERRA/SOMBRIO 95 117 80 65 70 92
556 MARACTUS PLANTA 75 86 67 106 67 60
557 DWEBBLE INSETO/PEDRA 50 65 85 35 35 55
558 CRUSTLE INSETO/PEDRA 70 105 125 65 75 45
559 SCRAGGY SOMBRIO/LUTADOR 50 75 70 35 70 48
560 SCRAFTY SOMBRIO/LUTADOR 65 90 115 45 115 58
561 SIGILYPH PSÍQUICO/VOADOR 72 58 80 103 80 97
568 TRUBBISH VENENO 50 50 62 40 62 65
569 GARBODOR VENENO 80 95 82 60 82 75
572 MINCCINO NORMAL 55 50 40 40 40 75
573 CINCCINO NORMAL 75 95 60 65 60 115
574 GOTHITA PSÍQUICO 45 30 50 55 65 45
575 GOTHORITA PSÍQUICO 60 45 70 75 85 55
576 GOTHITELLE PSÍQUICO 70 55 95 95 110 65
577 SOLOSIS PSÍQUICO 45 30 40 105 50 20
578 DUOSION PSÍQUICO 65 40 50 125 60 30
579 REUNICLUS PSÍQUICO 110 65 75 125 85 30
580 DUCKLETT ÁGUA/VOADOR 62 44 50 44 50 55
581 SWANNA ÁGUA/VOADOR 75 87 63 87 63 98
582 VANILLITE GELO 36 50 50 65 60 44
583 VANILLISH GELO 51 65 65 80 75 59
584 VANILLUXE GELO 71 95 85 110 95 79
585 DEERLING NORMAL/PLANTA 60 60 50 40 50 75
586 SAWSBUCK NORMAL/PLANTA 80 100 70 60 70 95
587 EMOLGA ELÉTRICO/VOADOR 55 75 60 75 60 103
588 KARRABLAST INSETO 50 75 45 40 45 60
589 ESCAVALIER INSETO/AÇO 70 135 105 60 105 20
590 FOONGUS PLANTA/VENENO 69 55 45 55 55 15
591 AMOONGUSS PLANTA/VENENO 114 85 70 85 80 30
592 FRILLISH ÁGUA/FANTASMA 55 40 50 65 85 40
593 JELLICENT ÁGUA/FANTASMA 100 60 70 85 105 60
594 ALOMOMOLA ÁGUA 165 75 80 40 45 65
595 JOLTIK INSETO/ELÉTRICO 50 47 50 57 50 65
596 GALVANTULA INSETO/ELÉTRICO 70 77 60 97 60 108
597 FERROSEED PLANTA/AÇO 44 50 91 24 86 10
598 FERROTHORN PLANTA/AÇO 74 94 131 54 116 20
600 KLANG AÇO 60 80 95 70 85 50
601 KLINKLANG AÇO 60 100 115 70 85 90
602 TYNAMO ELÉTRICO 35 55 40 45 40 60
603 EELEKTRIK ELÉTRICO 65 85 70 75 70 40
604 EELEKTROSS ELÉTRICO 85 115 80 105 80 50
610 AXEW DRAGÃO 46 87 60 30 40 57
611 FRAXURE DRAGÃO 66 117 70 40 50 67
612 HAXORUS DRAGÃO 76 147 90 60 70 97
613 CUBCHOO GELO 55 70 40 60 40 40
614 BEARTIC GELO 95 130 80 70 80 50
616 SHELMET INSETO 50 40 85 40 65 25
617 ACCELGOR INSETO 80 70 40 100 60 145
619 MIENFOO LUTADOR 45 85 50 55 50 65
620 MIENSHAO LUTADOR 65 125 60 95 60 105
621 DRUDDIGON DRAGÃO 77 120 90 60 90 48
623 GOLURK TERRA/FANTASMA 89 124 80 55 80 55
624 PAWNIARD SOMBRIO/AÇO 45 85 70 40 40 60
625 BISHARP SOMBRIO/AÇO 65 125 100 60 70 70
626 BOUFFALANT NORMAL 95 110 95 40 95 55
629 VULLABY SOMBRIO/VOADOR 70 55 75 45 65 60
630 MANDIBUZZ SOMBRIO/VOADOR 110 65 105 55 95 80
631 HEATMOR FOGO 85 97 66 105 66 65
632 DURANT INSETO/AÇO 58 109 112 48 48 109
633 DEINO SOMBRIO/DRAGÃO 52 65 50 45 50 38
634 ZWEILOUS SOMBRIO/DRAGÃO 72 85 70 65 70 58
635 HYDREIGON SOMBRIO/DRAGÃO 92 105 90 125 90 98
636 LARVESTA INSETO/FOGO 55 85 55 50 55 60
637 VOLCARONA INSETO/FOGO 85 60 65 135 105 100
638 COBALION AÇO/LUTADOR 91 90 129 90 72 108
639 TERRAKION PEDRA/LUTADOR 91 129 90 72 90 108
640 VIRIZION PLANTA/LUTADOR 91 90 72 90 129 108
643 RESHIRAM DRAGÃO/FOGO 100 120 100 150 120 90
644 ZEKROM DRAGÃO/ELÉTRICO 100 150 120 120 100 90
646 KYUREM DRAGÃO/GELO 125 130 90 130 90 95
647 KELDEO ÁGUA/LUTADOR 91 72 90 129 90 108
648 MELOETTA NORMAL/PSÍQUICO 100 77 77 128 128 90
659 BUNNELBY NORMAL 38 36 38 32 36 57
660 DIGGERSBY NORMAL/TERRA 85 56 77 50 77 78
661 FLETCHLING NORMAL/VOADOR 45 50 43 40 38 62
662 FLETCHINDER FOGO/VOADOR 62 73 55 56 52 84
663 TALONFLAME FOGO/VOADOR 78 81 71 74 69 126
664 SCATTERBUG INSETO 38 35 40 27 25 35
665 SPEWPA INSETO 45 22 60 27 30 29
666 VIVILLON INSETO/VOADOR 80 52 50 90 50 89
667 LITLEO FOGO/NORMAL 62 50 58 73 54 72
668 PYROAR FOGO/NORMAL 86 68 72 109 66 106
669 FLABÉBÉ FADA 44 38 39 61 79 42
670 FLOETTE FADA 54 45 47 75 98 52
671 FLORGES FADA 78 65 68 112 154 75
672 SKIDDO PLANTA 66 65 48 62 57 52
673 GOGOAT PLANTA 123 100 62 97 81 68
674 PANCHAM LUTADOR 67 82 62 46 48 43
675 PANGORO LUTADOR/SOMBRIO 95 124 78 69 71 58
676 FURFROU NORMAL 75 80 60 65 90 102
677 ESPURR PSÍQUICO 62 48 54 63 60 68
678 MEOWSTIC PSÍQUICO 74 48 76 83 81 104
679 HONEDGE AÇO/FANTASMA 45 80 100 35 37 28
680 DOUBLADE AÇO/FANTASMA 59 110 150 45 49 35
681 AEGISLASH AÇO/FANTASMA 60 50 140 50 140 60
682 SPRITZEE FADA 78 52 60 63 65 23
683 AROMATISSE FADA 101 72 72 99 89 29
684 SWIRLIX FADA 62 48 66 59 57 49
685 SLURPUFF FADA 82 80 86 85 75 72
686 INKAY SOMBRIO/PSÍQUICO 53 54 53 37 46 45
687 MALAMAR SOMBRIO/PSÍQUICO 86 92 88 68 75 73
688 BINACLE PEDRA/ÁGUA 42 52 67 39 56 50
689 BARBARACLE PEDRA/ÁGUA 72 105 115 54 86 68
690 SKRELP VENENO/ÁGUA 50 60 60 60 60 30
691 DRAGALGE VENENO/DRAGÃO 65 75 90 97 123 44
692 CLAUNCHER ÁGUA 50 53 62 58 63 44
693 CLAWITZER ÁGUA 71 73 88 120 89 59
694 HELIOPTILE ELÉTRICO/NORMAL 44 38 33 61 43 70
695 HELIOLISK ELÉTRICO/NORMAL 62 55 52 109 94 109
700 SYLVEON FADA 95 65 65 110 130 60
701 HAWLUCHA LUTADOR/VOADOR 78 92 75 74 63 118
702 DEDENNE ELÉTRICO/FADA 67 58 57 81 67 101
703 CARBINK PEDRA/FADA 50 50 150 50 150 50
707 KLEFKI AÇO/FADA 57 80 91 80 87 75
708 PHANTUMP FANTASMA/PLANTA 43 70 48 50 60 38
709 TREVENANT FANTASMA/PLANTA 85 110 76 65 82 56
710 PUMPKABOO FANTASMA/PLANTA 49 66 70 44 55 51
711 GOURGEIST FANTASMA/PLANTA 65 90 122 58 75 84
714 NOIBAT VOADOR/DRAGÃO 40 30 35 45 40 55
715 NOIVERN VOADOR/DRAGÃO 85 70 80 97 80 123
719 DIANCIE PEDRA/FADA 50 100 150 100 150 50
720 HOOPA PSÍQUICO/FANTASMA 80 110 60 150 130 70
721 VOLCANION FOGO/ÁGUA 80 110 120 130 90 70
731 PIKIPEK NORMAL/VOADOR 35 75 30 30 30 65
732 TRUMBEAK NORMAL/VOADOR 55 85 50 40 50 75
733 TOUCANNON NORMAL/VOADOR 80 120 75 75 75 60
734 YUNGOOS NORMAL 48 70 30 30 30 45
735 GUMSHOOS NORMAL 88 110 60 55 60 45
736 GRUBBIN INSETO 47 62 45 55 45 46
737 CHARJABUG INSETO/ELÉTRICO 57 82 95 55 75 36
738 VIKAVOLT INSETO/ELÉTRICO 77 70 90 145 75 43
739 CRABRAWLER LUTADOR 47 82 57 42 47 63
740 CRABOMINABLE LUTADOR/GELO 97 132 77 62 67 43
741 ORICORIO FOGO/VOADOR 75 70 70 98 70 93
742 CUTIEFLY INSETO/FADA 40 45 40 55 40 84
743 RIBOMBEE INSETO/FADA 60 55 60 95 70 124
744 ROCKRUFF PEDRA 45 65 40 30 40 60
745 LYCANROC PEDRA 75 115 65 55 65 112
746 WISHIWASHI ÁGUA 45 20 20 25 25 40
747 MAREANIE VENENO/ÁGUA 50 53 62 43 52 45
748 TOXAPEX VENENO/ÁGUA 50 63 152 53 142 35
749 MUDBRAY TERRA 70 100 70 45 55 45
750 MUDSDALE TERRA 100 125 100 55 85 35
751 DEWPIDER ÁGUA/INSETO 38 40 52 40 72 27
752 ARAQUANID ÁGUA/INSETO 68 70 92 50 132 42
753 FOMANTIS PLANTA 40 55 35 50 35 35
754 LURANTIS PLANTA 70 105 90 80 90 45
755 MORELULL PLANTA/FADA 40 35 55 65 75 15
756 SHIINOTIC PLANTA/FADA 60 45 80 90 100 30
757 SALANDIT VENENO/FOGO 48 44 40 71 40 77
758 SALAZZLE VENENO/FOGO 68 64 60 111 60 117
759 STUFFUL NORMAL/LUTADOR 70 75 50 45 50 50
760 BEWEAR NORMAL/LUTADOR 120 125 80 55 60 60
761 BOUNSWEET PLANTA 42 30 38 30 38 32
762 STEENEE PLANTA 52 40 48 40 48 62
763 TSAREENA PLANTA 72 120 98 50 98 72
764 COMFEY FADA 51 52 90 82 110 100
765 ORANGURU NORMAL/PSÍQUICO 90 60 80 90 110 60
766 PASSIMIAN LUTADOR 100 120 90 40 60 80
767 WIMPOD INSETO/ÁGUA 25 35 40 20 30 80
768 GOLISOPOD INSETO/ÁGUA 75 125 140 60 90 40
769 SANDYGAST FANTASMA/TERRA 55 55 80 70 45 15
770 PALOSSAND FANTASMA/TERRA 85 75 110 100 75 35
771 PYUKUMUKU ÁGUA 55 60 130 30 130 5
772 TYPE:-NULL NORMAL 95 95 95 95 95 59
773 SILVALLY NORMAL 95 95 95 95 95 95
774 MINIOR PEDRA/VOADOR 60 60 100 60 100 60
775 KOMALA NORMAL 65 115 65 75 95 65
776 TURTONATOR FOGO/DRAGÃO 60 78 135 91 85 36
777 TOGEDEMARU ELÉTRICO/AÇO 65 98 63 40 73 96
778 MIMIKYU FANTASMA/FADA 55 90 80 50 105 96
779 BRUXISH ÁGUA/PSÍQUICO 68 105 70 70 70 92
780 DRAMPA NORMAL/DRAGÃO 78 60 85 135 91 36
781 DHELMISE FANTASMA/PLANTA 70 131 100 86 90 40
782 JANGMO-O DRAGÃO 45 55 65 45 45 45
783 HAKAMO-O DRAGÃO/LUTADOR 55 75 90 65 70 65
784 KOMMO-O DRAGÃO/LUTADOR 75 110 125 100 105 85
785 TAPU-KOKO ELÉTRICO/FADA 70 115 85 95 75 130
786 TAPU-LELE PSÍQUICO/FADA 70 85 75 130 115 95
787 TAPU-BULU PLANTA/FADA 70 130 115 85 95 75
788 TAPU-FINI ÁGUA/FADA 70 75 115 95 130 85
789 COSMOG PSÍQUICO 43 29 31 29 31 37
790 COSMOEM PSÍQUICO 43 29 131 29 131 37
791 SOLGALEO PSÍQUICO/AÇO 137 137 107 113 89 97
792 LUNALA PSÍQUICO/FANTASMA 137 113 89 137 107 97
793 NIHILEGO PEDRA/VENENO 109 53 47 127 131 103
794 BUZZWOLE INSETO/LUTADOR 107 139 139 53 53 79
795 PHEROMOSA INSETO/LUTADOR 71 137 37 137 37 151
796 XURKITREE ELÉTRICO 83 89 71 173 71 83
797 CELESTEELA AÇO/VOADOR 97 101 103 107 101 61
798 KARTANA PLANTA/AÇO 59 181 131 59 31 109
799 GUZZLORD SOMBRIO/DRAGÃO 223 101 53 97 53 43
800 NECROZMA PSÍQUICO 97 107 101 127 89 79
801 MAGEARNA AÇO/FADA 80 95 115 130 115 65
802 MARSHADOW LUTADOR/FANTASMA 90 125 80 90 90 125
803 POIPOLE VENENO 67 73 67 73 67 73
804 NAGANADEL VENENO/DRAGÃO 73 73 73 127 73 121
805 STAKATAKA PEDRA/AÇO 61 131 211 53 101 13
806 BLACEPHALON FOGO/FANTASMA 53 127 53 151 79 107
807 ZERAORA ELÉTRICO 88 112 75 102 80 143
819 SKWOVET NORMAL 70 55 55 35 35 25
820 GREEDENT NORMAL 120 95 95 55 75 20
821 ROOKIDEE VOADOR 38 47 35 33 35 57
822 CORVISQUIRE VOADOR 68 67 55 43 55 77
823 CORVIKNIGHT VOADOR/AÇO 98 87 105 53 85 67
824 BLIPBUG INSETO 25 20 20 25 45 45
825 DOTTLER INSETO/PSÍQUICO 50 35 80 50 90 30
826 ORBEETLE INSETO/PSÍQUICO 60 45 110 80 120 90
827 NICKIT SOMBRIO 40 28 28 47 52 50
828 THIEVUL SOMBRIO 70 58 58 87 92 90
829 GOSSIFLEUR PLANTA 40 40 60 40 60 10
830 ELDEGOSS PLANTA 60 50 90 80 120 60
831 WOOLOO NORMAL 42 40 55 40 45 48
832 DUBWOOL NORMAL 72 80 100 60 90 88
833 CHEWTLE ÁGUA 50 64 50 38 38 44
834 DREDNAW ÁGUA/PEDRA 90 115 90 48 68 74
835 YAMPER ELÉTRICO 59 45 50 40 50 26
836 BOLTUND ELÉTRICO 69 90 60 90 60 121
837 ROLYCOLY PEDRA 30 40 50 40 50 30
838 CARKOL PEDRA/FOGO 80 60 90 60 70 50
839 COALOSSAL PEDRA/FOGO 110 80 120 80 90 30
840 APPLIN PLANTA/DRAGÃO 40 40 80 40 40 20
841 FLAPPLE PLANTA/DRAGÃO 70 110 80 95 60 70
842 APPLETUN PLANTA/DRAGÃO 110 85 80 100 80 30
843 SILICOBRA TERRA 52 57 75 35 50 46
844 SANDACONDA TERRA 72 107 125 65 70 71
845 CRAMORANT VOADOR/ÁGUA 70 85 55 85 95 85
846 ARROKUDA ÁGUA 41 63 40 40 30 66
847 BARRASKEWDA ÁGUA 61 123 60 60 50 136
848 TOXEL ELÉTRICO/VENENO 40 38 35 54 35 40
849 TOXTRICITY ELÉTRICO/VENENO 75 98 70 114 70 75
850 SIZZLIPEDE FOGO/INSETO 50 65 45 50 50 45
851 CENTISKORCH FOGO/INSETO 100 115 65 90 90 65
852 CLOBBOPUS LUTADOR 50 68 60 50 50 32
853 GRAPPLOCT LUTADOR 80 118 90 70 80 42
854 SINISTEA FANTASMA 40 45 45 74 54 50
855 POLTEAGEIST FANTASMA 60 65 65 134 114 70
856 HATENNA PSÍQUICO 42 30 45 56 53 39
`;

/** As frases de Pokédex escritas à mão. O resto fica com o texto genérico —
 *  "dados ainda não carregados" é exatamente o que uma espécie que vazou é. */
const LORE = {
  uxie: "O SER DO CONHECIMENTO. QUEM OLHA NOS OLHOS DELE ESQUECE TUDO — POR ISSO ELE NÃO ABRE OS OLHOS.",
  mesprit: "O SER DA EMOÇÃO. FOI ELE QUE ENSINOU AS PESSOAS A SENTIR ALEGRIA E TRISTEZA. DEPOIS FOI DORMIR NO FUNDO DE UM LAGO.",
  azelf: "O SER DA VONTADE. QUEM ENCOSTA NELE PERDE A VONTADE DE FAZER QUALQUER COISA, E FICA PARADO PRA SEMPRE.",
};

export const MAIS = {};
for (const line of TABLE.trim().split("\n")) {
  if (!line.trim()) continue;
  const [dex, name, types, hp, atk, def, spa, spd, spe] = line.trim().split(/\s+/);
  const base = { hp: +hp, atk: +atk, def: +def, spa: +spa, spd: +spd, spe: +spe };
  const bst = Object.values(base).reduce((a, b) => a + b, 0);
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  MAIS[id] = {
    id, dex: +dex, name: name.replace(/-/g, " "), types: types.split("/"), base, bst, foreign: true,
    dexText: LORE[id],
    catchRate: bst >= 600 ? 3 : bst >= 500 ? 45 : bst >= 400 ? 90 : 160,
    xpYield: Math.floor(bst / 4),
  };
}

/** as regras de evolução (troca e felicidade viraram nível, como no resto do jogo) */
export const EVO_MAIS = {
  pineco: [{ lvl: 31, to: "forretress" }],
  gligar: [{ lvl: 32, to: "gliscor" }],
  snubbull: [{ lvl: 23, to: "granbull" }],
  remoraid: [{ lvl: 25, to: "octillery" }],
  mantyke: [{ lvl: 32, to: "mantine" }],
  houndour: [{ lvl: 24, to: "houndoom" }],
  poochyena: [{ lvl: 18, to: "mightyena" }],
  silcoon: [{ lvl: 10, to: "beautifly" }],
  cascoon: [{ lvl: 10, to: "dustox" }],
  wurmple: [{ lvl: 7, onde: "fenda", to: "cascoon" }, { lvl: 7, to: "silcoon" }],
  lombre: [{ item: "pedra da água", to: "ludicolo" }],
  lotad: [{ lvl: 14, to: "lombre" }],
  nuzleaf: [{ item: "pedra da folha", to: "shiftry" }],
  seedot: [{ lvl: 14, to: "nuzleaf" }],
  taillow: [{ lvl: 22, to: "swellow" }],
  wingull: [{ lvl: 25, to: "pelipper" }],
  kirlia: [{ lvl: 30, onde: "fenda", to: "gallade" }, { lvl: 30, to: "gardevoir" }],
  ralts: [{ lvl: 20, to: "kirlia" }],
  surskit: [{ lvl: 22, to: "masquerain" }],
  shroomish: [{ lvl: 23, to: "breloom" }],
  vigoroth: [{ lvl: 36, to: "slaking" }],
  slakoth: [{ lvl: 18, to: "vigoroth" }],
  nincada: [{ lvl: 20, to: "ninjask" }],
  loudred: [{ lvl: 40, to: "exploud" }],
  whismur: [{ lvl: 20, to: "loudred" }],
  makuhita: [{ lvl: 24, to: "hariyama" }],
  nosepass: [{ lvl: 32, to: "probopass" }],
  skitty: [{ item: "pedra da lua", to: "delcatty" }],
  lairon: [{ lvl: 42, to: "aggron" }],
  aron: [{ lvl: 32, to: "lairon" }],
  meditite: [{ lvl: 37, to: "medicham" }],
  electrike: [{ lvl: 26, to: "manectric" }],
  roselia: [{ lvl: 32, to: "roserade" }],
  budew: [{ amizade: 65, to: "roselia" }],
  gulpin: [{ lvl: 26, to: "swalot" }],
  carvanha: [{ lvl: 30, to: "sharpedo" }],
  wailmer: [{ lvl: 40, to: "wailord" }],
  numel: [{ lvl: 33, to: "camerupt" }],
  spoink: [{ lvl: 32, to: "grumpig" }],
  vibrava: [{ lvl: 45, to: "flygon" }],
  trapinch: [{ lvl: 35, to: "vibrava" }],
  cacnea: [{ lvl: 32, to: "cacturne" }],
  swablu: [{ lvl: 35, to: "altaria" }],
  golbat: [{ amizade: 65, to: "crobat" }],
  barboach: [{ lvl: 30, to: "whiscash" }],
  corphish: [{ lvl: 30, to: "crawdaunt" }],
  baltoy: [{ lvl: 36, to: "claydol" }],
  feebas: [{ lvl: 32, to: "milotic" }],
  gloom: [{ lvl: 36, onde: "fora", to: "bellossom" }],
  shuppet: [{ lvl: 37, to: "banette" }],
  dusclops: [{ lvl: 36, to: "dusknoir" }],
  duskull: [{ lvl: 37, to: "dusclops" }],
  chingling: [{ amizade: 65, to: "chimecho" }],
  snorunt: [{ lvl: 42, onde: "fenda", to: "froslass" }, { lvl: 42, to: "glalie" }],
  sealeo: [{ lvl: 44, to: "walrein" }],
  spheal: [{ lvl: 32, to: "sealeo" }],
  clamperl: [{ lvl: 36, onde: "fenda", to: "gorebyss" }, { lvl: 36, to: "huntail" }],
  shelgon: [{ lvl: 50, to: "salamence" }],
  bagon: [{ lvl: 30, to: "shelgon" }],
  metang: [{ lvl: 45, to: "metagross" }],
  beldum: [{ lvl: 20, to: "metang" }],
  staravia: [{ lvl: 34, to: "staraptor" }],
  starly: [{ lvl: 14, to: "staravia" }],
  bidoof: [{ lvl: 15, to: "bibarel" }],
  kricketot: [{ lvl: 10, to: "kricketune" }],
  luxio: [{ lvl: 30, to: "luxray" }],
  shinx: [{ lvl: 15, to: "luxio" }],
  burmy: [{ lvl: 20, onde: "fenda", to: "mothim" }, { lvl: 20, to: "wormadam" }],
  combee: [{ lvl: 21, to: "vespiquen" }],
  buizel: [{ lvl: 26, to: "floatzel" }],
  cherubi: [{ lvl: 25, to: "cherrim" }],
  shellos: [{ lvl: 30, to: "gastrodon" }],
  drifloon: [{ lvl: 28, to: "drifblim" }],
  buneary: [{ amizade: 65, to: "lopunny" }],
  glameow: [{ lvl: 38, to: "purugly" }],
  stunky: [{ lvl: 34, to: "skuntank" }],
  bronzor: [{ lvl: 33, onde: "fora", to: "bronzong" }],
  gabite: [{ lvl: 48, to: "garchomp" }],
  gible: [{ lvl: 24, to: "gabite" }],
  riolu: [{ amizade: 65, to: "lucario" }],
  hippopotas: [{ lvl: 34, to: "hippowdon" }],
  skorupi: [{ lvl: 40, to: "drapion" }],
  croagunk: [{ lvl: 37, to: "toxicroak" }],
  finneon: [{ lvl: 31, to: "lumineon" }],
  snover: [{ lvl: 40, to: "abomasnow" }],
  patrat: [{ lvl: 20, to: "watchog" }],
  poliwhirl: [{ lvl: 36, onde: "fora", to: "politoed" }],
  herdier: [{ lvl: 32, to: "stoutland" }],
  lillipup: [{ lvl: 16, to: "herdier" }],
  purrloin: [{ lvl: 20, to: "liepard" }],
  pansage: [{ item: "pedra da folha", to: "simisage" }],
  pansear: [{ item: "pedra do fogo", to: "simisear" }],
  panpour: [{ item: "pedra da água", to: "simipour" }],
  munna: [{ item: "pedra da lua", to: "musharna" }],
  tranquill: [{ lvl: 32, to: "unfezant" }],
  pidove: [{ lvl: 21, to: "tranquill" }],
  blitzle: [{ lvl: 27, to: "zebstrika" }],
  boldore: [{ lvl: 36, to: "gigalith" }],
  roggenrola: [{ lvl: 25, to: "boldore" }],
  woobat: [{ amizade: 65, to: "swoobat" }],
  drilbur: [{ lvl: 31, to: "excadrill" }],
  gurdurr: [{ lvl: 36, to: "conkeldurr" }],
  timburr: [{ lvl: 25, to: "gurdurr" }],
  palpitoad: [{ lvl: 36, to: "seismitoad" }],
  tympole: [{ lvl: 25, to: "palpitoad" }],
  swadloon: [{ amizade: 65, to: "leavanny" }],
  sewaddle: [{ lvl: 20, to: "swadloon" }],
  whirlipede: [{ lvl: 30, to: "scolipede" }],
  venipede: [{ lvl: 22, to: "whirlipede" }],
  cottonee: [{ lvl: 32, to: "whimsicott" }],
  krokorok: [{ lvl: 40, to: "krookodile" }],
  sandile: [{ lvl: 29, to: "krokorok" }],
  dwebble: [{ lvl: 34, to: "crustle" }],
  scraggy: [{ lvl: 39, to: "scrafty" }],
  trubbish: [{ lvl: 36, to: "garbodor" }],
  minccino: [{ lvl: 32, to: "cinccino" }],
  gothorita: [{ lvl: 41, to: "gothitelle" }],
  gothita: [{ lvl: 32, to: "gothorita" }],
  duosion: [{ lvl: 41, to: "reuniclus" }],
  solosis: [{ lvl: 32, to: "duosion" }],
  ducklett: [{ lvl: 35, to: "swanna" }],
  vanillish: [{ lvl: 47, to: "vanilluxe" }],
  vanillite: [{ lvl: 35, to: "vanillish" }],
  deerling: [{ lvl: 34, to: "sawsbuck" }],
  karrablast: [{ lvl: 36, to: "escavalier" }],
  foongus: [{ lvl: 39, to: "amoonguss" }],
  frillish: [{ lvl: 40, to: "jellicent" }],
  joltik: [{ lvl: 36, to: "galvantula" }],
  ferroseed: [{ lvl: 40, to: "ferrothorn" }],
  klang: [{ lvl: 49, to: "klinklang" }],
  klink: [{ lvl: 38, onde: "fora", to: "klang" }],
  eelektrik: [{ item: "pedra do trovão", to: "eelektross" }],
  tynamo: [{ lvl: 39, to: "eelektrik" }],
  fraxure: [{ lvl: 48, to: "haxorus" }],
  axew: [{ lvl: 38, to: "fraxure" }],
  cubchoo: [{ lvl: 37, to: "beartic" }],
  shelmet: [{ lvl: 36, to: "accelgor" }],
  mienfoo: [{ lvl: 50, to: "mienshao" }],
  golett: [{ lvl: 43, onde: "fora", to: "golurk" }],
  pawniard: [{ lvl: 52, to: "bisharp" }],
  vullaby: [{ lvl: 54, to: "mandibuzz" }],
  zweilous: [{ lvl: 64, to: "hydreigon" }],
  deino: [{ lvl: 50, to: "zweilous" }],
  larvesta: [{ lvl: 59, to: "volcarona" }],
  slowpoke: [{ lvl: 36, onde: "fora", to: "slowking" }],
  magneton: [{ lvl: 36, onde: "fora", to: "magnezone" }],
  bunnelby: [{ lvl: 20, to: "diggersby" }],
  fletchinder: [{ lvl: 35, to: "talonflame" }],
  fletchling: [{ lvl: 17, to: "fletchinder" }],
  spewpa: [{ lvl: 12, to: "vivillon" }],
  scatterbug: [{ lvl: 9, to: "spewpa" }],
  litleo: [{ lvl: 35, to: "pyroar" }],
  floette: [{ lvl: 32, to: "florges" }],
  skiddo: [{ lvl: 32, to: "gogoat" }],
  pancham: [{ lvl: 32, to: "pangoro" }],
  espurr: [{ lvl: 25, to: "meowstic" }],
  doublade: [{ item: "pedra do crepúsculo", to: "aegislash" }],
  honedge: [{ lvl: 35, to: "doublade" }],
  spritzee: [{ lvl: 36, to: "aromatisse" }],
  swirlix: [{ lvl: 36, to: "slurpuff" }],
  inkay: [{ lvl: 30, to: "malamar" }],
  binacle: [{ lvl: 39, to: "barbaracle" }],
  skrelp: [{ lvl: 48, to: "dragalge" }],
  clauncher: [{ lvl: 37, to: "clawitzer" }],
  helioptile: [{ lvl: 32, to: "heliolisk" }],
  phantump: [{ lvl: 36, to: "trevenant" }],
  pumpkaboo: [{ lvl: 36, to: "gourgeist" }],
  noibat: [{ lvl: 48, to: "noivern" }],
  trumbeak: [{ lvl: 28, to: "toucannon" }],
  pikipek: [{ lvl: 14, to: "trumbeak" }],
  yungoos: [{ lvl: 20, to: "gumshoos" }],
  charjabug: [{ lvl: 32, to: "vikavolt" }],
  grubbin: [{ lvl: 20, to: "charjabug" }],
  crabrawler: [{ lvl: 32, to: "crabominable" }],
  cutiefly: [{ lvl: 25, to: "ribombee" }],
  rockruff: [{ lvl: 25, to: "lycanroc" }],
  mareanie: [{ lvl: 38, to: "toxapex" }],
  mudbray: [{ lvl: 30, to: "mudsdale" }],
  dewpider: [{ lvl: 22, to: "araquanid" }],
  fomantis: [{ lvl: 34, to: "lurantis" }],
  morelull: [{ lvl: 24, to: "shiinotic" }],
  salandit: [{ lvl: 33, to: "salazzle" }],
  stufful: [{ lvl: 27, to: "bewear" }],
  steenee: [{ lvl: 32, to: "tsareena" }],
  bounsweet: [{ lvl: 18, to: "steenee" }],
  wimpod: [{ lvl: 30, to: "golisopod" }],
  sandygast: [{ lvl: 42, to: "palossand" }],
  typenull: [{ amizade: 65, to: "silvally" }],
  hakamoo: [{ lvl: 45, to: "kommoo" }],
  jangmoo: [{ lvl: 35, to: "hakamoo" }],
  onix: [{ lvl: 36, onde: "fora", to: "steelix" }],
  cosmoem: [{ lvl: 53, onde: "fenda", to: "lunala" }, { lvl: 53, to: "solgaleo" }],
  cosmog: [{ lvl: 43, to: "cosmoem" }],
  poipole: [{ lvl: 32, to: "naganadel" }],
  skwovet: [{ lvl: 24, to: "greedent" }],
  corvisquire: [{ lvl: 38, to: "corviknight" }],
  rookidee: [{ lvl: 18, to: "corvisquire" }],
  dottler: [{ lvl: 30, to: "orbeetle" }],
  blipbug: [{ lvl: 10, to: "dottler" }],
  nickit: [{ lvl: 18, to: "thievul" }],
  gossifleur: [{ lvl: 20, to: "eldegoss" }],
  wooloo: [{ lvl: 24, to: "dubwool" }],
  chewtle: [{ lvl: 22, to: "drednaw" }],
  yamper: [{ lvl: 25, to: "boltund" }],
  carkol: [{ lvl: 34, to: "coalossal" }],
  rolycoly: [{ lvl: 18, to: "carkol" }],
  applin: [{ lvl: 32, onde: "fenda", to: "appletun" }, { lvl: 32, to: "flapple" }],
  silicobra: [{ lvl: 36, to: "sandaconda" }],
  arrokuda: [{ lvl: 26, to: "barraskewda" }],
  toxel: [{ lvl: 30, to: "toxtricity" }],
  sizzlipede: [{ lvl: 28, to: "centiskorch" }],
  clobbopus: [{ lvl: 32, to: "grapploct" }],
  sinistea: [{ lvl: 32, to: "polteageist" }],
  tyrogue: [{ lvl: 20, to: "hitmontop" }],
  lickitung: [{ lvl: 36, onde: "fora", to: "lickilicky" }],
  rhydon: [{ lvl: 36, onde: "fora", to: "rhyperior" }],
  chansey: [{ amizade: 65, to: "blissey" }],
  tangela: [{ lvl: 36, onde: "fora", to: "tangrowth" }],
  seadra: [{ lvl: 36, onde: "fora", to: "kingdra" }],
  scyther: [{ lvl: 36, onde: "fora", to: "scizor" }],
  electabuzz: [{ lvl: 36, onde: "fora", to: "electivire" }],
  magmar: [{ lvl: 36, onde: "fora", to: "magmortar" }],
  hoothoot: [{ lvl: 20, to: "noctowl" }],
  chinchou: [{ lvl: 27, to: "lanturn" }],
  togetic: [{ lvl: 32, to: "togekiss" }],
  togepi: [{ amizade: 65, to: "togetic" }],
  flaaffy: [{ lvl: 30, to: "ampharos" }],
  mareep: [{ lvl: 15, to: "flaaffy" }],
  bonsly: [{ lvl: 32, to: "sudowoodo" }],
  aipom: [{ lvl: 32, to: "ambipom" }],
  sunkern: [{ lvl: 32, to: "sunflora" }],
  murkrow: [{ item: "pedra do crepúsculo", to: "honchkrow" }],
  eevee: [{ amizade: 65, onde: "sevii", to: "sylveon" }, { amizade: 65, onde: "fenda", to: "umbreon" }, { amizade: 65, to: "espeon" }, { item: "pedra da folha", to: "leafeon" }, { item: "pedra do gelo", to: "glaceon" }],
};

/** ONDE ELAS APARECEM. Johto (152-251) no mato das ilhas SEVII, como no
 *  FireRed; o resto vaza pela fenda, por terreno (quem nada vai pra água, quem
 *  voa ou flutua pro ar, o resto pro chão). Os lendários (BST 600+) não vêm no
 *  mato: ficam só na oficina, no leilão e na fusão. `w` sai fracionário de
 *  propósito — src/data/index.js reparte entre elas o mesmo peso que a tabela
 *  de origem já tinha, senão 350 espécies novas engoliam as de casa. */
const comuns = Object.values(MAIS).filter((s) => s.bst < 600);
const nivel = (s) => (s.bst >= 500 ? [34, 46] : s.bst >= 400 ? [24, 38] : [14, 28]);
const entrada = (s, [min, max]) => ({ id: s.id, min, max, w: s.bst >= 560 ? 0.12 : s.bst >= 500 ? 0.4 : 1 });
/** OS GUARDIÕES DO LAGO: UXIE, MESPRIT e AZELF não têm lago aqui — flutuam no
 *  vazio da fenda, os três, e são o encontro mais raro dela. */
export const GUARDIOES = ["uxie", "mesprit", "azelf"].filter((id) => MAIS[id]);
export const MAIS_SEVII = comuns.filter((s) => s.dex <= 251).map((s) => entrada(s, nivel(s)));
const voa = (s) => ["VOADOR", "FANTASMA", "PSÍQUICO", "ELÉTRICO"].some((t) => s.types.includes(t));
const nada = (s) => ["ÁGUA", "GELO"].some((t) => s.types.includes(t));
const fora = comuns.filter((s) => s.dex > 251);
export const MAIS_DIM = {
  agua: fora.filter((s) => nada(s)).map((s) => entrada(s, [nivel(s)[0] + 6, nivel(s)[1] + 8])),
  ar: fora.filter((s) => !nada(s) && voa(s) && !GUARDIOES.includes(s.id)).map((s) => entrada(s, [nivel(s)[0] + 6, nivel(s)[1] + 8]))
    .concat(GUARDIOES.map((id) => ({ id, min: 50, max: 50, w: 0.12 }))),
  terra: fora.filter((s) => !nada(s) && !voa(s)).map((s) => entrada(s, [nivel(s)[0] + 6, nivel(s)[1] + 8])),
};
