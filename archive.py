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
