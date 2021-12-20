import random
import db

CATCH_PERCENT = {'1': .25, '2': .5, '3': .75, '4': 2}

def comePokemon(nPokemon, n):
    # nPokemon: 포켓몬 수
    comed = []
    for _ in range(n):
        pokemonId = random.randrange(1, nPokemon)
        percent = round(random.random(), 2)
        comed.append((pokemonId, percent))
    return comed
    
def catchPokemon(userId, ballType, pokemonId, percent, _max, numberOfTry):
    _ballType = str(ballType)

    inventory = db.getInventory(userId)

    if inventory[_ballType]['amount'] == 0:
        return False
    else:
        inventory[_ballType]['amount'] -= 1
    
    db.replaceInventory(userId, inventory)

    if random.random() < CATCH_PERCENT[_ballType]:
        db.addPokemon(userId, pokemonId, percent, _max)
        return True
    else:
        if random.random() < numberOfTry * .1:
            return 'run'
        return numberOfTry + 1