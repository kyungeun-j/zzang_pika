const getID = (idName) => document.getElementById(idName);
const getClass = (className) => document.getElementsByClassName(className);

// result popup
const popup_text = (text) => {
    getID('result_text').innerText = text;
    getID('result_container').classList.add('popped');

    setTimeout(function() {
        // 1초 뒤 닫음
        getID('result_text').innerText = '';
        getID('result_container').classList.remove('popped');
    }, 1000);
};

const show_scroll_bar = (ele) => {
    const eleOverflow = document.defaultView.getComputedStyle(ele).getPropertyValue("overflow-y");

    if (eleOverflow === 'hidden')
    {
        ele.addEventListener('mouseover', () => {
            ele.style.overflowY = 'scroll';
        });
        ele.addEventListener('mouseout', () => {
            ele.style.overflowY = 'hidden';
        });
    }
}