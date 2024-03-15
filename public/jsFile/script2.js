const wrapper = document.querySelector('.wrapper');
const wrap = document.querySelector('.wrap');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnTopic = document.querySelector('.btnTopic-popup');
const btnClose2 = document.querySelector('.icon-close-topic');

registerLink.addEventListener('click',()=> {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click',()=> {
    wrapper.classList.remove('active');
});

btnTopic.addEventListener('click', () => {
    wrap.classList.add('active-topic-popup')
});

btnClose2.addEventListener('click' ,() => {
    wrap.classList.remove('active-topic-popup')
});