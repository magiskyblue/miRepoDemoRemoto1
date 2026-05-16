import { listaDeNotas } from '../../utils/tareas'

export default defineEventHandler(async (contexto) => {
  const { id } = contexto.context.params
  const identificador = parseInt(id, 10)
  
  const indiceEncontrado = listaDeNotas.findIndex(item => item.uid === identificador)

  if (indiceEncontrado === -1) {
    throw createError({ 
      statusCode: 404, 
      statusMessage: `El registro con ID ${id} no existe en la base de datos.` 
    })
  }

  const elemento = listaDeNotas[indiceEncontrado]
  const metodo = contexto.method

  if (metodo === 'DELETE') {
    listaDeNotas.splice(indiceEncontrado, 1)
    return { estado: 'eliminado_con_exito' }
  }

  if (metodo === 'PUT') {
    const payload = await readBody(contexto)
    elemento.texto = payload.titulo
    return elemento
  }

  if (metodo === 'PATCH') {
    const parametrosUrl = getQuery(contexto)
    const propiedadAMutar = parametrosUrl.campo

    if (propiedadAMutar === 'favorita') {
      elemento.destacado = !elemento.destacado
    }
    if (propiedadAMutar === 'completada') {
      elemento.hecho = !elemento.hecho
    }
    
    return elemento
  }
})