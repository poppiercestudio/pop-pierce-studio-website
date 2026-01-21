// Funciones para interactuar con la GitHub API

/**
 * Obtiene el contenido actual del archivo data.json desde GitHub
 */
async function getGitHubFile() {
    if (!isGitHubConfigured()) {
        throw new Error('GitHub no está configurado. Por favor, ingresa tu token de GitHub.');
    }

    const token = getGitHubToken();
    const { owner, repo, branch, path } = GITHUB_CONFIG;

    try {
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
            {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );

        if (response.status === 404) {
            // El archivo no existe, retornar datos vacíos
            return { logos: {}, gallery: [] };
        }

        if (!response.ok) {
            throw new Error(`Error al obtener archivo: ${response.statusText}`);
        }

        const data = await response.json();
        const content = JSON.parse(atob(data.content.replace(/\s/g, '')));
        return content;
    } catch (error) {
        console.error('Error al obtener archivo de GitHub:', error);
        throw error;
    }
}

/**
 * Obtiene el SHA actual del archivo desde GitHub
 */
async function getFileSHA(path) {
    const token = getGitHubToken();
    const { owner, repo, branch } = GITHUB_CONFIG;
    
    try {
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
            {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );
        
        if (response.status === 404) {
            return null; // El archivo no existe
        }
        
        if (!response.ok) {
            throw new Error(`Error al obtener SHA: ${response.statusText}`);
        }
        
        const fileData = await response.json();
        return fileData.sha;
    } catch (error) {
        console.error('Error al obtener SHA:', error);
        return null;
    }
}

/**
 * Actualiza el archivo data.json en GitHub
 */
async function updateGitHubFile(data) {
    if (!isGitHubConfigured()) {
        throw new Error('GitHub no está configurado. Por favor, ingresa tu token de GitHub.');
    }

    const token = getGitHubToken();
    const { owner, repo, branch, path } = GITHUB_CONFIG;

    // Intentar hasta 5 veces en caso de error de SHA
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
        try {
            // Obtener el SHA actual del archivo (siempre obtenerlo fresco antes de cada intento)
            const sha = await getFileSHA(path);

            // Convertir datos a base64
            const content = JSON.stringify(data, null, 2);
            const encodedContent = btoa(unescape(encodeURIComponent(content)));

            // Preparar el cuerpo de la petición
            const body = {
                message: `Actualización automática: ${new Date().toLocaleString('es-MX')}`,
                content: encodedContent,
                branch: branch
            };

            if (sha) {
                body.sha = sha;
            }

            // Hacer el commit
            const response = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                
                // Si es error de SHA mismatch, intentar de nuevo
                if (errorData.message && (
                    errorData.message.includes('does not match') || 
                    errorData.message.includes('SHA') ||
                    errorData.message.includes('sha')
                )) {
                    attempts++;
                    if (attempts < maxAttempts) {
                        // Esperar un poco más antes de reintentar (aumentado a 1000ms)
                        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
                        continue; // Reintentar con SHA fresco
                    } else {
                        // Último intento fallido
                        throw new Error(`Error al actualizar: El archivo fue modificado en GitHub. Por favor, recarga la página e intenta de nuevo. ${errorData.message || response.statusText}`);
                    }
                }
                
                throw new Error(`Error al actualizar: ${errorData.message || response.statusText}`);
            }

            const result = await response.json();
            return result;
            
        } catch (error) {
            attempts++;
            
            // Si es el último intento, lanzar el error
            if (attempts >= maxAttempts) {
                console.error('Error al actualizar archivo en GitHub después de', maxAttempts, 'intentos:', error);
                throw error;
            }
            
            // Si es error de SHA, esperar y reintentar
            if (error.message && (
                error.message.includes('does not match') || 
                error.message.includes('SHA') ||
                error.message.includes('sha')
            )) {
                // Esperar más tiempo en cada intento (backoff exponencial)
                await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
                continue;
            }
            
            // Otro tipo de error, lanzarlo inmediatamente
            throw error;
        }
    }
}

/**
 * Sube una imagen/video a GitHub como archivo
 */
async function uploadFileToGitHub(file, filename) {
    if (!isGitHubConfigured()) {
        throw new Error('GitHub no está configurado.');
    }

    const token = getGitHubToken();
    const { owner, repo, branch } = GITHUB_CONFIG;
    const path = `assets/images/${filename}`;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                // Convertir a base64
            const base64Content = e.target.result.split(',')[1]; // Remover el prefijo data:image/...

            // Verificar si el archivo ya existe
            let sha = null;
            try {
                const getResponse = await fetch(
                    `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
                    {
                        headers: {
                            'Authorization': `token ${token}`,
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    }
                );
                
                if (getResponse.ok) {
                    const fileData = await getResponse.json();
                    sha = fileData.sha;
                }
            } catch (e) {
                // El archivo no existe
            }

            const body = {
                message: `Agregar archivo: ${filename}`,
                content: base64Content,
                branch: branch
            };

            if (sha) {
                body.sha = sha;
            }

            const response = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error al subir archivo: ${errorData.message || response.statusText}`);
            }

            const result = await response.json();
            resolve(result.content.download_url);
        } catch (error) {
            reject(error);
        }
        };
        reader.readAsDataURL(file);
    });
}
