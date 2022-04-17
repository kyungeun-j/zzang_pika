const getID = (idName) => document.getElementById(idName);
const getClass = (className) => document.getElementsByClassName(className);

// result popup
const popup_text = (text) => {
    getID('result_text').innerText = text;
    getID('result_container').classList.add('popped');

    setTimeout(function() {
        // 1초 뒤 닫음
        getID('result_text').innerText = '';
        getID('result_container').classList.remove('popped');
    }, 1000);
};

// scrollbar overflow handler
const show_scroll_bar = (ele) => {
    const eleOverflow = document.defaultView.getComputedStyle(ele).getPropertyValue("overflow-y");

    if (eleOverflow === 'hidden')
    {
        ele.addEventListener('mouseover', () => {
            ele.style.overflowY = 'scroll';
        });
        ele.addEventListener('mouseout', () => {
            ele.style.overflowY = 'hidden';
        });
    }
}

// Sort the list on the pokemonLevelUp/pokemonTraining page
const pokemon_sort = (e, defaultPokeJSON) => {
    const value = e.target === undefined ? getID('pokemonSort').value : e.target.value;
    let json = {};

    if (value === 'catchId') 
    {
        json = Object.values(defaultPokeJSON).sort(function(a, b) {
            let x = Number(a['catchID']);
            let y = Number(b['catchID']);

            return (x < y) ? 1 : (x === y) ? 0 : -1;
        });
    }
    else if (value === 'pokemonId') 
    {
        json = Object.values(defaultPokeJSON).sort(function(a, b) {
            let x = Number(a['id']);
            let y = Number(b['id']);

            return (x > y) ? 1 : (x === y) ? 0 : -1;
        });
    }
    pokemon_list_create('list', json, defaultPokeJSON);
}

const pokemon_list_create = (type, json, defaultPokeJSON) => {
    const listDivEle = getClass('listContainer')[0];
    listDivEle.innerHTML = '';
    if (type === 'list') {// 합성할 포켓몬 1 선택했을 때
        if (listDivEle.classList.contains('filter')) {
            listDivEle.classList.remove('filter');
        }
        listDivEle.classList.add('list');
    } else if (type === 'filter') {// 합성할 포켓몬 2 선택했을 때
        if (listDivEle.classList.contains('list')) {
            listDivEle.classList.remove('list');
        }
        listDivEle.classList.add('filter');
    }

    // 포켓몬이 없을 떄
    if (Object.values(json).length == 0) 
    {
        let noPokemonInfo = ''
        if (window.location.pathname === '/pokemonLevelUp')
        {
            noPokemonInfo = '합성할 수 있는 포켓몬이 없습니다.';
        }
        else if (window.location.pathname === '/pokemonTraining')
        {
            noPokemonInfo = '훈련할 수 있는 포켓몬이 없습니다.';
        }
        getClass('listContainer')[0].innerText = noPokemonInfo;
    } 
    else 
    {
        Object.values(json).map(pokemon => {
            const pokemonLiEle = document.createElement('li');
            const pokemonDivEle = document.createElement('div');
            const pokemonDivLEle = document.createElement('div');
            const pokemonLSpanEle = document.createElement('span');
            const pokemonLSpan2Ele = document.createElement('span');
            const pokemonLSpan3Ele = document.createElement('span');
            const pokemonDivIEle = document.createElement('div');

            pokemonLiEle.classList.add('lsItem');
            pokemonLiEle.setAttribute('catchID', pokemon['catchID']);
            pokemonLiEle.style.background = '#fbfbfb url(../static/images/' + pokemon['id'] + '.png) no-repeat center';
            pokemonLSpanEle.innerText = 'Lv.';
            pokemonLSpan2Ele.innerText = pokemon['level'];
            pokemonLSpan3Ele.innerText = pokemons[pokemon['id']]['name'];
            pokemonDivLEle.appendChild(pokemonLSpanEle);
            pokemonDivLEle.appendChild(pokemonLSpan2Ele);

            pokemonDivEle.appendChild(pokemonDivLEle);
            pokemonDivEle.appendChild(pokemonLSpan3Ele);

            pokemonDivIEle.innerText = parseFloat(Math.round(pokemon['percent'] * pokemon['max'])) + ' (' + parseInt(Math.round(parseFloat(pokemon['percent']) * 100)) + '%)';

            pokemonLiEle.appendChild(pokemonDivEle);
            pokemonLiEle.appendChild(pokemonDivIEle);
            getClass('listContainer')[0].appendChild(pokemonLiEle);
        });
    }
    
    // 포켓몬 선택 시
    pokemonBtn = [...getClass('lsItem')];
    pokemonBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const pokemonID = btn.getAttribute('catchID');

            // 포켓몬 1 선택했을 떄
            if (btn.parentElement.classList[1] === 'list') 
            {
                if (window.location.pathname === '/pokemonLevelUp')
                {
                    select_pokemon('select', pokemonID, defaultPokeJSON[pokemonID]);
                    pokemon_filter(pokemonID, defaultPokeJSON[pokemonID]['id'], defaultPokeJSON[pokemonID]['level'], defaultPokeJSON);
                    getID('pokemonSort').style.display = 'none';
                }
                else if (window.location.pathname === '/pokemonTraining')
                {
                    select_pokemon('select', pokemonID, defaultPokeJSON[pokemonID]);
                }
            }
            // 포켓몬 2 선택했을 때
            else if (btn.parentElement.classList[1] === 'filter') 
            {
                select_pokemon('filter', pokemonID, defaultPokeJSON[pokemonID]);
            }
        });
    });
}

// 합성할 포켓몬 선택했을 때 selectContainer에 이미지 넣어주기
function select_pokemon(type, pokemonID, json) {
    let second = 0;
    const pokemonSelDivEle = document.createElement('div');
    const pokemonDivEle = document.createElement('div');
    const pokemonDivLEle = document.createElement('div');
    const pokemonLSpanEle = document.createElement('span');
    const pokemonLSpan2Ele = document.createElement('span');
    const pokemonLSpan3Ele = document.createElement('span');
    const pokemonDivIEle = document.createElement('div');

    pokemonSelDivEle.classList.add('selectPoke');
    pokemonSelDivEle.setAttribute('catchID', pokemonID);

    pokemonSelDivEle.style.background = 'url(../static/images/' + json['id'] + '.png) no-repeat center';

    pokemonLSpanEle.innerText = 'Lv.';
    pokemonLSpan2Ele.innerText = json['level'];
    pokemonLSpan3Ele.innerText = pokemons[json['id']]['name'];
    pokemonDivLEle.appendChild(pokemonLSpanEle);
    pokemonDivLEle.appendChild(pokemonLSpan2Ele);

    pokemonDivEle.appendChild(pokemonDivLEle);
    pokemonDivEle.appendChild(pokemonLSpan3Ele);

    pokemonDivIEle.innerText = parseFloat(Math.round(json['percent'] * json['max'])) + ' (' + parseInt(Math.round(parseFloat(json['percent']) * 100)) + '%)';

    pokemonSelDivEle.appendChild(pokemonDivEle);
    pokemonSelDivEle.appendChild(pokemonDivIEle);

    if (type === 'select') {
        getClass('selectPokemon')[0].innerHTML = '';
        getClass('selectPokemon')[0].appendChild(pokemonSelDivEle);
        if (window.location.pathname === '/pokemonTraining')
        {
            const training = document.createElement('button');
            training.classList.add('training', 'selectBtn');
            training.innerText = '훈련시키기';
            getClass('selectPokemon')[0].appendChild(training);
        }
        else
        {
            const reSelect = document.createElement('button');
            reSelect.classList.add('reSelect', 'selectBtn');
            reSelect.innerText = '다시 고르기';
            getClass('selectPokemon')[0].appendChild(reSelect);
        }
    } else if (type === 'filter') {
        getClass('filterPokemon')[0].innerHTML = '';
        getClass('filterPokemon')[0].appendChild(pokemonSelDivEle);

        const levelup = document.createElement('button');
        levelup.classList.add('levelup', 'selectBtn');
        levelup.innerText = '합성하기';
        getClass('filterPokemon')[0].appendChild(levelup);

        second = pokemonID;
    }

    // 다시 고르기 버튼

    if (window.location.pathname === '/pokemonLevelUp')
    {
        getClass('reSelect')[0].addEventListener('click', () => {
            first = pokemonID;

            getClass('selectPokemon')[0].innerHTML = '';
            if (window.location.pathname === '/pokemonLevelUp')
            {
                getClass('filterPokemon')[0].innerHTML = '';
        
                getID('pokemonSort').style.display = 'block';
                pokemon_sort(getID('pokemonSort').value, pokemonJSON);
            }
        });
    }

    // 합성하기 버튼 -> post
    if (second > 0) {
        getClass('levelup')[0].addEventListener('click', async (e) => {
            const first = getClass('selectPokemon')[0].children[0].getAttribute('catchID');
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
            });

            const data = await post.json();
            if (data.result === true) {
                // alert('성공');
                popup_text('성공');
                // popup_text(data.levelUpPoke)

                pokemonJSON[first] = data.levelUpPoke;
                pokemonJSON[first]['catchID'] = first;
                delete pokemonJSON[second];

                pokemon_list_create('list', pokemonJSON);
            } else {
                // alert('실패');
                popup_text('실패');

                delete pokemonJSON[getClass('selectPokemon')[0].children[0].getAttribute('catchID')];
            }

            getClass('selectPokemon')[0].innerHTML = '';
            getClass('filterPokemon')[0].innerHTML = '';
            getID('pokemonSort').style.display = 'block';
            pokemon_sort(getID('pokemonSort').value, pokemonJSON);
        });
    }

    if (window.location.pathname === '/pokemonTraining')
    {
        // 훈련시키기 버튼 -> post
        getClass('training')[0].addEventListener('click', async () => {
            const pokemonID = getClass('selectPokemon')[0].children[0].getAttribute('catchID');

            const option = new URLSearchParams({
                field: 'training',
                pokemonID: pokemonID
            });
            
            const post = await myPokemonPost(option);
            const data = await post.json();
            if (!data.msg) {
                popup_text(data * 100 + '% (이)가 되었다!');
                defaultJSON[pokemonID]['percent'] = data;
                pokemon_list_create('list', defaultJSON);
                getClass('selectPokemon')[0].innerHTML = '';
                getID('pokemonSort').style.display = 'block';
                pokemon_sort(getID('pokemonSort').value, defaultJSON);
            } else {
                popup_text(data.msg);
            }
        });
    }
}

// 선택한 포켓몬과 합성할 수 있는 포켓몬 필터링
const pokemon_filter = (selectPokemon, id, level, defaultPokeJSON) => {
    let filterPokemon = Object.values(defaultPokeJSON).filter(pokemon => {
        return pokemon['id'] === id && pokemon['level'] === level && pokemon['catchID'] !== selectPokemon;
    });

    pokemon_list_create('filter', filterPokemon, defaultPokeJSON);
}