// ==========================================
// 1. BASE DE DATOS E INICIALIZACIÓN
// ==========================================

const galeriasBase = [
  { id: "gal_1", nombre: "Portal Lyon", direccion: "Av. Providencia 2198", admin: "Administración Central", telefono: "9 9589 5918" },
  { id: "gal_2", nombre: "Caracol Los Leones", direccion: "Nueva Los Leones 030, 050", admin: "Conserjería", telefono: "Sin registro" },
  { id: "gal_3", nombre: "Edificio Dos Caracoles", direccion: "Av. Providencia 2216", admin: "Administración", telefono: "(2) 2232 7557" },
  { id: "gal_4", nombre: "Dos Providencias Shopping Center", direccion: "Av. Providencia 2237", admin: "Administración", telefono: "(2) 2334 0645" },
  { id: "gal_5", nombre: "Paseo Las Palmas", direccion: "Av. Providencia 2208", admin: "Administración", telefono: "9 9434 6685" },
  { id: "gal_6", nombre: "Galería Zona Franca", direccion: "Av. Providencia 2251", admin: "Administración", telefono: "(2) 2334 3067" },
  { id: "gal_7", nombre: "Galería Puerta del Sol", direccion: "Av. Providencia 1336", admin: "Conserjería", telefono: "Sin registro" },
  { id: "gal_8", nombre: "Galería Los Pájaros", direccion: "Av. Providencia 2348", admin: "Administración", telefono: "(2) 2234 0714" },
  { id: "gal_9", nombre: "Galería Madrid / Centro Comercial Madrid", direccion: "Av. Pedro de Valdivia 1783", admin: "Administración", telefono: "(2) 2225 8268" },
  { id: "gal_10", nombre: "Galería Plaza Lyon", direccion: "Las Bellotas 269", admin: "Administración", telefono: "Sin registro" }
];

function extraerNumeroLocal(textoUbicacion) {
  if (!textoUbicacion) return null;
  // Extrae el primer número que encuentre tras la palabra Loc o Local
  const match = textoUbicacion.match(/Loc(?:al)?\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

function obtenerLocalesIniciales() {
  if (typeof LOCALES_DATA !== 'undefined' && Array.isArray(LOCALES_DATA)) {
    return LOCALES_DATA.map((item, index) => {
      const numExtraido = extraerNumeroLocal(item.ubicacion);
      return {
        id: item.id || `loc_${index + 1}`,
        galeriaId: "gal_1",
        numLocalVal: numExtraido,
        numLocal: numExtraido ? `Local ${numExtraido}` : (item.ubicacion ? (item.ubicacion.match(/Loc\s*[\d\w\-]+|Local\s*[\d\w\-]+/i)?.[0] || 'S/N') : 'S/N'),
        nombre: item.nombre || "Sin nombre",
        rubro: item.rubro || "Servicios / Retail",
        direccion: item.ubicacion || "Av. Providencia 2198",
        whatsapp: item.telefono || "",
        email: "",
        estado: item.estado || "Pendiente",
        tieneGoogleMaps: false,
        origen: item.origen || "Portal Lyon CSV"
      };
    });
  }
  return [];
}

// Cargar estado inicial
let galerias = JSON.parse(localStorage.getItem('galerias_crm_provi')) || galeriasBase;
let prospectos = JSON.parse(localStorage.getItem('prospectos_crm_provi'));

if (!prospectos || prospectos.length === 0) {
  prospectos = obtenerLocalesIniciales();
  localStorage.setItem('prospectos_crm_provi', JSON.stringify(prospectos));
}

function saveData() {
  localStorage.setItem('galerias_crm_provi', JSON.stringify(galerias));
  localStorage.setItem('prospectos_crm_provi', JSON.stringify(prospectos));
  renderAll();
}

// ==========================================
// 2. FUNCIONES DE DESPLEGABLES Y POBLADO
// ==========================================

function populateGaleriaSelects() {
  const selectVista = document.getElementById('selectGaleriaVista');
  const selectForm = document.getElementById('galeriaPertenece');
  const selectEdit = document.getElementById('editGaleriaPertenece');

  const optionsHTML = galerias.map(g => `<option value="${g.id}">${g.nombre} (${g.direccion})</option>`).join('');

  if (selectVista) {
    selectVista.innerHTML = `<option value="">-- Selecciona una Galería --</option>` + optionsHTML;
  }
  if (selectForm) {
    selectForm.innerHTML = `<option value="">Sin Galería Asignada</option>` + optionsHTML;
  }
  if (selectEdit) {
    selectEdit.innerHTML = `<option value="">Sin Galería Asignada</option>` + optionsHTML;
  }
}

// ==========================================
// 3. RENDERIZADO DE LOCALES CON ORDENAMIENTO
// ==========================================

function renderLocalesPorGaleria() {
  const selectVista = document.getElementById('selectGaleriaVista');
  const container = document.getElementById('tablaLocalesGaleriaBody');
  const detailsContainer = document.getElementById('galeriaDetails');

  if (!selectVista || !container) return;

  const galeriaId = selectVista.value;
  const galeriaSeleccionada = galerias.find(g => g.id === galeriaId);

  // Tarjeta Informativa
  if (detailsContainer) {
    if (galeriaSeleccionada) {
      detailsContainer.innerHTML = `
        <h3 style="color: var(--primary);">${galeriaSeleccionada.nombre}</h3>
        <p><strong>📍 Dirección:</strong> ${galeriaSeleccionada.direccion}</p>
        <p><strong>👤 Administración:</strong> ${galeriaSeleccionada.admin} | <strong>📞 Teléfono:</strong> ${galeriaSeleccionada.telefono}</p>
      `;
    } else {
      detailsContainer.innerHTML = `<p class="text-muted">Selecciona una galería del listado para ver su información técnica.</p>`;
    }
  }

  // Filtrar y Ordenar Numericamente (locales sin número al final)
  let filtrados = prospectos.filter(p => p.galeriaId === galeriaId);

  filtrados.sort((a, b) => {
    if (a.numLocalVal !== null && b.numLocalVal !== null) {
      return a.numLocalVal - b.numLocalVal;
    }
    if (a.numLocalVal !== null) return -1;
    if (b.numLocalVal !== null) return 1;
    return a.nombre.localeCompare(b.nombre);
  });

  container.innerHTML = '';

  if (!galeriaId) {
    container.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color: var(--text-muted);">Selecciona una galería en el desplegable superior.</td></tr>`;
    return;
  }

  if (filtrados.length === 0) {
    container.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color: var(--text-muted);">No hay locales registrados en esta galería.</td></tr>`;
    return;
  }

  // Dibujar Filas
  filtrados.forEach(p => {
    container.innerHTML += `
      <tr>
        <td><strong>${p.numLocal}</strong><br><small style="color:var(--text-muted);">${p.nombre}</small></td>
        <td><span class="tag-rubro">${p.rubro}</span></td>
        <td>
          ${p.whatsapp ? `<a href="https://wa.me/${p.whatsapp.replace(/\D/g,'')}" target="_blank" style="color:var(--success); text-decoration:none;">📱 ${p.whatsapp}</a>` : '<span style="color:var(--text-muted);">-</span>'}
        </td>
        <td>
          ${p.tieneGoogleMaps ? '<span class="badge-maps-yes">✅ En Maps</span>' : '<span class="badge-maps-no">❌ Sin Maps</span>'}
        </td>
        <td><span class="tag-galeria">${p.estado}</span></td>
        <td>
          <button class="btn-edit" onclick="openEditModal('${p.id}')">✏️ Editar</button>
        </td>
      </tr>
    `;
  });
}

// ==========================================
// 4. MODAL DE EDICIÓN
// ==========================================

function openEditModal(id) {
  const local = prospectos.find(p => p.id === id);
  if (!local) return;

  document.getElementById('editLocalId').value = local.id;
  document.getElementById('editNombre').value = local.nombre;
  document.getElementById('editRubro').value = local.rubro;
  document.getElementById('editGaleriaPertenece').value = local.galeriaId || '';
  document.getElementById('editNumLocal').value = local.numLocal;
  document.getElementById('editDireccion').value = local.direccion;
  document.getElementById('editWhatsapp').value = local.whatsapp;
  document.getElementById('editEmail').value = local.email || '';
  document.getElementById('editTieneMaps').checked = !!local.tieneGoogleMaps;

  const modal = document.getElementById('editLocalModal');
  if (modal) modal.classList.add('active');
}

function closeEditModal() {
  const modal = document.getElementById('editLocalModal');
  if (modal) modal.classList.remove('active');
}

// Guardar cambios del Modal
document.getElementById('editLocalForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('editLocalId').value;
  const index = prospectos.findIndex(p => p.id === id);

  if (index !== -1) {
    const numTexto = document.getElementById('editNumLocal').value;
    const numExtraido = extraerNumeroLocal(numTexto);

    prospectos[index] = {
      ...prospectos[index],
      nombre: document.getElementById('editNombre').value,
      rubro: document.getElementById('editRubro').value,
      galeriaId: document.getElementById('editGaleriaPertenece').value,
      numLocal: numTexto,
      numLocalVal: numExtraido,
      direccion: document.getElementById('editDireccion').value,
      whatsapp: document.getElementById('editWhatsapp').value,
      email: document.getElementById('editEmail').value,
      tieneGoogleMaps: document.getElementById('editTieneMaps').checked
    };

    saveData();
    closeEditModal();
  }
});

function renderAll() {
  populateGaleriaSelects();
  
  const selectVista = document.getElementById('selectGaleriaVista');
  if (selectVista && !selectVista.value) {
    selectVista.value = 'gal_1';
  }

  renderLocalesPorGaleria();
}

// ==========================================
// 5. INICIALIZACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  renderAll();

  const selectVista = document.getElementById('selectGaleriaVista');
  if (selectVista) {
    selectVista.addEventListener('change', renderLocalesPorGaleria);
  }
});