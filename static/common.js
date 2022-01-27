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