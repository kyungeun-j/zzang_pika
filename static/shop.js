const userMoney = getClass('userMoney')[0];
        const userBag = getClass('userBag')[0];

        // buyBall count
        const ballCountEle = getClass('ballCount')[0];
        const ballMinusEle = getClass('ballMinus')[0];
        const ballPlusEle = getClass('ballPlus')[0];

        let ballCount = ballCountEle.innerText * 1;
        ballMinusEle.addEventListener('click', () => {
            ballCount = minus(ballCount, ballCountEle)
            if (ballCount === 1) ballMinusEle.disabled = true;
        })
        ballPlusEle.addEventListener('click', () => {
            ballMinusEle.disabled = false;
            ballCount = plus(ballCount, ballCountEle)
            if (ballCount > 19) ballPlusEle.disabled = true;
        })

        // buyRunningMachines count
        const runCountEle = getClass('runCount')[0];
        const runMinusEle = getClass('runMinus')[0];
        const runPlusEle = getClass('runPlus')[0];

        let runCount = runCountEle.innerText * 1;
        runMinusEle.addEventListener('click', () => {
            runCount = minus(runCount, runCountEle)
            if (runCount === 1) runMinusEle.disabled = true;
        })
        runPlusEle.addEventListener('click', () => {
            runMinusEle.disabled = false;
            runCount = plus(runCount, runCountEle)
        })

        // +, - 버튼
        function minus(count, ele) {
            if (count > 1) {
                count -= 1;
                ele.innerText = count + '';
                return count;
            }
        }
        function plus(count, ele) {
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

            let result = ''
            if (!data.msg) {
                data.map(b => {
                    if (b == 1) result += '몬스터볼'
                    else if (b == 2) result += '수퍼볼'
                    else if (b == 3) result += '하이퍼볼'
                    else result += '마스터볼'
                })
            } else {
                result = data.msg
            }
            shopResult(result)
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
            if (data.result) result = '확장 완료'
            else result = data.msg
            shopResult(result)
        });

        // expandPokemonLength
        getClass('expandPokemonLength')[0].addEventListener('click', async () => {
            const option = new URLSearchParams({
                feild: 'expandPokemonLength'
            });
            const post = await shopPost(option);
            const data = await post.json();

            let result = ''
            if (data.result) result = '확장 완료'
            else result = data.msg
            shopResult(result)
        });

        // buyRunningMachines
        getClass('buyRunningMachines')[0].addEventListener('click', async () => {
            const option = new URLSearchParams({
                feild: 'buyRunningMachines',
                runCount: runCount
            });
            const post = await shopPost(option);
            const data = await post.json();
            
            let result = ''
            if (data.result === true) {
                userMoney.innerHTML -= 1000 * runCount;
                userBag.innerHTML -= 1 * runCount;
                result = runCount + '개 구입'
            } else {
                result = data.msg
            }
            shopResult(result)
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

        // popup
        const shopResultEle = getClass('shopResult')[0];
        const closeEle = getClass('closeBtn')[0];
        const resultItemEle = getClass('resultItem')[0];

        function shopResult(result) {
            shopResultEle.classList.toggle('show');
            resultItemEle.innerText = result
        }
            
        closeEle.addEventListener('click', () => {
            shopResultEle.classList.toggle('show');
        })
