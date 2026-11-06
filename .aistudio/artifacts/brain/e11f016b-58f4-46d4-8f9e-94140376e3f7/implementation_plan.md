# Mercado Exprés Mobile & APK Ready PWA

Modernización integral del prototipo HTML de **Mercado Exprés** para convertirlo en una Progressive Web App (PWA) de nivel producción, instalable directamente en dispositivos Android y iOS, con soporte offline, geolocalización GPS para entregas a domicilio, catálogo categorizado con imágenes reales, panel administrativo móvil táctil, y un asistente exportador integrado para empaquetar y compilar el archivo `.apk` mediante Trusted Web Activity (TWA) o Capacitor.

---

## Decisiones Críticas Confirmadas

> [!IMPORTANT]
> A partir de tus respuestas en la fase de clarificación, se han establecido las siguientes definiciones de producto y arquitectura:

- **Empaquetado Android**: PWA instalable de inmediato en teléfonos Android mediante prompt nativo (`beforeinstallprompt`) y modo pantalla completa (`standalone`), con módulo integrado para **descargar/generar la configuración de compilación de APK** (TWA manifest / Capacitor Android build guide y descarga de recursos empaquetados).
- **Catálogo & Experiencia de Pedidos**: Expansión a catálogo enriquecido con fotos de alta calidad, pestañas de categorías interactivas (Frutas y Verduras, Carnes y Pollos, Abarrotes, Platos Preparados, Bebidas), carrito con cálculo dinámico (Recojo o Delivery con selector de GPS/dirección), estados de pedido y notificación formateada por WhatsApp.
- **Persistencia**: Almacenamiento local optimizado (`localStorage` estructurado) con persistencia offline, exportación de reportes de ventas CSV, copia de seguridad JSON del catálogo y sincronización con Service Worker.

---

## 1. Visión General del Producto

- **Propósito**: Transformar la tienda de autoservicio de barrio en una aplicación móvil completa y autónoma que funcione tanto para clientes que hacen compras rápidas como para el comerciante/administrador que gestiona pedidos en tiempo real.
- **Público Objetivo**: Clientes de compras cotidianas que desean pedir rápido por móvil y recibirlo en casa o recoger en tienda, y administradores de tienda que atienden pedidos en ventanilla o delivery.
- **Valor Principal**: Cero fricción de instalación (funciona sin descargas pesadas desde el navegador y como icono nativo en el teléfono), operatividad garantizada incluso si se cae la conexión a internet, y puente inmediato para compilar el archivo APK final.

---

## 2. Experiencia de Usuario y Diseño Visual

### Flujos Clave de Usuario

1. **Flujo del Cliente (Compra & Checkout)**:
   - **Inicio & Exploración**: Cabecera limpia con buscador en vivo, selector de categorías táctil y lista de productos con fotografía, precio y control táctil para sumar al carrito.
   - **Carrito Deslizable / Hoja Inferior (Bottom Sheet)**: Botón flotante accesible en la zona natural del pulgar. Despliegue de hoja inferior con desglose de productos, cantidades (+ / -), método de entrega con botón de **GPS automático ("Usar mi ubicación actual")** y selección de método de pago (Efectivo, Yape/Plin, Tarjeta).
   - **Confirmación Inmediata**: Creación de orden con número de ticket único, almacenamiento en historial y botón de enlace directo a WhatsApp con mensaje estructurado listo para enviar.

2. **Flujo Administrativo (Panel de Control Protegido)**:
   - Acceso con PIN numérico de seguridad.
   - **Pestaña Pedidos**: Tarjetas de órdenes con actualización de estado en un toque (*Pendiente*, *Preparando*, *En Camino*, *Entregado*), botón para enviar mensaje de actualización automática a WhatsApp del cliente.
   - **Pestaña Catálogo**: Editor visual con creación/edición de productos, selección de categoría, precio, unidad (Kg, Unidad, Litro) e imagen/emoji.
   - **Pestaña Métricas & Exportación**: Ventas acumuladas, pedidos totales, ticket promedio, descarga de reporte CSV para Excel y exportación de respaldo.

3. **Flujo de Instalación PWA y Generador de APK**:
   - **Banner de Instalación Nativa**: Botón destacado en cabecera "Instalar App Móvil" que activa el instalador oficial de Android.
   - **Módulo Exportador APK**: Pestaña/Modal especial dentro de la app con el manifiesto completo, iconos Android HD (192x192, 512x512 maskable), enlace a Bubblewrap / PWABuilder / Capacitor y archivo ZIP descargable con el proyecto Android listo para compilar con un clic.

### Identidad Visual y Estilo

- **Aesthetic Direction**: *Fresh Market & Modern Retail* — Limpio, táctil, vibrante y confiable. Tonos verdes orgánicos con acentos naranja energéticos para botones de acción.
- **Paleta de Colores**:
  - Lienzo: Blanco nítido y gris suave (`#f8fafc`) con modo nocturno equilibrado (`#0f172a`).
  - Marca Primaria: Verde mercado (`#16a34a` / `#15803d`).
  - Acento de Acción (CTA): Naranja cálido (`#ea580c` / `#f97316`) para el carrito y confirmaciones.
  - Superficies: Tarjetas con bordes ultra-finos (`border-slate-200/80`), sombras suaves y esquinas redondeadas ergonómicas (`rounded-2xl`).
- **Tipografía**:
  - Titulares & Marca: *Plus Jakarta Sans* (moderna, legible, amigable).
  - Precios & Cifras: Numerales tabulares monoespaciados (`font-mono tabular-nums`) para alineación perfecta de importes monetarios en Soles (S/).
- **Ergonomía Táctil**:
  - Todos los botones y selectores cuentan con un área de contacto mínima de $44 \times 44\text{px}$.
  - Barra de acción y carrito fijados en la zona inferior de alcance del pulgar sin sobrepasar el 15% de la altura de la pantalla.

---

## 3. Decisiones de Producto y Arquitectura Técnica

- **Framework**: React 19 + TypeScript + Tailwind CSS v4 para máximo rendimiento y responsividad fluida.
- **Soporte PWA & Offline**:
  - Configuración con `vite-plugin-pwa` generando Web App Manifest (`manifest.webmanifest`) con `display: 'standalone'`, `orientation: 'portrait'`, `theme_color: '#16a34a'` e iconos adaptativos maskable.
  - Service Worker con Workbox configurado con `autoUpdate` para almacenamiento en caché de código y recursos.
- **Geolocalización GPS Nativa**:
  - API `navigator.geolocation` para autocompletar la dirección y generar coordenadas con enlace a Google Maps en el pedido de WhatsApp, facilitando la entrega al repartidor.
- **Exportador APK (TWA / Capacitor Ready)**:
  - Generador dinámico de paquete de configuración para Android (`manifest.json`, iconos SVG/PNG renderizados en canvas, y guía rápida de generación de `.apk` con un clic usando Google PWA Builder o Capacitor).

---

## 4. Diagrama de Arquitectura y Componentes

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MERCADO EXPRÉS APP                             │
│                     (Vite + React 19 + PWA)                            │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌───────────────────────────────┐           ┌────────────────────────────┐
│      VISTA CLIENTE (Store)    │           │    VISTA ADMIN (Dashboard) │
│ • Header (Brand + PWA Install)│           │ • Autenticación PIN (1234) │
│ • Buscador + Filtro Categorías│           │ • Tab Pedidos (Estados/WA) │
│ • Grid de Productos + Fotos   │           │ • Tab Catálogo (CRUD)      │
│ • Bottom Sheet Carrito        │           │ • Tab Métricas & CSV       │
│ • GPS Location Picker         │           │ • Generador / Exportar APK │
└──────────────┬────────────────┘           └─────────────┬──────────────┘
               │                                          │
               └────────────────────┬─────────────────────┘
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │                   CAPA DE ESTADO & SERVICIOS            │
       │ • useStoreData (Productos, Carrito, Pedidos, Métricas)  │
       │ • usePWAInstall (beforeinstallprompt + standalone mode) │
       │ • useGeolocation (Coordenadas y link Maps para delivery)│
       │ • LocalStorage Engine (Persistencia offline automática) │
       │ • Service Worker (VitePWA precaching y cache offline)   │
       └─────────────────────────────────────────────────────────┘
```

---

## 5. Fases de Ejecución

1. **Configuración de Dependencias & PWA**:
   - Instalación de `vite-plugin-pwa`.
   - Creación de iconos PWA vectoriales e imágenes de productos en `/public`.
   - Configuración de `vite.config.ts`, `manifest`, `index.html` (metatags Android/iOS) y `tsconfig.json`.
2. **Desarrollo de Modelos & Datos**:
   - Estructuración de tipos TypeScript para productos, categorías, carrito y órdenes.
   - Datos iniciales mejorados con categorías, descripciones y precios.
3. **Desarrollo de Componentes Frontend**:
   - Cabecera con selector de vista (Cliente / Admin) y botón de instalación PWA.
   - Catálogo interactivo con filtrado rápido y búsqueda en vivo.
   - Carrito con cálculo de delivery, captura de GPS y confirmación por WhatsApp.
   - Panel de control con métricas en tiempo real, cambio de estados de pedido y exportación a Excel.
   - Modal exportador de APK con descarga de recursos y guía rápida.
4. **Verificación & Pruebas**:
   - Compilación con `compile_applet` y validación con `lint_applet`.
   - Pruebas de funcionamiento del modo offline, instalación PWA y visualización móvil.
