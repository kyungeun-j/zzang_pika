const routePathname = document.location.pathname;
const menuLiEle = document.getElementsByClassName('runMenuContainer')[0].children;

// (러닝, 훈련, 합성) 이동 시 버튼 스타일 변경
Object.values(menuLiEle).forEach(selectMenu => {
    if (selectMenu.children[0].href.indexOf(routePathname) > 0) {
        selectMenu.classList.add('selected')
    }
});