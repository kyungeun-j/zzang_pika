import db
import archive
import random
import time

POKEMON_TRANING_PRICE = 10000

# work, rest start 함수는 등록 시간을 return
# work, rest end 함수는 현재 체력을 return

def workPokemon(userId, myPokemonId):
    myPokemon = db.getMyPokemon(str(userId))
    if str(myPokemonId) in myPokemon['default']:
        working = myPokemon['default'].pop(str(myPokemonId))
        working['startTime'] = round(time.time())
        myPokemon['working'][str(myPokemonId)] = working

        db.setMyPokemon(userId, myPokemon)
        
        return {'startTime': working['startTime'], 'rm': db.useRM(userId, -1)}
    
    return False

def workEndPokemon(userId, myPokemonId):
    # working의 포켓몬으로 default로 옮기고 돈을 return
    myPokemon = db.getMyPokemon(str(userId))

    if str(myPokemonId) in myPokemon['working']:
        now = round(time.time())
        # working 리스트에서 제거
        default = myPokemon['working'].pop(str(myPokemonId))
        startTime = default.pop('startTime')
        if (now - startTime > default['hp']):
            coin = int(default['hp'] / 60 * float(default['percent']) * default['max'])
            default['hp'] = 0
        else:
            coin = int((now - startTime) / 60 * float(default['percent']) * default['max'])
            default['hp'] -= now - startTime

        myPokemon['default'][str(myPokemonId)] = default
        db.setMyPokemon(userId, myPokemon)
        db.updateMoney(userId, coin)

        return {'coin': coin, 'hp': default['hp'], 'rm': db.useRM(userId, 1)}

    return False

def restPokemon(userId, myPokemonId):
    myPokemon = db.getMyPokemon(str(userId))
    if str(myPokemonId) in myPokemon['default']:
        resting = myPokemon['default'].pop(str(myPokemonId))
        resting['startTime'] = round(time.time())
        myPokemon['resting'][str(myPokemonId)] = resting

        db.setMyPokemon(userId, myPokemon)

        return { 'startTime': resting['startTime'] }
    
    return False

def restEndPokemon(userId, myPokemonId):
    # resting 포켓몬을 default로 옮기고 회복 후 hp를 return
    myPokemon = db.getMyPokemon(str(userId))

    if str(myPokemonId) in myPokemon['resting']:
        now = round(time.time())
        # resting 리스트에서 제거
        default = myPokemon['resting'].pop(str(myPokemonId))
        startTime = default.pop('startTime')
        
        hpRecoveryPercent = round((now - startTime) / 43200, 2)   # 12시간이 지나면 체력 100% 회복
        hpRecovery = hpRecoveryPercent * default['maxHp']

        if (default['hp'] + hpRecovery <= default['maxHp']):
            default['hp'] += hpRecovery
        else:
            default['hp'] = default['maxHp']

        myPokemon['default'][str(myPokemonId)] = default
        db.setMyPokemon(userId, myPokemon)

        return { 'hp': default['hp'] }

    return False

def levelUpPokemon(userId, first, second):
    # first, second: myPokemonId
    # 레벨과 id가 같고 default 내에 있어야 함
    # 합성이 성공하면 second를 삭제하고 first만 남고 그 id를 Return

    if first == second:
        # 동일한 포켓몬은 합성 X
        return False

    myPokemon = db.getMyPokemon(str(userId))
    if not str(first) in myPokemon['default'] and str(second) in myPokemon['default']:
        # 둘 다 default 내에 있어야 함
        return False

    if not myPokemon['default'][str(first)]['id'] == myPokemon['default'][str(second)]['id']:
        # 같은 id의 포켓몬이어야 함
        return False

    if not myPokemon['default'][str(first)]['level'] == myPokemon['default'][str(second)]['level']:
        # 포켓몬 레벨이 같아야 함
        return False

    pokemonId = myPokemon['default'][str(first)]['id']
    pokemonList = db.getPokemonList()
    if pokemonList[pokemonId]['evolution'] == None or pokemonList[pokemonId]['evolution'][-1] == int(pokemonId):
        # 다음 진화가 없는 포켓몬인 경우
        # level + 1, maxHp * 2, hp1 + hp2, average percent
        myPokemon['default'][str(first)]['level'] += 1
        myPokemon['default'][str(first)]['maxHp'] *= 2
        myPokemon['default'][str(first)]['hp'] += myPokemon['default'][str(second)]['hp']
        newPercent = round((float(myPokemon['default'][str(first)]['percent']) + float(myPokemon['default'][str(second)]['percent'])) / 2, 2)
        myPokemon['default'][str(first)]['percent'] = newPercent
    else:
        # 다음 진화가 있는 포켓몬인 경우
        myPokemon['default'][str(first)]['id'] = str((int(myPokemon['default'][str(first)]['id']) + 1))
        newPokemonId = myPokemon['default'][str(first)]['id']
        newHp = round((int(myPokemon['default'][str(first)]['hp']) + int(myPokemon['default'][str(second)]['hp'])) / 2)
        newPercent = round((float(myPokemon['default'][str(first)]['percent']) + float(myPokemon['default'][str(second)]['percent'])) / 2, 2)
        myPokemon['default'][str(first)]['hp'] = newHp
        myPokemon['default'][str(first)]['percent'] = newPercent
        
        if not str(newPokemonId) in myPokemon['archive']['pokemon']:
            myPokemon['archive']['pokemon'][str(newPokemonId)] = {
                'count': 0,
                'maxLevel': 1,
                'maxPercent': 0
            }

        myPokemon['archive']['pokemon'][str(newPokemonId)]['count'] += 1
        pokemonId = newPokemonId
        
    myPokemon['default'].pop(str(second))
    myPokemon['length'] -= 1

    # 업적 업데이트 (level)
    if pokemonId in myPokemon['archive']['pokemon']:
        maxLevel = max(myPokemon['default'][str(first)]['level'], myPokemon['archive']['pokemon'][pokemonId]['maxLevel'])
    else:
        maxLevel = myPokemon['default'][str(first)]['level']

    myPokemon['archive']['pokemon'][pokemonId]['maxLevel'] = maxLevel
    db.setMyPokemon(userId, myPokemon)

    return True     

def trainingPokemon(userId, myPokemonId):
    myPokemon = db.getMyPokemon(str(userId))

    if myPokemon['default'][str(myPokemonId)]['percent'] == 1:
        return { 'result': False, 'msg': 'Already max percent' }
        
    result = db.updateMoney(userId, -1 * (2 ** (myPokemon['default'][str(myPokemonId)]['level'] - 1) * POKEMON_TRANING_PRICE))
    if not result['result']:
        return {'result': False, 'msg': result['msg']}

    # 내 포켓몬의 효율을 다시 돌림 -> 더 좋은 경우에만 반영됨
    newPercent = round(random.random(), 2)
    if float(myPokemon['default'][str(myPokemonId)]['percent']) < newPercent:
        myPokemon['default'][str(myPokemonId)]['percent'] = newPercent

        # 업적 업데이트
        _id = myPokemon['default'][str(myPokemonId)]['id']
        maxPercent = max(myPokemon['archive']['pokemon'][_id]['maxPercent'], newPercent)
        myPokemon['archive']['pokemon'][_id]['maxPercent'] = maxPercent

        db.setMyPokemon(userId, myPokemon)

        return newPercent

    else:
        # newPercent < originPercent
        return {'result': False, 'msg': '실패' }