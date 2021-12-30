import json
from random import seed
import re
from flask import Flask, render_template, redirect, request, session
from flask.json import jsonify
import db
import catch as c
import shop as s

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

@app.route('/list')
def list():
    _username = session['username'] if 'id' in session else False
    return render_template('list.html', datas=g['pokemonList'], username=_username)

@app.route('/detail/<id>')
def detail(id):
    _username = session['username'] if 'id' in session else False
    return render_template('detail.html', data=g['pokemonList'][id], username=_username)

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
    print(result)
    return jsonify({'result': result})

@app.route('/shop')
def shopGet():
    _username = session['username'] if 'id' in session else False
    _money =  db.getMoney(session['id']) if 'id' in session else False
    return render_template('shop.html', username=_username, money=_money)

@app.route('/shop', methods=['POST'])
def shopPost():
    _userid = session['id'] if 'id' in session else False
    if _userid != False:
        # buyball
        if request.form['feild'] == 'buyball':
            _ballResult = s.buyBall(_userid, int(request.form['ballCount']))
            if _ballResult != False:
                result = {'success': True, 'ball': _ballResult, 'money': db.getMoney(_userid)}
            else:
                result = {'success': False, 'msg': '코인이 부족합니다.'}
    else:
        result = {'success': False, 'msg': '로그인을 해주세요.'}

    return jsonify(result)


@app.route('/catch', methods=['GET', 'POST'])
def catch():
    _username = session['username'] if 'id' in session else False

    if request.method == 'GET':
        if 'id' in session:
            _userball = []
            userinventory = getData('./db/inventory/'+str(session['id'])+'.json')
            for _id in range(1, 5):
                _userball.append(userinventory[str(_id)])

            return render_template('catch.html', username=_username, userball=_userball)
        else:
            return redirect('/login')
    elif request.method == 'POST':
        if request.form['post_id'] == 'comePokemon':
            return jsonify((c.comePokemon(151, 3)))
        elif request.form['post_id'] == 'catchPokemon':
            _max = g['pokemonList'][request.form['pokemonId']]['efficiency']
            result = {'result': c.catchPokemon(session['id'], request.form['ballType'], request.form['pokemonId'], request.form['percent'], _max, int(request.form['numberOfTry']))}
            print(result)
            print(request.form['numberOfTry'])
            return jsonify(result)

# jsonfile read
def getData(fileName):
    with open(fileName, 'r') as f:
        datas = f.read()
        return json.loads(datas)
    
app.run('0.0.0.0')
