const wrapper = document.querySelector('.wrapper');
const wrap = document.querySelector('.wrap');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const btnClose = document.querySelector('.icon-close');
const btnTopic = document.querySelector('.btnTopic-popup');
const btnClose2 = document.querySelector('.icon-close-topic');
let check = "go";


registerLink.addEventListener('click',()=> {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click',()=> {
    wrapper.classList.remove('active');
});

if (check == "go") {
    btnPopup.addEventListener('click' , () => {
        check += "working";
        wrapper.classList.add('active-popup');
    });
}

btnClose.addEventListener('click' ,() => {
    wrapper.classList.remove('active-popup')
});

if (wrapper.classList != 'wrapper active-popup') {
    btnTopic.addEventListener('click', () => {
        check++;
        wrap.classList.add('active-topic-popup')
    });    
}

btnClose2.addEventListener('click' ,() => {
    check--;
    wrap.classList.remove('active-topic-popup')
});


function addCheck() {
    check = 1;
}