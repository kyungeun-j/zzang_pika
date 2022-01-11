const userMoney = getClass('userMoney')[0];
const userBag = getClass('userBag')[0];

// buyBall count
const ballCountEle = getClass('ballCount')[0];
const ballMinusEle = getClass('ballMinus')[0];
const ballPlusEle = getClass('ballPlus')[0];

let ballCount = ballCountEle.innerText * 1;
ballMinusEle.addEventListener('click', () => {
    ballCount = minus(ballCount, ballCountEle)
});
ballPlusEle.addEventListener('click', () => {
    ballMinusEle.disabled = false;
    ballCount = plus(ballCount, ballCountEle)
});
getClass('setMax')[0].addEventListener('click', () => {
    ballCountEle.innerText = 40;
    ballCount = 40;
});

getClass('setMin')[0].addEventListener('click', () => {
    ballCountEle.innerText = 1;
    ballCount = 1;
});

// +, - 버튼
function minus(count, ele) {
    if (count == 1)
    {
        return count;
    }
    if (count > 1) {
        count -= 1;
        ele.innerText = count + '';
        return count;
    }
}
function plus(count, ele) {
    if (count == 40)
    {
        return count;
    }
    count += 1;
    ele.innerText = count + '';
    return count;
}

// buy ball
getClass('buyBall')[0].addEventListener('click', async () => {
    const option = new URLSearchParams({
        feild: 'buyball',
        ballCount: ballCount
    });
    const post = await shopPost(option);
    const data = await post.json();

    if (data.result !== false) {
        userMoney.innerHTML -= 100 * ballCount;
        userBag.innerHTML -= 1 * ballCount;
    }

    if (!data.msg) {
        getID('shop_ball_list').innerText = '';
        data.map(b => {
            const ballEle = document.createElement('li');
            ballEle.setAttribute('type', b);
            getID('shop_ball_list').appendChild(ballEle);
        });
        openBuyBallResult();
    } else {
        popup_text(data.msg);
    }
});

// expandBagSize
getClass('expandBagSize')[0].addEventListener('click', async () => {
    const option = new URLSearchParams({
        feild: 'expandBagSize'
    });
    const post = await shopPost(option);
    const data = await post.json();
    console.log(data)

    let result = ''
    if (data.result) {
        result = '업그레이드 완료!';
        userBag.innerHTML = userBag.innerHTML * 1 + 50;
        userMoney.innerHTML = userMoney.innerHTML * 1 - 10000;
    }
    else {
        result = data.msg;
    }

    popup_text(result);
});

// expandPokemonLength
getClass('expandPokemonLength')[0].addEventListener('click', async () => {
    const option = new URLSearchParams({
        feild: 'expandPokemonLength'
    });
    const post = await shopPost(option);
    const data = await post.json();

    let result = ''
    if (data.result) {
        result = '업그레이드 완료!';
        userMoney.innerHTML = userMoney.innerHTML * 1 - 10000;
    }
    else {
        result = data.msg;
    }
    popup_text(result);
});

// buyRunningMachines
getClass('buyRunningMachines')[0].addEventListener('click', async () => {
    const runCount = 1;
    const option = new URLSearchParams({
        feild: 'buyRunningMachines',
        runCount: runCount
    });
    const post = await shopPost(option);
    const data = await post.json();
    
    let result = ''
    if (data.result === true) {
        result = '러닝머신 구입 완료!'
        userMoney.innerHTML -= 1000 * runCount;
        userBag.innerHTML -= 1 * runCount;
    } else {
        result = data.msg
    }
    popup_text(result);
});

// post
function shopPost(option) {
    return fetch('/shop', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: option
    })
}

function openBuyBallResult()
{
    getID('shop_buy_result_container').classList.add('popped');
}

function closeBuyBallResult()
{
    getID('shop_buy_result_container').classList.remove('popped');
}

getID('close_shop_buy_result').addEventListener('click', () => {
    // 포켓몬볼 뽑기 결과 닫기 버튼 클릭 시
    // result html 삭제 후 display none
    getID('shop_ball_list').innerHTML = '';
    closeBuyBallResult();
});

getID('again_buy_balls').addEventListener('click', () => {
    // 다시 뽑기 클릭 시 
    getClass('buyBall')[0].click();
});

const popup_text = (text) => {
    getID('shop_result_text').innerText = text;
    getID('shop_result_container').classList.add('popped');

    setTimeout(function() {
        // .5초 뒤 닫음
        getID('shop_result_text').innerText = '';
        getID('shop_result_container').classList.remove('popped');
    }, 500);
};