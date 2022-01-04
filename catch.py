import random
import db
import archive

CATCH_PERCENT = {'1': .25, '2': .5, '3': .75, '4': 2}

def checkInventorySize(userId):
    pass

def comePokemon(userId, nPokemon, n):
    # nPokemon: 포켓몬 수 <- 이제 안 쓸거임
    myPokemon = db.getMyPokemon(str(userId))

    if 'coming' in myPokemon:
        return myPokemon['coming']

    pokemons = db.getPokemonList()

    # 진화 포켓몬이지만 아직 진화 안된 포켓몬 length: 54
    unevolved = [id for id in pokemons if pokemons[id]['evolution'] != None and pokemons[id]['evolution'][0] == pokemons[id]['id']]

    # 진화 포켓몬 X (전설 제외)
    noEvolved = [id for id in pokemons if pokemons[id]['evolution'] == None]

    # 잡은 포켓몬 종류 수
    unlocked = len(myPokemon['archive']['pokemon'])

    
    if unlocked < 100:
        n = 0
    elif unlocked < 110:
        n = 5
    elif unlocked < 120:
        n = 10
    elif unlocked < 125:
        n = 15
    elif unlocked < 150:
        n = 20

    spawnId = unevolved + noEvovled[:n]
    # legendSpawnId = noEvolved[-5:]

    coming = []
    for id in random.sample(spawnId, 3):
        coming.append((id, round(random.random(), 2)))

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
        # 업적 업데이트
        
        db.addPokemon(userId, pokemonId, percent, _max)

        archive.updateArchive(userId, 'get', {
            'ballType': _ballType,
            'result': True,
            'pokemonId': str(pokemonId),
            'percent': percent
        })

        return True
    else:
        archive.updateArchive(userId, 'throw', {
            'ballType': _ballType,
            'result': False
        })
        if random.random() < numberOfTry * .1:
            return 'run'
        return numberOfTry + 1
