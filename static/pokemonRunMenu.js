const pokeRoutePathname = document.location.pathname;
const runMenuLiEle = document.getElementsByClassName('runMenuContainer')[0].children;

// (러닝, 훈련, 합성) 이동 시 버튼 스타일 변경
Object.values(runMenuLiEle).forEach(selectMenu => {
    if (selectMenu.children[0].href.indexOf(pokeRoutePathname) > 0) {
        selectMenu.classList.add('selected')
    }
});