const menuEle = getID('menu');
if (getID('username').innerText !== 'False')
// 로그아웃 버튼
{
    menuEle.children[1].style.right = '-20px';
    menuEle.children[1].children[0].classList.add('liFirst');
}
else 
// 로그인 버튼
{
    menuEle.children[1].style.right = '-13px';   
    menuEle.children[1].children[0].classList.remove('liFirst');
}
menuEle.addEventListener('click', (e) => {
    const tg = e.currentTarget.children;

    // menu toggle
    if (tg[0].classList.contains('fa-bars')) 
    {
        tg[1].style.display = 'block';
        tg[0].classList.replace('fa-bars', 'fa-times');
    }
    else {
        tg[1].style.display = 'none';
        tg[0].classList.replace('fa-times', 'fa-bars');
    }
});