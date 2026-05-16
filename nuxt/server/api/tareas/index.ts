import { listaDeNotas, autogenerarId } from '../../utils/tareas'

export default defineEventHandler(async (evento) => {
  const metodoHttp = evento.method

  if (metodoHttp === 'GET') {
    return listaDeNotas
  }

  if (metodoHttp === 'POST') {
    const datosRecibidos = await readBody(evento)
    
    const nuevoItem = {
      uid: autogenerarId(),
      texto: datosRecibidos.titulo || 'Nueva nota anónima',
      hecho: false,
      destacado: false
    }
    
    listaDeNotas.push(nuevoItem)
    return nuevoItem
  }
})