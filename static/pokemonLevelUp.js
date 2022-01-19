const pokemons = JSON.parse(getID('pokemons').innerText.replaceAll("'", '"'));
let pokemonJSON = JSON.parse(getID('default').innerText.replaceAll("'", '"'));
let levelupBtn = [...getClass('pokemon')]

Object.keys(pokemonJSON).forEach(poke => {
    pokemonJSON[poke]['catchID'] = poke
})

sortPokemon(getID('pokemonSort').value)

// default 포켓몬 리스트를 만들어줌
function listPokemon(type, json) {
    const listDivEle = getClass('listContainer')[0]
    listDivEle.innerHTML = ""
    if (type === 'list') {// 합성할 포켓몬 1 선택했을 때
        if (listDivEle.classList.contains('filter')) {
            listDivEle.classList.remove('filter')   
        }
        listDivEle.classList.add('list')
    } else if (type === 'filter') {// 합성할 포켓몬 2 선택했을 때
        if (listDivEle.classList.contains('list')) {
            listDivEle.classList.remove('list')   
        }
        listDivEle.classList.add('filter') 
    }

    // 포켓몬이 없을 떄
    if (Object.values(json).length == 0) {
        getClass('listContainer')[0].innerText = '합성할 수 있는 포켓몬이 없습니다.'
    } else {
        Object.values(json).map(pokemon => {
            const pokemonLiEle = document.createElement('li');
            const pokemonDivEle = document.createElement('div')
            const pokemonDivLEle = document.createElement('div')
            const pokemonLSpanEle = document.createElement('span');
            const pokemonLSpan2Ele = document.createElement('span');
            const pokemonLSpan3Ele = document.createElement('span');
            const pokemonDivIEle = document.createElement('div')

            pokemonLiEle.classList.add('lsItem')
            pokemonLiEle.setAttribute('catchID', pokemon['catchID']);
            pokemonLiEle.style.background = "url('../static/images/" + pokemon['id'] + ".png') no-repeat center"

            pokemonLSpanEle.innerText = 'Lv.';
            pokemonLSpan2Ele.innerText = pokemon['level'];
            pokemonLSpan3Ele.innerText = pokemons[pokemon['id']]['name'];
            pokemonDivLEle.appendChild(pokemonLSpanEle)
            pokemonDivLEle.appendChild(pokemonLSpan2Ele)

            pokemonDivEle.appendChild(pokemonDivLEle)
            pokemonDivEle.appendChild(pokemonLSpan3Ele)

            pokemonDivIEle.innerText = parseFloat(Math.round(pokemon['percent'] * pokemon['max'])) + " (" + parseInt(Math.round(parseFloat(pokemon['percent']) * 100)) + "%)";

            pokemonLiEle.appendChild(pokemonDivEle);
            pokemonLiEle.appendChild(pokemonDivIEle);
            getClass('listContainer')[0].appendChild(pokemonLiEle)
    })
    }
    
    // 포켓몬 선택 시
    levelupBtn = [...getClass('lsItem')]
    levelupBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const pokemonID = btn.getAttribute('catchID');

            // 포켓몬 1 선택했을 떄
            if (btn.parentElement.classList[1] === 'list') {
                selectPokemon('select', pokemonID, pokemonJSON[pokemonID])
                pokemonFilter(pokemonID, pokemonJSON[pokemonID]['id'], pokemonJSON[pokemonID]['level'])
                getID('pokemonSort').style.display = 'none';
            }
            // 포켓몬 2 선택했을 때
            else if (btn.parentElement.classList[1] === 'filter') {
                selectPokemon('filter', pokemonID, pokemonJSON[pokemonID])
            }
        })
    })
}

// 합성할 포켓몬 선택했을 때 selectContainer에 이미지 넣어주기
function selectPokemon(type, pokemonID, json) {
    let second = 0;
    const pokemonSelDivEle = document.createElement('div');
    const pokemonDivEle = document.createElement('div')
    const pokemonDivLEle = document.createElement('div')
    const pokemonLSpanEle = document.createElement('span');
    const pokemonLSpan2Ele = document.createElement('span');
    const pokemonLSpan3Ele = document.createElement('span');
    const pokemonDivIEle = document.createElement('div')

    pokemonSelDivEle.classList.add('selectPoke');
    pokemonSelDivEle.setAttribute('catchID', pokemonID)

    pokemonSelDivEle.style.background = "url('../static/images/" + json['id'] + ".png') no-repeat center"

    pokemonLSpanEle.innerText = 'Lv.';
    pokemonLSpan2Ele.innerText = json['level'];
    pokemonLSpan3Ele.innerText = pokemons[json['id']]['name'];
    pokemonDivLEle.appendChild(pokemonLSpanEle)
    pokemonDivLEle.appendChild(pokemonLSpan2Ele)

    pokemonDivEle.appendChild(pokemonDivLEle)
    pokemonDivEle.appendChild(pokemonLSpan3Ele)

    pokemonDivIEle.innerText = parseFloat(Math.round(json['percent'] * json['max'])) + " (" + parseInt(Math.round(parseFloat(json['percent']) * 100)) + "%)";

    pokemonSelDivEle.appendChild(pokemonDivEle);
    pokemonSelDivEle.appendChild(pokemonDivIEle);

    if (type === 'select') {
        getClass('selectPokemon')[0].innerHTML = ""
        getClass('selectPokemon')[0].appendChild(pokemonSelDivEle)

        const reSelect = document.createElement('button');
        reSelect.classList.add('reSelect', 'selectBtn')
        reSelect.innerText = '다시 고르기'
        getClass('selectPokemon')[0].appendChild(reSelect)
    } else if (type === 'filter') {
        getClass('filterPokemon')[0].innerHTML = ""
        getClass('filterPokemon')[0].appendChild(pokemonSelDivEle)

        const levelup = document.createElement('button');
        levelup.classList.add('levelup', 'selectBtn')
        levelup.innerText = '합성하기'
        getClass('filterPokemon')[0].appendChild(levelup)

        second = pokemonID
    }

    // 다시 고르기 버튼
    getClass('reSelect')[0].addEventListener('click', (e) => {
        first = pokemonID
        getClass('selectPokemon')[0].innerHTML = ""
        getClass('filterPokemon')[0].innerHTML = ""

        getID('pokemonSort').style.display = 'block';
        sortPokemon(getID('pokemonSort').value)
    })

    // 합성하기 버튼 -> post
    if (second > 0) {
        getClass('levelup')[0].addEventListener('click', async (e) => {
            const first = getClass('selectPokemon')[0].children[0].getAttribute('catchID')
            const post = await fetch('/pokemonLevelUp', {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    first: first,
                    second: second
                })
            })

            const data = await post.json();
            console.log(data)
            if (data.result === true) {
                alert('성공')

                pokemonJSON[first] = data.levelUpPoke
                pokemonJSON[first]['catchID'] = first
                delete pokemonJSON[second]

                listPokemon('list', pokemonJSON)
            } else {
                alert('실패')

                delete pokemonJSON[getClass('selectPokemon')[0].children[0].getAttribute('catchID')]
            }

            getClass('selectPokemon')[0].innerHTML = ""
            getClass('filterPokemon')[0].innerHTML = ""
            getID('pokemonSort').style.display = 'block';
            sortPokemon(getID('pokemonSort').value)
        })
    }
}

// 선택한 포켓몬과 합성할 수 있는 포켓몬 필터링
function pokemonFilter(selectPokemon, id, level) {
    let filterPokemon = Object.values(pokemonJSON).filter(pokemon => {
        return pokemon['id'] === id && pokemon['level'] === level && pokemon['catchID'] !== selectPokemon
    })

    listPokemon('filter', filterPokemon)
}

// 포켓몬 리스트 정렬
getID('pokemonSort').addEventListener('change', sortPokemon)
function sortPokemon(e) {
    const value = e.target === undefined ? getID('pokemonSort').value : e.target.value
    let json = {}

    if (value == 'catchId') {
        json = Object.values(pokemonJSON).sort(function(a, b) {
            let x = Number(a['catchID'])
            let y = Number(b['catchID'])

            return (x < y) ? 1 : (x === y) ? 0 : -1;
        })
    } else if (value === 'pokemonId') {
        json = Object.values(pokemonJSON).sort(function(a, b) {
            let x = Number(a['id'])
            let y = Number(b['id'])

            return (x > y) ? 1 : (x === y) ? 0 : -1;
        })
    }
    listPokemon('list', json)
}