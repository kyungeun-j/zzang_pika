let pokemonJSON = JSON.parse(getClass('data')[0].innerText)
let myPokemonJSON = JSON.parse(getClass('myPokemon')[0].innerText)

// 보유 포켓몬 구별을 위한 json 생성
myPokemonJSON = Object.assign(myPokemonJSON['default'], myPokemonJSON['resting'], myPokemonJSON['working']);
const setMyPokemon = [... new Set(Object.values(myPokemonJSON).map(my => my['id']))]
const pokemons = []
setMyPokemon.map(set => {
    pokemons[set] = pokemonJSON[set]
})

// create pokemon list 
const pokemonsUl = getID('pokemons');
createPokemons(Object.keys(pokemonJSON));

function createPokemons(poke) {
    pokemonsUl.innerHTML = ""
    poke.forEach(key => {
        let pokemonLi = document.createElement('li');
        let pokemonA = document.createElement('a');
        let pokemonImg = document.createElement('img');
        let pokemonName = document.createElement('div');
        let pokemonEfficiency = document.createElement('div');
        if (pokemons[key] !== undefined) {
            pokemonA.href="/pokemonDetail/"+pokemonJSON[key]['id'];
            pokemonImg.src="../static/images/"+pokemonJSON[key]['id']+".png";
            pokemonName.innerText = pokemonJSON[key]['name']
            pokemonEfficiency.innerText = pokemonJSON[key]['efficiency']
            pokemonA.appendChild(pokemonImg)
            pokemonA.appendChild(pokemonName)
            pokemonA.appendChild(pokemonEfficiency)
            pokemonLi.appendChild(pokemonA)
        } else {
            pokemonLi.innerText = key
        }
        pokemonsUl.appendChild(pokemonLi)
    })
}