import random

def comePokemon(nPokemon, n):
    # nPokemon: 포켓몬 수
    comed = []
    for _ in range(n):
        pokemonId = random.randrange(1, nPokemon)
        percent = round(random.random(), 2)
        comed.append((pokemonId, percent))
    return comed