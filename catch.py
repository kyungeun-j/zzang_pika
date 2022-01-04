import random
import db

CATCH_PERCENT = {'1': .25, '2': .5, '3': .75, '4': 2}

def checkInventorySize(userId):
    pass

def comePokemon(userId, nPokemon, n):
    # nPokemon: 포켓몬 수
    myPokemon = db.getMyPokemon(str(userId))

    if 'coming' in myPokemon:
        return myPokemon['coming']

    coming = []
    for _ in range(n):
        pokemonId = random.randrange(1, nPokemon + 1)
        percent = round(random.random(), 2)
        coming.append((pokemonId, percent))

    myPokemon['coming'] = coming
    db.setMyPokemon(userId, myPokemon)

    return coming

def resetComingPokemon(userId):
    # coming 포켓몬 중 하나가 도망갔거나, 하나를 잡았을 때 호출
    myPokemon = db.getMyPokemon(str(userId))
    myPokemon.pop('coming')
    db.setMyPokemon(userId, myPokemon)

    return True

def catchPokemon(userId, ballType, pokemonId, percent, _max, numberOfTry):
    _ballType = str(ballType)

    inventory = db.getInventory(userId)

    if inventory[_ballType]['amount'] == 0:
        # 해당 볼이 없음
        return False
    else:
        inventory[_ballType]['amount'] -= 1
        inventory['999']['remain'] += 1     # 남은 가방 공간 + 1
    
    db.replaceInventory(userId, inventory)

    if random.random() < CATCH_PERCENT[_ballType]:
        db.addPokemon(userId, pokemonId, percent, _max)
        return True
    else:
        if random.random() < numberOfTry * .1:
            return 'run'
        return numberOfTry + 1
