// Sistema de Administración para Pop Pierce Studio
// Almacenamiento en localStorage

// Configuración
const ADMIN_PASSWORD_KEY = 'admin_password_hash';
const DEFAULT_PASSWORD = 'admin123'; // Cambiar esta contraseña por defecto
const LOGOS_KEY = 'pop_pierce_logos';
const GALLERY_KEY = 'pop_pierce_gallery';

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

function initializeAdmin() {
    // Verificar si hay sesión activa
    const isLoggedIn = sessionStorage.getItem('admin_logged_in') === 'true';
    
    if (isLoggedIn) {
        showAdminPanel();
        loadGitHubConfig();
    } else {
        showLoginScreen();
        setupLoginForm();
    }
}

function loadGitHubConfig() {
    const token = getGitHubToken();
    if (token) {
        const tokenInput = document.getElementById('githubToken');
        if (tokenInput) {
            tokenInput.value = token;
        }
        updateGitHubStatus(true);
    } else {
        updateGitHubStatus(false);
    }
}

function saveGitHubToken() {
    const tokenInput = document.getElementById('githubToken');
    const token = tokenInput.value.trim();
    
    if (!token) {
        showNotification('Por favor, ingresa un token válido', 'error');
        return;
    }
    
    setGitHubToken(token);
    showNotification('Token guardado exitosamente', 'success');
    updateGitHubStatus(true);
    
    // Probar la conexión
    testGitHubConnection();
}

function updateGitHubStatus(configured) {
    const statusDiv = document.getElementById('githubStatus');
    if (!statusDiv) return;
    
    if (configured) {
        statusDiv.innerHTML = `
            <div style="background: #d1fae5; padding: 15px; border-radius: 10px; border-left: 4px solid #10b981;">
                <strong style="color: #065f46;">✅ GitHub configurado correctamente</strong><br>
                <span style="color: #047857; font-size: 0.9rem;">Los cambios se guardarán automáticamente en tu repositorio</span>
            </div>
        `;
    } else {
        statusDiv.innerHTML = `
            <div style="background: #fee2e2; padding: 15px; border-radius: 10px; border-left: 4px solid #ef4444;">
                <strong style="color: #991b1b;">⚠️ GitHub no configurado</strong><br>
                <span style="color: #b91c1c; font-size: 0.9rem;">Los cambios solo se guardarán localmente. Configura GitHub para que se vean en tu página web pública.</span>
            </div>
        `;
    }
}

async function testGitHubConnection() {
    try {
        await getGitHubFile();
        showNotification('Conexión con GitHub exitosa', 'success');
    } catch (error) {
        showNotification('Error al conectar con GitHub: ' + error.message, 'error');
    }
}

function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('adminPassword').value;
            
            // Verificar contraseña
            if (checkPassword(password)) {
                sessionStorage.setItem('admin_logged_in', 'true');
                showAdminPanel();
            } else {
                showNotification('Contraseña incorrecta', 'error');
            }
        });
    }
}

function checkPassword(password) {
    // Obtener hash guardado o usar el default
    const storedHash = localStorage.getItem(ADMIN_PASSWORD_KEY);
    
    if (storedHash) {
        // Si hay hash guardado, comparar
        return simpleHash(password) === storedHash;
    } else {
        // Primera vez, usar contraseña por defecto
        if (password === DEFAULT_PASSWORD) {
            // Guardar hash para futuras verificaciones
            localStorage.setItem(ADMIN_PASSWORD_KEY, simpleHash(password));
            return true;
        }
        return false;
    }
}

function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
}

function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadGitHubConfig();
    loadFromGitHub().then(() => {
        loadLogos();
        loadGallery();
    });
}

function logout() {
    sessionStorage.removeItem('admin_logged_in');
    showLoginScreen();
    document.getElementById('loginForm').reset();
}

function switchTab(tabName) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.admin-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar tab seleccionado
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

// ========== GESTIÓN DE LOGOS ==========

function loadLogos() {
    const logos = getLogos();
    const logoManager = document.getElementById('logoManager');
    logoManager.innerHTML = '';
    
    const logoLocations = [
        { id: 'header', name: 'Logo del Header', description: 'Logo en la barra de navegación superior' },
        { id: 'hero', name: 'Logo del Hero', description: 'Logo en la sección principal' },
        { id: 'footer', name: 'Logo del Footer', description: 'Logo en el pie de página' }
    ];
    
    logoLocations.forEach(location => {
        const logoItem = createLogoItem(location, logos[location.id]);
        logoManager.appendChild(logoItem);
    });
}

function createLogoItem(location, currentLogo) {
    const div = document.createElement('div');
    div.className = 'logo-item';
    div.innerHTML = `
        <h3>${location.name}</h3>
        <p style="color: #64748b; margin-bottom: 15px;">${location.description}</p>
        <div class="logo-preview-container">
            ${currentLogo ? `<img src="${currentLogo}" alt="Logo actual" class="logo-preview">` : '<p style="color: #cbd5e1;">No hay logo cargado</p>'}
        </div>
        <div class="file-input-wrapper">
            <input type="file" id="logo-${location.id}" accept="image/*" onchange="handleLogoUpload('${location.id}', this)">
            <label for="logo-${location.id}" class="file-input-label">
                <i class="fas fa-upload"></i> ${currentLogo ? 'Cambiar Logo' : 'Subir Logo'}
            </label>
        </div>
        ${currentLogo ? `<button class="btn btn-danger" onclick="removeLogo('${location.id}')" style="width: 100%; margin-top: 10px;">
            <i class="fas fa-trash"></i> Eliminar Logo
        </button>` : ''}
    `;
    return div;
}

async function handleLogoUpload(locationId, input) {
    const file = input.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showNotification('Por favor, selecciona un archivo de imagen', 'error');
        return;
    }
    
    try {
        showNotification('Subiendo logo a GitHub...', 'info');
        
        // Si GitHub está configurado, subir el archivo
        if (isGitHubConfigured()) {
            const filename = `logo-${locationId}-${Date.now()}.${file.name.split('.').pop()}`;
            const imageUrl = await uploadFileToGitHub(file, filename);
            
            // Guardar la URL en lugar de base64
            saveLogo(locationId, imageUrl);
            await saveToGitHub();
            showNotification('Logo guardado en GitHub exitosamente', 'success');
        } else {
            // Si no está configurado, usar base64 local
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                saveLogo(locationId, imageData);
                showNotification('Logo guardado localmente. Configura GitHub para que se vea en tu página web.', 'success');
            };
            reader.readAsDataURL(file);
        }
        
        loadLogos();
    } catch (error) {
        console.error('Error al subir logo:', error);
        showNotification('Error al subir logo: ' + error.message, 'error');
        
        // Fallback a localStorage
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            saveLogo(locationId, imageData);
            showNotification('Logo guardado localmente (fallback)', 'success');
        };
        reader.readAsDataURL(file);
    }
}

function saveLogo(locationId, imageData) {
    const logos = getLogos();
    logos[locationId] = imageData;
    localStorage.setItem(LOGOS_KEY, JSON.stringify(logos));
}

async function removeLogo(locationId) {
    if (confirm('¿Estás seguro de que quieres eliminar este logo?')) {
        const logos = getLogos();
        const deletedLogo = logos[locationId];
        delete logos[locationId];
        localStorage.setItem(LOGOS_KEY, JSON.stringify(logos));
        
        // Guardar en GitHub si está configurado
        if (isGitHubConfigured()) {
            try {
                await saveToGitHub();
                showNotification('Logo eliminado de GitHub', 'success');
            } catch (error) {
                console.error('Error al guardar en GitHub:', error);
                
                // Si es un error de SHA mismatch, intentar recargar y guardar de nuevo
                if (error.message && (
                    error.message.includes('does not match') || 
                    error.message.includes('SHA') ||
                    error.message.includes('modificado en GitHub')
                )) {
                    try {
                        showNotification('Recargando datos desde GitHub...', 'info');
                        await loadFromGitHub();
                        
                        // Verificar si el logo aún existe y eliminarlo de nuevo
                        const reloadedLogos = getLogos();
                        if (reloadedLogos[locationId]) {
                            delete reloadedLogos[locationId];
                            localStorage.setItem(LOGOS_KEY, JSON.stringify(reloadedLogos));
                            
                            // Intentar guardar de nuevo
                            await saveToGitHub();
                            showNotification('Logo eliminado exitosamente después de recargar', 'success');
                        } else {
                            // El logo ya no existe en GitHub
                            showNotification('Logo eliminado. Ya no existía en GitHub.', 'success');
                        }
                    } catch (retryError) {
                        console.error('Error al reintentar:', retryError);
                        showNotification('Logo eliminado localmente. Error al guardar en GitHub: ' + error.message + '. Por favor, recarga la página e intenta de nuevo.', 'error');
                    }
                } else {
                    showNotification('Logo eliminado localmente. Error al guardar en GitHub: ' + error.message, 'error');
                }
            }
        } else {
            showNotification('Logo eliminado localmente', 'success');
        }
        
        loadLogos();
    }
}

function getLogos() {
    const stored = localStorage.getItem(LOGOS_KEY);
    return stored ? JSON.parse(stored) : {};
}

// ========== GESTIÓN DE GALERÍA ==========

function loadGallery() {
    const gallery = getGallery();
    const galleryManager = document.getElementById('galleryManager');
    
    // Limpiar solo los elementos de galería, no el formulario de agregar si existe
    const existingItems = galleryManager.querySelectorAll('.gallery-item-admin:not([data-new-item])');
    existingItems.forEach(item => item.remove());
    
    if (gallery.length === 0) {
        // Solo mostrar mensaje vacío si no hay formulario de agregar
        if (!galleryManager.querySelector('[data-new-item]')) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <i class="fas fa-images"></i>
                <h3>No hay elementos en la galería</h3>
                <p>Haz clic en "Agregar Nueva Imagen/Video" para comenzar</p>
            `;
            galleryManager.appendChild(emptyState);
        }
        return;
    }
    
    // Remover mensaje vacío si existe
    const emptyState = galleryManager.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    gallery.forEach((item, index) => {
        const itemDiv = createGalleryItemAdmin(item, index);
        // Insertar después del formulario de agregar si existe, sino al final
        const newItemForm = galleryManager.querySelector('[data-new-item]');
        if (newItemForm) {
            newItemForm.insertAdjacentElement('afterend', itemDiv);
        } else {
            galleryManager.appendChild(itemDiv);
        }
    });
}

function createGalleryItemAdmin(item, index) {
    const div = document.createElement('div');
    div.className = 'gallery-item-admin';
    
    const isVideo = item.type === 'video';
    const preview = isVideo 
        ? `<video class="preview" controls><source src="${item.src}" type="video/mp4"></video>`
        : `<img src="${item.src}" alt="Galería" class="preview">`;
    
    div.innerHTML = `
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
            <div>
                ${preview}
            </div>
            <div style="flex: 1; min-width: 300px;">
                <div class="form-group">
                    <label>Descripción:</label>
                    <textarea id="desc-${index}" rows="5">${item.description || ''}</textarea>
                </div>
                <div class="item-actions">
                    <button class="btn btn-primary" onclick="updateGalleryItem(${index})">
                        <i class="fas fa-save"></i> Guardar Cambios
                    </button>
                    <button class="btn btn-danger" onclick="deleteGalleryItem(${index})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                    ${index > 0 ? `<button class="btn" style="background: #64748b; color: white;" onclick="moveGalleryItem(${index}, -1)">
                        <i class="fas fa-arrow-up"></i> Subir
                    </button>` : ''}
                    ${index < getGallery().length - 1 ? `<button class="btn" style="background: #64748b; color: white;" onclick="moveGalleryItem(${index}, 1)">
                        <i class="fas fa-arrow-down"></i> Bajar
                    </button>` : ''}
                </div>
            </div>
        </div>
    `;
    return div;
}

function showAddGalleryItem() {
    // Remover formulario existente si hay uno
    const existingForm = document.getElementById('galleryManager').querySelector('[data-new-item]');
    if (existingForm) {
        existingForm.remove();
    }
    
    const div = document.createElement('div');
    div.className = 'gallery-item-admin';
    div.setAttribute('data-new-item', 'true');
    div.style.border = '3px solid #667eea';
    div.innerHTML = `
        <h3 style="margin-bottom: 20px; color: #667eea;">
            <i class="fas fa-plus-circle"></i> Nuevo Elemento de Galería
        </h3>
        <div class="form-group">
            <label>Tipo:</label>
            <select id="newItemType" style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 10px;">
                <option value="image">Imagen</option>
                <option value="video">Video</option>
            </select>
        </div>
        <div class="form-group">
            <label>Archivo:</label>
            <div class="file-input-wrapper">
                <input type="file" id="newItemFile" accept="image/*,video/*" onchange="previewNewItem(this)">
                <label for="newItemFile" class="file-input-label">
                    <i class="fas fa-upload"></i> Seleccionar Archivo
                </label>
            </div>
            <div id="newItemPreview" style="margin-top: 15px;"></div>
        </div>
        <div class="form-group">
            <label>Descripción:</label>
            <textarea id="newItemDesc" rows="5" placeholder="Escribe la descripción para este elemento..."></textarea>
        </div>
        <div class="item-actions">
            <button class="btn btn-success" onclick="addGalleryItem()">
                <i class="fas fa-check"></i> Agregar a Galería
            </button>
            <button class="btn btn-danger" onclick="cancelAddGalleryItem()">
                <i class="fas fa-times"></i> Cancelar
            </button>
        </div>
    `;
    
    const galleryManager = document.getElementById('galleryManager');
    galleryManager.insertBefore(div, galleryManager.firstChild);
}

function previewNewItem(input) {
    const file = input.files[0];
    if (!file) return;
    
    const previewDiv = document.getElementById('newItemPreview');
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const isVideo = file.type.startsWith('video/');
        if (isVideo) {
            previewDiv.innerHTML = `<video controls style="max-width: 300px; border-radius: 10px;"><source src="${e.target.result}"></video>`;
        } else {
            previewDiv.innerHTML = `<img src="${e.target.result}" style="max-width: 300px; border-radius: 10px;">`;
        }
    };
    
    reader.readAsDataURL(file);
}

async function addGalleryItem() {
    const fileInput = document.getElementById('newItemFile');
    const typeSelect = document.getElementById('newItemType');
    const descTextarea = document.getElementById('newItemDesc');
    
    if (!fileInput.files[0]) {
        showNotification('Por favor, selecciona un archivo', 'error');
        return;
    }
    
    const file = fileInput.files[0];
    const type = typeSelect.value;
    
    // Validar tipo de archivo
    if (type === 'image' && !file.type.startsWith('image/')) {
        showNotification('Por favor, selecciona un archivo de imagen', 'error');
        return;
    }
    if (type === 'video' && !file.type.startsWith('video/')) {
        showNotification('Por favor, selecciona un archivo de video', 'error');
        return;
    }
    
    try {
        showNotification('Subiendo archivo a GitHub...', 'info');
        
        let fileUrl;
        
        // Si GitHub está configurado, subir el archivo
        if (isGitHubConfigured()) {
            const extension = file.name.split('.').pop();
            const filename = `${type}-${Date.now()}.${extension}`;
            fileUrl = await uploadFileToGitHub(file, filename);
        } else {
            // Si no está configurado, usar base64
            fileUrl = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    resolve(e.target.result);
                };
                reader.readAsDataURL(file);
            });
        }
        
        const gallery = getGallery();
        const oldGallery = JSON.parse(JSON.stringify(gallery)); // Copia ANTES de agregar
        
        // Crear el nuevo elemento
        const newItem = {
            type: type,
            src: fileUrl,
            description: descTextarea.value || ''
        };
        
        // Agregar el nuevo elemento UNA SOLA VEZ
        gallery.push(newItem);
        
        // Marcar que hay cambios locales pendientes
        localStorage.setItem('gallery_has_local_changes', 'true');
        localStorage.setItem('gallery_last_change_time', Date.now().toString());
        localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
        
        // Guardar en GitHub si está configurado
        if (isGitHubConfigured()) {
            try {
                await saveToGitHub();
                
                // Marcar que los cambios están guardados en GitHub
                localStorage.setItem('gallery_has_local_changes', 'false');
                localStorage.setItem('gallery_last_saved_time', Date.now().toString());
                
                showNotification('Elemento agregado y guardado en GitHub', 'success');
                
                // Forzar actualización en la página principal si está abierta
                // Disparar evento de storage para que la página principal se actualice
                window.dispatchEvent(new StorageEvent('storage', {
                    key: GALLERY_KEY,
                    newValue: JSON.stringify(gallery),
                    oldValue: JSON.stringify(oldGallery)
                }));
            } catch (error) {
                console.error('Error al guardar en GitHub:', error);
                showNotification('Elemento agregado localmente. Error al guardar en GitHub: ' + error.message, 'error');
            }
        } else {
            showNotification('Elemento agregado localmente. Configura GitHub para que se vea en tu página web.', 'success');
            
            // Forzar actualización en la página principal
            window.dispatchEvent(new StorageEvent('storage', {
                key: GALLERY_KEY,
                newValue: JSON.stringify(gallery),
                oldValue: JSON.stringify(oldGallery)
            }));
        }
        
        loadGallery();
        cancelAddGalleryItem();
    } catch (error) {
        console.error('Error al agregar elemento:', error);
        showNotification('Error al subir archivo: ' + error.message, 'error');
        
        // Fallback a localStorage
        const reader = new FileReader();
        reader.onload = function(e) {
            const gallery = getGallery();
            gallery.push({
                type: type,
                src: e.target.result,
                description: descTextarea.value || ''
            });
            localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
            showNotification('Elemento agregado localmente (fallback)', 'success');
            loadGallery();
            cancelAddGalleryItem();
        };
        reader.readAsDataURL(file);
    }
}

function cancelAddGalleryItem() {
    const galleryManager = document.getElementById('galleryManager');
    const newItemDiv = galleryManager.querySelector('[data-new-item]');
    if (newItemDiv) {
        newItemDiv.remove();
    }
    
    // Si no hay elementos, mostrar mensaje vacío
    const gallery = getGallery();
    if (gallery.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <i class="fas fa-images"></i>
            <h3>No hay elementos en la galería</h3>
            <p>Haz clic en "Agregar Nueva Imagen/Video" para comenzar</p>
        `;
        galleryManager.appendChild(emptyState);
    }
}

async function updateGalleryItem(index) {
    const gallery = getGallery();
    const descTextarea = document.getElementById(`desc-${index}`);
    
    if (descTextarea) {
        const oldDescription = gallery[index].description;
        gallery[index].description = descTextarea.value;
        
        // Marcar que hay cambios locales pendientes (proteger de sobrescritura)
        localStorage.setItem('gallery_has_local_changes', 'true');
        localStorage.setItem('gallery_last_change_time', Date.now().toString());
        
        localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
        
        // Guardar en GitHub si está configurado
        if (isGitHubConfigured()) {
            try {
                await saveToGitHub();
                
                // Marcar que los cambios están guardados en GitHub
                localStorage.setItem('gallery_has_local_changes', 'false');
                localStorage.setItem('gallery_last_saved_time', Date.now().toString());
                
                showNotification('Cambios guardados en GitHub', 'success');
            } catch (error) {
                console.error('Error al guardar en GitHub:', error);
                
                // Si es un error de SHA mismatch, intentar recargar y guardar de nuevo
                if (error.message && (
                    error.message.includes('does not match') || 
                    error.message.includes('SHA') ||
                    error.message.includes('modificado en GitHub')
                )) {
                    try {
                        showNotification('Recargando datos desde GitHub...', 'info');
                        await loadFromGitHub();
                        
                        // Actualizar la descripción en la galería recargada
                        const reloadedGallery = getGallery();
                        if (index < reloadedGallery.length) {
                            reloadedGallery[index].description = descTextarea.value;
                            
                            // Marcar cambios locales de nuevo
                            localStorage.setItem('gallery_has_local_changes', 'true');
                            localStorage.setItem('gallery_last_change_time', Date.now().toString());
                            localStorage.setItem(GALLERY_KEY, JSON.stringify(reloadedGallery));
                            
                            // Intentar guardar de nuevo
                            await saveToGitHub();
                            
                            // Marcar que los cambios están guardados
                            localStorage.setItem('gallery_has_local_changes', 'false');
                            localStorage.setItem('gallery_last_saved_time', Date.now().toString());
                            
                            showNotification('Cambios guardados exitosamente después de recargar', 'success');
                        } else {
                            // Restaurar descripción anterior
                            gallery[index].description = oldDescription;
                            localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
                            localStorage.setItem('gallery_has_local_changes', 'false');
                            showNotification('Error: El elemento ya no existe. Por favor, recarga la página.', 'error');
                        }
                    } catch (retryError) {
                        console.error('Error al reintentar:', retryError);
                        showNotification('Cambios guardados localmente. Error al guardar en GitHub: ' + error.message + '. Por favor, recarga la página e intenta de nuevo.', 'error');
                    }
                } else {
                    showNotification('Cambios guardados localmente. Error al guardar en GitHub: ' + error.message, 'error');
                }
            }
        } else {
            showNotification('Cambios guardados localmente', 'success');
        }
        
        loadGallery();
    }
}

async function deleteGalleryItem(index) {
    if (!confirm('¿Estás seguro de que quieres eliminar este elemento de la galería?')) {
        return;
    }
    
    try {
        const gallery = getGallery();
        
        // Validar que el índice sea válido
        if (index < 0 || index >= gallery.length) {
            showNotification('Error: Índice inválido', 'error');
            return;
        }
        
        // Guardar una copia del elemento por si necesitamos restaurarlo
        const deletedItem = gallery[index];
        
        // Eliminar el elemento
        gallery.splice(index, 1);
        
        // Marcar que hay cambios locales pendientes
        localStorage.setItem('gallery_has_local_changes', 'true');
        localStorage.setItem('gallery_last_change_time', Date.now().toString());
        localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
        
        // Guardar en GitHub si está configurado
        if (isGitHubConfigured()) {
            try {
                await saveToGitHub();
                
                // Marcar que los cambios están guardados en GitHub
                localStorage.setItem('gallery_has_local_changes', 'false');
                localStorage.setItem('gallery_last_saved_time', Date.now().toString());
                
                showNotification('Elemento eliminado exitosamente de GitHub', 'success');
                
                // Forzar actualización en la página principal si está abierta
                // Disparar evento de storage para que la página principal se actualice
                window.dispatchEvent(new StorageEvent('storage', {
                    key: GALLERY_KEY,
                    newValue: JSON.stringify(gallery),
                    oldValue: JSON.stringify([...gallery, deletedItem])
                }));
            } catch (error) {
                console.error('Error al guardar en GitHub:', error);
                
                // Si es un error de SHA mismatch, intentar recargar y guardar de nuevo
                if (error.message && (
                    error.message.includes('does not match') || 
                    error.message.includes('SHA') ||
                    error.message.includes('modificado en GitHub')
                )) {
                    // Recargar datos desde GitHub y volver a intentar
                    try {
                        showNotification('Recargando datos desde GitHub...', 'info');
                        await loadFromGitHub();
                        
                        // Buscar el elemento en la galería recargada y eliminarlo de nuevo
                        const reloadedGallery = getGallery();
                        const itemIndex = reloadedGallery.findIndex(item => 
                            item.src === deletedItem.src && 
                            item.description === deletedItem.description
                        );
                        
                        if (itemIndex !== -1) {
                            reloadedGallery.splice(itemIndex, 1);
                            localStorage.setItem(GALLERY_KEY, JSON.stringify(reloadedGallery));
                            
                            // Intentar guardar de nuevo
                            await saveToGitHub();
                            
                            // Marcar que los cambios están guardados en GitHub
                            localStorage.setItem('gallery_has_local_changes', 'false');
                            localStorage.setItem('gallery_last_saved_time', Date.now().toString());
                            
                            showNotification('Elemento eliminado exitosamente después de recargar', 'success');
                            
                            // Forzar actualización en la página principal
                            window.dispatchEvent(new StorageEvent('storage', {
                                key: GALLERY_KEY,
                                newValue: JSON.stringify(reloadedGallery),
                                oldValue: JSON.stringify([...reloadedGallery, deletedItem])
                            }));
                        } else {
                            // El elemento ya no existe en GitHub, solo actualizar localmente
                            showNotification('Elemento eliminado. Ya no existía en GitHub.', 'success');
                        }
                    } catch (retryError) {
                        console.error('Error al reintentar:', retryError);
                        showNotification('Elemento eliminado localmente. Error al guardar en GitHub: ' + error.message + '. Por favor, recarga la página e intenta de nuevo.', 'error');
                    }
                } else {
                    showNotification('Elemento eliminado localmente. Error al guardar en GitHub: ' + error.message, 'error');
                }
            }
        } else {
            showNotification('Elemento eliminado localmente', 'success');
            
            // Forzar actualización en la página principal
            window.dispatchEvent(new StorageEvent('storage', {
                key: GALLERY_KEY,
                newValue: JSON.stringify(gallery),
                oldValue: JSON.stringify([...gallery, deletedItem])
            }));
        }
        
        // Recargar la galería
        loadGallery();
        
    } catch (error) {
        console.error('Error al eliminar elemento:', error);
        showNotification('Error al eliminar elemento: ' + error.message, 'error');
    }
}

async function moveGalleryItem(index, direction) {
    const gallery = getGallery();
    const newIndex = index + direction;
    
    if (newIndex >= 0 && newIndex < gallery.length) {
        [gallery[index], gallery[newIndex]] = [gallery[newIndex], gallery[index]];
        localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
        
        // Guardar en GitHub si está configurado
        if (isGitHubConfigured()) {
            try {
                await saveToGitHub();
            } catch (error) {
                console.error('Error al guardar en GitHub:', error);
            }
        }
        
        loadGallery();
    }
}

function getGallery() {
    const stored = localStorage.getItem(GALLERY_KEY);
    return stored ? JSON.parse(stored) : [];
}

// Función para guardar todos los datos en GitHub
async function saveToGitHub() {
    if (!isGitHubConfigured()) {
        return; // No hacer nada si no está configurado
    }
    
    try {
        // Obtener galería actual
        let gallery = getGallery();
        
        // Asegurarse de que las imágenes originales estén incluidas
        // Esto previene que se pierdan las imágenes originales al guardar
        const originalGallery = [
            {
                type: 'image',
                src: 'assets/images/Maya.jpg',
                description: '💫 Tu piercing es más que un accesorio, es una declaración de estilo y actitud.\nEn Pop Pierce Studio transformamos cada perforación en una obra única, hecha con precisión, higiene y materiales de alta calidad.\n✨ Refleja quién eres, luce con seguridad y elegancia.\n📸 Inspírate con nuestros trabajos y atrévete a brillar con un diseño tan auténtico como tú.'
            },
            {
                type: 'image',
                src: 'assets/images/IMGGGG.jpg',
                description: '✨ Cada detalle cuenta cuando se trata de tu estilo.\nEn Pop Pierce Studio realizamos perforaciones con precisión, higiene y materiales 100% seguros.\n💫 Este hermoso piercing refleja elegancia, seguridad y confianza —porque cuidar tu piel también es una forma de amor propio.\n📍Agenda tu cita y luce una pieza que hable por ti.'
            },
            {
                type: 'image',
                src: 'assets/images/1.jpg',
                description: '👯‍♀️✨ Porque los mejores momentos se comparten… incluso los piercings.\nEn Pop Pierce Studio transformamos cada experiencia en un recuerdo especial 💎\nPiercings seguros, elegantes y llenos de significado —perfectos para compartir con quien más quieres.\n💫 ¡Atrévete a vivir la experiencia y brillar juntas!'
            },
            {
                type: 'image',
                src: 'assets/images/nariz.jpg',
                description: '💙✨ Un toque sutil puede transformar por completo tu estilo.\nEste hermoso piercing nasal refleja elegancia, confianza y autenticidad.\nEn Pop Pierce Studio cuidamos cada detalle, utilizando materiales esterilizados y piezas de alta calidad para resaltar tu belleza natural.\n💫 Atrévete a brillar con un toque que hable por ti.'
            },
            {
                type: 'image',
                src: 'assets/images/2.jpg',
                description: '🖤 El estilo también está en los detalles.\nUn piercing puede ser pequeño, pero su actitud lo dice todo.\nEn Pop Pierce Studio realizamos perforaciones con técnica profesional, higiene garantizada y materiales de alta calidad.\n💪 Atrévete a marcar tu estilo con confianza.'
            },
            {
                type: 'image',
                src: 'assets/images/proceso.jpg',
                description: '💫 Cada piercing cuenta una historia, y la tuya comienza aquí.\nEn Pop Pierce Studio realizamos cada procedimiento con precisión, higiene y el máximo cuidado para garantizar una experiencia segura y cómoda.\n✨ Piercings con estilo, materiales de calidad y manos profesionales que te hacen sentir en confianza.\n💎 Tu seguridad y tu brillo son nuestra prioridad.'
            },
            {
                type: 'image',
                src: 'assets/images/Nuevo1.jpg',
                description: '🧤✨ La precisión y la higiene son la base de cada perforación en Pop Pierce Studio.\n\nCada procedimiento se realiza con técnica profesional y cuidado absoluto para brindarte una experiencia segura, cómoda y llena de confianza.\n\n💎 Porque un buen resultado empieza con manos expertas y materiales esterilizados de la más alta calidad.'
            },
            {
                type: 'video',
                src: 'assets/images/Video1.mp4',
                description: '💫 En Pop Pierce Studio nos encanta escuchar a nuestros clientes.\n\nEn esta entrevista, compartimos una experiencia real: cómo se sintió el proceso, el nivel de comodidad y la satisfacción al ver el resultado final.\n\n✨ Porque detrás de cada perforación hay confianza, cuidado y un momento que merece contarse.'
            },
            {
                type: 'image',
                src: 'assets/images/Nuevo2.jpg',
                description: '✨ Dos toques de brillo que transforman tu estilo.\n\nEste look combina una perforación en el lóbulo y otra en el cartílago, creando un equilibrio perfecto entre sutileza y elegancia.\n\n💎 En Pop Pierce Studio realizamos cada procedimiento con precisión, higiene y materiales de la más alta calidad —para que cada detalle hable de ti con confianza y estilo.'
            },
            {
                type: 'image',
                src: 'assets/images/Nuevo3.jpg',
                description: '💫 Cada perforación cuenta una historia, y esta comienza con cuidado y precisión.\n\nEn Pop Pierce Studio cuidamos cada detalle para que vivas una experiencia segura, tranquila y llena de estilo.\n\n✨ Un toque delicado que resalta tu autenticidad y te hace brillar a tu manera.'
            },
            {
                type: 'image',
                src: 'assets/images/Nuevo5.jpg',
                description: '💎 Precisión, higiene y estilo en cada detalle.\n\nTu seguridad es nuestra prioridad. ✨'
            },
            {
                type: 'image',
                src: 'assets/images/Nuevo6.jpg',
                description: '💎 Cada combinación cuenta una historia de estilo.\n\nEste look mezcla diferentes tipos de aros con un brillante delicado, creando un equilibrio entre elegancia y actitud.\n\n✨ En Pop Pierce Studio te ayudamos a personalizar tus piercings para que reflejen exactamente quién eres.'
            }
        ];
        
        // Combinar: agregar originales que no estén ya en la galería
        const combinedGallery = [...gallery];
        originalGallery.forEach(originalItem => {
            const exists = gallery.some(item => item.src === originalItem.src);
            if (!exists) {
                combinedGallery.push(originalItem);
            }
        });
        
        const data = {
            logos: getLogos(),
            gallery: combinedGallery
        };
        
        await updateGitHubFile(data);
    } catch (error) {
        console.error('Error al guardar en GitHub:', error);
        throw error;
    }
}

// Función para restaurar imágenes originales del HTML
function restoreOriginalGallery() {
    if (!confirm('¿Estás seguro de que quieres restaurar las imágenes originales? Esto agregará las imágenes originales del HTML a tu galería.')) {
        return;
    }
    
    // Las imágenes originales están definidas en el HTML
    const originalGallery = [
        {
            type: 'image',
            src: 'assets/images/Maya.jpg',
            description: '💫 Tu piercing es más que un accesorio, es una declaración de estilo y actitud.\nEn Pop Pierce Studio transformamos cada perforación en una obra única, hecha con precisión, higiene y materiales de alta calidad.\n✨ Refleja quién eres, luce con seguridad y elegancia.\n📸 Inspírate con nuestros trabajos y atrévete a brillar con un diseño tan auténtico como tú.'
        },
        {
            type: 'image',
            src: 'assets/images/IMGGGG.jpg',
            description: '✨ Cada detalle cuenta cuando se trata de tu estilo.\nEn Pop Pierce Studio realizamos perforaciones con precisión, higiene y materiales 100% seguros.\n💫 Este hermoso piercing refleja elegancia, seguridad y confianza —porque cuidar tu piel también es una forma de amor propio.\n📍Agenda tu cita y luce una pieza que hable por ti.'
        },
        {
            type: 'image',
            src: 'assets/images/1.jpg',
            description: '👯‍♀️✨ Porque los mejores momentos se comparten… incluso los piercings.\nEn Pop Pierce Studio transformamos cada experiencia en un recuerdo especial 💎\nPiercings seguros, elegantes y llenos de significado —perfectos para compartir con quien más quieres.\n💫 ¡Atrévete a vivir la experiencia y brillar juntas!'
        },
        {
            type: 'image',
            src: 'assets/images/nariz.jpg',
            description: '💙✨ Un toque sutil puede transformar por completo tu estilo.\nEste hermoso piercing nasal refleja elegancia, confianza y autenticidad.\nEn Pop Pierce Studio cuidamos cada detalle, utilizando materiales esterilizados y piezas de alta calidad para resaltar tu belleza natural.\n💫 Atrévete a brillar con un toque que hable por ti.'
        },
        {
            type: 'image',
            src: 'assets/images/2.jpg',
            description: '🖤 El estilo también está en los detalles.\nUn piercing puede ser pequeño, pero su actitud lo dice todo.\nEn Pop Pierce Studio realizamos perforaciones con técnica profesional, higiene garantizada y materiales de alta calidad.\n💪 Atrévete a marcar tu estilo con confianza.'
        },
        {
            type: 'image',
            src: 'assets/images/proceso.jpg',
            description: '💫 Cada piercing cuenta una historia, y la tuya comienza aquí.\nEn Pop Pierce Studio realizamos cada procedimiento con precisión, higiene y el máximo cuidado para garantizar una experiencia segura y cómoda.\n✨ Piercings con estilo, materiales de calidad y manos profesionales que te hacen sentir en confianza.\n💎 Tu seguridad y tu brillo son nuestra prioridad.'
        },
        {
            type: 'image',
            src: 'assets/images/Nuevo1.jpg',
            description: '🧤✨ La precisión y la higiene son la base de cada perforación en Pop Pierce Studio.\n\nCada procedimiento se realiza con técnica profesional y cuidado absoluto para brindarte una experiencia segura, cómoda y llena de confianza.\n\n💎 Porque un buen resultado empieza con manos expertas y materiales esterilizados de la más alta calidad.'
        },
        {
            type: 'video',
            src: 'assets/images/Video1.mp4',
            description: '💫 En Pop Pierce Studio nos encanta escuchar a nuestros clientes.\n\nEn esta entrevista, compartimos una experiencia real: cómo se sintió el proceso, el nivel de comodidad y la satisfacción al ver el resultado final.\n\n✨ Porque detrás de cada perforación hay confianza, cuidado y un momento que merece contarse.'
        },
        {
            type: 'image',
            src: 'assets/images/Nuevo2.jpg',
            description: '✨ Dos toques de brillo que transforman tu estilo.\n\nEste look combina una perforación en el lóbulo y otra en el cartílago, creando un equilibrio perfecto entre sutileza y elegancia.\n\n💎 En Pop Pierce Studio realizamos cada procedimiento con precisión, higiene y materiales de la más alta calidad —para que cada detalle hable de ti con confianza y estilo.'
        },
        {
            type: 'image',
            src: 'assets/images/Nuevo3.jpg',
            description: '💫 Cada perforación cuenta una historia, y esta comienza con cuidado y precisión.\n\nEn Pop Pierce Studio cuidamos cada detalle para que vivas una experiencia segura, tranquila y llena de estilo.\n\n✨ Un toque delicado que resalta tu autenticidad y te hace brillar a tu manera.'
        },
        {
            type: 'image',
            src: 'assets/images/Nuevo5.jpg',
            description: '💎 Precisión, higiene y estilo en cada detalle.\n\nTu seguridad es nuestra prioridad. ✨'
        },
        {
            type: 'image',
            src: 'assets/images/Nuevo6.jpg',
            description: '💎 Cada combinación cuenta una historia de estilo.\n\nEste look mezcla diferentes tipos de aros con un brillante delicado, creando un equilibrio entre elegancia y actitud.\n\n✨ En Pop Pierce Studio te ayudamos a personalizar tus piercings para que reflejen exactamente quién eres.'
        }
    ];
    
    // Obtener galería actual
    const currentGallery = getGallery();
    
    // Combinar: agregar originales que no estén ya en la galería
    const combinedGallery = [...currentGallery];
    
    originalGallery.forEach(originalItem => {
        const exists = currentGallery.some(item => item.src === originalItem.src);
        if (!exists) {
            combinedGallery.push(originalItem);
        }
    });
    
    // Guardar
    localStorage.setItem(GALLERY_KEY, JSON.stringify(combinedGallery));
    
    // Guardar en GitHub si está configurado
    if (isGitHubConfigured()) {
        saveToGitHub().then(() => {
            showNotification('Imágenes originales restauradas y guardadas en GitHub', 'success');
            loadGallery();
        }).catch(error => {
            showNotification('Imágenes restauradas localmente. Error al guardar en GitHub: ' + error.message, 'error');
            loadGallery();
        });
    } else {
        showNotification('Imágenes originales restauradas localmente', 'success');
        loadGallery();
    }
}

// Cargar datos desde GitHub al iniciar
async function loadFromGitHub() {
    let data = null;
    
    // Intentar cargar desde GitHub API si está configurado
    if (isGitHubConfigured()) {
        try {
            data = await getGitHubFile();
        } catch (error) {
            console.error('Error al cargar desde GitHub API:', error);
            // Continuar para intentar cargar desde URL pública
        }
    }
    
    // Si no se pudo cargar desde API o no está configurado, intentar desde URL pública
    if (!data) {
        try {
            // Intentar cargar desde la URL pública de GitHub Pages
            const { owner, repo, branch } = GITHUB_CONFIG;
            const publicUrl = `https://${owner}.github.io/${repo}/data.json?t=${Date.now()}`;
            
            const response = await fetch(publicUrl);
            if (response.ok) {
                data = await response.json();
                console.log('Datos cargados desde URL pública de GitHub Pages');
                
                // Mostrar notificación informativa
                if (!isGitHubConfigured()) {
                    showNotification('Datos cargados desde GitHub. Configura tu token en la pestaña "Configuración" para poder guardar cambios.', 'info');
                }
            }
        } catch (error) {
            console.error('Error al cargar desde URL pública:', error);
            // Si no se puede cargar, usar datos locales o vacíos
            if (!data) {
                console.log('No se pudo cargar desde GitHub, usando datos locales');
                return;
            }
        }
    }
    
    if (data) {
        // Obtener datos locales actuales
        const currentLocalLogos = getLogos();
        const currentLocalGallery = getGallery();
        
        // Para logos: solo actualizar si los locales están vacíos o si GitHub tiene más
        if (data.logos && Object.keys(data.logos).length > 0) {
            // Solo actualizar si los locales están vacíos o si GitHub tiene más logos
            if (Object.keys(currentLocalLogos).length === 0 || 
                Object.keys(data.logos).length > Object.keys(currentLocalLogos).length) {
                localStorage.setItem(LOGOS_KEY, JSON.stringify(data.logos));
            }
        }
        
        // Para galería: comparar y usar la versión más completa
        if (data.gallery && data.gallery.length > 0) {
            // Obtener imágenes originales para combinarlas
            const originalGallery = [
                {
                    type: 'image',
                    src: 'assets/images/Maya.jpg',
                    description: '💫 Tu piercing es más que un accesorio, es una declaración de estilo y actitud.\nEn Pop Pierce Studio transformamos cada perforación en una obra única, hecha con precisión, higiene y materiales de alta calidad.\n✨ Refleja quién eres, luce con seguridad y elegancia.\n📸 Inspírate con nuestros trabajos y atrévete a brillar con un diseño tan auténtico como tú.'
                },
                {
                    type: 'image',
                    src: 'assets/images/IMGGGG.jpg',
                    description: '✨ Cada detalle cuenta cuando se trata de tu estilo.\nEn Pop Pierce Studio realizamos perforaciones con precisión, higiene y materiales 100% seguros.\n💫 Este hermoso piercing refleja elegancia, seguridad y confianza —porque cuidar tu piel también es una forma de amor propio.\n📍Agenda tu cita y luce una pieza que hable por ti.'
                },
                {
                    type: 'image',
                    src: 'assets/images/1.jpg',
                    description: '👯‍♀️✨ Porque los mejores momentos se comparten… incluso los piercings.\nEn Pop Pierce Studio transformamos cada experiencia en un recuerdo especial 💎\nPiercings seguros, elegantes y llenos de significado —perfectos para compartir con quien más quieres.\n💫 ¡Atrévete a vivir la experiencia y brillar juntas!'
                },
                {
                    type: 'image',
                    src: 'assets/images/nariz.jpg',
                    description: '💙✨ Un toque sutil puede transformar por completo tu estilo.\nEste hermoso piercing nasal refleja elegancia, confianza y autenticidad.\nEn Pop Pierce Studio cuidamos cada detalle, utilizando materiales esterilizados y piezas de alta calidad para resaltar tu belleza natural.\n💫 Atrévete a brillar con un toque que hable por ti.'
                },
                {
                    type: 'image',
                    src: 'assets/images/2.jpg',
                    description: '🖤 El estilo también está en los detalles.\nUn piercing puede ser pequeño, pero su actitud lo dice todo.\nEn Pop Pierce Studio realizamos perforaciones con técnica profesional, higiene garantizada y materiales de alta calidad.\n💪 Atrévete a marcar tu estilo con confianza.'
                },
                {
                    type: 'image',
                    src: 'assets/images/proceso.jpg',
                    description: '💫 Cada piercing cuenta una historia, y la tuya comienza aquí.\nEn Pop Pierce Studio realizamos cada procedimiento con precisión, higiene y el máximo cuidado para garantizar una experiencia segura y cómoda.\n✨ Piercings con estilo, materiales de calidad y manos profesionales que te hacen sentir en confianza.\n💎 Tu seguridad y tu brillo son nuestra prioridad.'
                },
                {
                    type: 'image',
                    src: 'assets/images/Nuevo1.jpg',
                    description: '🧤✨ La precisión y la higiene son la base de cada perforación en Pop Pierce Studio.\n\nCada procedimiento se realiza con técnica profesional y cuidado absoluto para brindarte una experiencia segura, cómoda y llena de confianza.\n\n💎 Porque un buen resultado empieza con manos expertas y materiales esterilizados de la más alta calidad.'
                },
                {
                    type: 'video',
                    src: 'assets/images/Video1.mp4',
                    description: '💫 En Pop Pierce Studio nos encanta escuchar a nuestros clientes.\n\nEn esta entrevista, compartimos una experiencia real: cómo se sintió el proceso, el nivel de comodidad y la satisfacción al ver el resultado final.\n\n✨ Porque detrás de cada perforación hay confianza, cuidado y un momento que merece contarse.'
                },
                {
                    type: 'image',
                    src: 'assets/images/Nuevo2.jpg',
                    description: '✨ Dos toques de brillo que transforman tu estilo.\n\nEste look combina una perforación en el lóbulo y otra en el cartílago, creando un equilibrio perfecto entre sutileza y elegancia.\n\n💎 En Pop Pierce Studio realizamos cada procedimiento con precisión, higiene y materiales de la más alta calidad —para que cada detalle hable de ti con confianza y estilo.'
                },
                {
                    type: 'image',
                    src: 'assets/images/Nuevo3.jpg',
                    description: '💫 Cada perforación cuenta una historia, y esta comienza con cuidado y precisión.\n\nEn Pop Pierce Studio cuidamos cada detalle para que vivas una experiencia segura, tranquila y llena de estilo.\n\n✨ Un toque delicado que resalta tu autenticidad y te hace brillar a tu manera.'
                },
                {
                    type: 'image',
                    src: 'assets/images/Nuevo5.jpg',
                    description: '💎 Precisión, higiene y estilo en cada detalle.\n\nTu seguridad es nuestra prioridad. ✨'
                },
                {
                    type: 'image',
                    src: 'assets/images/Nuevo6.jpg',
                    description: '💎 Cada combinación cuenta una historia de estilo.\n\nEste look mezcla diferentes tipos de aros con un brillante delicado, creando un equilibrio entre elegancia y actitud.\n\n✨ En Pop Pierce Studio te ayudamos a personalizar tus piercings para que reflejen exactamente quién eres.'
                }
            ];
            
            // Combinar galería de GitHub con originales
            const githubGallery = data.gallery;
            const githubCombined = [...githubGallery];
            originalGallery.forEach(originalItem => {
                const exists = githubGallery.some(item => item.src === originalItem.src);
                if (!exists) {
                    githubCombined.push(originalItem);
                }
            });
            
            // Combinar galería local con originales
            const localCombined = [...currentLocalGallery];
            originalGallery.forEach(originalItem => {
                const exists = currentLocalGallery.some(item => item.src === originalItem.src);
                if (!exists) {
                    localCombined.push(originalItem);
                }
            });
            
            // Verificar si hay cambios locales recientes que proteger
            const hasLocalChanges = localStorage.getItem('gallery_has_local_changes') === 'true';
            const lastChangeTime = parseInt(localStorage.getItem('gallery_last_change_time') || '0');
            const timeSinceChange = Date.now() - lastChangeTime;
            const CHANGE_PROTECTION_TIME = 300000; // 5 minutos de protección
            
            // Usar la versión que tenga más elementos (probablemente tiene los cambios más recientes)
            // O si tienen la misma cantidad, usar la local (tiene los cambios no guardados)
            if (currentLocalGallery.length === 0) {
                // Si no hay datos locales, usar GitHub
                localStorage.setItem(GALLERY_KEY, JSON.stringify(githubCombined));
            } else if (hasLocalChanges && timeSinceChange < CHANGE_PROTECTION_TIME) {
                // Si hay cambios locales recientes (menos de 5 minutos), NO sobrescribir
                // Mantener los cambios locales
                console.log('Manteniendo cambios locales recientes (protegidos de sobrescritura)');
            } else if (localCombined.length >= githubCombined.length) {
                // Si los locales tienen igual o más elementos, mantener los locales (tienen cambios no guardados)
                // No sobrescribir, mantener los cambios locales
                console.log('Manteniendo cambios locales (no guardados en GitHub aún)');
            } else {
                // Si GitHub tiene más elementos y no hay cambios locales recientes, usar GitHub pero combinar con elementos únicos locales
                const finalGallery = [...githubCombined];
                currentLocalGallery.forEach(localItem => {
                    const exists = githubCombined.some(item => item.src === localItem.src);
                    if (!exists) {
                        finalGallery.push(localItem);
                    }
                });
                localStorage.setItem(GALLERY_KEY, JSON.stringify(finalGallery));
            }
        }
        
        // Recargar la interfaz
        loadLogos();
        loadGallery();
    } catch (error) {
        console.error('Error al cargar desde GitHub:', error);
        // Continuar con datos locales
    }
}

// ========== RESPALDO Y RESTAURACIÓN ==========

function downloadBackup() {
    const LOGOS_KEY = 'pop_pierce_logos';
    const GALLERY_KEY = 'pop_pierce_gallery';
    
    const backup = {
        version: '1.0',
        date: new Date().toISOString(),
        logos: JSON.parse(localStorage.getItem(LOGOS_KEY) || '{}'),
        gallery: JSON.parse(localStorage.getItem(GALLERY_KEY) || '[]')
    };
    
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `pop-pierce-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('Respaldo descargado exitosamente', 'success');
}

function restoreBackup(input) {
    const file = input.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.json')) {
        showNotification('Por favor, selecciona un archivo JSON válido', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backup = JSON.parse(e.target.result);
            
            if (!backup.logos || !backup.gallery) {
                throw new Error('Formato de respaldo inválido');
            }
            
            if (confirm('¿Estás seguro de que quieres restaurar este respaldo? Esto reemplazará todos los datos actuales.')) {
                const LOGOS_KEY = 'pop_pierce_logos';
                const GALLERY_KEY = 'pop_pierce_gallery';
                
                localStorage.setItem(LOGOS_KEY, JSON.stringify(backup.logos));
                localStorage.setItem(GALLERY_KEY, JSON.stringify(backup.gallery));
                
                showNotification('Respaldo restaurado exitosamente. Recarga la página para ver los cambios.', 'success');
                
                // Recargar los datos
                loadLogos();
                loadGallery();
                
                // Recargar página principal si está abierta
                setTimeout(() => {
                    if (window.opener) {
                        window.opener.location.reload();
                    }
                }, 1000);
            }
        } catch (error) {
            showNotification('Error al restaurar el respaldo. Verifica que el archivo sea válido.', 'error');
            console.error('Error restoring backup:', error);
        }
    };
    
    reader.readAsText(file);
    input.value = ''; // Reset input
}

// ========== UTILIDADES ==========

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type === 'error' ? 'error' : ''}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
