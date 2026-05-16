// CONTROLADOR CENTRAL DE ESTADO UNIFICADO (STATE ENGINE STORE)
const AppStore = {
  state: {
    grupoActivo: null,
    grupos: [],
    fecha: new Date().toISOString().split('T')[0],
    cacheAsistencia: [],
    cacheDashboard: null
  },

  async dispatch(action, payload) {
    switch (action) {
      case 'CARGAR_GRUPOS':
        this.state.grupos = await api.grupos.listar();
        this.renderSidebar();
        break;

      case 'SELECCIONAR_GRUPO':
        this.state.grupoActivo = parseInt(payload);
        document.getElementById('fallback-view').style.display = 'none';
        document.getElementById('active-dashboard-view').style.display = 'block';
        
        const grupo = this.state.grupos.find(g => g.id === this.state.grupoActivo);
        document.getElementById('txt-active-group-title').textContent = grupo.nombre;
        
        this.dispatch('SINCRONIZAR_DATA');
        break;

      case 'CAMBIAR_FECHA':
        this.state.fecha = payload;
        this.dispatch('REFRESCAR_ASISTENCIA');
        break;

      case 'SINCRONIZAR_DATA':
        if (!this.state.grupoActivo) return;
        await this.dispatch('REFRESCAR_ASISTENCIA');
        await this.dispatch('REFRESCAR_DASHBOARD');
        this.renderSidebar();
        break;

      case 'REFRESCAR_ASISTENCIA':
        this.state.cacheAsistencia = await api.asistencias.listar(this.state.grupoActivo, this.state.fecha);
        this.renderAsistenciaTable();
        break;

      case 'REFRESCAR_DASHBOARD':
        this.state.cacheDashboard = await api.asistencias.dashboard(this.state.grupoActivo);
        this.renderDashboardMetrics();
        break;
    }
  },

  // RENDERS ATÓMICOS DE COMPONENTES DE INTERFAZ
  renderSidebar() {
    const ul = document.getElementById('dom-groups-list');
    ul.innerHTML = this.state.grupos.map(g => `
      <li data-id="${g.id}" class="${this.state.grupoActivo === g.id ? 'activo' : ''}">
        <span>${g.nombre}</span>
        <button class="del" data-id="${g.id}">&times;</button>
      </li>
    `).join('');

    ul.querySelectorAll('li span').forEach(el => {
      el.addEventListener('click', () => this.dispatch('SELECCIONAR_GRUPO', el.closest('li').dataset.id));
    });

    ul.querySelectorAll('.del').forEach(btn => {
      btn.addEventListener('click', async e => {
        e.stopPropagation();
        if (confirm('¿Eliminar grupo y sus dependencias?')) {
          await api.grupos.eliminar(parseInt(btn.dataset.id));
          if (this.state.grupoActivo === parseInt(btn.dataset.id)) {
            this.state.grupoActivo = null;
            document.getElementById('active-dashboard-view').style.display = 'none';
            document.getElementById('fallback-view').style.display = 'flex';
          }
          this.dispatch('CARGAR_GRUPOS');
        }
      });
    });
  },

  renderAsistenciaTable() {
    const tbody = document.getElementById('render-asistencia-target');
    tbody.innerHTML = this.state.cacheAsistencia.map((a, idx) => `
      <tr>
        <td>${String(idx + 1).padStart(2, '0')}</td>
        <td><strong>${a.nombre}</strong></td>
        <td><button class="toggle ${a.presente ? 'on' : ''}" data-id="${a.id}"></button></td>
        <td style="text-align:right;">
          <button class="btn-icon edit" data-id="${a.id}" data-nombre="${a.nombre}">Modificar</button>
          <button class="btn-icon del" data-id="${a.id}">Remover</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.toggle').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = parseInt(btn.dataset.id);
        const nextState = !btn.classList.contains('on');
        btn.classList.toggle('on', nextState);
        await api.asistencias.marcar(id, this.state.fecha, nextState);
        this.dispatch('REFRESCAR_DASHBOARD'); // Sincroniza métricas derechas automáticamente
      });
    });

    tbody.querySelectorAll('.edit').forEach(btn => {
      btn.addEventListener('click', () => {
        ModalEngine.show('Modificar Nombre Estudiante', `<input id="inp-modal-ctx" value="${btn.dataset.nombre}" />`, async () => {
          const val = document.getElementById('inp-modal-ctx').value.trim();
          if (!val) return;
          await api.alumnos.actualizar(parseInt(btn.dataset.id), val);
          this.dispatch('SINCRONIZAR_DATA');
        });
      });
    });

    tbody.querySelectorAll('.del').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (confirm('¿Eliminar alumno del directorio?')) {
          await api.alumnos.eliminar(parseInt(btn.dataset.id));
          this.dispatch('SINCRONIZAR_DATA');
        }
      });
    });
  },

  renderDashboardMetrics() {
    const data = this.state.cacheDashboard;
    const conDatos = data.alumnos.filter(a => a.total_clases > 0);
    const presentes = conDatos.reduce((s, a) => s + parseInt(a.presentes), 0);
    const totalClases = conDatos.reduce((s, a) => s + parseInt(a.total_clases), 0);
    const prom = totalClases > 0 ? Math.round(presentes / totalClases * 100) : 0;

    // Tarjetas Superiores
    document.getElementById('stats-summary-grid').innerHTML = `
      <div class="stat-card blue"><h4>Matrícula Activa</h4><div class="num">${data.totalAlumnos}</div></div>
      <div class="stat-card green"><h4>Asistencia Media</h4><div class="num">${prom}%</div></div>
      <div class="stat-card amber"><h4>Sesiones Evaluadas</h4><div class="num">${data.fechas.length}</div></div>
      <div class="stat-card red"><h4>Índices Críticos (&lt;70%)</h4><div class="num">${data.alumnos.filter(a => a.porcentaje !== null && parseFloat(a.porcentaje) < 70).length}</div></div>
    `;

    // Tabla de análisis de rendimiento (Derecha)
    document.getElementById('render-metrics-target').innerHTML = data.alumnos.map(a => {
      const pct = a.porcentaje !== null ? parseFloat(a.porcentaje) : 0;
      const ausencias = parseInt(a.total_clases) - parseInt(a.presentes || 0);
      const colorClass = pct >= 70 ? 'verde' : pct >= 40 ? 'ambar' : 'roja';
      return `
        <tr>
          <td>${a.nombre}</td>
          <td class="center">${a.total_clases || 0}</td>
          <td class="center" style="color:var(--accent-green); font-weight:600;">${a.presentes || 0}</td>
          <td class="center" style="color:var(--accent-red); font-weight:600;">${ausencias}</td>
          <td>
            <div style="display:flex;align-items:center;gap:10px">
              <div class="barra-fondo" style="flex:1"><div class="barra-llena ${colorClass}" style="width:${pct}%"></div></div>
              <span style="font-weight:700; width:40px; text-align:right;">${pct}%</span>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }
};

// COMPONENTE HELPER PARA LA CAJA MODAL (MODAL CONTROL ENGINE)
const ModalEngine = {
  show(title, htmlBody, onConfirm) {
    document.getElementById('txt-modal-title').textContent = title;
    document.getElementById('modal-container-body').innerHTML = htmlBody;
    document.getElementById('global-modal-overlay').style.display = 'flex';

    const confirmBtn = document.getElementById('modal-btn-confirm');
    const dismissBtn = document.getElementById('modal-btn-dismiss');

    const cloneConfirm = confirmBtn.cloneNode(true);
    const cloneDismiss = dismissBtn.cloneNode(true);
    confirmBtn.replaceWith(cloneConfirm);
    dismissBtn.replaceWith(cloneDismiss);

    cloneDismiss.addEventListener('click', () => this.close());
    cloneConfirm.addEventListener('click', () => { onConfirm(); this.close(); });
  },
  close() {
    document.getElementById('global-modal-overlay').style.display = 'none';
  }
};

// SUSCRIPCIÓN DE EVENTOS DE BOTONES BASE Y CONFIGURACIONES INICIALES
document.getElementById('input-date-picker').value = AppStore.state.fecha;
document.getElementById('input-date-picker').addEventListener('change', e => AppStore.dispatch('CAMBIAR_FECHA', e.target.value));

document.getElementById('action-create-group').addEventListener('click', () => {
  ModalEngine.show('Crear Nuevo Bloque de Grupo', '<input id="inp-modal-ctx" placeholder="Asigne un identificador..." />', async () => {
    const val = document.getElementById('inp-modal-ctx').value.trim();
    if (!val) return;
    await api.grupos.crear(val);
    AppStore.dispatch('CARGAR_GRUPOS');
  });
});

document.getElementById('action-rename-group').addEventListener('click', () => {
  const currentGroup = AppStore.state.grupos.find(g => g.id === AppStore.state.grupoActivo);
  ModalEngine.show('Renombrar Módulo', `<input id="inp-modal-ctx" value="${currentGroup.nombre}" />`, async () => {
    const val = document.getElementById('inp-modal-ctx').value.trim();
    if (!val) return;
    await api.grupos.actualizar(currentGroup.id, val);
    AppStore.dispatch('CARGAR_GRUPOS');
    document.getElementById('txt-active-group-title').textContent = val;
  });
});

document.getElementById('action-purge-group').addEventListener('click', async () => {
  if (!confirm('¿Destruir el módulo activo y todos sus registros estadísticos?')) return;
  await api.grupos.eliminar(AppStore.state.grupoActivo);
  AppStore.state.grupoActivo = null;
  document.getElementById('active-dashboard-view').style.display = 'none';
  document.getElementById('fallback-view').style.display = 'flex';
  AppStore.dispatch('CARGAR_GRUPOS');
});

document.getElementById('action-add-student').addEventListener('click', () => {
  ModalEngine.show('Inscribir Alumno', '<input id="inp-modal-ctx" placeholder="Nombre de la entidad..." />', async () => {
    const val = document.getElementById('inp-modal-ctx').value.trim();
    if (!val) return;
    await api.alumnos.crear(AppStore.state.grupoActivo, val);
    AppStore.dispatch('SINCRONIZAR_DATA');
  });
});

// INICIALIZADOR DE ARRANQUE DEL SISTEMA
AppStore.dispatch('CARGAR_GRUPOS');