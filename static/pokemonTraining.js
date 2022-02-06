let defaultJSON = JSON.parse(getID('default').innerText.replaceAll("'", '"'));
const pokemons = JSON.parse(getID('pokemons').innerText.replaceAll("'", '"').replaceAll('None', 'null'));
const trainingBtn = [...getClass('trainingBtn')]

function setBackgroundColor() {
    Object.keys(defaultJSON).forEach(pokemons => {
            const percent = defaultJSON[pokemons]['percent'] * 100
            const pokemon = getClass(pokemons)[0];
            if (percent === 100) {
                // black
                pokemon.style.background = 'url(../static/images/'+ defaultJSON[pokemons]['id'] +'.png) no-repeat center'
                pokemon.style.border = '2px solid black'
            } else if (percent > 90) {
                // purple
                pokemon.style.background = 'url(../static/images/'+ defaultJSON[pokemons]['id'] +'.png) no-repeat center'
                pokemon.style.border = '2px solid #9334D7'
            } else if (percent > 80) {
                // red
                pokemon.style.background = 'url(../static/images/'+ defaultJSON[pokemons]['id'] +'.png) no-repeat center'
                pokemon.style.border = '2px solid #E93D3D'
            } else if (percent > 70) {
                // blue
                pokemon.style.background = 'url(../static/images/'+ defaultJSON[pokemons]['id'] +'.png) no-repeat center'
                pokemon.style.border = '2px solid #546CE1'
            } else if (percent > 60) {
                // green
                pokemon.style.background = 'url(../static/images/'+ defaultJSON[pokemons]['id'] +'.png) no-repeat center'
                pokemon.style.border = '2px solid #4AB520'
            } else {
                // white
                pokemon.style.background = 'url(../static/images/'+ defaultJSON[pokemons]['id'] +'.png) no-repeat center'
                pokemon.style.border = '2px solid #f5f5f5'
            }
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