<template>
  <div class="formulario">
    <h2>Formulario de Usuario</h2>

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
  </div>
</template>

<script>
export default {
  data() {
    return {
      nombre: '',
      correo: ''
    }
  }
}
</script>

<style>
.formulario {
  text-align: center;
  margin-top: 40px;
  font-family: Arial, sans-serif;
}

input {
  display: block;
  margin: 10px auto;
  padding: 10px;
  width: 250px;
  font-size: 16px;
}

h2 {
  color: #42b883;
}
</style>