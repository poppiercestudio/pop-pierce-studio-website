# 🔐 Panel de Administración - Pop Pierce Studio

## 📋 Descripción

Sistema de administración completo que te permite gestionar los logos y la galería de imágenes/videos directamente desde la página web, sin necesidad de editar código. **Los cambios se guardan automáticamente en tu repositorio de GitHub y se reflejan en tu página web pública.**

## 🚀 Cómo Acceder

1. **Abre el archivo `admin.html`** en tu navegador
2. **Ingresa la contraseña de administrador**
   - Contraseña por defecto: `admin123`
   - ⚠️ **IMPORTANTE**: Cambia esta contraseña después del primer uso

## ⚙️ Configuración Inicial (IMPORTANTE)

### Para que los cambios se vean en tu página web pública:

1. **Configura GitHub** (solo la primera vez):
   - Ve a la pestaña **"Configuración"** en el panel de administración
   - Sigue las instrucciones para crear un token de GitHub
   - **Ver instrucciones detalladas en `GITHUB_SETUP.md`**

2. **Una vez configurado**:
   - Todos los cambios se guardarán automáticamente en tu repositorio
   - Los visitantes de tu página web verán los cambios en 1-2 minutos
   - No necesitas hacer nada más, todo es automático

### Si NO configuras GitHub:
- Los cambios solo se guardarán en tu navegador local
- Solo tú los verás, los visitantes de tu página web NO los verán
- Es útil para probar, pero no para producción

## 🔑 Cambiar la Contraseña

La contraseña se guarda automáticamente después del primer inicio de sesión. Para cambiarla, necesitas:

1. Abrir la consola del navegador (F12)
2. Ejecutar: `localStorage.removeItem('admin_password_hash')`
3. Cerrar sesión y volver a iniciar con la nueva contraseña

## 📸 Gestión de Logos

### Ubicaciones de Logos

Puedes gestionar 3 logos diferentes:

1. **Logo del Header**: Aparece en la barra de navegación superior
2. **Logo del Hero**: Aparece en la sección principal (hero)
3. **Logo del Footer**: Aparece en el pie de página

### Cómo Cambiar un Logo

1. En el panel de administración, ve a la pestaña **"Logos"**
2. Encuentra el logo que quieres cambiar
3. Haz clic en **"Subir Logo"** o **"Cambiar Logo"**
4. Selecciona una imagen desde tu computadora
5. El logo se actualizará automáticamente en la página principal

### Eliminar un Logo

1. Haz clic en el botón **"Eliminar Logo"**
2. Confirma la eliminación
3. El logo volverá al valor por defecto

## 🖼️ Gestión de Galería

### Agregar Nueva Imagen o Video

1. Ve a la pestaña **"Galería"**
2. Haz clic en **"Agregar Nueva Imagen/Video"**
3. Selecciona el tipo: **Imagen** o **Video**
4. Selecciona el archivo desde tu computadora
5. Escribe una descripción (opcional pero recomendado)
6. Haz clic en **"Agregar a Galería"**

### Editar Elemento de la Galería

1. En la lista de elementos de la galería
2. Modifica la descripción en el cuadro de texto
3. Haz clic en **"Guardar Cambios"**

### Eliminar Elemento

1. Haz clic en el botón **"Eliminar"**
2. Confirma la eliminación

### Reordenar Elementos

- Usa los botones **"Subir"** y **"Bajar"** para cambiar el orden de los elementos

## 💾 Almacenamiento

### ✅ Los cambios se guardan en GitHub (Recomendado)

**Si configuraste GitHub:**
- ✅ Todos los cambios se guardan **automáticamente en tu repositorio de GitHub**
- ✅ Los visitantes de tu página web **verán los cambios en 1-2 minutos**
- ✅ Los cambios son **permanentes y públicos**
- ✅ Puedes ver los cambios en tu repositorio de GitHub
- ✅ Funciona en todos los navegadores y dispositivos

**Si NO configuraste GitHub:**
- Los cambios solo se guardan en tu navegador local (localStorage)
- Solo tú los verás, los visitantes NO los verán
- Los datos persisten incluso después de cerrar el navegador
- ⚠️ **Solo se pierden si**:
  - Limpias manualmente el caché/localStorage del navegador
  - Usas otro navegador o dispositivo diferente
  - Usas modo incógnito/privado

### 🔄 Respaldo y Restauración

Para mayor seguridad, puedes crear respaldos:

1. Ve a la pestaña **"Respaldo"** en el panel de administración
2. Haz clic en **"Descargar Respaldo"** para guardar todos tus datos
3. Guarda el archivo en un lugar seguro
4. Para restaurar, usa **"Restaurar Respaldo"** y selecciona el archivo

**Ventajas del respaldo:**
- Puedes restaurar tus datos en cualquier momento
- Puedes transferir tus datos a otro navegador o dispositivo
- Protección adicional contra pérdida de datos

## 🔄 Sincronización

- Los cambios se reflejan automáticamente en la página principal
- Si tienes ambas ventanas abiertas (admin y página principal), los cambios aparecerán en unos segundos
- Si solo tienes una ventana, recarga la página para ver los cambios

## 📱 Compatibilidad

- Funciona en todos los navegadores modernos (Chrome, Firefox, Safari, Edge)
- Compatible con dispositivos móviles y tablets
- Las imágenes y videos se almacenan como datos base64 en el navegador

## ⚠️ Limitaciones

1. **Tamaño de archivos**: 
   - localStorage tiene un límite de ~5-10MB por dominio
   - Para archivos grandes, considera usar imágenes/videos optimizados

2. **Solo funciona en el mismo navegador**:
   - Los cambios solo se ven en el navegador donde los hiciste
   - Si quieres que los cambios se vean en otros dispositivos, necesitarías un servidor

3. **No es permanente**:
   - Si limpias el caché del navegador, perderás todos los cambios
   - Considera hacer respaldos periódicos

## 🛠️ Solución de Problemas

### No puedo iniciar sesión
- Verifica que estés usando la contraseña correcta
- Si olvidaste la contraseña, limpia localStorage y usa la contraseña por defecto

### Los cambios no aparecen
- Recarga la página principal (F5 o Ctrl+R)
- Verifica que ambos archivos estén en la misma carpeta
- Asegúrate de que JavaScript esté habilitado

### Error al subir archivos
- Verifica que el archivo sea una imagen (JPG, PNG, GIF) o video (MP4)
- Intenta con un archivo más pequeño
- Verifica que tengas espacio en localStorage

## 📞 Soporte

Si tienes problemas o preguntas, revisa:
- La consola del navegador (F12) para ver errores
- Que todos los archivos estén en la misma carpeta
- Que estés usando un navegador actualizado

---

**¡Disfruta gestionando tu sitio web!** ✨
