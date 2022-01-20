import json
from random import seed
import re
from flask import Flask, render_template, redirect, request, session
from flask.json import jsonify
import db
import catch as c
import shop as s
import pokemon as p

POKET_DATA = './pokemons.json'

app = Flask(__name__)
app.secret_key='1624'

# Global
g = {}
g['pokemonList'] = db.getPokemonList()   # 포켓몬 도감
g['nPokemon'] = len(g['pokemonList'].keys())

# Routings
@app.route('/')
def main():
    _username = session['username'] if 'id' in session else False
    return render_template('index.html', username=_username)
@app.route('/pokemonList')
def pokemonList():
    if 'id' in session:
        _username = session['username'] if 'id' in session else False
        _mypokemon = db.getMyPokemon(session['id'])

        return render_template('pokemonList.html', datas=g['pokemonList'], username=_username, myPokemon=_mypokemon)
    else:
        return redirect('/login')

@app.route('/pokemonDetail/<id>')
def pokemonDetail(id):
    _username = session['username'] if 'id' in session else False
    return render_template('pokemonDetail.html', data=g['pokemonList'][id], username=_username)

@app.route('/login', methods = ['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    elif request.method == 'POST':
        userId = db.login(request.form['username'], request.form['password'])
        if userId == False:
            return render_template('login.html', message=True)
        else:
            session['id'] = userId
            session['username'] = request.form['username']
            return redirect('/')

@app.route('/logout')
def logout():
    session.pop('id', None)
    session.pop('username', None)
    return redirect('/')

@app.route('/register', methods=['GET', 'POST'])
def register():
    _username = session['username'] if 'id' in session else False
    if request.method == 'GET':
        return render_template('register.html', username=_username)
    elif request.method == 'POST':
        db.register(request.form['username'], request.form['password'])
        return redirect('/login')

@app.route('/checkID', methods=['POST'])
def checkID():
    result = db.checkDuplicatedUser(request.form['username'])
    return jsonify({'result': result})

@app.route('/myPokemon', methods=['GET', 'POST'])
def myPokemon():
    _username = session['username'] if 'id' in session else False
    if 'id' in session:
        if request.method == 'GET':
            _mypokemon = db.getMyPokemon(session['id'])
            return render_template('myPokemon.html', username=_username, pokemons=g['pokemonList'], resting=_mypokemon['resting'], working=_mypokemon['working'], default=_mypokemon['default'])
    else:
        return redirect('/login')

@app.route('/pokemonRun', methods=['GET', 'POST'])
def pokemonRun():
    _username = session['username'] if 'id' in session else False
    _userid = session['id'] if 'id' in session else False
    if request.method == 'GET':
        if 'id' in session:
            _mypokemon = db.getMyPokemon(session['id'])
            _myRM = db.getInventory(session['id'])['5']
            del _mypokemon['length']
            del _mypokemon['archive']
            if 'coming' in _mypokemon:
                del _mypokemon['coming']
            
            return render_template('pokemonRun.html', username=_username, myRM=_myRM, pokemons=g['pokemonList'], mypokemon=_mypokemon)
        else:
            return redirect('/login')
    elif request.method == 'POST':
        _myRM = db.getInventory(session['id'])['5']

        if request.form['startCont'] == 'working':

            # 일 -> 휴식
            if request.form['endCont'] == 'resting':
                _workEndResult = p.workEndPokemon(_userid, request.form['dragPokemon'])
                _restStartResult = p.restPokemon(_userid, request.form['dragPokemon'])

                if _workEndResult == False or _restStartResult == False:
                    # 하나라도 문제가 생기면 False return, error 처리는 나중에
                    return jsonify({
                        'result': False
                    })

                return jsonify({
                    'result': True,
                    'coin': _workEndResult['coin'],
                    'startTime': _restStartResult['startTime'],
                    'hp': _workEndResult['hp']
                })

            # 일 -> 아무것도 안함
            elif request.form['endCont'] == 'default':
                _result = p.workEndPokemon(_userid, request.form['dragPokemon'])
                return jsonify(_result) # coin, hp

        elif request.form['startCont'] == 'resting':
            # 휴식 -> 일
            if request.form['endCont'] == 'working':
                _restEndResult = p.restEndPokemon(_userid, request.form['dragPokemon'])
                _workStartResult = p.workPokemon(_userid, request.form['dragPokemon'])

                if _restEndResult == False or _workStartResult == False:
                    # 하나라도 문제가 생기면 False return, error 처리는 나중에
                    return jsonify({
                        'result': False
                    })

                return jsonify({
                    'result': True,
                    'hp': _restEndResult['hp'],
                    'startTime': _workStartResult['startTime']
                })
            # 휴식 -> 아무것도 안함
            elif request.form['endCont'] == 'default':
                _result = p.restEndPokemon(_userid, request.form['dragPokemon'])
                return jsonify(_result)

        elif request.form['startCont'] == 'default':
            # 아무것도 안함 -> 일
            if request.form['endCont'] == 'working':
                _result = p.workPokemon(_userid, request.form['dragPokemon'])
                if _result == False:
                    return jsonify({'result': False})

                return jsonify({
                    'startTime': _result['startTime']
                })

            # 아무것도 안함 -> 휴식
            elif request.form['endCont'] == 'resting':
                _result = p.restPokemon(_userid, request.form['dragPokemon'])
                return jsonify({
                    'startTime': _result['startTime']
                })
        
        # 같은 곳으로 이동 (무시)
        elif request.form['startCont'] == request.form['endCont']:
            return jsonify({'result': False})

@app.route('/pokemonTraining', methods=['GET', 'POST'])
def pokemonTraining():
    _username = session['username'] if 'id' in session else False
    if 'id' in session:
        if request.method == 'GET':
            _default = db.getMyPokemon(session['id'])['default']
            return render_template('pokemonTraining.html', username=_username, pokemons=g['pokemonList'], default=_default)
        elif request.method == 'POST':
            if request.form['field'] == 'training':
                return jsonify(p.trainingPokemon(session['id'], int(request.form['pokemonID'])))
    else:
        return redirect('/login')

@app.route('/pokemonLevelUp', methods=['GET', 'POST'])
def pokemonLevelUp():
    _username = session['username'] if 'id' in session else False
    if 'id' in session:
        if request.method == 'GET':
            _default = db.getMyPokemon(session['id'])['default']
            return render_template('pokemonLevelUp.html', username=_username, pokemons=g['pokemonList'], default=_default)
        elif request.method == 'POST':
            _result = p.levelUpPokemon(session['id'], int(request.form['first']), int(request.form['second']))
            if _result == True:
                _levelUpPoke = db.getMyPokemon(session['id'])['default'][request.form['first']]
            return jsonify({'result':_result, "levelUpPoke": _levelUpPoke})
    else:
        return redirect('/login')


@app.route('/shop')
def shopGet():
    _username = session['username'] if 'id' in session else False
    if 'id' in session:
        inventory = db.getInventory(session['id'])
        money = inventory['0']['amount']
        remainBagSize = inventory['999']['remain']
        return render_template('shop.html', username=_username, money=money, remainBagSize=remainBagSize)
    else:
        return redirect('/login')

@app.route('/shop', methods=['POST'])
def shopPost():
    _userid = session['id'] if 'id' in session else False
    # buyball
    if request.form['feild'] == 'buyball':
        _ballResult = s.buyBall(_userid, int(request.form['ballCount']))
        return jsonify(_ballResult)
    # expandBagSize
    elif request.form['feild'] == 'expandBagSize':
        _bagResult = s.expandBackSize(_userid)
        return _bagResult
    # buyRunningMachines
    elif request.form['feild'] == 'buyRunningMachines':
        _runningResult = s.buyRunningMachines(_userid, int(request.form['runCount']))
        return _runningResult
    # expandPokemonLength
    elif request.form['feild'] == 'expandPokemonLength':
        _pokemonLResult = s.expandPokemonLength(_userid)
        return _pokemonLResult

@app.route('/pokemonCatch', methods=['GET', 'POST'])
def catch():
    _username = session['username'] if 'id' in session else False
    if request.method == 'GET':
        if 'id' in session:
            _userball = []
            userinventory = db.getInventory(session['id'])
            for _id in range(1, 5):
                _userball.append(userinventory[str(_id)])
            return render_template('pokemonCatch.html', username=_username, userball=_userball)
        else:
            return redirect('/login')
    elif request.method == 'POST':
        _userid = session['id'] if 'id' in session else False
        if _userid != False:
            # comePokemon
            if request.form['post_id'] == 'comePokemon':
                if request.form['catch_res'] == 'true' or request.form['catch_res'] == 'run':
                    c.resetComingPokemon(_userid)
                return jsonify((c.comePokemon(_userid, 151, 3)))

            # catchPokemon
            elif request.form['post_id'] == 'catchPokemon':
                _max = g['pokemonList'][request.form['pokemonId']]['efficiency']
                result = {'result': c.catchPokemon(_userid, request.form['ballType'], request.form['pokemonId'], float(request.form['percent']), _max, int(request.form['numberOfTry']))}
                return jsonify(result)
        else:
            return redirect('/login')
    
app.run('0.0.0.0')
