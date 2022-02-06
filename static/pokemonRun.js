let dragEles = [...getClass('dragPokemon')];
let containerEles = getClass('container');

let myRMJSON = JSON.parse(getID('myRM').innerText.replaceAll("'", '"'));
const pokemons = JSON.parse(getID('pokemons').innerText.replaceAll("'", '"').replaceAll('None', 'null'));
let myPokemonJSON = JSON.parse(getID('myPokemons').innerText.replaceAll("'", '"'));

let rmCount = myRMJSON['remain']; // 러닝머신 개수

// pokeContainer에 포켓몬 추가 
function RMCreate(myPokemonJSON, rmCount) {
    Object.keys(myPokemonJSON).map(container => {
        if (container == 'working') {
            pokeCreate(myPokemonJSON, container);
            // 남은 러닝머신 개수만큼 이미지 추가
            for (let rm=1; rm<=rmCount; rm++) {
                const rmDivEle = document.createElement('div');
                const rmImgEle = document.createElement('img');
                rmDivEle.setAttribute('class', 'rm');
                rmDivEle.setAttribute('rm', rm);
                rmImgEle.setAttribute('class', 'rmImg');
                rmImgEle.src = '../static/icons/RM.png';
                rmDivEle.append(rmImgEle);
                getClass(container)[0].children[1].append(rmDivEle);
            }
        } else if (container == 'resting' || container == 'default') {
            pokeCreate(myPokemonJSON, container);
        }
    });

    dragEles = [...getClass('dragPokemon')];
    dragSE(dragEles);
}

// hpBar 값 계산
const updateHpBar = (container, startHp, maxHp, before) => {
    const now = (Date.now() + '').slice(0,-3) * 1;

    const hpRecoveryPercent = container == 'resting'
            ?  Math.round((now - before) / 86400 * 100) / 100
            : 0;

    // for working
    let hpDecrease = container == 'working'
        ? now - before    // 초당 1의 체력이 소모
        : 0;

    // 반올림 오차로 now - before이 음수가 되는 경우 0으로 초기화
    hpDecrease = hpDecrease < 0
        ? 0
        : hpDecrease;

    // Hp 소모량이 시작 체력을 넘을 수 없음
    hpDecrease = hpDecrease > startHp
        ? startHp
        : hpDecrease;

    const hpPercent = Math.round((startHp - hpDecrease)/ maxHp * 100);

    // hpResult가 maxHp보다 커지지 않게
    const hpLabel = Math.round(startHp - hpDecrease + hpRecoveryPercent * maxHp) > maxHp ? maxHp : Math.round(startHp - hpDecrease + hpRecoveryPercent * maxHp);

    return ({'percentInnerDiv': hpPercent + hpRecoveryPercent * 100 + '%', 'wor_res_percentLabelDiv': hpLabel + ' / ' + maxHp});
}

function RMUsingInfo(rmCount) {

    const amount = myRMJSON['amount'];
    const using = amount - rmCount;

    getClass('working')[0].children[0].innerHTML = '돈버는 친구들 <span> (' + using + ' / ' + amount + ' 사용 중) </span>'
}

RMUsingInfo(rmCount)

// pokemonEle create
function pokeCreate(myPokemonJSON, container) {
    Object.keys(myPokemonJSON[container]).map(myPokemonId => {
        // myPokemonId: 유저별 해당 포켓몬을 얻은 순서에 따라 부여되는 id

        // pokemonCard, 이미지
        const rmDivEle = document.createElement('div');
        const rmImgEle = document.createElement('img');

        // 체력바
        const percentDiv = document.createElement('div');
        const percentInnerDiv = document.createElement('div');
        const percentLabelDiv = document.createElement('div');

        // 이름, percent 
        const rmPEle = document.createElement('p');
        const rmPEle2 = document.createElement('p');
        const rmPEle3 = document.createElement('p');

        // pokemon card 설정
        rmDivEle.classList.add('dragPokemon');
        rmDivEle.classList.add('pokemonCard');  // for style
        rmDivEle.setAttribute('my_pokemon_id', myPokemonId);
        rmDivEle.setAttribute('pokemon_id', myPokemonJSON[container][myPokemonId]['id']);
        rmDivEle.setAttribute('percent', myPokemonJSON[container][myPokemonId]['percent']);
        rmDivEle.setAttribute('max', myPokemonJSON[container][myPokemonId]['max']);
        rmDivEle.setAttribute('draggable', 'true');

        // 상단 체력바 추가
        percentDiv.classList.add('percentDiv');
        percentInnerDiv.classList.add('percentInnerDiv');
        percentLabelDiv.classList.add('percentLabelDiv');
        
        const startHp = myPokemonJSON[container][myPokemonId]['hp'];
        const maxHp = myPokemonJSON[container][myPokemonId]['maxHp'];
        const before = myPokemonJSON[container][myPokemonId]['startTime'];

        const hpBar = updateHpBar(container, startHp, maxHp, before);
        percentInnerDiv.style.width = hpBar.percentInnerDiv;
        
        if (container == 'default')
        {
            percentLabelDiv.innerText = startHp + ' / ' + maxHp;
        }
        else
        {
            // container가 working인 경우 hpRecovery가 0, hp: startHp - hpDecrease
            // resting인 경우 hpDecrease가 0, hp: startHp
            percentLabelDiv.innerText = hpBar.wor_res_percentLabelDiv;
        }

        percentDiv.appendChild(percentInnerDiv);
        percentDiv.appendChild(percentLabelDiv);

        rmDivEle.appendChild(percentDiv);

        // 포켓몬 이미지 추가
        if(container === 'working') {
            rmDivEle.classList.add('using');
            rmImgEle.classList.add('usingImg');

            // usingImg가 absolute이므로 간격을 위해 빈 박스 추가
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('emptyBlockForUsingImg');
            rmDivEle.appendChild(emptyDiv);
        }
        rmImgEle.src='../static/images/' + myPokemonJSON[container][myPokemonId]['id']+'.png';
        rmDivEle.appendChild(rmImgEle);

        // name
        rmPEle.innerText = pokemons[myPokemonJSON[container][myPokemonId]['id']]['name'];
        rmPEle.classList.add('name');
        rmDivEle.appendChild(rmPEle);

        // percent
        rmPEle2.innerText = parseInt(Math.round(parseFloat(myPokemonJSON[container][myPokemonId]['percent']) * myPokemonJSON[container][myPokemonId]['max'])) + ' (' + parseInt(Math.round(parseFloat(myPokemonJSON[container][myPokemonId]['percent']) * 100))+'%)';
        rmPEle2.classList.add('percentOfPokemonCard');
        rmPEle2.classList.add('percent');
        rmDivEle.appendChild(rmPEle2);

        // level
        rmPEle3.innerText = 'Lv.' + myPokemonJSON[container][myPokemonId]['level'];
        rmPEle3.classList.add('level');
        rmDivEle.appendChild(rmPEle3);

        getClass(container)[0].children[1].append(rmDivEle);
    });
}

RMCreate(myPokemonJSON, rmCount);

// drag Start & End
function dragSE(dragEles) {
    dragEles.forEach(ele => {
        ele.addEventListener('dragstart', () => {
            ele.classList.add('dragging');
        });

        ele.addEventListener('dragend', () => {
            ele.classList.remove('dragging');
        });
    });
}

// drag Over & drop
[...containerEles].forEach(container => {
    container.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    container.addEventListener('drop', async (e) => {
        const draggable = getClass('dragging')[0];
        const startCont = draggable.parentElement.parentElement.classList[0];
        const endCont = container.classList[0];
        const dragPokemonId = draggable.getAttribute('my_pokemon_id');
        // 같은 section 안에선 이동 못함 ex) working -> working
        if (startCont === endCont) {
            e.preventDefault();
        } 
        // 러닝머신 개수와 working의 pokemon 수가 동일하다면 이동을 막음
        else if (endCont === 'working' && rmCount <= 0) {
                e.preventDefault();
                // alert('러닝머신이 부족합니다.');
                popup_text('러닝머신이 부족합니다.');
        } else {
            // post
            const option = new URLSearchParams({
                startCont: startCont,
                endCont: endCont,
                dragPokemon: dragPokemonId
            });
            const post = await runPost(option);
            const data = await post.json();            

            // client를 위한 json 변경 함수 호출
            if (data.result !== false || data !== undefined) {
                // 포켓몬의 동작 시작 시간, 체력이 업데이트 되면 바로 갱신
                if ('startTime' in data)
                {
                    myPokemonJSON[startCont][dragPokemonId]['startTime'] = data['startTime'];
                }

                if ('hp' in data)
                {
                    myPokemonJSON[startCont][dragPokemonId]['hp'] = data['hp'];
                    popup_text('+' + data['hp'] + 'hp');
                }

                // 남은 rm 개수도 업데이트 될 때마다 갱신
                if ('rm' in data)
                {
                    rmCount = data['rm'];
                }
                // 임시로 획득 코인은 console.log()
                if ('coin' in data)
                {
                    // console.log(data['coin']);
                    popup_text('+' + data['coin'] + 'coin');
                }

                rmCount = updateJSON(startCont, endCont, draggable);
            } else if (data.result === false) {
                // alert('포켓몬을 이동시킬 수 없습니다.');
                popup_text('포켓몬을 이동시킬 수 없습니다.');
            }

            // 초기화 <- 나중에 효율적으로 수정해야 할듯
            getClass('working')[0].children[1].innerHTML = '';
            getClass('resting')[0].children[1].innerHTML = '';
            getClass('default')[0].children[1].innerHTML = '';

            // create function 실행
            RMCreate(myPokemonJSON, rmCount);
            RMUsingInfo(rmCount);
        }
    });
});

function updateJSON(startCont, endCont, pokemon) {
    if (startCont === 'working') {
        pokemon.classList.remove('using');
        rmCount += 1;
    } else if (endCont === 'working') {
        pokemon.classList.add('using');
        rmCount -= 1;
    }
    
    myPokemonJSON[endCont] = {
        ...myPokemonJSON[endCont],
        [pokemon.getAttribute('my_pokemon_id')]: myPokemonJSON[startCont][pokemon.getAttribute('my_pokemon_id')]
    };

    delete myPokemonJSON[startCont][pokemon.getAttribute('my_pokemon_id')];

    return rmCount;
}

async function runPost(option) {
    return fetch('/pokemonRun', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/x-www-form-urlencoded'
        },
        body: option
    });
}

// percentBarDiv 1초마다 업데이트
setInterval(() => {
    Object.values(getClass('container')).map(containerDiv => {
        Object.values(containerDiv.children[1].children).map(containItem => {
            // container가 working이거나 resting일 때에만 업데이트
            if ((containerDiv.classList[0] === 'working' && containItem.classList.contains('using')) || containerDiv.classList[0] === 'resting')
            {
                const container = containerDiv.classList[0];
                const myPokemonId = containItem.getAttribute('my_pokemon_id');

                const startHp = myPokemonJSON[container][myPokemonId]['hp'];
                const maxHp = myPokemonJSON[container][myPokemonId]['maxHp'];
                const before = myPokemonJSON[container][myPokemonId]['startTime'];

                const hpBar = updateHpBar(container, startHp, maxHp, before);
                
                const percentDiv = document.querySelector('[my_pokemon_id="'+myPokemonId+'"]').children[0];
                percentDiv.children[0].style.width = hpBar.percentInnerDiv;
                percentDiv.children[1].innerText = hpBar.wor_res_percentLabelDiv;
            }
        });
    });
}, 1000);