import json
import datetime
import os
import time

# DB 위치
DB_POKEMON_LIST = './db/pokemons.json'
DB_USER_LIST = './db/users.json'
DB_INVENTORY = './db/inventory/'
DB_MY_POKEMONS = './db/my_pokemon/'

# 상점 가격
SHOP_BALL_PRICE = 100
SHOP_RM_PRICE = 1000
SHOP_BAG_SIZE = 50
SHOP_BAG_PRICE = 10000
SHOP_POKEMON_BAG_SIZE = 10
SHOP_POKEMON_BAG_PRICE = 10000

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
        f.write(json.dumps(before_users, indent=2))

def resetUsers():
    # db/users.json이 없는 경우, 초기화할 경우 사용
    usersForm = {
        'userLength': 0,
        'userList': {}
    }
    with open(DB_USER_LIST, 'w') as f:
        f.write(json.dumps(usersForm, indent=2))
    
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
        f.write(json.dumps(before_users, indent=2))
    
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
        f.write(json.dumps(inventoryTable, indent=2))

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
    
    elif field == 'bag':
        # datas를 사용하지 않음
        beforeInventory['999']['remain'] += SHOP_BAG_SIZE
        beforeInventory['999']['amount'] += SHOP_BAG_SIZE

        if SHOP_BAG_PRICE > beforeInventory['0']['amount']:
            return {'result': False, 'msg': '소지 금액 부족'}
        beforeInventory['0']['amount'] -= SHOP_BAG_PRICE

    elif field == 'pokemonBag':
        # datas를 사용하지 않음
        beforeInventory['999']['remain'] += SHOP_POKEMON_BAG_SIZE
        beforeInventory['999']['amount'] += SHOP_POKEMON_BAG_SIZE

        if SHOP_BAG_PRICE > beforeInventory['0']['amount']:
            return {'result': False, 'msg': '소지 금액 부족'}
        beforeInventory['0']['amount'] -= SHOP_POKEMON_BAG_PRICE

    with open(DB_INVENTORY + str(userId) + '.json', 'w') as f:
        f.write(json.dumps(beforeInventory, indent=2))

    return {'result': True}

def replaceInventory(userId, inventory):
    # catch에서 사용
    with open(DB_INVENTORY + str(userId) + '.json', 'w') as f:
        f.write(json.dumps(inventory, indent=2))

def updateMoney(userId, earned):
    inventory = getInventory(userId)
    if inventory['0']['amount'] + int(earned) < 0:
        return { 'result': False, 'msg': '소지 금액 부족'}

    inventory['0']['amount'] += int(earned)

    replaceInventory(userId, inventory)

    return { 'result': True }
    
def getRemainBackSize(userId):
    return getInventory(userId)['999']['remain']

# My Pokemon
def makeMyPokemon(userId):
    with open(DB_MY_POKEMONS + 'table.json', 'r') as f:
        myPokemonTable = json.loads(f.read())
    with open(DB_MY_POKEMONS + str(userId) + '.json', 'w') as f:
        f.write(json.dumps(myPokemonTable, indent=2))

def getMyPokemon(userId):
    if not str(userId) + '.json' in os.listdir(DB_MY_POKEMONS):
        makeMyPokemon(userId)

    with open(DB_MY_POKEMONS + str(userId) + '.json', 'r') as f:
        return json.loads(f.read())

def setMyPokemon(userId, updated):
    with open(DB_MY_POKEMONS + str(userId) + '.json', 'w') as f:
        f.write(json.dumps(updated, indent=2))

def addPokemon(userId, pokemonId, percent, _max):
    myPokemon = getMyPokemon(str(userId))

    myPokemon['length'] += 1
    myPokemon['id'] += 1
    # myPokemon['length']: my Pokemon Id
    myPokemon['default'][myPokemon['id']] = {
        'id': str(pokemonId),
        'percent': percent,
        'max': _max,
        'hp': 300,
        'maxHp': 300,
        'level': 1
    }

    # 전설 포켓몬은 레벨 및 효율 비율이 정해져서 spawn
    if (int(pokemonId) >= 144 and int(pokemonId) <= 146) or int(pokemonId) == 151:
        myPokemon['default'][myPokemon['id']]['level'] = 10
        myPokemon['default'][myPokemon['id']]['percent'] = 0.5
    elif int(pokemonId) == 150:
        myPokemon['default'][myPokemon['id']]['level'] = 15
        myPokemon['default'][myPokemon['id']]['percent'] = 0.5

    setMyPokemon(userId, myPokemon)
