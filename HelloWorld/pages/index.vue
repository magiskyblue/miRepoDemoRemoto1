<template>
  <div class="arcade-welcome-container">
    <div class="arcade-card">
      <h1 class="pixel-title">HELLO WORLD</h1>
      
      <div class="pixel-divider"></div>
      
      <p class="pixel-subtitle">
        BIENVENIDO A NUXT 3 (JS) — PROYECTO DE EJEMPLO DE MAGALI ARJONA.
      </p>
      
      <div class="insert-coin-anim">
        &lt; PRESS START TO PLAY &gt;
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.arcade-welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem;
  font-family: 'Press Start 2P', monospace;
  color: #fff;
}

.arcade-card {
  background: #111424;
  border: 6px solid #000;
  box-shadow: 10px 10px 0px #000;
  padding: 40px 30px;
  max-width: 550px;
  width: 100%;
  text-align: center;
  position: relative;
}

.pixel-title {
  font-size: 22px;
  color: #00ffcc;
  text-shadow: 3px 3px #ff00ff;
  margin-bottom: 20px;
  letter-spacing: 2px;
}

.pixel-divider {
  height: 8px;
  background: #000;
  border-top: 2px solid #ffcc00;
  border-bottom: 2px solid #ffcc00;
  margin-bottom: 25px;
}

.pixel-subtitle {
  font-size: 10px;
  line-height: 1.8;
  color: #eee;
  margin-bottom: 35px;
  text-transform: uppercase;
}

.insert-coin-anim {
  font-size: 11px;
  color: #ff00ff;
  letter-spacing: 1px;
  animation: blink 1.5s infinite steps(1);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>