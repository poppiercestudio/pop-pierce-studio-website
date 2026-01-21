# 🔧 Configuración de GitHub para el Panel de Administración

## 📋 ¿Por qué necesito esto?

Para que los cambios que hagas desde el panel de administración se vean en tu página web pública en GitHub Pages, necesitas configurar un token de acceso personal de GitHub.

## 🚀 Pasos para Configurar

### Paso 1: Crear un Token de Acceso Personal

1. **Ve a GitHub Settings**
   - Haz clic en tu foto de perfil (esquina superior derecha)
   - Selecciona **"Settings"**

2. **Accede a Developer Settings**
   - En el menú lateral izquierdo, baja hasta el final
   - Haz clic en **"Developer settings"**

3. **Crear un nuevo token**
   - En el menú lateral, haz clic en **"Personal access tokens"**
   - Selecciona **"Tokens (classic)"**
   - Haz clic en **"Generate new token"** → **"Generate new token (classic)"**

4. **Configurar el token**
   - **Note (nombre)**: Ponle un nombre descriptivo como "Pop Pierce Admin Panel"
   - **Expiration**: Selecciona cuánto tiempo quieres que dure (recomendado: 90 días o "No expiration")
   - **Scopes (permisos)**: 
     - ✅ Marca **"repo"** (esto da acceso completo a los repositorios)
     - Esto incluye automáticamente: `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`, `security_events`

5. **Generar y copiar el token**
   - Haz clic en **"Generate token"** al final de la página
   - **⚠️ IMPORTANTE**: Copia el token inmediatamente (empieza con `ghp_`)
   - Solo se muestra una vez, si lo pierdes tendrás que crear uno nuevo

### Paso 2: Configurar el Token en el Panel de Administración

1. **Abre el panel de administración**
   - Abre `admin.html` en tu navegador
   - Inicia sesión con tu contraseña

2. **Ve a la pestaña "Configuración"**
   - Haz clic en la pestaña **"Configuración"** (primera pestaña)

3. **Pega tu token**
   - Pega el token que copiaste en el campo **"Token de GitHub"**
   - Haz clic en **"Guardar Token"**

4. **Verificar conexión**
   - Deberías ver un mensaje verde que dice "✅ GitHub configurado correctamente"
   - Si ves un error, verifica que el token sea correcto

## ✅ Verificación

Una vez configurado:

1. **Haz un cambio de prueba**
   - Ve a la pestaña "Logos" o "Galería"
   - Sube una imagen o modifica algo
   - Deberías ver el mensaje "guardado en GitHub exitosamente"

2. **Verifica en GitHub**
   - Ve a tu repositorio en GitHub
   - Deberías ver un nuevo commit con tus cambios
   - El archivo `data.json` debería actualizarse

3. **Verifica en tu página web**
   - Espera 1-2 minutos (GitHub Pages tarda en actualizar)
   - Recarga tu página web pública
   - Los cambios deberían aparecer

## 🔒 Seguridad

- **Nunca compartas tu token** con nadie
- **No subas el token al repositorio** (ya está configurado para guardarse solo localmente)
- Si crees que tu token fue comprometido, revócalo inmediatamente y crea uno nuevo
- El token se guarda en el navegador (localStorage), solo tú puedes verlo

## 🛠️ Solución de Problemas

### Error: "GitHub no está configurado"
- Verifica que hayas guardado el token correctamente
- Asegúrate de estar en la pestaña "Configuración"

### Error: "Bad credentials" o "401 Unauthorized"
- El token es incorrecto o expiró
- Crea un nuevo token y vuelve a configurarlo

### Error: "Not Found" o "404"
- Verifica que el nombre del repositorio sea correcto en `github-config.js`
- Verifica que tengas permisos de escritura en el repositorio

### Los cambios no aparecen en la página web
- GitHub Pages puede tardar 1-5 minutos en actualizar
- Verifica que el commit se haya hecho correctamente en GitHub
- Recarga la página con Ctrl+F5 (forzar recarga)

### Error al subir archivos grandes
- GitHub tiene un límite de 100MB por archivo
- Si el archivo es muy grande, comprímelo antes de subirlo
- Para videos, considera usar servicios externos como YouTube o Vimeo

## 📝 Notas Importantes

- **Los cambios se guardan automáticamente** en GitHub cuando configuras el token
- **Si no configuras GitHub**, los cambios solo se guardan localmente en tu navegador
- **El archivo `data.json`** se actualiza automáticamente en tu repositorio
- **Las imágenes/videos** se suben a `assets/images/` en tu repositorio

## 🎉 ¡Listo!

Una vez configurado, podrás:
- ✅ Subir logos desde el panel de administración
- ✅ Agregar imágenes y videos a la galería
- ✅ Ver los cambios reflejados en tu página web pública
- ✅ Todo se guarda automáticamente en GitHub

---

**¿Necesitas ayuda?** Revisa la consola del navegador (F12) para ver mensajes de error detallados.
