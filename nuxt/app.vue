<script setup>
const listado = ref([])
const entradaTexto = ref('')
const idEnModoEdicion = ref(null)
const bufferEdicion = ref('')
const criterioFiltro = ref('all')

const cuentaTotal = computed(() => listado.value.length)
const cuentaResueltas = computed(() => listado.value.filter(item => item.hecho).length)
const ratioProgreso = computed(() => {
  if (cuentaTotal.value === 0) return 0
  return Math.floor((cuentaResueltas.value / cuentaTotal.value) * 100)
})

const itemsFiltrados = computed(() => {
  switch (criterioFiltro.value) {
    case 'favs': return listado.value.filter(item => item.destacado)
    case 'done': return listado.value.filter(item => item.hecho)
    case 'todo': return listado.value.filter(item => !item.hecho)
    default: return listado.value
  }
})

async function sincronizarBackend() {
  const respuesta = await $fetch('/api/tareas')
  listado.value = respuesta
}

async function registrarNueva() {
  const cadenaLimpia = entradaTexto.value.trim()
  if (!cadenaLimpia) return
  
  const nuevoRegistro = await $fetch('/api/tareas', { 
    method: 'POST', 
    body: { titulo: cadenaLimpia } 
  })
  listado.value.push(nuevoRegistro)
  entradaTexto.value = ''
}

async function borrarItem(uid) {
  await $fetch(`/api/tareas/${uid}`, { method: 'DELETE' })
  listado.value = listado.value.filter(item => item.uid !== uid)
}

async function alternarDestacado(uid) {
  const actualizado = await $fetch(`/api/tareas/${uid}`, { 
    method: 'PATCH', 
    params: { campo: 'favorita' } 
  })
  const index = listado.value.findIndex(item => item.uid === uid)
  if (index !== -1) listado.value[index] = actualizado
}

async function alternarEstadoHecho(uid) {
  const actualizado = await $fetch(`/api/tareas/${uid}`, { 
    method: 'PATCH', 
    params: { campo: 'completada' } 
  })
  const index = listado.value.findIndex(item => item.uid === uid)
  if (index !== -1) listado.value[index] = actualizado
}

function activarEdicion(item) {
  idEnModoEdicion.value = item.uid
  bufferEdicion.value = item.texto
}

async function confirmarCambio(uid) {
  if (!bufferEdicion.value.trim()) return
  const actualizado = await $fetch(`/api/tareas/${uid}`, { 
    method: 'PUT', 
    body: { titulo: bufferEdicion.value } 
  })
  const index = listado.value.findIndex(item => item.uid === uid)
  if (index !== -1) listado.value[index] = actualizado
  abortarEdicion()
}

function abortarEdicion() {
  idEnModoEdicion.value = null
  bufferEdicion.value = ''
}

onMounted(() => {
  sincronizarBackend()
})
</script>

<template>
  <main class="contenedor-principal">
    <section class="modulo-tareas">
      <header class="cabecera-app">
        <div class="bloque-superior">
          <h2>Dashboard de Notas</h2>
          <div class="marcador-digital">{{ cuentaResueltas }} / {{ cuentaTotal }}</div>
        </div>
        <div class="riel-progreso">
          <div class="linea-activa" :style="{ width: ratioProgreso + '%' }"></div>
        </div>
      </header>

      <div class="zona-captura">
        <input 
          v-model="entradaTexto" 
          @keydown.enter="registrarNueva" 
          placeholder="Escribe algo importante..." 
          class="input-global"
        />
        <button @click="registrarNueva" class="btn-guardar">Añadir</button>
      </div>

      <nav class="segmentos-filtro">
        <button 
          v-for="opcion in [{id:'all',txt:'Ver Todas'},{id:'todo',txt:'Pendientes'},{id:'done',txt:'Completadas'},{id:'favs',txt:'Destacadas'}]" 
          :key="opcion.id" 
          :class="['btn-segmento', { 'segmento-activo': criterioFiltro === opcion.id }]" 
          @click="criterioFiltro = opcion.id"
        >
          {{ opcion.txt }}
        </button>
      </nav>

      <ul class="lista-items">
        <li 
          v-for="nodo in itemsFiltrados" 
          :key="nodo.uid" 
          :class="['tarjeta-item', { 'estado-listo': nodo.hecho, 'es-prioritario': nodo.destacado }]"
        >
          <template v-if="idEnModoEdicion === nodo.uid">
            <input v-model="bufferEdicion" @keydown.enter="confirmarCambio(nodo.uid)" class="input-edicion-celda" />
            <div class="grupo-ajuste">
              <button @click="confirmarCambio(nodo.uid)" class="btn-check-ok">✔</button>
              <button @click="abortarEdicion" class="btn-check-cancel">✖</button>
            </div>
          </template>
          
          <template v-else>
            <div class="wrapper-contenido" @click="alternarEstadoHecho(nodo.uid)">
              <div :class="['radio-selector', { 'selector-activo': nodo.hecho }]">
                <span v-if="nodo.hecho">•</span>
              </div>
              <span class="texto-renderizado">{{ nodo.texto }}</span>
            </div>
            
            <div class="acciones-flotantes">
              <button @click.stop="activarEdicion(nodo)" class="accion-btn edita" title="Modificar contenido">
                ⚙️
              </button>
              <button @click.stop="alternarDestacado(nodo.uid)" :class="['accion-btn', 'destaca', { 'marcado': nodo.destacado }]" title="Destacar">
                ⭐
              </button>
              <button @click.stop="borrarItem(nodo.uid)" class="accion-btn elimina" title="Remover por completo">
                🗑️
              </button>
            </div>
          </template>
        </li>
      </ul>

      <div v-if="itemsFiltrados.length === 0" class="panel-vacio">
        <p>No se encontraron registros en este segmento.</p>
      </div>
    </section>
  </main>
</template>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', system-ui, sans-serif; background-color: #0f172a; color: #f1f5f9; min-height: 100vh; padding: 30px 15px; }

.contenedor-principal { display: flex; justify-content: center; padding-top: 20px; }
.modulo-tareas { width: 100%; max-width: 550px; background: #1e293b; border-radius: 16px; border: 1px solid #334155; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); overflow: hidden; }

.cabecera-app { padding: 24px; background: #111827; border-bottom: 1px solid #334155; }
.bloque-superior { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.bloque-superior h2 { font-size: 20px; color: #38bdf8; letter-spacing: 0.5px; }
.marcador-digital { font-family: monospace; background: #1f2937; padding: 6px 14px; border-radius: 6px; border: 1px solid #4b5563; color: #10b981; }

.riel-progreso { height: 6px; background: #374151; border-radius: 3px; overflow: hidden; }
.linea-activa { height: 100%; background: linear-gradient(90deg, #10b981, #3b82f6); transition: width 0.4s ease; }

.zona-captura { display: flex; gap: 10px; padding: 20px 24px; background: #1e293b; }
.input-global { flex: 1; padding: 12px 16px; background: #0f172a; border: 1px solid #4b5563; border-radius: 8px; color: #fff; font-size: 14px; outline: none; transition: border 0.2s; }
.input-global:focus { border-color: #38bdf8; }
.btn-guardar { padding: 0 20px; border: none; border-radius: 8px; background: #3b82f6; color: white; font-weight: 600; cursor:pointer; }
.btn-guardar:hover { background: #2563eb; }

.segmentos-filtro { display: flex; gap: 6px; padding: 0 24px 16px; flex-wrap: wrap; }
.btn-segmento { padding: 6px 12px; border: 1px solid #334155; border-radius: 6px; background: #1e293b; color: #94a3b8; font-size: 12px; cursor: pointer; }
.btn-segmento:hover { background: #334155; color: #fff; }
.segmento-activo { background: #38bdf8 !important; color: #0f172a !important; font-weight: bold; border-color: #38bdf8; }

.lista-items { list-style: none; padding: 0 24px 24px; }
.tarjeta-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; margin-bottom: 8px; background: #111827; border-radius: 8px; border: 1px solid #1e293b; transition: all 0.2s; }
.tarjeta-item:hover { border-color: #4b5563; background: #162238; }

.estado-listo .texto-renderizado { text-decoration: line-through; color: #64748b; }
.es-prioritario { border-left: 4px solid #f59e0b; }

.wrapper-contenido { display: flex; align-items: center; gap: 12px; flex: 1; cursor: pointer; }
.radio-selector { width: 18px; height: 18px; border: 2px solid #64748b; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #10b981; font-weight: bold; }
.selector-activo { border-color: #10b981; }
.texto-renderizado { font-size: 14px; color: #e2e8f0; }

.acciones-flotantes { display: flex; gap: 4px; opacity: 0.4; }
.tarjeta-item:hover .acciones-flotantes { opacity: 1; }
.accion-btn { width: 28px; height: 28px; border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; filter: grayscale(100%); transition: filter 0.2s; }
.accion-btn:hover { filter: grayscale(0%); }
.destaca.marcado { filter: grayscale(0%); }

.input-edicion-celda { flex: 1; padding: 8px; background: #0f172a; border: 1px solid #38bdf8; border-radius: 6px; color: white; font-size: 13px; }
.grupo-ajuste { display: flex; gap: 4px; margin-left: 8px; }
.btn-check-ok, .btn-check-cancel { width: 28px; height: 28px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; color: #fff; }
.btn-check-ok { background: #10b981; }
.btn-check-cancel { background: #ef4444; }

.panel-vacio { text-align: center; padding: 30px; color: #64748b; font-size: 14px; }
</style>