let pokemonJSON = JSON.parse(getClass('data')[0].innerText);
let myPokemonJSON = JSON.parse(getClass('myPokemon')[0].innerText);

// 0, 10은 일단 white
const pokemonListBackground = ['#ffffff', '#87e8ff', '#87fffb', '#87ffc3', '#9eff87', '#d0ff87', '#fffd87', '#ffdb87', '#ffb587', '#ff8080', '#ffffff'];

createPokemons();

function createPokemons() {
    // 초기화
    const pokemonsUI = getID('pokemons');
    pokemonsUI.innerHTML = '';

    const pokemonInfo = myPokemonJSON['archive']['pokemon'];
    Object.keys(pokemonJSON).map(pokemonId => {
        const liEle = document.createElement('li');
        // 전체 포켓몬 id 중 pokemonInfo['archive'] (도감)에 있는 포켓몬을 보여줌
        // 이외 포켓몬은 ID 값만 노출
        if (pokemonId in pokemonInfo)
        {
            liEle.style.backgroundImage = 'url(../static/images/' + pokemonId + '.png';
            liEle.style.backgroundColor = pokemonListBackground[pokemonInfo[pokemonId]['maxLevel']];

            if (pokemonInfo[pokemonId]['maxLevel'] == 10)
            {
                // 금색 배경으로 다시 초기화
            }


            // maxPercent는 나중에 업데이트
        }
        else
        {
            liEle.innerText = pokemonId;
        }

        pokemonsUI.appendChild(liEle);
    });
}