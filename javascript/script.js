
    const menuBtn = document.querySelector('.menu-btn');
    const sideMenu = document.getElementById('sideMenu');

    
    menuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sideMenu.classList.toggle('active');
    });

    
    document.addEventListener('click', (e) => {
        if (!sideMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            sideMenu.classList.remove('active');
        }
    });