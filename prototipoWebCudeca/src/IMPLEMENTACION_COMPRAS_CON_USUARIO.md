# Implementación de Compras Vinculadas a Usuarios

## Resumen de Cambios

Se ha implementado el sistema de vinculación de compras con usuarios autenticados, permitiendo tanto compras con sesión activa como compras anónimas.

## Modificaciones Realizadas

### 1. Esquema de Base de Datos

**Archivo**: `/MODIFICAR_USUARIO_NULLABLE.sql`

Se han hecho nullable los campos `usuario_id` en las siguientes tablas:
- `compra` - Permite compras sin usuario autenticado
- `entrada` - Permite entradas sin usuario asociado
- `donacion` - Permite donaciones sin usuario asociado

**IMPORTANTE**: Ejecutar este script SQL en el editor SQL de Supabase antes de probar el sistema:

```sql
ALTER TABLE public.compra ALTER COLUMN usuario_id DROP NOT NULL;
ALTER TABLE public.entrada ALTER COLUMN usuario_id DROP NOT NULL;
ALTER TABLE public.donacion ALTER COLUMN usuario_id DROP NOT NULL;
```

### 2. Servidor Edge Function

**Archivo**: `/supabase/functions/server/index.tsx`

#### Cambios en la ruta POST `/make-server-e30de6da/purchases`:

1. **Detección de usuario autenticado**:
   - Lee el header `Authorization` de la petición
   - Si contiene `Bearer {userId}`, verifica que el usuario existe
   - Si es válido, asocia la compra a ese usuario

2. **Gestión de compras sin usuario**:
   - Si NO hay usuario autenticado pero se proporciona email, busca o crea un usuario temporal
   - Si no se puede crear el usuario, la compra continúa con `usuario_id = null`
   - Los registros en `compra`, `entrada` y `donacion` se crean con el `usuario_id` correspondiente (puede ser null)

3. **Logs mejorados**:
   - Informa claramente si la compra está vinculada a un usuario autenticado, temporal, o es anónima
   - Facilita el debugging y seguimiento de las operaciones

### 3. Componente PurchaseFlow

**Archivo**: `/components/PurchaseFlow.tsx`

#### Cambios en el método `handleCompletePurchase`:

1. **Envío del userId en el header**:
   ```typescript
   if (user && user.id) {
     headers['Authorization'] = `Bearer ${user.id}`;
   }
   ```

2. **Flujo de compra**:
   - Si el usuario está autenticado, envía su ID en el header Authorization
   - Si NO está autenticado, no envía el header (compra anónima o con usuario temporal)
   - El servidor decide cómo procesar la compra según el contexto

### 4. Contexto de Autenticación

**Archivo**: `/contexts/AuthContext.tsx`

#### Cambios en el método `signOut`:

1. **Redirección automática al logout**:
   ```typescript
   window.dispatchEvent(new CustomEvent('navigate', { 
     detail: { href: '/' } 
   }));
   ```

2. **Funcionalidad**:
   - Limpia la sesión del usuario (setUser(null))
   - Elimina el userId del localStorage
   - Redirige automáticamente a la pantalla principal

## Flujos de Compra

### Escenario 1: Usuario Autenticado
1. Usuario hace login
2. Navega a un evento y hace clic en "Comprar entrada"
3. Completa el flujo de compra
4. El sistema envía `Authorization: Bearer {userId}` al servidor
5. El servidor asocia la compra al usuario autenticado
6. La compra queda vinculada en la base de datos con `usuario_id = {id del usuario}`

### Escenario 2: Usuario No Autenticado (con datos)
1. Usuario navega directamente a un evento sin login
2. Hace clic en "Comprar entrada"
3. Completa el formulario con su email, nombre, etc.
4. El servidor busca si existe un usuario con ese email
5. Si existe, vincula la compra a ese usuario
6. Si NO existe, crea un usuario temporal y vincula la compra
7. La compra queda vinculada en la base de datos

### Escenario 3: Compra Completamente Anónima
1. Usuario navega a un evento sin login
2. Completa el formulario de compra
3. Si por alguna razón no se puede crear/encontrar el usuario, la compra continúa
4. La compra se guarda con `usuario_id = null`
5. Las entradas y donaciones también se guardan con `usuario_id = null`

## Beneficios

1. **Flexibilidad**: Permite tanto compras autenticadas como anónimas
2. **Trazabilidad**: Las compras de usuarios registrados están claramente vinculadas
3. **Sin fricción**: No se obliga al usuario a registrarse para comprar
4. **Datos valiosos**: Se capturan emails y datos de contacto incluso en compras anónimas
5. **Experiencia mejorada**: Logout automático redirige a la pantalla principal

## Pruebas Recomendadas

### Probar Compra con Usuario Autenticado
1. Registrar un nuevo usuario o hacer login con uno existente
2. Navegar a un evento
3. Completar una compra
4. Verificar en Supabase que la tabla `compra` tiene el `usuario_id` correcto

### Probar Compra sin Usuario
1. Asegurarse de NO tener sesión activa (logout si es necesario)
2. Navegar a un evento
3. Completar una compra con un email válido
4. Verificar en Supabase:
   - Si el email existía, la compra se vincula al usuario existente
   - Si el email es nuevo, se crea un usuario temporal
   - Si hay error, la compra se guarda con `usuario_id = null`

### Probar Logout
1. Iniciar sesión con cualquier usuario
2. Navegar a cualquier página (evento, cuenta, etc.)
3. Hacer click en "Cerrar sesión"
4. Verificar que se redirige automáticamente a la pantalla principal

## Notas Técnicas

### Seguridad
- El `usuario_id` en el header Authorization es solo el ID numérico
- El servidor verifica que el usuario existe antes de aceptarlo
- No se envían contraseñas ni tokens sensibles en las peticiones de compra

### Base de Datos
- Los campos `usuario_id` ahora son nullable (NULL permitido)
- Las foreign keys siguen activas pero permiten valores NULL
- No se han eliminado ni modificado restricciones de integridad referencial

### Compatibilidad
- El sistema es compatible con compras existentes (todas tienen usuario_id)
- Las nuevas compras pueden tener o no usuario_id
- No se requieren migraciones de datos

## Mantenimiento Futuro

### Si se necesita identificar compras anónimas:
```sql
SELECT * FROM compra WHERE usuario_id IS NULL;
```

### Si se necesita asociar compras anónimas a un usuario:
```sql
UPDATE compra 
SET usuario_id = {id_usuario} 
WHERE usuario_id IS NULL AND /* criterio de búsqueda */;
```

### Si se necesita estadísticas de compras:
```sql
-- Compras con usuario autenticado
SELECT COUNT(*) FROM compra WHERE usuario_id IS NOT NULL;

-- Compras anónimas
SELECT COUNT(*) FROM compra WHERE usuario_id IS NULL;
```
