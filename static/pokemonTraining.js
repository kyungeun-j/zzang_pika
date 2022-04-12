let defaultJSON = JSON.parse(getID('default').innerText.replaceAll("'", '"'));
const pokemons = JSON.parse(getID('pokemons').innerText.replaceAll("'", '"').replaceAll('None', 'null'));

Object.keys(defaultJSON).forEach(poke => {
    defaultJSON[poke]['catchID'] = poke;
});
pokemon_sort(getID('pokemonSort').value, defaultJSON);

async function myPokemonPost(option) {
    return fetch('/pokemonTraining', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: option
    });
}

//common.js
getID('pokemonSort').addEventListener('change', (e) => {
    pokemon_sort(e, defaultJSON);
});

show_scroll_bar(getClass('listContainer')[0]);