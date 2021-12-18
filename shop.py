import db
import random

def buyBall(userId, n):
    money = db.getMoney(userId)
    price = n * 100
    if money < price:
        return False    # 소지 코인보다 구매 금액이 높으면 return False
    
    balls = randBall(n)
    db.updateInventory(userId, 'ball', balls)

    return True # 정상적으로 구입이 되면 return True

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

buyBall('1', 20)