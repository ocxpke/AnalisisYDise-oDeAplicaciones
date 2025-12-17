# CUDECA - Plataforma de Venta de Entradas, Rifas y Sorteos

Sistema web completo para la Fundación CUDECA que permite gestionar eventos, vender entradas, rifas y sorteos solidarios.

## 🎯 Características Principales

### Para Usuarios
- **Listado de Eventos**: Browse eventos con filtros por tipo (rifa, sorteo, cena, concierto)
- **Compra de Entradas**: Proceso guiado paso a paso con múltiples métodos de pago
- **Rifas y Sorteos**: Selección de números manual o automática
- **Entradas Numeradas**: Selector visual de asientos por zonas con precios diferentes
- **Donaciones**: Opción de añadir donación adicional durante la compra
- **Mi Cuenta**: Gestión de entradas compradas, donaciones y datos personales
- **Modo Fácil**: Interfaz simplificada para personas mayores con tipografía grande y navegación guiada
- **Bilingüe**: Soporte completo en Español e Inglés

### Para Administradores
- **Panel de Administración**: Crear y gestionar eventos
- **Lista de Asistentes**: Ver y exportar compradores
- **Exportación CSV**: Descarga de datos para análisis
- **Cancelación de Eventos**: Con notificación automática a compradores
- **Estadísticas**: Visualización de ventas y recaudación

### Para Staff
- **Lector QR**: Validación de entradas en tiempo real
- **Control de Acceso**: Verificación de tickets válidos/usados
- **Entrada Manual**: Búsqueda por código en caso de problemas con QR
- **Historial**: Registro de todos los escaneos

## 🎨 Diseño

El sistema sigue el estilo visual de CUDECA:
- **Colores**: Verde CUDECA (#00A859) como color principal
- **Tipografía**: Clara y legible, con soporte para tamaños aumentados
- **Interfaz**: Minimalista, moderna y accesible
- **Responsive**: Adaptado a desktop, tablet y móvil

## 📱 Pantallas Incluidas

1. **Home** - Listado de eventos con filtros y tarjetas
2. **Detalle de Evento** - Información completa y botón de compra
3. **Flujo de Compra**:
   - Paso 1: Selección de entradas/números
   - Paso 2: Datos personales
   - Paso 3: Método de pago
   - Paso 4: Confirmación con QR
4. **Mi Cuenta** - Perfil, entradas y donaciones
5. **Panel de Administración** - Gestión de eventos y asistentes
6. **Lector QR** - Validación de entradas
7. **Dona Ahora** - Página de donaciones
8. **Hazte Socio** - Formulario de membresía

## 🔒 Cumplimiento Legal

- **RGPD**: Gestión de consentimiento de datos
- **Cookies**: Banner de cookies con opciones personalizables
- **Privacidad**: Enlaces a políticas de privacidad y cookies
- **Transparencia**: Información clara sobre uso de datos

## 🛠 Tecnologías

- **React** - Framework principal
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Lucide React** - Iconos
- **Sonner** - Notificaciones

## 🚀 Funcionalidades Especiales

### Modo Simplificado
Activable mediante botón flotante:
- Tipografía aumentada (2-3x)
- Botones más grandes
- Navegación simplificada
- Ideal para personas mayores

### Sistema de Tickets con QR
- Generación automática de códigos únicos
- Visualización de QR en confirmación
- Descarga en PDF
- Envío por email
- Validación en tiempo real

### Gestión de Rifas
- Números del 1 al X configurables
- Selección manual o automática
- Visualización de disponibilidad
- Precio por número

### Entradas con Asientos
- Mapa visual del recinto
- Zonas con diferentes precios
- Selector de cantidad por zona
- Colores identificativos

## 📊 Datos de Ejemplo

El sistema incluye 4 eventos de ejemplo:
1. Concierto de Dani Martín
2. Cena Benéfica Anual
3. Gran Rifa Solidaria
4. Marcha Solidaria

## 🎯 Próximas Mejoras

- Integración real con pasarelas de pago (Stripe, PayPal, Bizum)
- Conexión con CRM para identificación de socios
- Sistema de notificaciones por email/SMS
- Panel de estadísticas avanzadas
- Generación automática de certificados de donación
- Sistema de reembolsos automático

## 💡 Navegación Rápida

En la página principal (Home) hay dos botones en la esquina inferior izquierda para acceso rápido:
- **Admin Panel** - Gestión de eventos
- **QR Scanner** - Validación de entradas

## 📝 Notas

- Los métodos de pago son simulados (no requieren datos reales)
- Los códigos QR son únicos pero no implementan un sistema de verificación backend
- Las notificaciones y emails son simulados
- El CRM es una integración futura

---

**Fundación CUDECA** - Cuidados Paliativos con Corazón
