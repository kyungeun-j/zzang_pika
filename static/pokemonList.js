let pokemonJSON = JSON.parse(getClass('data')[0].innerText)
const pokemonsUl = getID('pokemons');
createPokemons(Object.values(pokemonJSON));

[...getID('pokemonSort').children].map(pokemon => {
    pokemon.addEventListener('click', () => {
        if (pokemon.classList[0] === undefined) {
            createPokemons(Object.values(pokemonJSON))
        } else {
            let pokemonSort = jsonSort(pokemon.classList[0])
            createPokemons(pokemonSort)
        }
    })
})

function createPokemons(pokemonSort) {
    pokemonsUl.innerHTML = ""
    pokemonSort.forEach(poke => {
        let pokemonLi = document.createElement('li');
        let pokemonA = document.createElement('a');
        let pokemonImg = document.createElement('img');
        let pokemonName = document.createElement('div');
        let pokemonEfficiency = document.createElement('div');

        pokemonA.href="/pokemonDetail/"+poke['id'];

        pokemonImg.src="../static/images/"+poke['id']+".png";
        pokemonName.innerText = poke['name']
        pokemonEfficiency.innerText = poke['efficiency']

        pokemonA.appendChild(pokemonImg)
        pokemonA.appendChild(pokemonName)
        pokemonA.appendChild(pokemonEfficiency)

        pokemonLi.appendChild(pokemonA)

        pokemonsUl.appendChild(pokemonLi)
    })
}

function jsonSort(val) {
    return Object.values(pokemonJSON).sort(function(a, b) {
        let x = a[val]
        let y = b[val]

        return (x< y) ? -1 : (x > y) ? 1 : 0;
    })
}

// sort menu 고정
getID('content').addEventListener('scroll', () => {
	let scrollLocation = getID('content').scrollTop; // content 스크롤바 위치
    
    getID('pokemonSort').style.top = (scrollLocation + 16)+'px';
})