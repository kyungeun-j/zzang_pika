import json
import datetime
import os

# DB 위치
DB_POKEMON_LIST = './db/pokemons.json'
DB_USER_LIST = './db/users.json'
DB_INVENTORY = './db/inventory/'

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
        for ball in datas:
            beforeInventory[ball]['amount'] += 1

    beforeInventory['0']['amount'] -= len(datas) * 100

    # coin이 0 이하로 떨어지지 않음
    # updateInventory()를 사용하는 곳에서 예외처리 해주어야 함
    beforeInventory['0']['amount'] = 0 if beforeInventory['0']['amount'] < 0 else beforeInventory['0']['amount']

    with open(DB_INVENTORY + str(userId) + '.json', 'w') as f:
        f.write(json.dumps(beforeInventory))
