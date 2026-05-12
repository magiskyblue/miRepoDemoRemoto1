<template>
  <div class="contenedor">

    <!-- CONTADOR -->
    <section class="seccion">
      <h1 class="titulo">Contador en Vue</h1>

      <h2>{{ contador }}</h2>

      <button @click="incrementar">
        Incrementar
      </button>

      <button @click="decrementar">
        Decrementar
      </button>
    </section>

    <!-- FORMULARIO -->
    <section class="seccion">
      <h1 class="titulo">Formulario</h1>

      <input
        type="text"
        v-model="nombre"
        placeholder="Ingresa tu nombre"
      />

      <input
        type="email"
        v-model="correo"
        placeholder="Ingresa tu correo"
      />

      <h3>Datos capturados:</h3>

      <p><strong>Nombre:</strong> {{ nombre }}</p>
      <p><strong>Correo:</strong> {{ correo }}</p>
    </section>

    <!-- CARD POKEMON -->
    <section class="seccion">
      <h1 class="titulo">Pokémon Card</h1>

      <div class="card">
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
          alt="Pikachu"
        />

        <h2>Pikachu</h2>

        <p><strong>Tipo:</strong> Eléctrico</p>

        <p><strong>Poder:</strong> 90</p>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  data() {
    return {
      contador: 0,
      nombre: '',
      correo: ''
    }
  },

  methods: {
    incrementar() {
      this.contador++
    },

    decrementar() {
      this.contador--
    }
  }
}
</script>

<style>
body {
  margin: 0;
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
}

.contenedor {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.seccion {
  background: white;
  margin: 20px;
  padding: 30px;
  width: 350px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  text-align: center;
}

.titulo {
  font-size: 40px;
  margin-bottom: 20px;
  color: #2c3e50;
}

button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

input {
  display: block;
  margin: 10px auto;
  padding: 10px;
  width: 250px;
  font-size: 16px;
}

.card img {
  width: 150px;
}

.card h2 {
  color: #ffcb05;
}
</style>