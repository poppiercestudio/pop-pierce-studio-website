# 💻 Uso del Panel de Administración en Múltiples Computadoras

## ✅ ¿Funciona en Otras Computadoras?

**¡Sí!** El sistema está diseñado para funcionar en cualquier computadora. Los cambios se guardan en GitHub y se sincronizan automáticamente entre todas las computadoras.

## 🚀 Configuración Inicial en una Nueva Computadora

### Paso 1: Obtener los Archivos

Tienes dos opciones:

**Opción A: Clonar desde GitHub (Recomendado)**
```bash
git clone https://github.com/poppiercestudio/pop-pierce-studio-website.git
```

**Opción B: Descargar como ZIP**
1. Ve a tu repositorio en GitHub
2. Haz clic en "Code" → "Download ZIP"
3. Extrae los archivos en la nueva computadora

### Paso 2: Configurar el Token de GitHub

**IMPORTANTE**: Cada computadora necesita configurar el token una vez para poder hacer cambios.

1. **Abre `admin.html`** en el navegador de la nueva computadora
2. **Inicia sesión** con tu contraseña de administrador
3. **Ve a la pestaña "Configuración"**
4. **Pega tu token de GitHub** (el mismo token que usaste en la otra computadora)
5. **Haz clic en "Guardar Token"**

> **Nota**: El token se guarda localmente en cada navegador. Si usas un navegador diferente, necesitarás configurarlo de nuevo.

### Paso 3: Verificar que Funciona

1. **Abre la página principal** (`index.html`)
2. **Verifica que se carguen los datos** desde GitHub automáticamente
3. **Haz un cambio de prueba** desde el panel de administración
4. **Verifica que se guarde en GitHub** (deberías ver un mensaje de éxito)

## 🔄 ¿Cómo Funciona la Sincronización?

### Lectura de Datos (Automática)

- **La página principal** (`index.html`) carga automáticamente los datos desde GitHub Pages
- **El panel de administración** carga automáticamente los datos desde GitHub al abrirse
- **No necesitas hacer nada**, los datos se sincronizan automáticamente

### Escritura de Cambios (Requiere Token)

- **Para hacer cambios**, necesitas tener el token de GitHub configurado
- **Los cambios se guardan automáticamente** en GitHub cuando los haces
- **Todas las computadoras** verán los cambios en 1-2 minutos

## 📋 Escenarios de Uso

### Escenario 1: Primera Vez en una Nueva Computadora

1. Descarga/clona los archivos
2. Abre `admin.html`
3. Configura el token de GitHub
4. ¡Listo! Ya puedes hacer cambios

### Escenario 2: Solo Ver la Página Web

- **No necesitas configurar nada**
- Simplemente abre `index.html` en el navegador
- Los datos se cargarán automáticamente desde GitHub

### Escenario 3: Hacer Cambios desde Diferentes Computadoras

1. **Computadora A**: Hace un cambio → Se guarda en GitHub
2. **Computadora B**: Abre el panel → Carga automáticamente los cambios más recientes
3. **Computadora B**: Hace otro cambio → Se guarda en GitHub
4. **Computadora A**: Recarga el panel → Ve los cambios de la Computadora B

> **Nota**: Si dos personas hacen cambios al mismo tiempo, GitHub manejará los conflictos automáticamente con reintentos.

## ⚠️ Limitaciones y Consideraciones

### 1. Token por Computadora

- El token se guarda en `localStorage` del navegador
- Cada computadora/navegador necesita configurar el token una vez
- Si limpias el caché del navegador, perderás el token y tendrás que configurarlo de nuevo

### 2. Uso Local vs. GitHub Pages

**Si abres los archivos localmente** (file://):
- ✅ Puedes leer los datos desde GitHub Pages
- ✅ Puedes hacer cambios si tienes el token configurado
- ⚠️ Algunos navegadores pueden tener restricciones CORS

**Si usas GitHub Pages** (https://tu-usuario.github.io/...):
- ✅ Todo funciona perfectamente
- ✅ No hay restricciones CORS
- ✅ Recomendado para producción

### 3. Sincronización Automática

- Los cambios se sincronizan automáticamente cuando abres el panel
- Si haces cambios en una computadora, espera 1-2 minutos antes de abrir el panel en otra
- Puedes forzar la recarga presionando F5 o Ctrl+R

## 🔒 Seguridad

### Compartir el Token

- **Puedes usar el mismo token** en múltiples computadoras
- **No compartas el token** con personas que no deberían tener acceso
- **Si alguien deja de trabajar contigo**, revoca el token y crea uno nuevo

### Revocar un Token

1. Ve a GitHub Settings → Developer settings → Personal access tokens
2. Encuentra el token que quieres revocar
3. Haz clic en "Revoke"
4. Crea un nuevo token y configúralo en todas las computadoras

## 🛠️ Solución de Problemas

### Los cambios no aparecen en otra computadora

1. **Verifica que el token esté configurado** en ambas computadoras
2. **Espera 1-2 minutos** (GitHub Pages tarda en actualizar)
3. **Recarga la página** con Ctrl+F5 (forzar recarga)
4. **Verifica en GitHub** que el commit se haya hecho correctamente

### Error al cargar datos desde GitHub

1. **Verifica tu conexión a internet**
2. **Verifica que GitHub Pages esté activado** en tu repositorio
3. **Abre la consola del navegador** (F12) para ver errores detallados
4. **Intenta acceder directamente** a: `https://poppiercestudio.github.io/pop-pierce-studio-website/data.json`

### El token no se guarda

1. **Verifica que JavaScript esté habilitado** en tu navegador
2. **Verifica que no estés en modo incógnito/privado** (algunos navegadores bloquean localStorage)
3. **Intenta en otro navegador** para descartar problemas del navegador

## 📱 Uso en Móviles/Tablets

- **Sí, funciona en móviles y tablets**
- Abre `admin.html` en el navegador móvil
- Configura el token igual que en una computadora
- Los cambios funcionan igual que en desktop

## ✅ Checklist para Nueva Computadora

- [ ] Archivos descargados/clonados
- [ ] `admin.html` abre correctamente
- [ ] Puedo iniciar sesión con la contraseña
- [ ] Token de GitHub configurado
- [ ] Verifico que los datos se carguen desde GitHub
- [ ] Hago un cambio de prueba
- [ ] Verifico que el cambio se guarde en GitHub
- [ ] Verifico que el cambio aparezca en la página principal

## 🎉 ¡Listo!

Una vez configurado, puedes usar el panel de administración desde cualquier computadora. Todos los cambios se sincronizan automáticamente a través de GitHub.

---

**¿Necesitas ayuda?** Revisa la consola del navegador (F12) para ver mensajes de error detallados.
