// ================= RutaCRM — Autocaravanas =================
// App standalone (sin dependencias), datos guardados en IndexedDB del dispositivo.

const ETAPAS = ["Nuevo", "Contactado", "Visita agendada", "Prueba de manejo", "Negociación", "Vendido"];
const ESTADOS_VEHICULO = ["Disponible", "Reservado", "Vendido"];
const TIPOS_VEHICULO = ["Perfilada", "Capuchina", "Integral", "Camper furgoneta"];

const ETAPA_COLOR = {
  "Nuevo": "#8AA0A8", "Contactado": "#5C8C88", "Visita agendada": "#C98A3E",
  "Prueba de manejo": "#C98A3E", "Negociación": "#B8834A", "Vendido": "#7FA37A",
};
const ESTADO_COLOR = { "Disponible": "#7FA37A", "Reservado": "#C98A3E", "Vendido": "#8A8478" };

const PEDIDO_ESTADOS = ["Pedido realizado", "En fabricación", "En tránsito", "Recibido en concesión", "Entregado al cliente"];
const PEDIDO_ESTADO_COLOR = {
  "Pedido realizado": "#8AA0A8", "En fabricación": "#C98A3E", "En tránsito": "#B8834A",
  "Recibido en concesión": "#5C8C88", "Entregado al cliente": "#7FA37A",
};

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
function formatEuros(n) { return (Number(n) || 0).toLocaleString("es-ES", { maximumFractionDigits: 0 }) + " €"; }
function formatKm(n) { return (Number(n) || 0).toLocaleString("es-ES") + " km"; }
function esc(s) { return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

// ---------- Icons (inline SVG, stroke = currentColor) ----------
const ICO = {
  dashboard: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>`,
  users: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  truck: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  plus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
  x: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  phone: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mail: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>`,
  trash: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>`,
  pencil: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`,
  search: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  euro: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h12M4 14h9M19.5 5.5a7 7 0 1 0 0 13"/></svg>`,
  gauge: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>`,
  package: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.29 7 12 12l8.71-5"/><path d="M12 22V12"/></svg>`,
  calendar: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
  camera: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3.5"/></svg>`,
  loader: `<svg class="spin" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
};

// ---------- IndexedDB ----------
const DB_NAME = "rutacrm-db";
const DB_VERSION = 1;
let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("leads")) db.createObjectStore("leads", { keyPath: "id" });
      if (!db.objectStoreNames.contains("inventario")) db.createObjectStore("inventario", { keyPath: "id" });
      if (!db.objectStoreNames.contains("pedidos")) db.createObjectStore("pedidos", { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function dbGetAll(store) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbPut(store, obj) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).put(obj);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function dbDelete(store, id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ---------- Seed data (only used the very first time) ----------
const SEED_LEADS = [
  { id: uid(), nombre: "Marta Iglesias", telefono: "600 111 222", email: "marta.iglesias@example.com", modeloInteres: "Perfilada 7m, 4-5 plazas", etapa: "Visita agendada", notas: "Quiere cambiar su autocaravana actual, viene el sábado a verla.", fecha: new Date().toISOString() },
  { id: uid(), nombre: "Iván Souto", telefono: "600 333 444", email: "ivan.souto@example.com", modeloInteres: "Camper furgoneta, uso fin de semana", etapa: "Nuevo", notas: "Contactó por el formulario web.", fecha: new Date().toISOString() },
];
const SEED_INVENTARIO = [
  { id: uid(), marca: "Benimar", modelo: "Tessoro 486", anio: 2023, precio: 68900, km: 4200, tipo: "Perfilada", plazas: 4, estado: "Disponible", notas: "Cama isla, garaje amplio.", fotos: [] },
  { id: uid(), marca: "Pilote", modelo: "P650G", anio: 2021, precio: 54500, km: 21800, tipo: "Integral", plazas: 5, estado: "Reservado", notas: "Reservada por cliente, pendiente de financiación.", fotos: [] },
];
const SEED_PEDIDOS = [
  { id: uid(), cliente: "Marta Iglesias", marcaModelo: "Benimar Mileo 202", proveedor: "Benimar (fábrica)", fechaPedido: new Date().toISOString().slice(0, 10), fechaEntrega: "", precio: 71500, anticipo: 3000, estado: "En fabricación", notas: "Configuración a medida, placas solares extra." },
];

// ---------- App state ----------
const state = {
  loading: true,
  vista: "panel",
  leads: [],
  inventario: [],
  pedidos: [],
  busqueda: "",
  filtroEstado: "Todos",
  filtroEstadoPedido: "Todos",
  modalLead: null,       // null | 'nuevo' | lead object
  modalVehiculo: null,   // null | 'nuevo' | vehicle object
  modalPedido: null,     // null | 'nuevo' | order object
  fotosTmp: [],           // photos being staged in the vehicle modal
};

const root = document.getElementById("app");

async function init() {
  let leads = await dbGetAll("leads");
  let inventario = await dbGetAll("inventario");
  let pedidos = await dbGetAll("pedidos");
  if (leads.length === 0 && inventario.length === 0 && pedidos.length === 0) {
    for (const l of SEED_LEADS) await dbPut("leads", l);
    for (const v of SEED_INVENTARIO) await dbPut("inventario", v);
    for (const p of SEED_PEDIDOS) await dbPut("pedidos", p);
    leads = SEED_LEADS;
    inventario = SEED_INVENTARIO;
    pedidos = SEED_PEDIDOS;
  }
  state.leads = leads;
  state.inventario = inventario;
  state.pedidos = pedidos;
  state.loading = false;
  render();
}

// ---------- Mutations ----------
async function guardarLead(datos) {
  if (datos.id) {
    await dbPut("leads", datos);
    state.leads = state.leads.map((x) => (x.id === datos.id ? datos : x));
  } else {
    const nuevo = { ...datos, id: uid(), fecha: new Date().toISOString() };
    await dbPut("leads", nuevo);
    state.leads = [nuevo, ...state.leads];
  }
  state.modalLead = null;
  render();
}

async function borrarLead(id) {
  await dbDelete("leads", id);
  state.leads = state.leads.filter((x) => x.id !== id);
  render();
}

async function cambiarEtapa(id, etapa) {
  const lead = state.leads.find((x) => x.id === id);
  if (!lead) return;
  const actualizado = { ...lead, etapa };
  await dbPut("leads", actualizado);
  state.leads = state.leads.map((x) => (x.id === id ? actualizado : x));
  render();
}

async function guardarVehiculo(datos) {
  if (datos.id) {
    await dbPut("inventario", datos);
    state.inventario = state.inventario.map((x) => (x.id === datos.id ? datos : x));
  } else {
    const nuevo = { ...datos, id: uid() };
    await dbPut("inventario", nuevo);
    state.inventario = [nuevo, ...state.inventario];
  }
  state.modalVehiculo = null;
  state.fotosTmp = [];
  render();
}

async function borrarVehiculo(id) {
  await dbDelete("inventario", id);
  state.inventario = state.inventario.filter((x) => x.id !== id);
  render();
}

async function guardarPedido(datos) {
  if (datos.id) {
    await dbPut("pedidos", datos);
    state.pedidos = state.pedidos.map((x) => (x.id === datos.id ? datos : x));
  } else {
    const nuevo = { ...datos, id: uid() };
    await dbPut("pedidos", nuevo);
    state.pedidos = [nuevo, ...state.pedidos];
  }
  state.modalPedido = null;
  render();
}

async function borrarPedido(id) {
  await dbDelete("pedidos", id);
  state.pedidos = state.pedidos.filter((x) => x.id !== id);
  render();
}

async function cambiarEstadoPedido(id, estado) {
  const pedido = state.pedidos.find((x) => x.id === id);
  if (!pedido) return;
  const actualizado = { ...pedido, estado };
  await dbPut("pedidos", actualizado);
  state.pedidos = state.pedidos.map((x) => (x.id === id ? actualizado : x));
  render();
}

// ---------- Photo helper: resize + compress before storing ----------
function resizeImage(file, maxWidth = 900, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ---------- Rendering ----------
function render() {
  if (state.loading) {
    root.innerHTML = `<div class="loading-wrap">${ICO.loader}<span>Cargando datos…</span></div>`;
    return;
  }

  const leadsActivos = state.leads.filter((l) => l.etapa !== "Vendido");
  const leadsNegociacion = state.leads.filter((l) => l.etapa === "Negociación");
  const vehiculosDisponibles = state.inventario.filter((v) => v.estado === "Disponible");
  const pedidosActivos = state.pedidos.filter((p) => p.estado !== "Entregado al cliente");

  root.innerHTML = `
    <div class="topbar">
      <div class="brand">${ICO.truck}<span>RutaCRM</span></div>
    </div>
    <div class="content" id="content"></div>
    ${renderBottomNav(leadsActivos.length, pedidosActivos.length)}
    ${state.vista !== "panel" ? `<button class="fab" id="fab">${ICO.plus}</button>` : ""}
    ${state.modalLead ? renderLeadModal() : ""}
    ${state.modalVehiculo ? renderVehiculoModal() : ""}
    ${state.modalPedido ? renderPedidoModal() : ""}
  `;

  const content = document.getElementById("content");
  if (state.vista === "panel") {
    content.innerHTML = renderPanel(leadsActivos, leadsNegociacion, vehiculosDisponibles, pedidosActivos);
  } else if (state.vista === "leads") {
    content.innerHTML = renderLeadsView();
  } else if (state.vista === "inventario") {
    content.innerHTML = renderInventarioView();
  } else if (state.vista === "pedidos") {
    content.innerHTML = renderPedidosView();
  }

  attachEvents();
}

function renderBottomNav(badgeLeads, badgePedidos) {
  const items = [
    { id: "panel", label: "Panel", icon: ICO.dashboard },
    { id: "leads", label: "Leads", icon: ICO.users, badge: badgeLeads },
    { id: "inventario", label: "Inventario", icon: ICO.truck, badge: state.inventario.length },
    { id: "pedidos", label: "Pedidos", icon: ICO.package, badge: badgePedidos },
  ];
  return `
    <nav class="bottom-nav">
      <div class="brand-desktop">${ICO.truck}<span>RutaCRM</span></div>
      ${items.map((it) => `
        <button data-nav="${it.id}" class="${state.vista === it.id ? "active" : ""}">
          ${it.icon}
          <span>${it.label}</span>
          ${typeof it.badge === "number" ? `<span class="badge">${it.badge}</span>` : ""}
        </button>
      `).join("")}
    </nav>
  `;
}

function renderPanel(leadsActivos, leadsNegociacion, vehiculosDisponibles, pedidosActivos) {
  const valorInventario = vehiculosDisponibles.reduce((acc, v) => acc + (Number(v.precio) || 0), 0);
  const proximasEntregas = [...pedidosActivos].sort((a, b) => (a.fechaEntrega || "9999").localeCompare(b.fechaEntrega || "9999"));
  return `
    <div class="page-header">
      <h1 class="page-title">Panel</h1>
      <p class="page-subtitle">Resumen rápido de tu actividad comercial</p>
    </div>
    <div class="stat-grid">
      ${statCard(ICO.users, leadsActivos.length, "Leads activos", "#8AA0A8")}
      ${statCard(ICO.gauge, leadsNegociacion.length, "En negociación", "#C98A3E")}
      ${statCard(ICO.truck, vehiculosDisponibles.length, "Disponibles", "#5C8C88")}
      ${statCard(ICO.package, pedidosActivos.length, "Pedidos en curso", "#B8834A")}
    </div>
    <div class="section-card">
      <h3 class="section-title">Próximas entregas</h3>
      ${proximasEntregas.slice(0, 5).map((p) => `
        <div class="mini-row">
          <div><div class="mini-row-title">${esc(p.cliente)} — ${esc(p.marcaModelo)}</div><div class="mini-row-sub">${p.fechaEntrega ? "Entrega est. " + esc(p.fechaEntrega) : "Sin fecha estimada"}</div></div>
          ${pill(p.estado, PEDIDO_ESTADO_COLOR[p.estado])}
        </div>`).join("") || `<div class="empty-hint">No hay pedidos en curso.</div>`}
    </div>
    <div class="section-card">
      <h3 class="section-title">Últimos leads</h3>
      ${state.leads.slice(0, 5).map((l) => `
        <div class="mini-row">
          <div><div class="mini-row-title">${esc(l.nombre)}</div><div class="mini-row-sub">${esc(l.modeloInteres || "—")}</div></div>
          ${pill(l.etapa, ETAPA_COLOR[l.etapa])}
        </div>`).join("") || `<div class="empty-hint">Aún no hay leads registrados.</div>`}
    </div>
    <div class="section-card">
      <h3 class="section-title">Inventario reciente</h3>
      ${state.inventario.slice(0, 5).map((v) => `
        <div class="mini-row">
          <div><div class="mini-row-title">${esc(v.marca)} ${esc(v.modelo)}</div><div class="mini-row-sub">${v.anio} · ${formatKm(v.km)} · ${formatEuros(v.precio)}</div></div>
          ${pill(v.estado, ESTADO_COLOR[v.estado])}
        </div>`).join("") || `<div class="empty-hint">Aún no hay vehículos en el inventario.</div>`}
    </div>
  `;
}

function statCard(icon, value, label, color) {
  return `
    <div class="stat-card">
      <div class="stat-icon" style="color:${color};border-color:${color}">${icon}</div>
      <div><div class="stat-value">${value}</div><div class="stat-label">${label}</div></div>
    </div>`;
}

function pill(text, color) {
  return `<span class="pill" style="color:${color};border-color:${color}">${esc(text)}</span>`;
}

function renderLeadsView() {
  return `
    <div class="page-header">
      <h1 class="page-title">Leads</h1>
      <p class="page-subtitle">De primer contacto a venta</p>
    </div>
    <div class="kanban">
      ${ETAPAS.map((etapa) => {
        const items = state.leads.filter((l) => l.etapa === etapa);
        return `
          <div class="kanban-col">
            <div class="kanban-col-header">
              <span class="dot" style="background:${ETAPA_COLOR[etapa]}"></span>
              <span class="kanban-col-title">${etapa}</span>
              <span class="kanban-col-count">${items.length}</span>
            </div>
            <div class="kanban-col-body">
              ${items.map((l) => `
                <div class="lead-card">
                  <div class="lead-card-top">
                    <span class="lead-card-name">${esc(l.nombre)}</span>
                    <div style="display:flex;gap:6px">
                      <button class="icon-btn" data-edit-lead="${l.id}">${ICO.pencil}</button>
                      <button class="icon-btn" data-del-lead="${l.id}">${ICO.trash}</button>
                    </div>
                  </div>
                  ${l.modeloInteres ? `<div class="lead-card-interes">${esc(l.modeloInteres)}</div>` : ""}
                  <div class="lead-card-contact">
                    ${l.telefono ? `<span class="lead-card-contact-item">${ICO.phone} ${esc(l.telefono)}</span>` : ""}
                    ${l.email ? `<span class="lead-card-contact-item">${ICO.mail} ${esc(l.email)}</span>` : ""}
                  </div>
                  <select class="select-mini" data-stage-lead="${l.id}">
                    ${ETAPAS.map((e) => `<option value="${e}" ${e === l.etapa ? "selected" : ""}>${e}</option>`).join("")}
                  </select>
                </div>
              `).join("") || `<div class="kanban-empty">Sin leads en esta fase</div>`}
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderInventarioView() {
  const filtrado = state.inventario.filter((v) => {
    const coincideEstado = state.filtroEstado === "Todos" || v.estado === state.filtroEstado;
    const texto = `${v.marca} ${v.modelo} ${v.tipo}`.toLowerCase();
    return coincideEstado && texto.includes(state.busqueda.toLowerCase());
  });

  return `
    <div class="page-header">
      <h1 class="page-title">Inventario</h1>
      <p class="page-subtitle">Autocaravanas y campers disponibles</p>
    </div>
    <div class="toolbar">
      <div class="search-box">
        ${ICO.search}
        <input id="busqueda" placeholder="Buscar marca, modelo o tipo…" value="${esc(state.busqueda)}" />
      </div>
      <div class="chip-row">
        ${["Todos", ...ESTADOS_VEHICULO].map((e) => `<button class="chip ${state.filtroEstado === e ? "active" : ""}" data-filtro-estado="${e}">${e}</button>`).join("")}
      </div>
    </div>
    <div class="veh-grid">
      ${filtrado.map((v) => `
        <div class="veh-card">
          ${renderFotosVehiculo(v.fotos)}
          <div class="veh-body">
            <div class="veh-top">
              <div>
                <div class="veh-title">${esc(v.marca)} ${esc(v.modelo)}</div>
                <div class="veh-sub">${esc(v.tipo)} · ${v.anio} · ${v.plazas} plazas</div>
              </div>
              ${pill(v.estado, ESTADO_COLOR[v.estado])}
            </div>
            <div class="veh-stats">
              <div class="veh-stat" style="color:#C98A3E">${ICO.euro}<span style="color:var(--text)">${formatEuros(v.precio)}</span></div>
              <div class="veh-stat" style="color:#5C8C88">${ICO.gauge}<span style="color:var(--text)">${formatKm(v.km)}</span></div>
            </div>
            ${v.notas ? `<div class="veh-notes">${esc(v.notas)}</div>` : ""}
            <div class="veh-actions">
              <button class="btn-secondary" data-edit-veh="${v.id}">${ICO.pencil} Editar</button>
              <button class="btn-danger" data-del-veh="${v.id}">${ICO.trash} Eliminar</button>
            </div>
          </div>
        </div>
      `).join("") || `<div class="empty-hint">No hay vehículos que coincidan con la búsqueda o el filtro.</div>`}
    </div>
  `;
}

function renderPedidosView() {
  const filtrado = state.pedidos.filter((p) => state.filtroEstadoPedido === "Todos" || p.estado === state.filtroEstadoPedido);
  const ordenado = [...filtrado].sort((a, b) => (a.fechaEntrega || "9999").localeCompare(b.fechaEntrega || "9999"));

  return `
    <div class="page-header">
      <h1 class="page-title">Pedidos</h1>
      <p class="page-subtitle">Autocaravanas pedidas a fábrica para clientes concretos</p>
    </div>
    <div class="toolbar">
      <div class="chip-row">
        ${["Todos", ...PEDIDO_ESTADOS].map((e) => `<button class="chip ${state.filtroEstadoPedido === e ? "active" : ""}" data-filtro-estado-pedido="${e}">${e}</button>`).join("")}
      </div>
    </div>
    <div class="veh-grid">
      ${ordenado.map((p) => `
        <div class="veh-card">
          <div class="veh-body">
            <div class="veh-top">
              <div>
                <div class="veh-title">${esc(p.cliente)}</div>
                <div class="veh-sub">${esc(p.marcaModelo)}</div>
              </div>
              ${pill(p.estado, PEDIDO_ESTADO_COLOR[p.estado])}
            </div>
            <div class="veh-stats">
              <div class="veh-stat" style="color:#C98A3E">${ICO.euro}<span style="color:var(--text)">${formatEuros(p.precio)}${p.anticipo ? " (anticipo " + formatEuros(p.anticipo) + ")" : ""}</span></div>
            </div>
            <div class="veh-stats">
              <div class="veh-stat" style="color:#5C8C88">${ICO.calendar}<span style="color:var(--text)">${p.fechaEntrega ? "Entrega est. " + esc(p.fechaEntrega) : "Sin fecha de entrega estimada"}</span></div>
            </div>
            ${p.proveedor ? `<div class="veh-sub">Proveedor: ${esc(p.proveedor)}</div>` : ""}
            ${p.notas ? `<div class="veh-notes">${esc(p.notas)}</div>` : ""}
            <select class="select-mini" data-stage-pedido="${p.id}">
              ${PEDIDO_ESTADOS.map((e) => `<option value="${e}" ${e === p.estado ? "selected" : ""}>${e}</option>`).join("")}
            </select>
            <div class="veh-actions">
              <button class="btn-secondary" data-edit-pedido="${p.id}">${ICO.pencil} Editar</button>
              <button class="btn-danger" data-del-pedido="${p.id}">${ICO.trash} Eliminar</button>
            </div>
          </div>
        </div>
      `).join("") || `<div class="empty-hint">No hay pedidos con este filtro.</div>`}
    </div>
  `;
}

function renderFotosVehiculo(fotos) {
  if (!fotos || fotos.length === 0) {
    return `<div class="veh-photo-placeholder">${ICO.camera}<span>Sin fotos</span></div>`;
  }
  return `<div class="veh-photo-scroll">${fotos.map((f) => `<img src="${f}" loading="lazy" />`).join("")}</div>`;
}

// ---------- Modals ----------
function renderLeadModal() {
  const inicial = state.modalLead === "nuevo" ? null : state.modalLead;
  const f = inicial || { nombre: "", telefono: "", email: "", modeloInteres: "", etapa: "Nuevo", notas: "" };
  return `
    <div class="modal-overlay" id="overlay-lead">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">${inicial ? "Editar lead" : "Nuevo lead"}</h2>
          <button class="icon-btn" id="cerrar-lead">${ICO.x}</button>
        </div>
        <form class="form" id="form-lead">
          ${inicial ? `<input type="hidden" name="id" value="${inicial.id}" />` : ""}
          <label class="field"><span class="field-label">Nombre</span><input name="nombre" required value="${esc(f.nombre)}" /></label>
          <div class="form-row">
            <label class="field"><span class="field-label">Teléfono</span><input name="telefono" value="${esc(f.telefono)}" /></label>
            <label class="field"><span class="field-label">Email</span><input name="email" value="${esc(f.email)}" /></label>
          </div>
          <label class="field"><span class="field-label">Modelo de interés</span><input name="modeloInteres" value="${esc(f.modeloInteres)}" placeholder="Ej. Perfilada 4 plazas, ~60.000 €" /></label>
          <label class="field"><span class="field-label">Etapa</span>
            <select name="etapa">${ETAPAS.map((e) => `<option value="${e}" ${e === f.etapa ? "selected" : ""}>${e}</option>`).join("")}</select>
          </label>
          <label class="field"><span class="field-label">Notas</span><textarea name="notas">${esc(f.notas)}</textarea></label>
          <div class="form-actions">
            <button type="button" class="btn-secondary" id="cancelar-lead">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderVehiculoModal() {
  const inicial = state.modalVehiculo === "nuevo" ? null : state.modalVehiculo;
  const f = inicial || { marca: "", modelo: "", anio: new Date().getFullYear(), precio: "", km: "", tipo: TIPOS_VEHICULO[0], plazas: 4, estado: "Disponible", notas: "" };
  if (state.modalVehiculo !== "nuevo" && state.fotosTmp.length === 0 && inicial && inicial.fotos) {
    state.fotosTmp = [...inicial.fotos];
  }
  return `
    <div class="modal-overlay" id="overlay-veh">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">${inicial ? "Editar vehículo" : "Nuevo vehículo"}</h2>
          <button class="icon-btn" id="cerrar-veh">${ICO.x}</button>
        </div>
        <form class="form" id="form-veh">
          ${inicial ? `<input type="hidden" name="id" value="${inicial.id}" />` : ""}

          <label class="field"><span class="field-label">Fotos</span></label>
          <div class="photo-picker" id="photo-picker">
            ${state.fotosTmp.map((f, i) => `
              <div class="photo-thumb"><img src="${f}" /><button type="button" class="remove" data-rm-photo="${i}">${ICO.x}</button></div>
            `).join("")}
            <label class="btn-photo" style="flex-shrink:0;width:72px;height:72px;flex-direction:column;">
              ${ICO.camera}
              <input type="file" accept="image/*" multiple id="input-fotos" style="display:none" />
            </label>
          </div>

          <div class="form-row">
            <label class="field"><span class="field-label">Marca</span><input name="marca" required value="${esc(f.marca)}" /></label>
            <label class="field"><span class="field-label">Modelo</span><input name="modelo" required value="${esc(f.modelo)}" /></label>
          </div>
          <div class="form-row">
            <label class="field"><span class="field-label">Año</span><input type="number" name="anio" value="${esc(f.anio)}" /></label>
            <label class="field"><span class="field-label">Plazas</span><input type="number" name="plazas" value="${esc(f.plazas)}" /></label>
          </div>
          <div class="form-row">
            <label class="field"><span class="field-label">Precio (€)</span><input type="number" name="precio" value="${esc(f.precio)}" /></label>
            <label class="field"><span class="field-label">Kilómetros</span><input type="number" name="km" value="${esc(f.km)}" /></label>
          </div>
          <div class="form-row">
            <label class="field"><span class="field-label">Tipo</span>
              <select name="tipo">${TIPOS_VEHICULO.map((t) => `<option value="${t}" ${t === f.tipo ? "selected" : ""}>${t}</option>`).join("")}</select>
            </label>
            <label class="field"><span class="field-label">Estado</span>
              <select name="estado">${ESTADOS_VEHICULO.map((e) => `<option value="${e}" ${e === f.estado ? "selected" : ""}>${e}</option>`).join("")}</select>
            </label>
          </div>
          <label class="field"><span class="field-label">Notas</span><textarea name="notas">${esc(f.notas)}</textarea></label>
          <div class="form-actions">
            <button type="button" class="btn-secondary" id="cancelar-veh">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderPedidoModal() {
  const inicial = state.modalPedido === "nuevo" ? null : state.modalPedido;
  const f = inicial || { cliente: "", marcaModelo: "", proveedor: "", fechaPedido: new Date().toISOString().slice(0, 10), fechaEntrega: "", precio: "", anticipo: "", estado: "Pedido realizado", notas: "" };
  return `
    <div class="modal-overlay" id="overlay-pedido">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">${inicial ? "Editar pedido" : "Nuevo pedido"}</h2>
          <button class="icon-btn" id="cerrar-pedido">${ICO.x}</button>
        </div>
        <form class="form" id="form-pedido">
          ${inicial ? `<input type="hidden" name="id" value="${inicial.id}" />` : ""}
          <label class="field"><span class="field-label">Cliente</span>
            <input name="cliente" required list="lista-clientes" value="${esc(f.cliente)}" placeholder="Nombre del cliente" />
            <datalist id="lista-clientes">${state.leads.map((l) => `<option value="${esc(l.nombre)}"></option>`).join("")}</datalist>
          </label>
          <label class="field"><span class="field-label">Marca y modelo pedidos</span><input name="marcaModelo" required value="${esc(f.marcaModelo)}" placeholder="Ej. Benimar Mileo 202" /></label>
          <label class="field"><span class="field-label">Proveedor / fábrica</span><input name="proveedor" value="${esc(f.proveedor)}" /></label>
          <div class="form-row">
            <label class="field"><span class="field-label">Fecha del pedido</span><input type="date" name="fechaPedido" value="${esc(f.fechaPedido)}" /></label>
            <label class="field"><span class="field-label">Entrega estimada</span><input type="date" name="fechaEntrega" value="${esc(f.fechaEntrega)}" /></label>
          </div>
          <div class="form-row">
            <label class="field"><span class="field-label">Precio (€)</span><input type="number" name="precio" value="${esc(f.precio)}" /></label>
            <label class="field"><span class="field-label">Anticipo pagado (€)</span><input type="number" name="anticipo" value="${esc(f.anticipo)}" /></label>
          </div>
          <label class="field"><span class="field-label">Estado</span>
            <select name="estado">${PEDIDO_ESTADOS.map((e) => `<option value="${e}" ${e === f.estado ? "selected" : ""}>${e}</option>`).join("")}</select>
          </label>
          <label class="field"><span class="field-label">Notas</span><textarea name="notas">${esc(f.notas)}</textarea></label>
          <div class="form-actions">
            <button type="button" class="btn-secondary" id="cancelar-pedido">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// ---------- Event wiring ----------
function attachEvents() {
  document.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.onclick = () => { state.vista = btn.dataset.nav; render(); };
  });

  const fab = document.getElementById("fab");
  if (fab) fab.onclick = () => {
    if (state.vista === "leads") { state.modalLead = "nuevo"; }
    if (state.vista === "inventario") { state.modalVehiculo = "nuevo"; state.fotosTmp = []; }
    if (state.vista === "pedidos") { state.modalPedido = "nuevo"; }
    render();
  };

  // Leads view
  document.querySelectorAll("[data-edit-lead]").forEach((b) => b.onclick = () => {
    state.modalLead = state.leads.find((l) => l.id === b.dataset.editLead);
    render();
  });
  document.querySelectorAll("[data-del-lead]").forEach((b) => b.onclick = () => borrarLead(b.dataset.delLead));
  document.querySelectorAll("[data-stage-lead]").forEach((s) => s.onchange = () => cambiarEtapa(s.dataset.stageLead, s.value));

  // Inventario view
  const busquedaInput = document.getElementById("busqueda");
  if (busquedaInput) {
    busquedaInput.oninput = (e) => {
      state.busqueda = e.target.value;
      const content = document.getElementById("content");
      content.innerHTML = renderInventarioView();
      attachEvents();
      document.getElementById("busqueda").focus();
      const val = document.getElementById("busqueda").value;
      document.getElementById("busqueda").setSelectionRange(val.length, val.length);
    };
  }
  document.querySelectorAll("[data-filtro-estado]").forEach((b) => b.onclick = () => {
    state.filtroEstado = b.dataset.filtroEstado;
    const content = document.getElementById("content");
    content.innerHTML = renderInventarioView();
    attachEvents();
  });
  document.querySelectorAll("[data-edit-veh]").forEach((b) => b.onclick = () => {
    state.modalVehiculo = state.inventario.find((v) => v.id === b.dataset.editVeh);
    state.fotosTmp = [...(state.modalVehiculo.fotos || [])];
    render();
  });
  document.querySelectorAll("[data-del-veh]").forEach((b) => b.onclick = () => borrarVehiculo(b.dataset.delVeh));

  // Pedidos view
  document.querySelectorAll("[data-filtro-estado-pedido]").forEach((b) => b.onclick = () => {
    state.filtroEstadoPedido = b.dataset.filtroEstadoPedido;
    const content = document.getElementById("content");
    content.innerHTML = renderPedidosView();
    attachEvents();
  });
  document.querySelectorAll("[data-edit-pedido]").forEach((b) => b.onclick = () => {
    state.modalPedido = state.pedidos.find((p) => p.id === b.dataset.editPedido);
    render();
  });
  document.querySelectorAll("[data-del-pedido]").forEach((b) => b.onclick = () => borrarPedido(b.dataset.delPedido));
  document.querySelectorAll("[data-stage-pedido]").forEach((s) => s.onchange = () => cambiarEstadoPedido(s.dataset.stagePedido, s.value));

  // Pedido modal
  const overlayPedido = document.getElementById("overlay-pedido");
  if (overlayPedido) {
    overlayPedido.onclick = (e) => { if (e.target === overlayPedido) { state.modalPedido = null; render(); } };
    document.getElementById("cerrar-pedido").onclick = () => { state.modalPedido = null; render(); };
    document.getElementById("cancelar-pedido").onclick = () => { state.modalPedido = null; render(); };
    document.getElementById("form-pedido").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const datos = Object.fromEntries(fd.entries());
      if (!datos.cliente || !datos.cliente.trim() || !datos.marcaModelo || !datos.marcaModelo.trim()) return;
      guardarPedido(datos);
    };
  }

  // Lead modal
  const overlayLead = document.getElementById("overlay-lead");
  if (overlayLead) {
    overlayLead.onclick = (e) => { if (e.target === overlayLead) { state.modalLead = null; render(); } };
    document.getElementById("cerrar-lead").onclick = () => { state.modalLead = null; render(); };
    document.getElementById("cancelar-lead").onclick = () => { state.modalLead = null; render(); };
    document.getElementById("form-lead").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const datos = Object.fromEntries(fd.entries());
      if (!datos.nombre || !datos.nombre.trim()) return;
      guardarLead(datos);
    };
  }

  // Vehicle modal
  const overlayVeh = document.getElementById("overlay-veh");
  if (overlayVeh) {
    overlayVeh.onclick = (e) => { if (e.target === overlayVeh) { state.modalVehiculo = null; state.fotosTmp = []; render(); } };
    document.getElementById("cerrar-veh").onclick = () => { state.modalVehiculo = null; state.fotosTmp = []; render(); };
    document.getElementById("cancelar-veh").onclick = () => { state.modalVehiculo = null; state.fotosTmp = []; render(); };

    const inputFotos = document.getElementById("input-fotos");
    inputFotos.onchange = async (e) => {
      const files = Array.from(e.target.files || []).slice(0, 5 - state.fotosTmp.length);
      for (const file of files) {
        try {
          const dataUrl = await resizeImage(file);
          state.fotosTmp.push(dataUrl);
        } catch (err) { console.error("No se pudo procesar la foto", err); }
      }
      refreshVehiculoModalPhotos();
    };

    document.querySelectorAll("[data-rm-photo]").forEach((b) => b.onclick = () => {
      state.fotosTmp.splice(Number(b.dataset.rmPhoto), 1);
      refreshVehiculoModalPhotos();
    });

    document.getElementById("form-veh").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const datos = Object.fromEntries(fd.entries());
      if (!datos.marca || !datos.marca.trim() || !datos.modelo || !datos.modelo.trim()) return;
      datos.fotos = [...state.fotosTmp];
      guardarVehiculo(datos);
    };
  }
}

function refreshVehiculoModalPhotos() {
  const picker = document.getElementById("photo-picker");
  if (!picker) return;
  picker.innerHTML = `
    ${state.fotosTmp.map((f, i) => `
      <div class="photo-thumb"><img src="${f}" /><button type="button" class="remove" data-rm-photo="${i}">${ICO.x}</button></div>
    `).join("")}
    ${state.fotosTmp.length < 5 ? `
      <label class="btn-photo" style="flex-shrink:0;width:72px;height:72px;flex-direction:column;">
        ${ICO.camera}
        <input type="file" accept="image/*" multiple id="input-fotos" style="display:none" />
      </label>` : ""}
  `;
  const inputFotos = document.getElementById("input-fotos");
  if (inputFotos) {
    inputFotos.onchange = async (e) => {
      const files = Array.from(e.target.files || []).slice(0, 5 - state.fotosTmp.length);
      for (const file of files) {
        try {
          const dataUrl = await resizeImage(file);
          state.fotosTmp.push(dataUrl);
        } catch (err) { console.error("No se pudo procesar la foto", err); }
      }
      refreshVehiculoModalPhotos();
    };
  }
  document.querySelectorAll("[data-rm-photo]").forEach((b) => b.onclick = () => {
    state.fotosTmp.splice(Number(b.dataset.rmPhoto), 1);
    refreshVehiculoModalPhotos();
  });
}

init();
