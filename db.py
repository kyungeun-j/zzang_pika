import json
import datetime
import os

# DB 위치
DB_POKEMON_LIST = './db/pokemons.json'
DB_USER_LIST = './db/users.json'
DB_INVENTORY = './db/inventory/'
DB_MY_POKEMONS = './db/my_pokemon/'

# 상점 가격
SHOP_BALL_PRICE = 100
SHOP_RM_PRICE = 1000
SHOP_BACK_SIZE = 50

# 포켓몬 도감
def getPokemonList():
    with open(DB_POKEMON_LIST, 'r') as f:
        datas = f.read()
        return json.loads(datas)
    return {}

# Users
def login(username, password):
    # 로그인 성공 시 user id를 return
    users = getUsers()
 
    correct = users['userList'][username]['password'] if username in users['userList'] else None
    
    if correct == None:
        # username이 없음
        return False

    if correct == password:
        userId = users['userList'][username]['id']
        updateUser(username, 'lastLogin', str(datetime.datetime.now()))
        return userId
    else:
        # 비밀번호가 틀림
        return False

def getUsers():
    with open(DB_USER_LIST, 'r') as f:
        datas = f.read()
        users = json.loads(datas)

        return users

def updateUser(username, field, data):
    before_users = getUsers()

    before_users['userList'][username][field] = data
    with open(DB_USER_LIST, 'w') as f:
        f.write(json.dumps(before_users))

def resetUsers():
    # db/users.json이 없는 경우, 초기화할 경우 사용
    usersForm = {
        'userLength': 0,
        'userList': {}
    }
    with open(DB_USER_LIST, 'w') as f:
        f.write(json.dumps(usersForm))
    
    # 인벤토리 삭제
    userInventories = os.listdir(DB_INVENTORY)
    userInventories.remove('table.json')

    for inventory in userInventories:
        os.remove(DB_INVENTORY + inventory)

    # 보유 포켓몬 삭제
    userMyPokemons = os.listdir(DB_MY_POKEMONS)
    userMyPokemons.remove('table.json')

    for myPokemon in userMyPokemons:
        os.remove(DB_MY_POKEMONS + myPokemon)

def register(username, password):
    userId = getUsers()['userLength'] + 1
    user = {
        'password': password,
        'lastLogin': '',
        'id': userId
    }

    before_users = getUsers()
    before_users['userLength'] = userId
    before_users['userList'][username] = user
    with open(DB_USER_LIST, 'w') as f:
        f.write(json.dumps(before_users))
    
    makeInventory(userId)

def checkDuplicatedUser(username):
    return username in getUsers()['userList'].keys()

# Inventory
def getInventory(userId):
    if not str(userId) + '.json' in os.listdir(DB_INVENTORY):
        makeInventory(userId)
    with open(DB_INVENTORY + str(userId) + '.json', 'r') as f:
        return json.loads(f.read())

def makeInventory(userId):
    with open(DB_INVENTORY + 'table.json', 'r') as f:
        inventoryTable = json.loads(f.read())
    
    with open(DB_INVENTORY + str(userId) + '.json', 'w') as f:
        f.write(json.dumps(inventoryTable))

def getMoney(userId):
    return getInventory(userId)['0']['amount']

def updateInventory(userId, field, datas):
    beforeInventory = getInventory(userId)
    if field == 'ball':
        if len(datas) > beforeInventory['999']['remain']:
            return {'result': False, 'msg': '가방 공간 부족'}

        for ball in datas:
            beforeInventory[ball]['amount'] += 1
        beforeInventory['999']['remain'] -= len(datas)

        if len(datas) * SHOP_BALL_PRICE > beforeInventory['0']['amount']:
            return {'result': False, 'msg': '소지 금액 부족'}
        beforeInventory['0']['amount'] -= len(datas) * SHOP_BALL_PRICE

    elif field == 'RM':
        # datas: 구입하는 갯수
        if datas > beforeInventory['999']['remain']:
            return {'result': False, 'msg': '가방 공간 부족'}
        beforeInventory['5']['amount'] += datas
        beforeInventory['5']['remain'] += datas

        beforeInventory['999']['remain'] -= datas

        if datas * SHOP_RM_PRICE > beforeInventory['0']['amount']:
            return {'result': False, 'msg': '소지 금액 부족'}
        beforeInventory['0']['amount'] -= datas * SHOP_RM_PRICE
    
    elif field == 'back':
        # datas를 사용하지 않음, 에러 처리 없음
        beforeInventory['999']['remain'] += SHOP_BACK_SIZE
        beforeInventory['999']['amount'] += SHOP_BACK_SIZE

    with open(DB_INVENTORY + str(userId) + '.json', 'w') as f:
        f.write(json.dumps(beforeInventory))

    return {'result': True}

def replaceInventory(userId, inventory):
    # catch에서 사용
    with open(DB_INVENTORY + str(userId) + '.json', 'w') as f:
        f.write(json.dumps(inventory))

def getRemainBackSize(userId):
    return getInventory(userId)['999']['remain']

# My Pokemon
def makeMyPokemon(userId):
    with open(DB_MY_POKEMONS + 'table.json', 'r') as f:
        myPokemonTable = json.loads(f.read())
    with open(DB_MY_POKEMONS + str(userId) + '.json', 'w') as f:
        f.write(json.dumps(myPokemonTable))

def getMyPokemon(userId):
    if not str(userId) + '.json' in os.listdir(DB_MY_POKEMONS):
        makeMyPokemon(userId)

    with open(DB_MY_POKEMONS + str(userId) + '.json', 'r') as f:
        return json.loads(f.read())

def addPokemon(userId, pokemonId, percent, _max):
    myPokemon = getMyPokemon(str(userId))

    myPokemon['length'] += 1
    myPokemon['default'][myPokemon['length']] = {
        'id': str(pokemonId),
        'percent': percent,
        'max': _max
    }

    with open(DB_MY_POKEMONS + str(userId) + '.json', 'w') as f:
        f.write(json.dumps(myPokemon))
        