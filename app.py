from flask import Flask, render_template, jsonify, request
import db
import catch as c
import shop

POKET_DATA = './pokemons.json'

app = Flask(__name__)

# Global
g = {}
g['pokemonList'] = db.getPokemonList()   # 포켓몬 도감
g['nPokemon'] = len(g['pokemonList'].keys())

# Routings
@app.route('/')
def main():
    return render_template('index.html')

@app.route('/list')
def list():
    return render_template('poket_list.html', datas=g['pokemonList'])

@app.route('/catch')
def catch():
    comed = c.comePokemon(g['nPokemon'], 3) # [(포켓몬 id, percent), ...]

    return str(comed)

@app.route('/shop')
def shop():

    # shop.buyBall(userId, numberOfbuyBall)
    # db.getMoney(userId)로 남은 코인 확인 후 처리
    
    return 'asd'

app.run()