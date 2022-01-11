const catchEle = getID('catchDiv');
const catchBtn = getClass('catchBtn')[0];

function pokemonImgCreate(pokemon) {
    catchEle.innerHTML = ''

    pokemon.map(poke => {
        const img = document.createElement("img");
        img.setAttribute('class', 'pokemon');
        img.setAttribute('pokemon_id', poke[0]);
        img.setAttribute('pokemon_percent', poke[1]);
        
        img.src = "../static/images/" + poke[0] + ".png";
        
        const randomX = Math.random() * (catchEle.offsetWidth - 96);
        const randomY = Math.random() * (catchEle.offsetHeight - 96); 

        img.style.left = randomX+"px";
        img.style.top = randomY+"px";

        catchEle.appendChild(img);
    });

    [...getClass('pokemon')].map(poke => {
        poke.addEventListener('click', catchPokemon)
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

    pokemonImgCreate(data)
}


// catch pokemon
let numberOfTry = 1;
async function catchPokemon(e){
    const ballType = getClass('select')[0].getAttribute('ball_id')
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
        // alert('성공')
        openCatchResultPopUp('성공!');
    }
    else if (catchData.result == false) 
    {
        openCatchResultPopUp('몬스터볼이 부족합니다.');
    }
    else if (catchData.result == 'run')
    {
        // alert('도망갔다!')
        openCatchResultPopUp('도망갔다!');
    }
    else 
    {
        // alert('실패')
        openCatchResultPopUp('실패!');
        numberOfTry = Number(catchData.result);
    }

    getPokemon(catchData.result)
    
    // 포켓볼이 부족하지 않은 경우 -1
    if (catchData.result != false) 
    {
        // 사용한 포켓볼 업데이트
        console.log(getClass('select')[0].children[0].innerHTML);
        getClass('select')[0].children[0].innerHTML -= 1;
    }
    
}

// ball select
[...getClass('ball')].map(b => {
    b.addEventListener('click', () => {
        for (let i=0; i<[...getClass('ball')].length; i++) {
            if ([...getClass('ball')][i].classList.contains('select')) [...getClass('ball')][i].classList.remove('select')
        }
        if (b.getAttribute('ball_id')) b.classList.add('select')
    })
});

const openCatchResultPopUp = (text) => {
    getID('catchResultPopUp').classList.add('popped');
    getID('catchResultPopUp').innerText = text;

    setTimeout(function() {
        // 1초 뒤 닫음
        closeCatchResultPopUp();
    }, 1000);
};

const closeCatchResultPopUp = () => {
    getID('catchResultPopUp').classList.remove('popped');
    getID('catchResultPopUp').innerText = '';
};