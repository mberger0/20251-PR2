/*Este script gestiona el registro de nuevos usuarios, incluyendo la validación de datos y el autocompletado de campos.
    Permite al usuario seleccionar una ciudad y autocompletar el código postal, así como autocompletar el dominio del correo electrónico.*/

// Referencias a inputs
const nameInput = document.getElementById('name');
const surnameInput = document.getElementById('surname');
const addressInput = document.getElementById('address');
const citySelect = document.getElementById('city');
const postalCodeInput = document.getElementById('postalCode');
const emailInput = document.getElementById('email');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

const saveButton = document.getElementById('save');
const loginButton = document.getElementById('loginButton');

/* ---------------
Carga de ciudades
------------------ */
cities.forEach(city => {
  const option = document.createElement('option'); // creo una opción por cada ciudad
  option.value = city.name;
  option.textContent = city.name;
  citySelect.appendChild(option); // la añado al select
});

/* -------------------------------------------
Autocompletar CP cuando se elige la población
-------------------------------------------- */
citySelect.addEventListener('change', () => { // cuando se cambia la ciudad
  const selectedCity = cities.find(c => c.name === citySelect.value); // busco la ciudad seleccionada
  if (selectedCity) {
    postalCodeInput.value = selectedCity.postalCode; // y autocompleto el CP si se encuentra
  }
});

/* -------------------------
Autocompletar email @uoc.edu
---------------------------- */
emailInput.addEventListener('input', () => { // cuando se escribe en el input de email
  const value = emailInput.value; 

  if (value.includes('@') && !value.includes('@uoc.edu')) { // si contiene @ pero no es @uoc.edu
    emailInput.value =
      value.substring(0, value.indexOf('@')) + '@uoc.edu'; // autocompleto con @uoc.edu
  }
});

/* ----------------------
Guardo usuario (validado)
------------------------- */
saveButton.addEventListener('click', () => { // al hacer click en guardar se validan y guardan los datos siguientes:
  const name = nameInput.value.trim();
  const surname = surnameInput.value.trim();
  const address = addressInput.value.trim();
  const city = citySelect.value;
  const postalCode = postalCodeInput.value.trim();
  const email = emailInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  // Campos obligatorios
  if (!name || !surname || !address || !username) { // si faltan campos obligatorios
    alert('Todos los campos obligatorios deben estar rellenados'); // salta este aviso
    return;
  }

  // Usuario existente
  if (User.exists(username)) { // si el usuario ya existe
    alert('El usuario ya existe'); // salta este aviso
    return;
  }

  // Validación contraseña
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/; // al menos 8 caracteres, una letra, un número y un carácter especial
  if (!passwordRegex.test(password)) { // si la contraseña no cumple los requisitos
    alert('La contraseña no cumple los requisitos'); // salta este aviso
    return;
  }

  // Validación CP ↔ ciudad
  const cityByCP = cities.find(c => c.postalCode === postalCode); // busco la ciudad por el CP
  if (postalCode && !cityByCP) { // si se ha introducido CP pero no coincide con ninguna ciudad
    alert('El código postal no es válido'); // salta este aviso
    return;
  }

  // y si el CP coincide con una ciudad pero no con la seleccionada, entonces la cambio
  if (cityByCP && city !== cityByCP.name) {
    citySelect.value = cityByCP.name;
  }

  // Crear y guardar usuario
  const user = new User({ 
    name,
    surname,
    address,
    city: citySelect.value,
    postalCode,
    email,
    username,
    password
  });

  if (user.save()) { // si se guarda correctamente
    alert('Usuario registrado correctamente'); // salta este aviso
    window.location.href = 'index.html'; // y vuelve a login
  }
});

/* ----------------
   Se vuelve a login
------------------- */
loginButton.addEventListener('click', () => { 
  window.location.href = 'index.html';
});

/* Añadir las funciones que consideréis necesarias*/
