const pokemons = JSON.parse(getID('pokemons').innerText.replaceAll("'", '"'));
let pokemonJSON = JSON.parse(getID('default').innerText.replaceAll("'", '"'));
let levelupBtn = [...getClass('pokemon')];

Object.keys(pokemonJSON).forEach(poke => {
    pokemonJSON[poke]['catchID'] = poke;
});
pokemon_sort(getID('pokemonSort').value, pokemonJSON);

//common.js
getID('pokemonSort').addEventListener('change', (e) => {
    pokemon_sort(e, pokemonJSON);
});

show_scroll_bar(getClass('listContainer')[0]);