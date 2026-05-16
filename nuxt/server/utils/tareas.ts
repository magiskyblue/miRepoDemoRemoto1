export interface NotaItem {
  uid: number;
  texto: string;
  hecho: boolean;
  destacado: boolean;
}

export const listaDeNotas: NotaItem[] = [
  { uid: 101, texto: 'Dominar el ecosistema de Nuxt 3', hecho: false, destacado: true },
  { uid: 102, texto: 'Rutina de cardio matutina', hecho: true, destacado: false },
  { uid: 103, texto: 'Revisar capítulos de literatura avanzada', hecho: false, destacado: false }
]

let contadorId = 104

export function autogenerarId(): number {
  const actual = contadorId
  contadorId += 1
  return actual
}