from bs4 import BeautifulSoup as bs
import requests
import json 

POKET_DATA = './pokemons.json'
URL = 'https://pokemon.fandom.com/ko/wiki/%EC%A2%85%EC%A1%B1%EA%B0%92_%EB%AA%A9%EB%A1%9D/1%EC%84%B8%EB%8C%80'

def getInfo(raw_data):
    json_data = {}
    json_data['id'] = int(raw_data.select('td')[0].get_text())          # id
    json_data['name'] = raw_data.select('td')[2].get_text().strip()             # name
    json_data['efficiency'] = int(raw_data.select('td')[-2].get_text()) # efficiency
    
    return json_data

def makeJSONDatas():
    # 포켓몬 DB 크롤링 -> return json_datas 
    req = requests.get(URL);
    soup = bs(req.content, 'html.parser')
    
    raw_datas = soup.select('table.rounded tbody tr')[1:]

    json_datas = {}

    for raw_data in raw_datas:
        json_data = getInfo(raw_data)
        json_datas[str(json_data['id'])] = json_data

    return json_datas

def pretty_saveData(fileName, json_datas):
    with open(fileName, 'w') as f:
        f.write(json.dumps(json_datas, indent=2))   #  json -> str

def saveData(fileName, json_datas):
    with open(fileName, 'w') as f:
        f.write(json.dumps(json_datas))        

def getData(fileName):
    with open(fileName, 'r') as f:
        datas = f.read()
        return json.loads(datas)

    return {}

if __name__ == '__main__':
    print(getData(POKET_DATA))

    # pretty_saveData(POKET_DATA, makeJSONDatas())