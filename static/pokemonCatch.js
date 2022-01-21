const catchEle = getID('catchDiv');
const catchBtn = getClass('catchBtn')[0];

function pokemonImgCreate(pokemon) {
    catchEle.innerHTML = '';

    pokemon.map(poke => {
        const img = document.createElement('img');
        img.setAttribute('class', 'pokemon');
        img.setAttribute('pokemon_id', poke[0]);
        img.setAttribute('pokemon_percent', poke[1]);
        
        img.src = '../static/images/' + poke[0] + '.png';
        
        const randomX = Math.random() * (catchEle.offsetWidth - 96);
        const randomY = Math.random() * (catchEle.offsetHeight - 96); 

        img.style.left = randomX+'px';
        img.style.top = randomY+'px';

        catchEle.appendChild(img);
    });

    [...getClass('pokemon')].map(poke => {
        poke.addEventListener('click', catchPokemon);
    });
}


// 잡기 버튼 클릭
catchBtn.addEventListener('click', getPokemon);

async function getPokemon(catchResult) {
    // get pokemonList
    const res = await fetch('/pokemonCatch', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ 
                post_id: 'comePokemon',
                catch_res: catchResult
            })
        });
    const data = await res.json();

    pokemonImgCreate(data);
}


// catch pokemon
let numberOfTry = 1;
async function catchPokemon(e){
    const ballType = getClass('select')[0].getAttribute('ball_id');
    const catchRes = await fetch('/pokemonCatch', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ 
            post_id: 'catchPokemon',
            ballType: ballType,
            pokemonId: e.target.getAttribute('pokemon_id'), 
            percent: e.target.getAttribute('pokemon_percent'), 
            numberOfTry: numberOfTry
        })
    });
    const catchData = await catchRes.json();
    if (catchData.result === true) 
    {
        openCatchResultPopUp('성공!');
    }
    else if (catchData.result == false) 
    {
        openCatchResultPopUp('몬스터볼이 부족합니다.');
    }
    else if (catchData.result == 'run')
    {
        openCatchResultPopUp('도망갔다!');
        numberOfTry = 1;
    }
    else 
    {
        openCatchResultPopUp('실패!');
        numberOfTry = Number(catchData.result);
    }

    getPokemon(catchData.result);
    
    // 포켓볼이 부족하지 않은 경우 -1
    if (catchData.result != false) {
        // 사용한 포켓볼 업데이트
        const ballCount = getClass('select')[0];
        ballCount.children[0].innerText -= 1;
        if (ballCount.children[0].innerText < 1) {
            ballCount.style.filter = 'grayscale(1)';
        }
    }
    
}

// ball select
[...getClass('ball')].map(b => {
    // ball 갯수가 1개보다 적으면 이미지 흑백처리
    if(Number(b.children[0].innerText) < 1) {
        b.style.filter = 'grayscale(1)';
    }
    b.addEventListener('click', () => {
        for (let i=0; i<[...getClass('ball')].length; i++) {
            if ([...getClass('ball')][i].classList.contains('select')) [...getClass('ball')][i].classList.remove('select');
        }
        if (b.getAttribute('ball_id')) b.classList.add('select');
    });
});

const openCatchResultPopUp = (text) => {
    getID('catchResultPopUp').classList.add('popped');
    getID('popupText').innerText = text;

    setTimeout(function() {
        // 1초 뒤 닫음
        closeCatchResultPopUp();
    }, 1000);
};

const closeCatchResultPopUp = () => {
    getID('catchResultPopUp').classList.remove('popped');
    getID('popupText').innerText = '';
};