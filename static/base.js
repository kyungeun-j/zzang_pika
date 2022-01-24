const menuEle = getID('menu');

// login 여부에 따라 menuEle width 조절
if (getID('username').innerText !== 'False')
// 로그아웃 버튼
{
    menuEle.children[1].children[1].classList.add('loginEle');
}
else 
// 로그인 버튼
{
    menuEle.children[1].style.width = '50px';   
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