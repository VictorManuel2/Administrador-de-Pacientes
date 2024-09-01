const darkMode = document.querySelector('.dark-mode');
const body = document.querySelector('body');
const claro = document.querySelector('.claro');
const oscuro = document.querySelector('.oscuro');

const darkModeToggle= () => {

    body.classList.toggle('dark');
    claro.classList.toggle('none');
    oscuro.classList.toggle('none');

    localStorage.setItem('darkMode', body.classList.contains('dark'));
}

darkMode.addEventListener('click', darkModeToggle);

if(localStorage.getItem('darkMode') === true){
    body.classList.add('dark');
    claro.classList.remove('none');
    oscuro.classList.add('none');
}else{
    body.classList.remove('dark');
    claro.classList.add('none');
    oscuro.classList.remove('none')
}
