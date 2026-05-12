<template>
  <div class="card">
    <img :src="imagen" :alt="nombre" />

    <h2>{{ nombre }}</h2>

    <p><strong>Tipo:</strong> {{ tipo }}</p>

    <p><strong>Poder:</strong> {{ poder }}</p>
  </div>
</template>

<script>
export default {
  props: {
    nombre: String,
    tipo: String,
    poder: Number,
    imagen: String
  }
}
</script>

<style>
.card {
  width: 250px;
  padding: 20px;
  border-radius: 12px;
  background: #f4f4f4;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  margin: 20px auto;
  font-family: Arial, sans-serif;
}

.card img {
  width: 150px;
}

.card h2 {
  color: #ffcb05;
}
</style>