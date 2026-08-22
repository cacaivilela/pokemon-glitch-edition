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
      "sprite": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAHMElEQVR4Xt2ZL7DqRhjF9zlccc2b6UwjkdQhnojEdIapQiIRFUwVEonqIJFIVIeZGiTiibhGItOZzjSSOhzNWXLCx97NH24293LfGiDZ7O757fm+3SyfVMvl9PXzxdZF98u/n1ruulbzrQ6iSDxGBgDm/feA8m4AiqbnrSE4B2DO6ndfflZ///KP1vvjHz/kuv/7+qeVwfnX7/PrXhQ5H5/ZqdMObJY//f5T3qcEwIsmCAkAddqG8KYATBfgtwkAIZD0+3eJs00ITgFAkOkC6QATAEKj+9tfuUNk/EsI3ywA2+yDxnwbXJbjQ+6EDwWA0/noEsilEeL9XkfFx7OaLU+6uVnQVftNpE6nk3PHOm+wLgAzG0M4rxFAHCoVTDr68jwIvw0AjHMpOBj173jEx6M6bM65eNzEb7hA5xmHTngzB0jhmGEUv9fLhUM0C8XjPq4jHOAGf6DUeuo2FFoDYFocv8ez4EJL874UZzohB7KLNAAU17ngzQAwuUkwps1NR9ABDAE4ACC2q4OzcTtpaLJaX8IwVMftprA9c/Yx8wiF1dLLmczmiQ4L2N78BCwCcOmCxgAg3h9fY3k72+QQCEXO+GAwUINgpy9R+Hg1UXESp1nurADRBkGGCZ51mQecAqAQFVyTnK2Ey4O+DOEo+hnt8bPaLeZqeUh9bhQTgEsITgHIccfbW1bX10ugQDxKGQANK1sJPgQAPWBCqCG+CABmn0UCIJCmCbG5A6LNxff82yAz0cgLub1fmDq7kM08b8MB0/X9pujOVcIBrlzQCIBMgPks2QCkQpko4Qoku8E80HEvC64n+10hBNMBLpJhYwA6toXAuxnLsrsUPx1cZziFp7AqmAUuQLE5QQLAdxfLYWMA6+lEeZ6nRoeVkqGgYzQFwGuYeYhLkkQLjKLICgF1RoulrishUDx3hGjjaQAc+j21nc5zm1M8PgEAIHbBTG29rhonJw0BAIbDoRYrCwHgGr4PJ8U5oWkCRB+vdgDjf95NbTybqmlvcItzru1UloYInIJ63naXA7CFgQSAx5EX+l78IlRczH4jAL3x5KJ3cam118dQAyhc6wUA1AMMOGAdXl9vZdEJMssN+M6C5Eg3uBLvBAAHKHd0BIFdn872tmKsAKxSBAD3AQHlKc4DEAKluzu77Pur2f5fzrhcGaQDcJ3L5FMAgJJut3tBEoOlkQhRkAxzMKnA8fqW5ILoqPqT6R0E21JYxq7qrbMOd1nn1UmQjWgI6RI4Hi8e6nvWD6z7ADRihoEJCYnSlQsaA8idYIHg+/4dlDiO9e8y8bjPlcCWDwDj6QBg0DInwA028To8siLFyZCR9/Gdsc/rMl+UHcDUtaMTB+TimdRKMj8TG4Xlq0T2LEXL/YB8hsJcucAtAM5uduhhmwUzy8tlkocltLm5S5TtPRUAbIr0zHHmjeWtyI75W6GsIA5HPgQAnv3pmc3eDJnJzbg1QeR5QB6YCADecGRdKVzuBxqHwIsNkRDApYoO4U5OgtAihXNkjOMec4JMjmjnaZZBmQCrEhT2DBTFuhBjm2nOMvYY3FLzE2+WTwEA4rELxO4u2qz1uQBK2eAAQToAdXENr8hsh5+dTueTzT2uxGMcpSHAwe7SXRvLKDoo+XszGqrJbq/wuUwhlJXOfHF3+7y8/Q56fbVOzwqm6ZmB/Czqt6yfMD01WZ7OtVxSOwfImZMAigbSO8WlMI5dv/S+edMEb3sYdaocaD5XG4B8cOl7lwH+p3qjUiaeoh8VzqG/CgAetoVHGzykQLN9F7ng1QA4mEdDow4kxjDruhBa1G9jALLh18IwBfcH1/UfJQrdrfk2CE4BSFdABAZfVebdjtr3hqXVDvviv92r2q+63xiA1xvm63py3Ov24ATO4uJ8UpjhMpFVdY5xoti2rb8qkWX3GwHAYALx784hO8U9J6Eajma63/7hujcoAzA87kvrAACK7Eu3uVvVWutbA4CZplB0kqT/B2CwHKhnnAh5m9uBCIB44k9VPi8HS+E9/7rDNOu/OwDaXc90lrgQ94BiiqeweTpr2AQtOt1KALaZIwQX4tF+oxCQA5QrQBmAKDxYZ9PmABOATKqulkZnADhYGRZwQZIehPKzLBYRPraCMEBOQXElWvbTGgBTfBWEIgAcbFv7AecAdLLKVoe6DrCJR6zjOj5dxbvNYa0A4D7AzNrmAIpmXYpHnbZm32kSNMXJzVBZ7POeKZq/2xTfKgC5RHa8geJaXrS00e6ccdZrI/G1mgRtAuEGQEBhRrfVk3XaFs7+W8kBTITshLMv9/QmACTOOvXqhNMjdZwBkC8pcs9uJroiCBIABHAbjO98EXpEWN26TgDIZU92jE2QFiA2OWVJrWj14EtWGzCcAYB9kbn5DgDxZkKDgKojc7xTlL0kuV4VnACQGd+03qPJTL5TyJMhtvu0AOrG3CP1zD9Rqhz0SNus+z+ovep9arVUZAAAAABJRU5ErkJggg=="
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
  ]
};
