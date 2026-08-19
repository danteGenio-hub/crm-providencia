# 🚀 ProviServicios Express - CRM & Base de Datos de Prospectos

Documento maestro para la recopilación de información de comercios en Avenida Providencia, categorización de servicios y prospección comercial.

---

## 🛠️ 1. Catálogo General de Servicios y Mantenimientos Básicos

### A. Mantenimiento Físico e Instalaciones Básicas
* **Cortinas metálicas y accesos:** Engrase y lubricación de rieles/cadenas, alineación de candados, pintura de retoque y cambio de chapas básicas.
* **Limpieza técnica de fachada e interiores:** Limpieza de vitrinas, vidrios en altura media, marquesinas, letreros exteriores y gráfica publicitaria.
* **Mantenimiento preventivo menor:** Ajuste de bisagras de puertas, cambio de ampolletas/tubos LED, fijación de repisas o cuadros y reparación básica de grifería.
* **Cuidado de espacios:** Riego y mantenimiento de plantas decorativas, orden de bodegas pequeñas y salas de acopio.

### B. Gestiones, Trámites y Apoyo Logístico (Mandados)
* **Trámites presenciales:** Filas en notarías, pagos de cuentas presenciales, gestiones en bancos, trámites en la Municipalidad (OIRS/Patentes) o SII.
* **Compras e insumos express:** Compra de insumos de aseo, papelería urgente, herramientas o repuestos en ferreterías del sector.
* **Envíos y correspondencia:** Despacho/retiro de encomiendas (Starken, Chilexpress, Correos) y entregas directas a clientes en el eje Providencia.

### C. Apoyo Operativo y Eventual
* **Carga, descarga y orden:** Apoyo en recepción de proveedores, ordenamiento de stock en bodega, armado de cajas y embalaje.
* **Apoyo en temporada:** Montaje/desmontaje de vitrinas de temporada (Navidad, CyberDays, eventos) y pegado de gráfica publicitaria.
* **Retiro de desechos ligeros:** Traslado de cartón acumulado, reciclaje masivo o despeje de cajas hacia puntos limpios.

---

## 🏷️ 2. Segmentación por Rubro, Necesidades y Servicios Sugeridos

### 1. Locales de Comida Rápida, Cafeterías y Restaurantes
* **Necesidad Principal:** Aseo exigente, grasa/polvo constante y rotación rápida en horas peak.
* **Servicios Sugeridos:** Limpieza profunda de vitrinas/ventanales, engrase frecuente de cortinas metálicas, trámites urgentes de insumos y retiro de cartón.
* **Canal Ideal:** Visita presencial breve (de 9:00 a 11:30 AM) o WhatsApp directo al administrador.

### 2. Ópticas, Tiendas de Ropa, Joyerías y Retail
* **Necesidad Principal:** Estética de vitrina impecable y atención al cliente sin interrupciones.
* **Servicios Sugeridos:** Limpieza periódica de vidrios/espejos, fijación de vitrinas, trámites bancarios/notariales para el dueño, despacho express local.
* **Canal Ideal:** Correo electrónico formal o mensaje por Instagram Direct.

### 3. Minimarkets, Almacenes y Bazares
* **Necesidad Principal:** Falta de personal para tareas pesadas y falta de tiempo del dueño para salir.
* **Servicios Sugeridos:** Carga y orden de cajas en bodega, engrase de persianas, trámites presenciales para evitar cerrar la tienda.
* **Canal Ideal:** WhatsApp Business o conversación presencial directa.

### 4. Peluquerías, Centros de Estética y Consultorios
* **Necesidad Principal:** Entorno extremadamente pulcro, iluminación óptima y mantenimiento constante.
* **Servicios Sugeridos:** Cambio de iluminación LED, reparaciones menores de grifería/muebles, compra de insumos semanales, limpieza de letreros.
* **Canal Ideal:** WhatsApp o entrega de tarjeta digital en el local.

---

## 📋 3. Estructura de Registro por Prospecto (Template Data)

Cada comercio que extraigas de Google Maps debe almacenarse con esta plantilla de datos (puedes estructurarlo como objeto JSON o lista en Markdown):

```json
{
  "id": "PROVI-001",
  "nombre_comercio": "Ejemplo Óptica Sol",
  "rubro_categoria": "Ópticas y Retail",
  "direccion_exacta": "Av. Providencia 1234, Local 5",
  "tramo_avenida": "Plaza Baquedano - Pedro de Valdivia",
  "telefono_whatsapp": "+56912345678",
  "email": "contacto@opticasol.cl",
  "instagram": "@opticasol",
  "estado_prospeccion": "Pendiente", 
  "servicios_sugeridos": [
    "Limpieza de vidrios semanal",
    "Engrase de cortina metálica",
    "Trámites notariales"
  ],
  "notas_observaciones": "Local de galería. Atendido por su dueño (Don Marcelo)."
}
