// FICHAS PUBLICADAS PELOS JOGADORES.
//
// Este arquivo e ESCRITO PELO JOGO: ao terminar uma ficha na oficina,
// PUBLICAR manda ela pro dev_server, que grava aqui (rota /__ficha). Dai em
// diante ela entra na lista de variantes daquela dupla, com o nome de quem
// fez, do mesmo jeito que as fusoes que ja vem no jogo (src/data/fusoes.js)
// -- e vale pra qualquer partida deste computador, inclusive um jogo novo.
//
// Da pra editar a mao, e da pra apagar tudo: e so deixar o objeto vazio. O
// desenho vem junto, em PNG, dentro do campo `sprite`.
export const FUSOES_FEITAS = {
  "butterfree+pikachu": [
    {
      "id": "butterchuu",
      "nome": "BUTTERCHUU",
      "autor": "VERMELHO",
      "tipos": [
        "INSETO",
        "ELÉTRICO"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 126
      },
      "crescimento": {
        "hp": 2.3,
        "atk": 1,
        "def": 0.9,
        "spa": 1.4,
        "spd": 1.4,
        "spe": 9
      },
      "sprite": "data:image/png;base64,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"
    }
  ],
  "bulbasaur+vileplume": [
    {
      "id": "bulbaplume",
      "nome": "BULBAPLUME",
      "autor": "VERMELHO",
      "tipos": [
        "PLANTA",
        "VENENO"
      ],
      "inicial": {
        "hp": 10,
        "atk": 19,
        "def": 5,
        "spa": 6,
        "spd": 6,
        "spe": 5
      },
      "crescimento": {
        "hp": 2.4,
        "atk": 1.2,
        "def": 1.6,
        "spa": 1.6,
        "spd": 1.7,
        "spe": 1.1
      },
      "sprite": "data:image/png;base64,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"
    }
  ],
  "magneton+magnemite": [
    {
      "id": "magnet",
      "nome": "MAGNET",
      "autor": "VERMELHO",
      "tipos": [
        "ELÉTRICO",
        "AÇO"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 5
      },
      "crescimento": {
        "hp": 2,
        "atk": 1.3,
        "def": 1.9,
        "spa": 2.5,
        "spd": 1.6,
        "spe": 1.4
      },
      "sprite": "data:image/png;base64,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"
    }
  ],
  "lapras+kabutops": [
    {
      "id": "laprutops",
      "nome": "LAPRUTOPS",
      "autor": "VERMELHO",
      "tipos": [
        "ÁGUA",
        "PEDRA"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 5
      },
      "crescimento": {
        "hp": 3.1,
        "atk": 2.1,
        "def": 1.9,
        "spa": 1.6,
        "spd": 1.7,
        "spe": 1.5
      },
      "sprite": "data:image/png;base64,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"
    }
  ],
  "pidgeotto+clefairy": [
    {
      "id": "pidgeotairy",
      "nome": "PIDGEOTAIRY",
      "autor": "VERMELHO",
      "tipos": [
        "NORMAL"
      ],
      "inicial": {
        "hp": 11,
        "atk": 6,
        "def": 6,
        "spa": 7,
        "spd": 6,
        "spe": 6
      },
      "crescimento": {
        "hp": 2.4,
        "atk": 1.2,
        "def": 1.2,
        "spa": 1.3,
        "spd": 1.2,
        "spe": 1.1
      },
      "sprite": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEN0lEQVR4Xu2aLbiyQBCF9zaj0UgkGonEG41GItFoJBKNRKLxi0Yi0UgkEo02Ps7i+Cwr/uGO4JUt6srPnnfOzA7e+yO+fPx8uX4xAhgd8OUExhT4cgOMRXBMgXenwNKxy22aNcBjTl+HfgzXOt/qAAj1JzPhJsmPKnpjzy70rbJCznGDeBsAEg9RXp5LcalrnYVn1RTN6zTyPGdbJ9uFVREQjyiTSFW4k9QwdCD4jOMxoiOfG9gBkHgIga3J7iRchUEgSLjuBIAwnRKsANrEA0JaHBv2V6N9LQ1wTGxZ0g0mIbABuCb+WsEDFBKp2h7vSbBlWaVpCGwAEtctHX8uvM1OxKtf+aqLp0qPneHWgCuoEAIsYJkqjCwASHwa7QUg0CtEHnZ7WQswVCBq3qtpgIjTwPZ5k1SHL41fEGu4BoDEwxEEQ89/ZzZp5DhsT9FW33fQ2nqKcQDqfq9HX3cCoo6iRvlvytbPwGEFYFfuhd0RcV381PMu1umtQ6MV/hEQrAComqPIIdKU84BS2VkE/rJ3CMYBQBGlAUSTeKr0mFsFWyl8Ptn/TQBUCFHNUcXplfI9yzIpPPAWrS6YuB5LYNpSgu1G1LTQlobqHid7Ydu2+AoAlApEPQxdEUVV2T8N368qZDVmwrkIzJ9wAAFQC1+0dRtiDxWPNgA4yPYCY93erd2ALQVw0+N2JX/pQQOEgepPECD+mgP+BADsBNj/STw9/iZx3QXSuOYAfP+OVGBzgPo0CPG0GzwD4B1pwAbgmMQlOjtqcxHRZ8STQ7hdwArgVvF59LuPA7BdL0u0ufNqvzcxPgpAHqzLmWtAePWYWJx+IQJEKwjZnGrswibEx9E/aZpfzT2DBwDxu6q/9/xFZ9dDvDwfPxLgOfo0iqR+buCC8LID1MhjsV1TAOc2IGppwAXBGADVvp0gOEuRpqlwsqSR/xAOMEgLDhe8BCBaLkrYVkZ+HUgBWbR5OhUAz/ZX0uptAOabSOxX/rAB5G7d4nYBgPMAYb1D9AtRhIG8FiKPOYgfZApIB7hzuTjatjrZXyl4iDaN8Ndl3xFeSgEsdDqdlogQUiD2lk/b/6yW3rQUP/UY03XgZQAEAa+I2CtbYZ1DecNROqBBAqBFUlG8iOqjE3fEc9QBIw5Q9Z0haA3NTQbK38XUFrjtnEE7AAtWXXC3MXpCOMEYPAAdAjVItFvoUb0XcfV47BCHw8Goa41ejBaLnaH4t6k/nqKMn8Qx9AcdVSB1fG3Wp57gIwDQzlCEdXenRxliMNDktA19/8fx6BQXi8VnOEB1AnqEWEzklCfq/wLBuGdnuAjHAQa1yR8H4OyEqr2VYsJQQrgnXnUFgcCcafvjmiw1QLe1KoJLSGsuPTD5FgAPrKO3Q0YAvaEfyI1HBwwkEL0tY3RAb+gHcuPRAQMJRG/LGB3QG/qB3PjrHfAfPTl3X7J2F5kAAAAASUVORK5CYII="
    }
  ],
  "rattata+pidgey": [
    {
      "id": "rattadgey",
      "nome": "RATTADGEY",
      "autor": "VERMELHO",
      "tipos": [
        "NORMAL",
        "VOADOR"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 9
      },
      "crescimento": {
        "hp": 1.9,
        "atk": 1.2,
        "def": 0.9,
        "spa": 0.7,
        "spd": 1,
        "spe": 2.6
      },
      "sprite": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFMklEQVR4Xu2aL5CjSBTGe9yaq6LqTGRqVSQyMudyrmUkcmTWsa4lEhmJzDnWXEXmHBJ3yJyLW+TWiuX4unlMTyeBTGgymYQ2TDUE+H7ve6//ME/swdvTg+tnA4DBAQ9OYEiBBzfAUASHFBhS4MEJDCnw4AboNgoEXBQE0I/FgZt+7IL6/Kexf5Nu6/RSOgAThC4e5+4KAAl3nNFBBuX5nsENOoB//vrJvv/7N1tEiQRugtPdI7wX1+BaEfXrnIsc0ATAE/krKOk6Y7ssk327fH6y5AACiefuy3VhJORvojS+6F3batxFNz0FoEl8nOXMHS1Yk2sAQBcvoe12UkO8jXqBcBUAEC+CKYvDcSMAilYaprJ4QjyE85nXG4ROAPBWFNFT0Yf4aBPWToyWKqJ6o7pBffEyrkcPij4g9OGCzgDopZfhJ/knch4tjBN51MWzPGWRcGrtEE5NL4QmAB5yVvb14oKLAOjRW3vTggted8UiZjLqa2VbNG8RyeMmU4IDHsgjATDnEJ7LC7J9mmcYCW4XAIQsppMCgiEejYCMXCU0jqt+ztmKT2QfDYk6TP1vQCgrP3U9EZQKSOfA1Tc+9QJv6QcAuh7FDk34SR3x/V5FfjRS8wZAaANgPl93hc1a0Jnkzl8Wo6kSjeYFQh71FNjtMjbldTQ7Q7gZAKb4faIKX5qmbL46nPQIf8tWG3VNFxegKJatc/A63ySezwrXdWvR67KqB7P5SQAyDaq6AAAoluskO1sIpcHNAIAgyn8IR/O3m4MUoPSgVKBCKH9frQ/omqYjDY9JtmXBJjwbXNM9rdzEdMLEH7PxWFV7vSH6uvi7AaA7gUYB9OkQEP00UpMkeW6iAE396Owg3KwDKA3eKv5SAGUNOBtaW2pZudE1APiLeT3XCNYbK+8NOFZu1BcA3PfXr9/Z58+/1YHECvEtI8dVHEA1gFLALIC0QDr1MqfqAIEdj8e3DSDbekW02pdr/tlRjW0AzB8RkCTwCqwqdQA27W8tBQBAVnZ3obSUy169YQTI1QTw7AbhSz6Vy2oc0fC3TftbAXAg3pRYwYALdDFtJEzhuN62+KsCgAuwQuQTtSFC8wAC4S4m5RaYcgr+pj2EvoTTczuPAnDAK+s7am1QNy0dzJkgQXBKhx+bOQJCH1HXX68zAIzPYrWU90xXa+Y+V3WAntIAwPUmdcSPpcSHAxAvBeOhUEWwcoKEUloaDYL0FEDkZToY6wakAvoobfp0QWcH0HYYhGBLDNthKHgkmvogBg11QJ8yU+RNCPgdHILrbxoABNCEBdEFABKtR52+DWBnKIlfNlEJABZKtJdICycAwPV5nncO1LEUQ5/VGwMEIECs3syIH4MAABCsN/Q9x+XI8FEA0MvT3OAUdUoFbJPrbjDTgzZWPxwAjAzY+ztmdRMKiaRrTQgfKgVIHDZLsTVGH0LQ3wRDL3Rwjw4Bawzb8389CFZrgAlAFsjqfwi8JK1zWU8RRHg+Gb2q9I7jFM9zNUb2Kd56ESzKhpv+9/VLDRlb5GjYMdaHM+wjylGiBGMCaKodts9ZdQAB+PbnH4y2y/HCBIFvtvXzkCY4R7vIfY71TdCsAsCDYF/zUxgiLF1QfQP4Ea+leHxIARzHF2w2m1l/l3Pc0stDAQEPp+FLzha3KhX2wpdHcgWlQZ9D3VUdcOxhAKCPCOSQpHQAL78Yv5d4vGsvDmizng7kPcW/G4A2QNc8/y4OuKbAtmcNANoI3fv5wQH3HuE2fYMD2gjd+/nBAfce4TZ9/wNpFCZulkeYhwAAAABJRU5ErkJggg=="
    }
  ],
  "metapod+butterfree": [
    {
      "id": "metarfree",
      "nome": "METARFREE",
      "autor": "VERMELHO",
      "tipos": [
        "INSETO",
        "VOADOR"
      ],
      "inicial": {
        "hp": 10,
        "atk": 11,
        "def": 99,
        "spa": 7,
        "spd": 6,
        "spe": 6
      },
      "crescimento": {
        "hp": 2.1,
        "atk": 1,
        "def": 9,
        "spa": 1.1,
        "spd": 1.4,
        "spe": 1.1
      },
      "sprite": "data:image/png;base64,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"
    }
  ],
  "rayquaza+kyogre": [
    {
      "id": "rayogre",
      "nome": "RAYOGRE",
      "autor": "VERMELHO",
      "tipos": [
        "DRAGÃO",
        "ÁGUA"
      ],
      "inicial": {
        "hp": 12,
        "atk": 6,
        "def": 7,
        "spa": 7,
        "spd": 8,
        "spe": 13
      },
      "crescimento": {
        "hp": 3.1,
        "atk": 2.3,
        "def": 1.8,
        "spa": 3,
        "spd": 2.1,
        "spe": 1.8
      },
      "sprite": "data:image/png;base64,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"
    }
  ],
  "unown+unown": [
    {
      "id": "kingunown",
      "nome": "KING UNOWN",
      "autor": "VERMELHO",
      "tipos": [
        "PSÍQUICO",
        "AÇO"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 5
      },
      "crescimento": {
        "hp": 2,
        "atk": 1.4,
        "def": 2.5,
        "spa": 1.4,
        "spd": 1,
        "spe": 1
      },
      "sprite": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEYElEQVR4Xu1YMW8TMRR2RibCVhBIGVi6I1EBElmLGFoWKjE0Y38A0I6MLfADOiZbh4oJsZJICBUJibFrpCLolkwwMIR8Vl704tq+Z8u5+Jrectc7P+d93/u+Z7s1teRXbcnxq0oTMPxyc4QC1h/9jsYRHVimclxArwi4UoDfAqQQn00qawEOzgZQAh5x2RNgA2KCp36EZlhEjNm7KkUAVdpFgK0xF60QlSDg+sNf6k/nhfp393PQ4lMEPnsLoNIAj2upCQB4XEupAABvPP07lX7/4zWxDXjccDi02j3rHgALAESr1VKrq6sa+O7urpKS8Ob4+UycjYSFErCxsaH38nR1u139SImCAAJxenqqv7XbbdVsNmdUQHE2YhBPcdkQQMAbjYZVzgAJMK339xUf0+/39XhfHL6DoPbLb3osCEAcSMqCAIAnADs7O6rX6+lEqcLECCUN+ePC37FxLvCYt1QLEHgAxwXwJnAuCSIBFQX4mDgf+FIJcIHnlbX5gb5LwZsKcnV/GleaAjgBVPki8Fz6ZBeXYqg58v6Ad1kQ4AJ/dHQ0Lfre3t4FAfDq++yyv7+vY1dWVvSSGaKCUhTACTg8PNQNDUlTtba2tnSX5smb1ac4xBBgijs4OFDb29t63rW1tek8vu5fqgWIAGxmIGEkRtUHCDyjerjOz8+n1aTmR3GUNAjwxfGVI4smyJc+gIA3OVC8Q9LmeyKAgEvjsiOgXq+PuLwB5OTkRFug0+no7S0uU8pEDCdAEpc9AaYKzO5HzQxEmX2Bq8AVx62WhQWQqKkCalBUUWp6aGKQ/vr6uu4XJgnSOCI5i2WQCDA9TUnyStLJzzz8mPt/EOOLk6wAiC9lGaREoQIbCfhOx108E/jjH7fUWfeVutN8p+7d+Go9BNnipOBLJ8CnBNPPAPF98GBKAIjY3Nx0ngQpPgT8QgggEnA3z/UEAo1rMBjoypMCcK/Vaugl3jjMUeR7TnapFjCrDEuY7xiA0e3Hb9XP3mtFd2YlW1gQcJpgoQRYUYxf9p890cQ0PnzC88wwvEvZu7ImgJBPQM9FuVkSMBpfQEs9wHwe94JkeSebyCXnmPc+AibYk+WdbKIYoK4YFwHjhpg83+QTpiSCzQVLzCXXuUw6BxJouUyeb/IJ5wCepiQV8DtfzjlJfH/hxVhFAkI4LrROzgTYdomh+VaCAOt2eFLmUMDcLqIdY+wPhMjQN9b0M+XjanqFFZ38mHTcfJYWITu2RlXU7YuAFcVfSG3RCkBCIV732UUkeZOBHAiwCSa4kkLVZakA547Y8SFp0ZJOFlsFYVyR/4XTzA6rGgFRPvcxUzUCkuebfMIoHcqCriwQeCQWrSRVU0BID8iagBg5SzdMIuD8HC1zYPpR0kRdZ3sXiUHk5mAB38HHJ/kgoK765UAAP8IiH6ky6BzBMQSTkhsBMdZ0HalFps2JAFHClkHi///ZfuAyEGCzgpjMy0KAGHBV/h8QDSg0cOkV8B8Sn+ZfYTmF0AAAAABJRU5ErkJggg=="
    }
  ],
  "ditto+charizard": [
    {
      "id": "dizard",
      "nome": "DIZARD",
      "autor": "VERMELHO",
      "tipos": [
        "FOGO",
        "VOADOR"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 5
      },
      "crescimento": {
        "hp": 2.3,
        "atk": 1.6,
        "def": 1.6,
        "spa": 1.8,
        "spd": 1.6,
        "spe": 1.7
      },
      "sprite": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAIh0lEQVR4Xu2bL5TiOhTGMw6JRFYikSMrkciRI5HIkciVSCQSWYmsXImsRCKRuHn9Ur5ye8m/QuftO2dfztnDUNLk3t/9cpMm3Tfzl5e3v9x/8z+An1RAsVh/s/3rZW0+SvOGa2VV2cubav/HA/BjBhxXu+9ptmv5Hsrc/j1fnYw51v/q8rWdJEM4LhcW5mxbDGrzoI3RW0RZOorrAGCvsdQQqtOn2R0OUQj73Hwv1p/2zmLdQIWa7o09/9cgjejuLYC87ETffp9lzbWbAnwA5NBZFGtro4WwyO3tVTWu/xWDQBgMACUKA0/nmSEAOCmHAqngOotUgQuehDCdLtr7AOFVNbwEQDo9nV7uhnmclkqRACy008lkWeaEJXMFlCAhNIp4HkQyAOksOpUOS8fsWBfyl7/pvwnBpRBZNwagVdUTIKIAQBwdcPzdOxu3Nub78i7nfOUFkJUzc8qPISbO33wAEHmtBioiNUkGAcjsay1D5q4TEAqdHuWfHaO3ZpysgFQSUBXzgDXjNiUCwGq8MpvLxjZFGH0SZDKAan/xOt0ZAtnMOY5D0Y8pQ88WzAME0Ol/crJfUyGkAagjP1kfjY62jqAr+nDOV1KHAwAgSXI1GQIANUAJwwGo594U5+HkIRD9kNxTQWAoYBn9Ptm3TmIIyEIAqSrwKkAuPCSA0TTrdHitGsnFxn5ICbg/FQLqIil+5lcbZQ0Av/dRQRQAkt783DitnbedVc38H5v6YgD6QnjfXczX+PgzAGT0abjPeb2+D0l9iHzA9qECDIWQAlKGgVMBBMDoJzmP3m5r/L4QtPxTFkgAsJ9OvF2lDoMHADr6Lucp/T7RD0GRv6WsJFEHM4Ir+mzrZQDR6Ccud1MdR70U51EP4/+c5cGmU2eDjgJ6Rf8HAEDWv5bnKLOY/Puo4CkA6KC4jp0rvqj1gQqpANBECoSUYeAEEJL/aDY112Nlxoed2dUPPiixp7k+UFIh/BEAdN4FYWgQKdAkBCRrLsp47yHhuaBVQGz8a+fRCTqcnErb3zpbRBdDKU71qcNk6HI+Rf7oKwkAnGeB/AmDxGnAvw0jpIDBAEjnJQQqgM7rT8D4SVXIqZBrFTkEYgAuh+x7PD+9PShAJ0ANAApoQdwehLTzUsYA8fvzvnuUKnE4iJJfG/XJ6THmPOoPAsAVfRv5GoKWfwhC7ElRQqHju/esw2pXjkw5auDLRZAr+qjDBOg7SOkowJcACeC8/GiNmWz3LQCf/HVS+qjOSQscOA+1cNvNpRZsxcU2ZkLRvyzz7/G2fAMAU2RNEnQBkM5fLpd2qEwWq2/puBwO13LXsVkaCgj5dOqcKZDMEF083srDjyEBMOK9ACDy0nkaRAhMhFaWxebhwWo8HtsdZQ2CUmZ7cBxFOo9td5cSfJsgEpZLATbiKHXUzeLUVA8p4LJdO53HfVIFLsd15ABCy1aqZTu7OLfdfRA4DNg37JF9usZ/C0BWlAC4pYzdH0g8BsAXdQwn1548IcDx87q7UYotN3kNkfc5j34BQCuTEHT0O5JXzuNrmwMkABjpkr5rTOIanEN9m0sOV1PMR86DS9TTzvvaDEHoA4DtM+lZ+WMY3MpLAHhqNN0cTZ7XO7ZlWUduaiaTiRMgAJQfue26c5Z4iziuh2YAGs1DGZcKpPylGqGE1nkBwQKQhmEIpCrARvR8thFfHscWgJVoDQOFBragxMmujLzviMunDgBA3kCfEoI8L8C9UCOCcdrfFmJMgFoBEoBLXiHp02lTJ00axmyOsa0TnI5wX+cblRTWeUJw2YfAoAAA6qHMp01gzHJeT1vb+yzwLACtHhpCeRdF+ZDdAYUFhrkON33A5XXCltc6bS3X9icOTXyePm7JV0+DrwAgBHxyfGsQNhI3x3WdkLMjGiwqXfcNwCiAWx0otFrNrGJaAGjgBqFdvHDR0if7a+PZhnaSSSvVeTg+GY+8bE7b3+1BrVQT/pYnxFbtteMorfOQ//bQDIO6RN8PCEXI9xtB8PdUx1E/W75HuzxfruZ9sXmYaXS/aAgBtTOALrc80AsAsznbCo1fRF3P+aEpLhZ1bX+W/0peq7RrANnIbSqMHo/zHpvZ+ZZXJEaTRfHgPG9xQUiJ+isArBJuT3/4+1CVZv6V3WcB3XjntZhEp2UbLgC+6D/jvB0qPRSA+vCJ06AFUE+JeCwOHo35Ao3pDUW/N4Rrel0/dOTRHnLAcb1+WAj57OXj/rXeT4Hz8lnl4VwA49r3BpjugCCYafm7b70vVfBs5CUA2MoZBmsK/RDmesELNkcBoJNUCB3pq6c6DWwoAIfVV/uGiOvFSfargwl16mm+owC5IOoLwSd9CYGvuM5q+YbmeZ+UdfTxHQqITbMIpst53B8EcCd5fwvUZ5wFUNxfY7X11PsCVADW8oBgc0ZgwePqi9HnbzEAIecfAOCCVoE2ghsV8tPpPG8UEFwAOkMoAYYGEFKB77FZ9uncx/tdrAzX3K4oaAjtokdPmQ7n2Z5Uge4DqkCm15/I/K7Fl3xTlW25kqLLF+dCCCoABJQQCEk/lDRdawAYzT5chmnnsfT1jfU+j/C6L+9KUEKQN2kgcgxqCLH9/RAA5geu+0OJ7kcAMB/gM2RoKDKuyMrkFVMAVnsoP+W8Mwm6jOZTlsvgoQGgPZaY46j3yuN7MgAapB83CaQvBG5p+RQScpz3os4r/1GCffd6HNYGSyB9trdCYzY2DUsbmHN8i5zQEBwEgOxAvlwZ6jjlLW7fzhLa7Wyn55vOnt8zw+ElBdBRbkfTOGZ//Z3TZqqheshxd5drgelmb03Azu+z+WAwANiDr1bNMbrc6uY4pdGvTFm+XPSs872ToEvaPA6r6vf4sfsKEBZCDQPO8zsPT1KjnzJ+h6jzsgK0THEgARg8HZLf/2vOA+A/AK2ShJR/js0AAAAASUVORK5CYII="
    }
  ]
};
