const menuEle = getID('menu');

// login 여부에 따라 menuEle width 조절
if (getID('username').innerText !== 'False')
// 로그아웃 버튼
{
    menuEle.children[1].children[1].classList.add('loginEle');
}

// menu click event
menuEle.addEventListener('click', (e) => {
    const tg = e.currentTarget.children;

    // menu toggle
    if (tg[0].classList.contains('fa-bars')) 
    {
        tg[1].style.display = 'flex';
        tg[0].classList.replace('fa-bars', 'fa-times');
    }
    else {
        tg[1].style.display = 'none';
        tg[0].classList.replace('fa-times', 'fa-bars');
    }
});

// menuEle가 open되어 있을 경우 다른 영역을 선택했을 때에도 close되기 위함
document.getElementsByTagName('html')[0].addEventListener('click', (e) => {
    const menuEleCheck = getID('menu');
    
    if (e.target === menuEleCheck || e.target.parentElement === menuEleCheck)
    {
        return;
    }
    else
    {
        if (!menuEleCheck.children[0].classList.contains('fa-bars'))
        {
            menuEleCheck.children[1].style.display = 'none';
            menuEleCheck.children[0].classList.replace('fa-times', 'fa-bars');
        }
    }
})

// 기본 메뉴 - 현재페이지 하이라이트
// 포켓몬 합성/훈련일 경우 포켓몬에 하이라이트
const routePathname = window.location.pathname === '/pokemonLevelUp' || window.location.pathname === '/pokemonTraining' ? '/pokemonRun' : window.location.pathname;

Object.values(menuEle.children[1].children).forEach(aTag => {
    if(aTag.children[0].href !== undefined) 
    {
        const aTagPathname = aTag.children[0].href.slice(aTag.children[0].href.lastIndexOf('/'), aTag.children[0].href.length);

        if (aTagPathname === routePathname)
        {
            aTag.style.backgroundColor = '#6266a5';
        }
    }
});