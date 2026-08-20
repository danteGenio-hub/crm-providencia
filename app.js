// ==========================================
// INICIALIZACIÓN DE CLIENTE DE SUPABASE
// ==========================================
if (typeof CONFIG === 'undefined' || !CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_KEY) {
  console.error("Error: No se encontraron las credenciales en config.js");
}

const supabaseClient = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

let prospectos = [];
let galerias = typeof galeriasBase !== 'undefined' ? galeriasBase : [];

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  populateGaleriaSelects();
  setupEventListeners();
  await loadAndListen();
}

// Cargar datos iniciales y escuchar cambios en tiempo real
async function loadAndListen() {
  // 1. Obtención inicial de datos
  const { data, error } = await supabaseClient.from('prospectos').select('*');
  if (!error && data) {
    prospectos = data;
    renderAll();
  } else if (error) {
    console.error('Error al cargar datos desde Supabase:', error);
  }

  // 2. Escucha activa de cambios (Sincronización multi-dispositivo)
  supabaseClient
    .channel('realtime-prospectos')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'prospectos' }, async () => {
      const { data: updated } = await supabaseClient.from('prospectos').select('*');
      if (updated) {
        prospectos = updated;
        renderAll();
      }
    })
    .subscribe();
}

// Renderizar tarjetas de locales
function renderAll() {
  const container = document.getElementById('localesList');
  const searchVal = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const filterGaleria = document.getElementById('filterGaleria')?.value || '';

  if (!container) return;
  container.innerHTML = '';

  const filtered = prospectos.filter(p => {
    const matchSearch = (p.nombre || '').toLowerCase().includes(searchVal) || 
                        (p.rubro || '').toLowerCase().includes(searchVal) || 
                        (p.direccion || '').toLowerCase().includes(searchVal);
    const matchGaleria = !filterGaleria || p.galeriaId === filterGaleria;
    return matchSearch && matchGaleria;
  });

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card-local';
    card.innerHTML = `
      <h3>${p.nombre || 'Sin nombre'}</h3>
      <p><strong>Rubro:</strong> ${p.rubro || '-'}</p>
      <p><strong>Local:</strong> ${p.numLocal || '-'}</p>
      <p><strong>Dirección:</strong> ${p.direccion || '-'}</p>
      <p><strong>Contacto:</strong> ${p.whatsapp || '-'}</p>
      <button class="btn-secondary" onclick="openEditModal('${p.id}')">Editar</button>
    `;
    container.appendChild(card);
  });

  const stats = document.getElementById('statsContainer');
  if (stats) stats.innerText = `Total registrados: ${prospectos.length}`;
}

// Guardar/Actualizar registros en la nube
async function saveLocalToCloud(localData) {
  const { error } = await supabaseClient.from('prospectos').upsert(localData);
  if (error) {
    console.error('Error al guardar en Supabase:', error);
    alert('Error al intentar guardar los datos.');
  } else {
    closeEditModal();
  }
}

// Configuración de interactividad y eventos
function setupEventListeners() {
  document.getElementById('searchInput')?.addEventListener('input', renderAll);
  document.getElementById('filterGaleria')?.addEventListener('change', renderAll);
  
  document.getElementById('btnNewLocal')?.addEventListener('click', () => {
    openEditModal();
  });

  document.getElementById('editLocalForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editLocalId').value || 'loc_' + Date.now();
    
    const localData = {
      id: id,
      nombre: document.getElementById('editNombre').value,
      rubro: document.getElementById('editRubro').value,
      galeriaId: document.getElementById('editGaleriaPertenece').value,
      numLocal: document.getElementById('editNumLocal').value,
      direccion: document.getElementById('editDireccion').value,
      whatsapp: document.getElementById('editWhatsapp').value,
      email: document.getElementById('editEmail').value,
      tieneGoogleMaps: document.getElementById('editTieneMaps').checked
    };

    await saveLocalToCloud(localData);
  });
}

function openEditModal(id = null) {
  const modal = document.getElementById('editModal');
  const title = document.getElementById('modalTitle');
  
  if (id) {
    const item = prospectos.find(p => p.id === id);
    if (!item) return;
    title.innerText = 'Editar Local';
    document.getElementById('editLocalId').value = item.id;
    document.getElementById('editNombre').value = item.nombre || '';
    document.getElementById('editRubro').value = item.rubro || '';
    document.getElementById('editGaleriaPertenece').value = item.galeriaId || '';
    document.getElementById('editNumLocal').value = item.numLocal || '';
    document.getElementById('editDireccion').value = item.direccion || '';
    document.getElementById('editWhatsapp').value = item.whatsapp || '';
    document.getElementById('editEmail').value = item.email || '';
    document.getElementById('editTieneMaps').checked = !!item.tieneGoogleMaps;
  } else {
    title.innerText = 'Nuevo Local';
    document.getElementById('editLocalForm').reset();
    document.getElementById('editLocalId').value = '';
  }
  
  modal.classList.remove('hidden');
}

function closeEditModal() {
  document.getElementById('editModal')?.classList.add('hidden');
}

function populateGaleriaSelects() {
  const filter = document.getElementById('filterGaleria');
  const editSelect = document.getElementById('editGaleriaPertenece');
  
  galerias.forEach(g => {
    if (filter) filter.innerHTML += `<option value="${g.id}">${g.nombre}</option>`;
    if (editSelect) editSelect.innerHTML += `<option value="${g.id}">${g.nombre}</option>`;
  });
}