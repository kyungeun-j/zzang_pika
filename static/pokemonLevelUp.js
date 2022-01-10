const pokemons = JSON.parse(getID('pokemons').innerText.replaceAll("'", '"'));
const pokemonJSON = JSON.parse(getID('default').innerText.replaceAll("'", '"'));
let levelupBtn = [...getClass('pokemon')]

// default 포켓몬 리스트를 만들어줌
function listPokemon(type, json) {
    const listDivEle = getClass('listContainer')[0]
    listDivEle.innerHTML = ""
    if (type === 'list') {
        if (listDivEle.classList.contains('filter')) {
            listDivEle.classList.remove('filter')   
        }
        listDivEle.classList.add('list')   
    } else if (type === 'filter') {
        if (listDivEle.classList.contains('list')) {
            listDivEle.classList.remove('list')   
        }
        listDivEle.classList.add('filter') 
    }

    if (Object.keys(json).length == 0) {
        getClass('listContainer')[0].innerText = '합성할 수 있는 포켓몬이 없습니다.'
    } else {
        Object.keys(json).map(pokemon => {
            const pokemonLiEle = document.createElement('li');
            const pokemonDivEle = document.createElement('div')
            const pokemonDivLEle = document.createElement('div')
            const pokemonLSpanEle = document.createElement('span');
            const pokemonLSpan2Ele = document.createElement('span');
            const pokemonLSpan3Ele = document.createElement('span');
            const pokemonDivIEle = document.createElement('div')

            pokemonLiEle.classList.add(pokemon, 'lsItem')
            pokemonLiEle.style.background = "url('../static/images/" + json[pokemon]['id'] + ".png') no-repeat center"

            pokemonLSpanEle.innerText = 'Lv.';
            pokemonLSpan2Ele.innerText = json[pokemon]['level'];
            pokemonLSpan3Ele.innerText = pokemons[json[pokemon]['id']]['name'];
            pokemonDivLEle.appendChild(pokemonLSpanEle)
            pokemonDivLEle.appendChild(pokemonLSpan2Ele)

            pokemonDivEle.appendChild(pokemonDivLEle)
            pokemonDivEle.appendChild(pokemonLSpan3Ele)

            pokemonDivIEle.innerText = parseFloat(Math.round(json[pokemon]['percent'] * json[pokemon]['max'])) + " (" + parseInt(Math.round(parseFloat(json[pokemon]['percent']) * 100)) + "%)";

            pokemonLiEle.appendChild(pokemonDivEle);
            pokemonLiEle.appendChild(pokemonDivIEle);
            getClass('listContainer')[0].appendChild(pokemonLiEle)
    })
    }
    
    levelupBtn = [...getClass('lsItem')]
    levelupBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const pokemonID = btn.classList[0];
            if (btn.parentElement.classList[1] === 'list') {
                selectPokemon('select', pokemonID, json)
            pokemonFilter(pokemonID, pokemonJSON[pokemonID]['id'], pokemonJSON[pokemonID]['level'])
            } else if (btn.parentElement.classList[1] === 'filter') {
                selectPokemon('filter', pokemonID, json)
            }
        })
    })
}

listPokemon('list', pokemonJSON)

// 합성할 포켓몬 선택
function selectPokemon(type, pokemonID, json) {
    let second = 0;
    const pokemonSelDivEle = document.createElement('div');
    const pokemonDivEle = document.createElement('div')
    const pokemonDivLEle = document.createElement('div')
    const pokemonLSpanEle = document.createElement('span');
    const pokemonLSpan2Ele = document.createElement('span');
    const pokemonLSpan3Ele = document.createElement('span');
    const pokemonDivIEle = document.createElement('div')

    pokemonSelDivEle.classList.add(pokemonID, 'select');

    pokemonSelDivEle.style.background = "url('../static/images/" + json[pokemonID]['id'] + ".png') no-repeat center"

    pokemonLSpanEle.innerText = 'Lv.';
    pokemonLSpan2Ele.innerText = json[pokemonID]['level'];
    pokemonLSpan3Ele.innerText = pokemons[json[pokemonID]['id']]['name'];
    pokemonDivLEle.appendChild(pokemonLSpanEle)
    pokemonDivLEle.appendChild(pokemonLSpan2Ele)

    pokemonDivEle.appendChild(pokemonDivLEle)
    pokemonDivEle.appendChild(pokemonLSpan3Ele)

    pokemonDivIEle.innerText = parseFloat(Math.round(json[pokemonID]['percent'] * json[pokemonID]['max'])) + " (" + parseInt(Math.round(parseFloat(json[pokemonID]['percent']) * 100)) + "%)";

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
        listPokemon('list', pokemonJSON)
        getClass('selectPokemon')[0].innerHTML = ""
    })

    // 합성하기 버튼 -> post
    if (second > 0) {
        getClass('levelup')[0].addEventListener('click', async (e) => {

            const post = await fetch('/pokemonLevelUp', {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    first: getClass('selectPokemon')[0].children[0].classList[0],
                    second: second
                })
            })
            
            const data = await post.json();

            if (data === true) {
                alert('성공')

                listPokemon('list', pokemonJSON)
            } else {
                alert('실패')
            }
            getClass('selectPokemon')[0].innerHTML = ""
            getClass('filterPokemon')[0].innerHTML = ""
        })
    }
    
}

// 선택한 포켓몬과 합성할 수 있는 포켓몬 필터링
function pokemonFilter(selectPokemon, id, level) {
    const filterPokemon = Object.keys(pokemonJSON).filter(pokemon => {
        return pokemonJSON[pokemon]['id'] === id && pokemonJSON[pokemon]['level'] === level && pokemon !== selectPokemon
    })

    let filterJSON = {};
    filterPokemon.forEach(pokemon => {
        filterJSON[pokemon] = pokemonJSON[pokemon]
        
    })

    listPokemon('filter', filterJSON)
}