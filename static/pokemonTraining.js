let defaultJSON = JSON.parse(getID('default').innerText.replaceAll("'", '"'));
const pokemons = JSON.parse(getID('pokemons').innerText.replaceAll("'", '"').replaceAll('None', 'null'));
const trainingBtn = [...getClass('trainingBtn')]

function setBackgroundColor() {
    Object.keys(defaultJSON).forEach(pokemons => {
        const pokemon = getClass(pokemons)[0];
        pokemon.style.background = '#fbfbfb url(../static/images/'+ defaultJSON[pokemons]['id'] +'.png) no-repeat center';
    })
}
setBackgroundColor();

trainingBtn.forEach(btn => {
    btn.addEventListener('click', async (e) => {
        const pokemonID = e.currentTarget.classList[0];
        const option = new URLSearchParams({
            field: 'training',
            pokemonID: pokemonID
        });
        
        const post = await myPokemonPost(option)
        const data = await post.json();
        console.log(data)
        if (!data.msg) {
            // alert('percent가 ' + data*100 + '(이)가 되었다!')
            popup_text(data*100 + '% (이)가 되었다!')
            defaultJSON[pokemonID]['percent'] = data;
            getClass(pokemonID)[0].children[1].innerText = parseFloat(Math.round(defaultJSON[pokemonID]['percent'] * defaultJSON[pokemonID]['max'])) + " (" + parseInt(Math.round(parseFloat(defaultJSON[pokemonID]['percent']) * 100)) + "%)";
            setBackgroundColor()
        } else {
            // alert(data.msg)
            popup_text(data.msg)
        }
    })
})

async function myPokemonPost(option) {
    return fetch('/pokemonTraining', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: option
    })
}