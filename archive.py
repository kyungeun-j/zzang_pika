import db

def updateArchive(userId, archiveType, datas):
    myPokemon = db.getMyPokemon(userId)

    if archiveType == 'throw':
        myPokemon['archive']['ball'][datas['ballType']]['throw'] += 1
    elif archiveType == 'get':
        myPokemon['archive']['ball'][datas['ballType']]['throw'] += 1
        myPokemon['archive']['ball'][datas['ballType']]['success'] += 1
        
        if not datas['pokemonId'] in myPokemon['archive']['pokemon']:
            myPokemon['archive']['pokemon'][datas['pokemonId']] = {
                'count': 0,
                'maxLevel': 1,
                'maxPercent': 0
            }
        
        myPokemon['archive']['pokemon'][datas['pokemonId']]['count'] += 1
        myPokemon['archive']['pokemon'][datas['pokemonId']]['maxPercent'] = max(float(myPokemon['archive']['pokemon'][datas['pokemonId']]['maxPercent']), float(datas['percent']))

    elif archiveType == 'level':
        # 최대 레벨은 pokemon.trainingPokemon에서 바로 반영
        pass

    db.setMyPokemon(userId, myPokemon)

def addPokemon(userId, pokemonId):
    # updatePokemon의 get이 아닌 경우 (ex. level up)에만 사용
    # pokemon이 이미 있는 경우 count += 1
    myPokemon = db.getMyPokemon(userId)

    if str(pokemonId) in myPokemon['archive']['pokemon']:
        myPokemon['archive']['pokemon'][str(pokemonId)]['count'] += 1

    myPokemon['archive']['pokemon'][str(pokemonId)] = {
        'count': 0,
        'maxLevel': 1,
        'maxPercent': 0
    }

    db.setMyPokemon(userId, myPokemon)
