import json
import datetime

DB_POKEMON_LIST = './db/pokemons.json'
DB_USER_LIST = './db/users.json'

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
