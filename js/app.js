//variables
const nombreInput = document.querySelector('#nombre');
const numeroInput = document.querySelector('#numero');
const emailInput = document.querySelector('#email');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const motivoInput = document.querySelector('#motivo');
const formulario = document.querySelector('#formulario-cita');
const contenedorCitas = document.querySelector('#citas');
const submitFormulario = document.querySelector('#formulario-cita input[type="submit"]');

//Objeto para guardar los valores del formularios
const citasObj = {
    id: generarId(),
    nombre: '',
    numero: '',
    email: '',
    fecha: '',
    hora: '',
    motivo: ''
}
//creamos una variable para poder editar al paciente
let editando = false;

//eventos
nombreInput.addEventListener('change', datosCita);
numeroInput.addEventListener('change', datosCita);
emailInput.addEventListener('change', datosCita);
fechaInput.addEventListener('change', datosCita);
horaInput.addEventListener('change', datosCita)
motivoInput.addEventListener('change', datosCita);

formulario.addEventListener('submit', submitCita);

//clases
class Notificacion{
    constructor({texto, tipo}){
        this.texto = texto;
        this.tipo = tipo;

        this.mostrar();
    }

    mostrar(){
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('alerta', 'existe');

        const existe = document.querySelector('.existe');
        existe?.remove();

        this.tipo === 'error' ? divMensaje.classList.add('alerta-error') : divMensaje.classList.add('alerta-exito');

        divMensaje.textContent = this.texto;

        formulario.parentElement.insertBefore(divMensaje, formulario);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}
class AdminCitas{
    constructor(){
        this.citas = JSON.parse(localStorage.getItem('citas')) || [];

        this.mostrar();
    }

    agregar(citas){
        this.citas = [...this.citas, citas];
        
        this.mostrar();
    }
    editar(citaActualizada){
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita);
        this.mostrar();
    }
    eliminarCita(id){
        this.citas = this.citas.filter( cita => cita.id !== id);
        this.mostrar();
    }
    mostrar(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }

        if(this.citas.length === 0){
            contenedorCitas.innerHTML = '<p class="cita-parrafo">No hay Pacientes</p>';
        }
        this.citas.forEach( cita => {

            const divCard = document.createElement('DIV');
            divCard.classList.add('card');

            const nombre = document.createElement('P');
            nombre.classList.add('color-texto');
            nombre.innerHTML = `<span> Nombre: </span> ${cita.nombre}`;

            const numero = document.createElement('P');
            numero.classList.add('color-texto');
            numero.innerHTML = `<span> Número de teléfono: </span> ${cita.numero}`;

            const email = document.createElement('P');
            email.classList.add('color-texto');
            email.innerHTML = `<span> E-mail: </span> ${cita.email}`;

            const fecha = document.createElement('P');
            fecha.classList.add('color-texto');
            fecha.innerHTML = `<span> Fecha: </span> ${cita.fecha}`;

            const hora = document.createElement('P');
            hora.classList.add('color-texto');
            hora.innerHTML = `<span> Hora: </span> ${cita.hora}`;

            const motivo = document.createElement('P');
            motivo.classList.add('color-texto');
            motivo.innerHTML = `<span> Motivo: </span> ${cita.motivo}`;

            const contenedorBtn = document.createElement('div');
            contenedorBtn.classList.add('contenedor-btn');

            const btnEditar = document.createElement('button');
            btnEditar.classList.add('editar');
            btnEditar.innerHTML = 'Editar <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"> <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>'

            //clonamos la cita
            const clone = structuredClone(cita);
            //al dar click en el boton editar mostrara los datos en los input del formulario
            btnEditar.onclick = () => editarCita(clone);
            
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('eliminar');
            btnEliminar.innerHTML = 'Eliminar <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>';

            btnEliminar.onclick = () => this.eliminarCita(cita.id);

            contenedorBtn.appendChild(btnEditar);
            contenedorBtn.appendChild(btnEliminar);

            divCard.appendChild(nombre);
            divCard.appendChild(numero);
            divCard.appendChild(email);
            divCard.appendChild(fecha);
            divCard.appendChild(hora);
            divCard.appendChild(motivo);
            divCard.appendChild(contenedorBtn);

            contenedorCitas.appendChild(divCard);
        });

        this.agregarLocalStorage();
    }

    agregarLocalStorage(){
        localStorage.setItem('citas', JSON.stringify(this.citas));
    }
}

const citas = new AdminCitas();

//funciones
function datosCita(e){
    //llenamos el objecto con la informacion del formulario 
    citasObj[e.target.name] = e.target.value;
}

function submitCita(e){
    e.preventDefault();

    // comprobamos si al menos un campo esta vacio para mostrar la alerta
    if(Object.values(citasObj).some( valor => valor.trim() === '')){
        new Notificacion({
            texto: 'Los campos son obligatorios',
            tipo: 'error'
        })
        return;
    }
    //comprobamos que el número de telefono sea valido
    if(!/^\d{10}$/.test(citasObj.numero)){
        new Notificacion({
            texto: 'Número de teléfono inválido. Por favor, ingresa un número de 10 dígitos',
            tipo: 'error'
        })
        return;
    }
    //comprobamos que el correo sea valido
    if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(citasObj.email)){
        new Notificacion({
            texto: 'Introduce un correo electrónico válido',
            tipo: 'error'
        });
        return;
    }

    if(editando){
        citas.editar({...citasObj});
        new Notificacion({
            texto: 'Paciente actualizado',
            tipo: 'exito'
        });
    }else{
        // agregamos los pacientes a nuestro arreglo
        citas.agregar({...citasObj});
        new Notificacion({
            texto: 'Paciente agregado correctamente',
            tipo: 'exito'
        });
    }
    
    formulario.reset();
    reiniciarObj();

    editando = false;

    submitFormulario.value = 'Registrar Paciente';
}

function generarId(){
    return Math.random().toString(32).substring(2) + Date.now();
}
function reiniciarObj(){
    citasObj.id = generarId();
    citasObj.nombre = '';
    citasObj.numero = '';
    citasObj.email = '';
    citasObj.fecha = '';
    citasObj.hora = '';
    citasObj.motivo = '';
}

function editarCita(cita){
    Object.assign(citasObj, cita);

    nombreInput.value = cita.nombre;
    numeroInput.value = cita.numero;
    emailInput.value = cita.email;
    fechaInput.value = cita.fecha;
    horaInput.value = cita.hora;
    motivoInput.value = cita.motivo;

    editando = true;

    submitFormulario.value = 'Actualizar Paciente';
}