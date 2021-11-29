from flask import Flask, render_template, jsonify, request
import json
POKET_DATA = './pokemons.json'

app = Flask(__name__)

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/list')
def list():
    with open(POKET_DATA) as f:
        list_data = json.load(f)
        print(jsonify(list_data))
    return render_template('poket_list.html', datas=list_data)