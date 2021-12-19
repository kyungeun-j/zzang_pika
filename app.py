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

@app.route('/catch')
def catch():
    if 'id' in session:
        comed = c.comePokemon(g['nPokemon'], 3) # [(포켓몬 id, percent), ...]

        return str(comed)
    else:
        return redirect('/login')

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

@app.route('/shop')
def shopGet():
    _username = session['username'] if 'id' in session else False
    _money =  db.getMoney(session['id']) if 'id' in session else False
    print(_money)
    print(_username)
    return render_template('shop.html', username=_username, money=_money)

@app.route('/shop', methods=['POST'])
def shopPost():
    _userid = session['id'] if 'id' in session else False
    _money = db.getMoney(session['id']) if 'id' in session else False
    _success = False

    if _userid != False:
        # buyball
        if request.form['feild'] == 'buyball':
            if db.getMoney(_userid) >= int(request.form['ballCount']) * 100:
                _success = True
                _result = s.buyBall(_userid, int(request.form['ballCount']))
            else:
                _success = False
                _result = False
    return jsonify({'success': _success, 'result': _result, 'money': _money})

app.run('0.0.0.0')
