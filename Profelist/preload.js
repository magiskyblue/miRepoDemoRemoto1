const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  grupos: {
    listar: () => ipcRenderer.invoke('grupos:listar'),
    crear: (nombre) => ipcRenderer.invoke('grupos:crear', { nombre }),
    actualizar: (id, nombre) => ipcRenderer.invoke('grupos:actualizar', { id, nombre }),
    eliminar: (id) => ipcRenderer.invoke('grupos:eliminar', { id })
  },
  alumnos: {
    listar: (grupo_id) => ipcRenderer.invoke('alumnos:listar', { grupo_id }),
    crear: (grupo_id, nombre) => ipcRenderer.invoke('alumnos:crear', { grupo_id, nombre }),
    actualizar: (id, nombre) => ipcRenderer.invoke('alumnos:actualizar', { id, nombre }),
    eliminar: (id) => ipcRenderer.invoke('alumnos:eliminar', { id })
  },
  asistencias: {
    listar: (grupo_id, fecha) => ipcRenderer.invoke('asistencias:listar', { grupo_id, fecha }),
    marcar: (alumno_id, fecha, presente) => ipcRenderer.invoke('asistencias:marcar', { alumno_id, fecha, presente }),
    dashboard: (grupo_id) => ipcRenderer.invoke('asistencias:dashboard', { grupo_id })
  }
});
