/* ---------------------------------
   Clase User
   Representa un usuario registrado
------------------------------------ */
class User {
    /* Constructor de la clase User */
  constructor({
    name,
    surname,
    address,
    city,
    postalCode,
    email,
    username,
    password
  }) {
    this.name = name;
    this.surname = surname;
    this.address = address;
    this.city = city;
    this.postalCode = postalCode;
    this.email = email;
    this.username = username;
    this.password = password;

    // Listas del usuario
    this.myTeam = new PokemonList(); // máxiumo 6
    this.wishes = new PokemonList(); // sin límite
  }

    /* Getters y Setters */ 
    getUsername() { return this.username; } 
    setUsername(username) { this.username = username; } 

    getPassword() { return this.password; }
    setPassword(password) { this.password = password; }

    getName() { return this.name; }
    setName(name) { this.name = name; }

    getSurname() { return this.surname; }
    setSurname(surname) { this.surname = surname; }

    getAddress() { return this.address; }
    setAddress(address) { this.address = address; }

    getCity() { return this.city; }
    setCity(city) { this.city = city; }

    getPostalCode() { return this.postalCode; }
    setPostalCode(postalCode) { this.postalCode = postalCode; }

    getEmail() { return this.email; }
    setEmail(email) { this.email = email; }

    getMyTeam() { return this.myTeam; }
    getWishes() { return this.wishes; }
    

    // Método para añadir o eliminar pokemons de las listas
    manageList(pokemon, listName, action) {
        if (!pokemon || !pokemon.id || !pokemon.name) return false; // esto valida que sea un objeto Pokémon básico

        const list = this[listName];
        if (!(list instanceof PokemonList)) return false; // valida que la lista exista

        if (action === 'add') {
        if (listName === 'myTeam' && list.getAll().length >= 6) return false; // límite de 6 pokémons en myTeam
        return list.add(pokemon);
        }

        if (action === 'remove') {
        return list.removeById(pokemon.id); // elimina por id
        }

        return false;
    }

    /* Método para guardar el usuario en el localStorage */
    save() {
        const users = User.getAll();

        if (User.exists(this.username)) return false;

        users.push(this.toJSON()); // añade el nuevo usuario
        localStorage.setItem('users', JSON.stringify(users)); // guarda el array actualizado
        return true;
    }

    /* Método para actualizar un usuario en el localStorage */
    update() {
        const users = User.getAll(); // obtiene todos los usuarios
        const index = users.findIndex(u => u.username === this.username); // busca por username

        if (index === -1) return false;

        users[index] = this.toJSON(); // actualiza el usuario
        localStorage.setItem('users', JSON.stringify(users)); // guarda el array actualizado
        return true;
    }

    toJSON() { // convierte el usuario a un objeto JSON
        return {
        name: this.name,
        surname: this.surname,
        address: this.address,
        city: this.city,
        postalCode: this.postalCode,
        email: this.email,
        username: this.username,
        password: this.password,
        myTeam: this.myTeam.toJSON(),
        wishes: this.wishes.toJSON()
        };
    }

    static fromJSON(obj) { // crea un usuario a partir de un objeto JSON
        const user = new User(obj);
        user.myTeam = PokemonList.fromJSON(obj.myTeam || []);
        user.wishes = PokemonList.fromJSON(obj.wishes || []);
        return user;
    }
    /* Añadir las funciones que consideréis necesarias*/
    /* Helpers estáticos (LOGIN) */
    static getAll() {
        return JSON.parse(localStorage.getItem('users')) || []; // devuelve un array de usuarios o vacío
    }

    static exists(username) {
        return User.getAll().some(u => u.username === username); // comprueba si existe un usuario con ese username
    }

    static findByUsername(username) {
        const data = User.getAll().find(u => u.username === username); // busca el usuario por username
        return data ? User.fromJSON(data) : null;
    }

    static setLoggedUser(username) {
        localStorage.setItem('loggedUser', username); // guarda el username del usuario logueado
    }

    static getLoggedUser() {
        const username = localStorage.getItem('loggedUser'); // obtiene el username del usuario logueado
        return username ? User.findByUsername(username) : null; // devuelve el usuario o null
    }

    static logout() {
        localStorage.removeItem('loggedUser'); // elimina el usuario logueado
    }
}


/* -----------------------------------------------
   Clase Pokemon
   Representa un Pokémon (estructura de datos)
----------------------------------------------- */
class Pokemon {
    /* Constructor de la clase Pokemon */
  constructor({
    id,
    name,
    description = '',
    height = 0,
    weight = 0,
    baseExperience = 0,
    abilities = [],
    types = [],
    sprites = '',
    stats = []
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.height = height;
    this.weight = weight;
    this.baseExperience = baseExperience;
    this.abilities = abilities;
    this.types = types;
    this.sprites = sprites;
    this.stats = stats;
  }

    /* Getters y Setters */ 
    getId() { return this.id; }
    setId(id) { this.id = id; }

    getName() { return this.name; }
    setName(name) { this.name = name; }

    getTypes() { return this.types; }
    setTypes(types) { this.types = types; }

    getSprites() { return this.sprites; }
    setSprites(sprites) { this.sprites = sprites; }

    getStats() { return this.stats; }
    setStats(stats) { this.stats = stats; }

    /* Añadir las funciones que consideréis necesarias*/   
    toJSON() { // convierte el Pokémon a un objeto JSON
        return { ...this };
    }

    static fromJSON(obj) { // crea un Pokémon a partir de un objeto JSON
        return new Pokemon(obj);
    }
    }

/* -------------------------------
    Clase PokemonList
    Lista reutilizable de Pokémon
----------------------------------*/
class PokemonList {
    /* Constructor de la clase PokemonList */
  constructor() {
    this.items = [];
  }
    /* Getters y Setters */ 
    getAll() {
        return this.items; // devuelve todos los pokémons de la lista
    }
    /* Añadir las funciones que consideréis necesarias*/

    has(id) {
        return this.items.some(p => p.id === id); // comprueba si existe un Pokémon con ese id
    }

    add(pokemon) {
        if (!(pokemon instanceof Pokemon)) return false; // valida que sea un objeto Pokémon 
        if (this.has(pokemon.id)) return false; // no añade duplicados

        this.items.push(pokemon); // añade el Pokémon a la lista
        return true;
    }

    removeById(id) {
        const initialLength = this.items.length; // guarda la longitud inicial
        this.items = this.items.filter(p => p.id !== id); // filtra la lista para eliminar el Pokémon con ese id
        return this.items.length !== initialLength; // devuelve true si se ha eliminado algún Pokémon
    }

    toJSON() {
        return this.items.map(p => p.toJSON()); // convierte la lista a un array de objetos JSON
    }

    static fromJSON(arr) { // crea una lista de Pokémon a partir de un array de objetos JSON
        const list = new PokemonList();
        arr.forEach(obj => list.add(Pokemon.fromJSON(obj)));
        return list;
    }
}