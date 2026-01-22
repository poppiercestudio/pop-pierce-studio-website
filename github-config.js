// Configuración de GitHub API
// IMPORTANTE: Necesitas crear un Personal Access Token en GitHub
// 1. Ve a: https://github.com/settings/tokens
// 2. Crea un nuevo token con permisos "repo"
// 3. Copia el token y guárdalo de forma segura

const GITHUB_CONFIG = {
    // Configuración del repositorio
    // Estos valores se obtienen automáticamente desde _config.yml o puedes cambiarlos aquí
    owner: 'poppiercestudio',  // Tu usuario de GitHub (se detecta automáticamente)
    repo: 'pop-pierce-studio-website',  // Nombre de tu repositorio
    branch: 'main',  // Rama principal (puede ser 'main' o 'master')
    path: 'data.json',  // Archivo donde se guardarán los datos
    
    // Token de GitHub (se configurará en admin.html)
    // NO pongas el token aquí directamente por seguridad
    token: null  // Se establecerá desde el panel de administración
};

// Intentar detectar la configuración desde _config.yml o la URL
try {
    // Detectar desde la URL actual
    const hostname = window.location.hostname;
    if (hostname.includes('github.io')) {
        const parts = hostname.split('.');
        if (parts.length >= 2) {
            GITHUB_CONFIG.owner = parts[0];
        }
    }
} catch (e) {
    console.log('No se pudo detectar automáticamente la configuración');
}

// Función para obtener el token desde localStorage
function getGitHubToken() {
    return localStorage.getItem('github_token') || GITHUB_CONFIG.token;
}

// Función para guardar el token
function setGitHubToken(token) {
    localStorage.setItem('github_token', token);
    GITHUB_CONFIG.token = token;
}

// Función para verificar si está configurado
function isGitHubConfigured() {
    return getGitHubToken() !== null && getGitHubToken() !== '';
}
