let dragEles = [...getClass('dragPokemon')];
let containerEles = getClass('container');

let myRMJSON = JSON.parse(getID('myRM').innerText.replaceAll("'", '"'));
const pokemons = JSON.parse(getID('pokemons').innerText.replaceAll("'", '"').replaceAll('None', 'null'));
let myPokemonJSON = JSON.parse(getID('myPokemons').innerText.replaceAll("'", '"'));

let rmCount = myRMJSON['remain']; // 러닝머신 개수

// running machine create
function RMCreate(myPokemonJSON, rmCount) {
    Object.keys(myPokemonJSON).map(myPoke => {
        if (myPoke == 'working' && rmCount > 0) {
            pokeCreate(myPokemonJSON, myPoke);
            for (let rm=1; rm<=rmCount; rm++) {
                const rmDivEle = document.createElement('div');
                const rmImgEle = document.createElement('img');
                rmDivEle.setAttribute('class', 'rm');
                rmImgEle.setAttribute('class', 'rmImg');
                rmImgEle.src = '../static/icons/RM.png';
                rmDivEle.append(rmImgEle);
                getClass(myPoke)[0].children[1].append(rmDivEle);
            }
        } else if (myPoke == 'resting' || myPoke == 'default') {
            pokeCreate(myPokemonJSON, myPoke);
        }
    });

    dragEles = [...getClass('dragPokemon')];
    dragSE(dragEles)
}

// pokemon create
function pokeCreate(myPokemonJSON, myPoke) {
    Object.keys(myPokemonJSON[myPoke]).map(poke => {
        const rmDivEle = document.createElement('div');
        const rmImgEle = document.createElement('img');
        const rmPEle = document.createElement('p');
        const rmPEle2 = document.createElement('p');

        const percentDiv = document.createElement('div')
        const percentInnerDiv = document.createElement('div')
        const percentLabelDiv = document.createElement('div')

        if(myPoke === 'default') {
            rmDivEle.classList.add('pokemonCard');
            percentDiv.classList.add('percentDiv');
            percentInnerDiv.classList.add('percentInnerDiv');
            percentLabelDiv.classList.add('percentLabelDiv');

            
            const percent = Math.round(myPokemonJSON[myPoke][poke]['hp'] / myPokemonJSON[myPoke][poke]['maxHp'] * 100)
            percentInnerDiv.style.width = percent+'%';
            percentLabelDiv.innerHTML = percent+'%';

            percentInnerDiv.appendChild(percentLabelDiv)
            percentDiv.appendChild(percentInnerDiv)

            rmDivEle.appendChild(percentDiv)
        }
    
        if(myPoke === 'working') {
            rmDivEle.classList.add("dragPokemon", "using");
            rmDivEle.setAttribute('my_pokemon_id', poke);
            rmImgEle.classList.add('usingImg')
        } else {
            rmDivEle.classList.add("dragPokemon");
            rmDivEle.setAttribute('my_pokemon_id', poke);
        }
        rmDivEle.setAttribute("pokemon_id", myPokemonJSON[myPoke][poke]['id']);
        rmDivEle.setAttribute('percent', myPokemonJSON[myPoke][poke]['percent']);
        rmDivEle.setAttribute('max', myPokemonJSON[myPoke][poke]['max']);
        rmDivEle.setAttribute('draggable', "true");
        rmImgEle.src="../static/images/"+myPokemonJSON[myPoke][poke]['id']+".png";
        rmDivEle.appendChild(rmImgEle);
        rmPEle.innerText = pokemons[myPokemonJSON[myPoke][poke]['id']]['name'];
        rmDivEle.appendChild(rmPEle);
        rmPEle2.innerText = parseInt(Math.round(parseFloat(myPokemonJSON[myPoke][poke]['percent']) * myPokemonJSON[myPoke][poke]['max'])) + " (" + parseInt(Math.round(parseFloat(myPokemonJSON[myPoke][poke]['percent']) * 100))+"%)";
        rmPEle2.classList.add('percentOfPokemonCard');
        rmDivEle.appendChild(rmPEle2);
        getClass(myPoke)[0].children[1].append(rmDivEle);
    })
}

RMCreate(myPokemonJSON, rmCount);

// drag Start & End
function dragSE(dragEles) {
    dragEles.forEach(ele => {
        ele.addEventListener('dragstart', () => {
            ele.classList.add("dragging");
        });

        ele.addEventListener("dragend", () => {
            ele.classList.remove("dragging");
        });
    });
}

// drag Over & drop
[...containerEles].forEach(container => {
    container.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    container.addEventListener("drop", async (e) => {
        const draggable = getClass("dragging")[0];
        const startCont = draggable.parentElement.parentElement.classList[0];
        const endCont = container.classList[0];

        // 같은 section 안에선 이동 못함 ex) working -> working
        if (startCont === endCont) {
            e.preventDefault();
        } 
        // 러닝머신 개수와 working의 pokemon 수가 동일하다면 이동을 막음
        else if (endCont === 'working' && rmCount <= 0) {
                e.preventDefault();
                alert('러닝머신이 부족합니다.')
        } else {
            // post
            const option = new URLSearchParams({
                startCont: startCont,
                endCont: endCont,
                dragPokemon: draggable.getAttribute('my_pokemon_id')
            });
            const post = await runPost(option)
            const data = await post.json();

            // client를 위한 json 변경 함수 호출
            if (data.result !== false || data !== undefined) {
                rmCount = updateJSON(startCont, container.classList[0], draggable)
                if (data.coin) { 
                    alert('+'+data.coin+'coin')
                } else if (data.hp) {
                    alert('+'+data.hp+'hp')
                }
            } else if (data.result === false) {
                alert('포켓몬을 이동시킬 수 없습니다.')
            }

            getClass('working')[0].children[1].innerHTML = ''
            getClass('resting')[0].children[1].innerHTML = ''
            getClass('default')[0].children[1].innerHTML = ''

            // create function 실행
            RMCreate(myPokemonJSON, rmCount);
        }
    })
});

function updateJSON(startCont, endCont, pokemon) {
    if (startCont === 'working') {
        pokemon.classList.remove('using')
        rmCount += 1;
    } else if (endCont === 'working') {
        pokemon.classList.add('using')
        rmCount -= 1;
    }
    
    myPokemonJSON[endCont] = {
        ...myPokemonJSON[endCont],
        [pokemon.getAttribute('my_pokemon_id')]: myPokemonJSON[startCont][pokemon.getAttribute('my_pokemon_id')]
    }  

    delete myPokemonJSON[startCont][pokemon.getAttribute('my_pokemon_id')]

    return rmCount
}

async function runPost(option) {
    return fetch('/pokemonRun', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: option
    })
}