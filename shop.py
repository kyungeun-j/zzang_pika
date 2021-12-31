import db
import random

# shop 가격은 db.py 상단에 기재

# 몬스터볼 구입
def buyBall(userId, n):
    balls = randBall(n)
    result = db.updateInventory(userId, 'ball', balls)

    if not result['result']:
        return result
        
    return balls

def randBall(n):
    randomResult = []
    for _ in range(n):
        rand = round(random.random(), 2)
        if rand == 0.01:
            # 약 1%
            randomResult.append('4')
        elif rand < 0.11:
            # 약 9%
            randomResult.append('3')
        elif rand < 0.31:
            # 약 20%
            randomResult.append('2')
        else:
            # 약 70%
            randomResult.append('1')
    return randomResult

# 러닝머신 구입
def buyRunningMachines(userId, n):
    n = int(n)
    return db.updateInventory(userId, 'RM', n)

# 포켓몬 가방 확장
def expandPokemonLength(userId, n):
    pass

# 인벤토리 가방 확장
def expandBackSize(userId):
    pass