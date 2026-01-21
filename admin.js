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
        delete logos[locationId];
        localStorage.setItem(LOGOS_KEY, JSON.stringify(logos));
        
        // Guardar en GitHub si está configurado
        if (isGitHubConfigured()) {
            try {
                await saveToGitHub();
                showNotification('Logo eliminado de GitHub', 'success');
            } catch (error) {
                showNotification('Logo eliminado localmente. Error al guardar en GitHub: ' + error.message, 'error');
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
        gallery.push({
            type: type,
            src: fileUrl,
            description: descTextarea.value || ''
        });
        
        // Guardar en localStorage
        localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
        
        // Guardar en GitHub si está configurado
        if (isGitHubConfigured()) {
            await saveToGitHub();
            showNotification('Elemento agregado y guardado en GitHub', 'success');
        } else {
            showNotification('Elemento agregado localmente. Configura GitHub para que se vea en tu página web.', 'success');
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
        gallery[index].description = descTextarea.value;
        localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
        
        // Guardar en GitHub si está configurado
        if (isGitHubConfigured()) {
            try {
                await saveToGitHub();
                showNotification('Cambios guardados en GitHub', 'success');
            } catch (error) {
                showNotification('Cambios guardados localmente. Error al guardar en GitHub: ' + error.message, 'error');
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
        
        // Eliminar el elemento
        gallery.splice(index, 1);
        localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
        
        // Guardar en GitHub si está configurado
        if (isGitHubConfigured()) {
            try {
                await saveToGitHub();
                showNotification('Elemento eliminado exitosamente de GitHub', 'success');
            } catch (error) {
                console.error('Error al guardar en GitHub:', error);
                showNotification('Elemento eliminado localmente. Error al guardar en GitHub: ' + error.message, 'error');
            }
        } else {
            showNotification('Elemento eliminado localmente', 'success');
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
        const data = {
            logos: getLogos(),
            gallery: getGallery()
        };
        
        await updateGitHubFile(data);
    } catch (error) {
        console.error('Error al guardar en GitHub:', error);
        throw error;
    }
}

// Cargar datos desde GitHub al iniciar
async function loadFromGitHub() {
    if (!isGitHubConfigured()) {
        return; // Usar datos locales si no está configurado
    }
    
    try {
        const data = await getGitHubFile();
        
        if (data.logos && Object.keys(data.logos).length > 0) {
            localStorage.setItem(LOGOS_KEY, JSON.stringify(data.logos));
        }
        
        if (data.gallery && data.gallery.length > 0) {
            localStorage.setItem(GALLERY_KEY, JSON.stringify(data.gallery));
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
