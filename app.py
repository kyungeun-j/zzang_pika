from flask import Flask, render_template, jsonify, request
import db
import catch as c

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

app.run()