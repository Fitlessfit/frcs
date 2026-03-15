document.addEventListener('DOMContentLoaded', function() {
    // Обработчик кликов по навигационным ссылкам
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Вычисляем позицию с учетом фиксированного header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20; // + небольшой отступ
                
                // Плавная прокрутка
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Дополнительно: добавляем плавную прокрутку для всех внутренних ссылок
    const allInternalLinks = document.querySelectorAll('a[href^="#"]');
    
    allInternalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Игнорируем пустые якоря
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Дополнительная функция для обновления активного пункта меню при скролле
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        if (window.scrollY >= (sectionTop - headerHeight - 100)) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Вызываем при скролле
window.addEventListener('scroll', updateActiveNavLink);

// Серый фон шапки при скролле
(function() {
    const header = document.querySelector('.header');
    function toggleHeaderBg() {
        if (window.scrollY > 40) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }
    window.addEventListener('scroll', toggleHeaderBg, { passive: true });
    toggleHeaderBg();
})();

// === БУРГЕР-МЕНЮ ===
(function() {
    const burgerBtn = document.getElementById('burgerBtn');
    const drawerMenu = document.getElementById('drawerMenu');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerClose = document.getElementById('drawerClose');

    if (!burgerBtn || !drawerMenu) return;

    function openDrawer() {
        drawerMenu.classList.add('open');
        drawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    window.closeDrawer = function() {
        drawerMenu.classList.remove('open');
        drawerOverlay.classList.remove('open');
        document.body.style.overflow = '';
    };

    burgerBtn.addEventListener('click', openDrawer);
    drawerClose.addEventListener('click', closeDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);

    drawerMenu.querySelectorAll('.drawer__link').forEach(function(link) {
        link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeDrawer();
    });
})();