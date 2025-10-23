// Funcionalidad principal de la página web
document.addEventListener('DOMContentLoaded', function() {
    
    // Test simple para verificar que el JavaScript funciona
    console.log('Script cargado correctamente');
    
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
        
        // Agregar un evento de prueba simple
        hamburger.addEventListener('click', function() {
            console.log('¡CLICK DETECTADO!');
            alert('¡El botón funciona!');
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
        
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('¡Hamburguesa clickeado!');
            
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                console.log('Menú abierto');
            } else {
                document.body.style.overflow = '';
                console.log('Menú cerrado');
            }
        });
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
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Cerrar otros items abiertos
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle del item actual
            item.classList.toggle('active');
        });
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
            
            // Configurar número de WhatsApp del negocio
            const businessPhoneNumber = '522351081694'; // Número del negocio
            
            // Crear URL de WhatsApp
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/${businessPhoneNumber}?text=${encodedMessage}`;
            
            console.log('URL de WhatsApp:', whatsappUrl);
            
            // Mostrar notificación de éxito
            showNotification('¡Redirigiendo a WhatsApp para agendar tu cita!', 'success');
            
            // Redirigir a WhatsApp después de un breve delay
            setTimeout(() => {
                try {
                    // Intentar abrir WhatsApp en nueva ventana
                    window.open(whatsappUrl, '_blank');
                    
                    // Limpiar formulario
                    appointmentForm.reset();
                    
                    // Restaurar botón
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    isSubmitting = false;
                    
                } catch (error) {
                    console.error('Error al abrir WhatsApp:', error);
                    showNotification('Error al abrir WhatsApp. Por favor, intenta de nuevo.', 'error');
            
            // Restaurar botón
                    submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                    isSubmitting = false;
                }
            }, 1500);
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
    const header = document.querySelector('.header');
    
    function updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 150) {
            // Scrolling hacia abajo y más de 150px - ocultar header
            header.style.transform = 'translateY(-100%)';
        } else if (scrollTop < lastScrollTop || scrollTop < 50) {
            // Scrolling hacia arriba o cerca del top - mostrar header
            header.style.transform = 'translateY(0)';
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
    
    // Galería de imágenes (simulación de lightbox)
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Crear modal de imagen
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    <div class="modal-image">
                        <i class="fas fa-image"></i>
                        <p>Imagen del trabajo aquí</p>
                    </div>
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
                background: white;
                border-radius: 15px;
                padding: 2rem;
                text-align: center;
            `;
            
            const modalImage = modal.querySelector('.modal-image');
            modalImage.style.cssText = `
                width: 300px;
                height: 300px;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                border-radius: 15px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: white;
                margin: 0 auto;
            `;
            
            const closeBtn = modal.querySelector('.modal-close');
            closeBtn.style.cssText = `
                position: absolute;
                top: 10px;
                right: 15px;
                font-size: 2rem;
                cursor: pointer;
                color: #666;
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

