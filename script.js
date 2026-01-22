// Funcionalidad principal de la página web
document.addEventListener('DOMContentLoaded', function() {
    
    // Test simple para verificar que el JavaScript funciona
    console.log('Script cargado correctamente');
    
    // Cargar logos y galería desde localStorage
    loadLogosFromStorage();
    loadGalleryFromStorage();
    
    // Variables globales mejoradas
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const faqItems = document.querySelectorAll('.faq-item');
    const appointmentForm = document.getElementById('appointmentForm');
    
    // Test del botón hamburguesa
    if (hamburger) {
        console.log('Hamburguesa encontrado:', hamburger);
        // Evento sin alert intrusivo
        hamburger.addEventListener('click', function() {
            console.log('¡CLICK DETECTADO!');
        });
    } else {
        console.error('Hamburguesa NO encontrado');
    }
    
    // Scroll effect for header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollIndicator.style.width = scrollPercent + '%';
        }
        
        // Active link highlighting
        updateActiveLink();
    });
    
    // Active link highlighting function
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Smooth scrolling for navigation links (versión mejorada)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Solo procesar si es un enlace de navegación, no un botón de formulario
            if (this.tagName === 'A' && this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                
                // Cerrar menú móvil si está abierto
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Add scroll indicator to body
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    document.body.appendChild(scrollIndicator);
    
    // Navegación móvil y desktop mejorada
    console.log('Hamburger element:', hamburger);
    console.log('NavMenu element:', navMenu);
    
    if (hamburger && navMenu) {
        console.log('Agregando event listener al hamburguesa');
        
        let lastToggleAt = 0;
        const toggleMenu = function(e) {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            lastToggleAt = Date.now();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                console.log('Menú abierto');
            } else {
                document.body.style.overflow = '';
                console.log('Menú cerrado');
            }
        };
        
        // Click desktop
        hamburger.addEventListener('click', toggleMenu, { passive: false });
        // Soporte iOS/Android
        hamburger.addEventListener('touchstart', toggleMenu, { passive: false });
        hamburger.addEventListener('touchend', function(e){ e.preventDefault(); }, { passive: false });
        
        // Cerrar al tocar fuera (click/touch), evitando cierre inmediato tras abrir
        const maybeCloseMenu = (e) => {
            const justToggled = Date.now() - lastToggleAt < 350;
            if (justToggled) return;
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
            }
        };
        document.addEventListener('click', maybeCloseMenu, { passive: true });
        document.addEventListener('touchstart', maybeCloseMenu, { passive: true });
    } else {
        console.error('No se encontraron los elementos hamburger o navMenu');
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on nav links (mobile) - versión mejorada
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Solo cerrar menú si es un enlace de navegación válido
            if (this.tagName === 'A' && this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Touch support for mobile
    if ('ontouchstart' in window) {
        // Add touch event listeners for better mobile experience
    navLinks.forEach(link => {
            link.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            link.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
    }
    
    
    // Funcionalidad FAQ (Preguntas Frecuentes)
    // Nota: Este código es respaldado por el código más completo en index.html
    // Solo se ejecuta si el código del HTML no se ejecutó correctamente
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-question i');
        
        // Solo agregar evento si no tiene uno ya
        if (question && !question.hasAttribute('data-faq-initialized')) {
            question.setAttribute('data-faq-initialized', 'true');
            
            // Inicializar estado cerrado si no está ya inicializado
            if (answer && !answer.style.maxHeight) {
                answer.style.maxHeight = '0';
                answer.style.overflow = 'hidden';
            }
            
            question.addEventListener('click', function() {
                // Cerrar otros items abiertos
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('.faq-question i');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0';
                            otherAnswer.style.padding = '0 1.5rem';
                        }
                        if (otherIcon) {
                            otherIcon.style.transform = 'rotate(0deg)';
                        }
                    }
                });
                
                // Toggle del item actual
                const isActive = item.classList.contains('active');
                item.classList.toggle('active');
                
                if (!isActive) {
                    // Abrir
                    if (answer) {
                        const scrollHeight = answer.scrollHeight;
                        answer.style.maxHeight = scrollHeight + 'px';
                        answer.style.padding = '0 1.5rem 1.5rem';
                    }
                    if (icon) {
                        icon.style.transform = 'rotate(180deg)';
                    }
                } else {
                    // Cerrar
                    if (answer) {
                        answer.style.maxHeight = '0';
                        answer.style.padding = '0 1.5rem';
                    }
                    if (icon) {
                        icon.style.transform = 'rotate(0deg)';
                    }
                }
            });
        }
    });
    
    // Animaciones al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animaciones
    const animateElements = document.querySelectorAll('.service-card, .material-card, .gallery-item, .faq-item, .contact-item');
    animateElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
    
    // Formulario de cita - Redirección directa a WhatsApp
    console.log('Formulario de cita encontrado:', appointmentForm);
    
    if (appointmentForm) {
        let isSubmitting = false; // Prevenir múltiples envíos
        
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Prevenir múltiples envíos
            if (isSubmitting) {
                console.log('Formulario ya se está enviando...');
                return;
            }
            
            isSubmitting = true;
            console.log('Formulario de cita enviado');
            
            // Obtener datos del formulario
            const name = document.getElementById('clientName').value.trim();
            const phone = document.getElementById('clientPhone').value.trim();
            const service = document.getElementById('serviceType').value;
            const date = document.getElementById('preferredDate').value;
            const time = document.getElementById('preferredTime').value;
            const additionalInfo = document.getElementById('additionalInfo').value.trim();
            
            console.log('Datos del formulario:', { name, phone, service, date, time, additionalInfo });
            
            // Validación básica
            if (!name || !phone || !service) {
                showNotification('Por favor, completa los campos obligatorios: Nombre, Teléfono y Tipo de Perforación.', 'error');
                isSubmitting = false;
                return;
            }
            
            // Validar formato de teléfono básico
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(phone)) {
                showNotification('Por favor, ingresa un número de teléfono válido.', 'error');
                isSubmitting = false;
                return;
            }
            
            // Mostrar loading
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirigiendo...';
            submitBtn.disabled = true;
            
            // Crear mensaje para WhatsApp
            let whatsappMessage = `🌸 *SOLICITUD DE CITA PARA PERFORACIÓN* 🌸\n\n`;
            whatsappMessage += `👤 *Cliente:* ${name}\n`;
            whatsappMessage += `📱 *Teléfono:* ${phone}\n`;
            whatsappMessage += `💎 *Servicio:* ${service}\n`;
            
            if (date) {
                const formattedDate = new Date(date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                whatsappMessage += `📅 *Fecha preferida:* ${formattedDate}\n`;
            }
            
            if (time) {
                whatsappMessage += `🕐 *Hora preferida:* ${time}\n`;
            }
            
            if (additionalInfo) {
                whatsappMessage += `📝 *Información adicional:*\n${additionalInfo}\n`;
            }
            
            whatsappMessage += `\n✨ ¡Espero tu respuesta para confirmar la cita! ✨`;
            
            // Copiar al portapapeles como respaldo
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(whatsappMessage).catch(() => {});
            }
            
            // Número de WhatsApp del negocio
            const businessPhoneNumber = '522351081694';
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // Detección de plataforma
            const ua = navigator.userAgent;
            const isAndroid = /Android/i.test(ua);
            const isIOS = /iPhone|iPad|iPod/i.test(ua);
            
            // URLs de apertura de APP
            const appScheme = `whatsapp://send?phone=${businessPhoneNumber}&text=${encodedMessage}`;
            const androidIntent = `intent://send?phone=${businessPhoneNumber}&text=${encodedMessage}#Intent;scheme=whatsapp;package=com.whatsapp;end`;
            
            // Aviso: mensaje copiado por si la app no lo prellena
            showNotification('Abriendo la app de WhatsApp… si no ves el texto, solo pégalo (Ctrl+V).', 'info');
            
            try {
                if (isAndroid) {
                    // Intento preferente en Android para asegurar texto
                    window.location.href = androidIntent;
                } else {
                    // iOS y escritorio
                    window.location.href = appScheme;
                }
            } catch (_) {}
            
            // Si seguimos visibles, ofrecer reintento de apertura de la app (mismo esquema)
            setTimeout(() => {
                if (document.visibilityState === 'visible') {
                    const retry = document.createElement('a');
                    retry.href = isAndroid ? androidIntent : appScheme;
                    retry.style.display = 'none';
                    document.body.appendChild(retry);
                    retry.click();
                    setTimeout(() => { if (document.body.contains(retry)) document.body.removeChild(retry); }, 0);
                }
            }, 1200);
            
            // Recordatorio para pegar el texto si aún no aparece
            setTimeout(() => {
                if (document.visibilityState === 'hidden') return; // ya salimos a la app
                showNotification('Si la app abrió sin texto, el mensaje ya está copiado. Pégalo y envíalo.', 'info');
            }, 2200);
            
            // Restaurar UI
            appointmentForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            isSubmitting = false;
        });
    } else {
        console.error('No se encontró el formulario de cita');
    }
    
    function showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Agregar estilos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        // Agregar al DOM
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Botón de cerrar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });
        
        // Auto-cerrar después de 5 segundos
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Efecto parallax suave en el hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Header que desaparece al hacer scroll hacia abajo
    let lastScrollTop = 0;
    let ticking = false;
    const headerEl = document.querySelector('.header');
    
    function updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 150) {
            // Scrolling hacia abajo y más de 150px - ocultar header
            if (headerEl) headerEl.style.transform = 'translateY(-100%)';
        } else if (scrollTop < lastScrollTop || scrollTop < 50) {
            // Scrolling hacia arriba o cerca del top - mostrar header
            if (headerEl) headerEl.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
    
    // Contador animado para estadísticas
    function animateCounters() {
        const counters = document.querySelectorAll('.stat h3');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const suffix = counter.textContent.replace(/\d/g, '');
            let current = 0;
            const increment = target / 50;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + suffix;
                }
            };
            
            updateCounter();
        });
    }
    
    // Activar contadores cuando el hero sea visible
    const heroObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                heroObserver.unobserve(entry.target);
            }
        });
    });
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        heroObserver.observe(heroStats);
    }
    
    // Configurar lightbox para la galería (se llamará después de cargar desde storage)
    setupGalleryLightbox();
    
    // Validación de formulario en tiempo real
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Validaciones específicas
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, ingresa un email válido';
            }
        }
        
        if (field.type === 'tel') {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (value && !phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, ingresa un teléfono válido';
            }
        }
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        }
        
        // Mostrar error si es necesario
        if (!isValid) {
            showFieldError(field, errorMessage);
        } else {
            clearFieldError(field);
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        clearFieldError(field);
        
        field.style.borderColor = '#ef4444';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        `;
        
        field.parentNode.appendChild(errorDiv);
    }
    
    function clearFieldError(field) {
        field.style.borderColor = '#e2e8f0';
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // Efecto de escritura en el título principal
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Activar efecto de escritura cuando la página cargue
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 1000);
    }
    
    // Lazy loading para imágenes (cuando se agreguen imágenes reales)
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    // Observar imágenes lazy
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
    
    // Preloader (opcional)
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });
    
    console.log('Página web de Pop Pierce Studio cargada correctamente ✨');
});

// ========== FUNCIONES DE CARGA DINÁMICA ==========

async function loadLogosFromStorage() {
    const LOGOS_KEY = 'pop_pierce_logos';
    
    // Intentar cargar desde GitHub primero
    try {
        const response = await fetch('data.json?' + Date.now()); // Cache busting
        if (response.ok) {
            const data = await response.json();
            if (data.logos && Object.keys(data.logos).length > 0) {
                localStorage.setItem(LOGOS_KEY, JSON.stringify(data.logos));
            }
        }
    } catch (error) {
        console.log('No se pudo cargar desde GitHub, usando datos locales');
    }
    
    const logos = JSON.parse(localStorage.getItem(LOGOS_KEY) || '{}');
    
    // Cargar logo del header
    const headerLogo = document.getElementById('header-logo');
    if (headerLogo && logos.header) {
        headerLogo.src = logos.header;
    }
    
    // Cargar logo del hero
    const heroLogo = document.getElementById('hero-logo');
    if (heroLogo && logos.hero) {
        heroLogo.src = logos.hero;
    }
    
    // Cargar logo del footer
    const footerLogo = document.getElementById('footer-logo');
    if (footerLogo && logos.footer) {
        footerLogo.src = logos.footer;
    }
}

// Función para extraer las imágenes originales del HTML
function extractOriginalGalleryItems() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return [];
    
    const originalItems = [];
    const galleryItems = galleryGrid.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const img = item.querySelector('.gallery-img');
        const video = item.querySelector('video');
        const desc = item.querySelector('.gallery-desc');
        
        if (video) {
            const source = video.querySelector('source');
            if (source) {
                originalItems.push({
                    type: 'video',
                    src: source.getAttribute('src'),
                    description: desc ? desc.textContent.trim() : ''
                });
            }
        } else if (img) {
            originalItems.push({
                type: 'image',
                src: img.getAttribute('src'),
                description: desc ? desc.textContent.trim() : ''
            });
        }
    });
    
    return originalItems;
}

// Función para migrar imágenes originales a data.json
function migrateOriginalGallery() {
    const GALLERY_KEY = 'pop_pierce_gallery';
    const MIGRATION_KEY = 'gallery_migrated';
    
    // Verificar si ya se hizo la migración
    if (localStorage.getItem(MIGRATION_KEY) === 'true') {
        return;
    }
    
    // Extraer imágenes originales del HTML
    const originalItems = extractOriginalGalleryItems();
    
    if (originalItems.length > 0) {
        // Obtener galería actual (puede estar vacía o tener nuevas imágenes)
        const currentGallery = JSON.parse(localStorage.getItem(GALLERY_KEY) || '[]');
        
        // Combinar: primero las originales, luego las nuevas
        // Pero solo si no hay duplicados
        const combinedGallery = [...originalItems];
        
        // Agregar nuevas imágenes que no estén en las originales
        currentGallery.forEach(newItem => {
            const exists = originalItems.some(orig => orig.src === newItem.src);
            if (!exists) {
                combinedGallery.push(newItem);
            }
        });
        
        // Guardar la galería combinada
        localStorage.setItem(GALLERY_KEY, JSON.stringify(combinedGallery));
        
        // Marcar como migrado
        localStorage.setItem(MIGRATION_KEY, 'true');
        
        console.log('Galería original migrada:', combinedGallery.length, 'elementos');
    }
}

async function loadGalleryFromStorage() {
    const GALLERY_KEY = 'pop_pierce_gallery';
    const galleryGrid = document.getElementById('gallery-grid');
    
    if (!galleryGrid) return;
    
    // Migrar imágenes originales la primera vez
    migrateOriginalGallery();
    
    // Obtener imágenes originales del HTML para combinarlas si es necesario
    const originalItems = extractOriginalGalleryItems();
    
    // Intentar cargar desde GitHub primero - SIEMPRE priorizar GitHub si está disponible
    let gallery = [];
    let loadedFromGitHub = false;
    
    try {
        const response = await fetch('data.json?' + Date.now()); // Cache busting
        if (response.ok) {
            const data = await response.json();
            if (data.gallery && Array.isArray(data.gallery)) {
                // Usar la versión de GitHub como base
                gallery = data.gallery;
                loadedFromGitHub = true;
                console.log('Galería cargada desde GitHub:', gallery.length, 'elementos');
                
                // Combinar con imágenes originales que no estén ya en la galería
                // Esto asegura que las imágenes originales nunca se pierdan
                originalItems.forEach(originalItem => {
                    const exists = gallery.some(item => item.src === originalItem.src);
                    if (!exists) {
                        gallery.push(originalItem);
                        console.log('Imagen original agregada:', originalItem.src);
                    }
                });
                
                // Guardar la galería combinada en localStorage
                localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
            }
        }
    } catch (error) {
        console.log('No se pudo cargar desde GitHub, usando datos locales:', error);
    }
    
    // Solo usar localStorage si no se pudo cargar desde GitHub
    if (!loadedFromGitHub) {
        gallery = JSON.parse(localStorage.getItem(GALLERY_KEY) || '[]');
        
        // Asegurarse de que las imágenes originales estén incluidas
        originalItems.forEach(originalItem => {
            const exists = gallery.some(item => item.src === originalItem.src);
            if (!exists) {
                gallery.push(originalItem);
            }
        });
        
        // Guardar la galería combinada
        localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
        console.log('Galería cargada desde localStorage:', gallery.length, 'elementos');
    }
    
    // Si hay elementos, reemplazar el contenido
    if (gallery.length > 0) {
        galleryGrid.innerHTML = '';
        
        gallery.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            if (item.type === 'video') {
                galleryItem.innerHTML = `
                    <video controls preload="metadata" class="gallery-video" playsinline>
                        <source src="${item.src}" type="video/mp4">
                        Tu navegador no soporta la reproducción de videos.
                    </video>
                    <div class="gallery-desc">${item.description || ''}</div>
                `;
            } else {
                galleryItem.innerHTML = `
                    <img src="${item.src}" alt="Pop Pierce Studio - Trabajo" class="gallery-img">
                    <div class="gallery-desc">${item.description || ''}</div>
                `;
            }
            
            galleryGrid.appendChild(galleryItem);
        });
        
        // Re-aplicar eventos de lightbox a los nuevos elementos
        setTimeout(() => {
            setupGalleryLightbox();
        }, 100);
    } else {
        // Si no hay datos, mantener el contenido por defecto y configurar lightbox
        setTimeout(() => {
            setupGalleryLightbox();
        }, 100);
    }
}

function setupGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        // No abrir modal si se hace clic en un video
        const video = item.querySelector('video');
        if (video) {
            video.addEventListener('click', function(e) {
                e.stopPropagation();
            });
            return;
        }
        
        // Solo agregar listener si no tiene uno ya
        if (item.hasAttribute('data-lightbox-setup')) {
            return;
        }
        item.setAttribute('data-lightbox-setup', 'true');
        
        item.addEventListener('click', function() {
            const img = item.querySelector('.gallery-img');
            if (!img) return;
            
            // Crear modal de imagen
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    <img src="${img.src}" alt="Imagen ampliada" style="max-width: 90vw; max-height: 90vh; border-radius: 10px;">
                </div>
            `;
            
            // Estilos del modal
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            const modalContent = modal.querySelector('.modal-content');
            modalContent.style.cssText = `
                position: relative;
                max-width: 90%;
                max-height: 90%;
            `;
            
            const closeBtn = modal.querySelector('.modal-close');
            closeBtn.style.cssText = `
                position: absolute;
                top: -40px;
                right: 0;
                font-size: 3rem;
                cursor: pointer;
                color: white;
                z-index: 10001;
            `;
            
            // Agregar al DOM
            document.body.appendChild(modal);
            
            // Animar entrada
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
            
            // Cerrar modal
            const closeModal = () => {
                modal.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.contains(modal)) {
                        document.body.removeChild(modal);
                    }
                }, 300);
            };
            
            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            // Cerrar con tecla ESC
            const handleKeyPress = (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', handleKeyPress);
                }
            };
            document.addEventListener('keydown', handleKeyPress);
        });
    });
}

// Escuchar cambios en localStorage para actualizar en tiempo real
window.addEventListener('storage', function(e) {
    if (e.key === 'pop_pierce_logos') {
        loadLogosFromStorage();
    }
    if (e.key === 'pop_pierce_gallery') {
        loadGalleryFromStorage();
    }
});

// También escuchar cambios del mismo tab usando polling (cada 5 segundos)
// Esto permite que los cambios se reflejen cuando se edita desde admin.html
// También verifica cambios en GitHub periódicamente
let lastGitHubCheck = 0;
const GITHUB_CHECK_INTERVAL = 10000; // Verificar GitHub cada 10 segundos

setInterval(function() {
    const currentLogos = JSON.stringify(JSON.parse(localStorage.getItem('pop_pierce_logos') || '{}'));
    const currentGallery = JSON.stringify(JSON.parse(localStorage.getItem('pop_pierce_gallery') || '[]'));
    
    // Verificar cambios en localStorage
    if (!window.lastLogosState || window.lastLogosState !== currentLogos) {
        window.lastLogosState = currentLogos;
        loadLogosFromStorage();
    }
    
    if (!window.lastGalleryState || window.lastGalleryState !== currentGallery) {
        window.lastGalleryState = currentGallery;
        loadGalleryFromStorage();
    }
    
    // Verificar cambios en GitHub periódicamente (cada 10 segundos)
    const now = Date.now();
    if (now - lastGitHubCheck > GITHUB_CHECK_INTERVAL) {
        lastGitHubCheck = now;
        
        // Verificar si hay cambios en GitHub
        fetch('data.json?' + Date.now())
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('No se pudo cargar desde GitHub');
            })
            .then(data => {
                if (data.gallery && Array.isArray(data.gallery)) {
                    // Obtener imágenes originales para combinarlas
                    const originalItems = extractOriginalGalleryItems();
                    
                    // Combinar galería de GitHub con originales
                    const combinedGallery = [...data.gallery];
                    originalItems.forEach(originalItem => {
                        const exists = data.gallery.some(item => item.src === originalItem.src);
                        if (!exists) {
                            combinedGallery.push(originalItem);
                        }
                    });
                    
                    const githubGalleryStr = JSON.stringify(combinedGallery);
                    const currentGalleryStr = JSON.stringify(JSON.parse(localStorage.getItem('pop_pierce_gallery') || '[]'));
                    
                    // Verificar si hay cambios locales pendientes
                    const hasLocalChanges = localStorage.getItem('gallery_has_local_changes') === 'true';
                    const lastChangeTime = parseInt(localStorage.getItem('gallery_last_change_time') || '0');
                    const timeSinceChange = Date.now() - lastChangeTime;
                    const CHANGE_PROTECTION_TIME = 300000; // 5 minutos de protección
                    
                    // Si la galería de GitHub es diferente, actualizar
                    // PERO solo si no hay cambios locales recientes (menos de 5 minutos)
                    if (githubGalleryStr !== currentGalleryStr) {
                        if (!hasLocalChanges || timeSinceChange > CHANGE_PROTECTION_TIME) {
                            console.log('Cambios detectados en GitHub, actualizando galería...');
                            localStorage.setItem('pop_pierce_gallery', JSON.stringify(combinedGallery));
                            loadGalleryFromStorage();
                        } else {
                            console.log('Cambios locales detectados, no sobrescribiendo desde GitHub');
                        }
                    }
                }
                
                if (data.logos && Object.keys(data.logos).length > 0) {
                    const githubLogosStr = JSON.stringify(data.logos);
                    const currentLogosStr = JSON.stringify(JSON.parse(localStorage.getItem('pop_pierce_logos') || '{}'));
                    
                    // Si los logos de GitHub son diferentes, actualizar
                    if (githubLogosStr !== currentLogosStr) {
                        console.log('Cambios detectados en GitHub, actualizando logos...');
                        localStorage.setItem('pop_pierce_logos', JSON.stringify(data.logos));
                        loadLogosFromStorage();
                    }
                }
            })
            .catch(error => {
                // Silenciar errores de red, solo loguear en desarrollo
                // console.log('Error al verificar GitHub:', error);
            });
    }
}, 2000);


// Funciones utilitarias globales
window.PopPierceStudio = {
    // Función para mostrar mensaje de WhatsApp
    openWhatsApp: function(message = 'Hola, me interesa agendar una cita para perforaciones') {
        const phoneNumber = '522351081694'; // Número del negocio
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    },
    
    // Función para compartir la página
    sharePage: function() {
        if (navigator.share) {
            navigator.share({
                title: 'Pop Pierce Studio',
                text: 'Descubre los mejores servicios de perforaciones profesionales',
                url: window.location.href
            });
        } else {
            // Fallback para navegadores que no soportan Web Share API
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                alert('¡Enlace copiado al portapapeles!');
            });
        }
    },
    
    // Función para agendar cita rápida
    quickBooking: function(service) {
        const message = `🌸 *SOLICITUD DE CITA RÁPIDA* 🌸\n\n💎 *Servicio:* ${service}\n\n✨ ¡Me interesa agendar una cita! ✨`;
        this.openWhatsApp(message);
    }
};

