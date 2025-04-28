document.addEventListener('DOMContentLoaded', function() {
    // Before-After Slider Functionality
    const beforeAfterItems = document.querySelectorAll('.before-after-item');
    
    beforeAfterItems.forEach(item => {
        const container = item.querySelector('.image-container');
        const afterImage = item.querySelector('.after');
        const imageLink = item.querySelector('.image-link');
        
        if (!container || !afterImage || !imageLink) return;
        
        let isDragging = false;
        
        // Make the entire container draggable except when clicking the link
        container.addEventListener('mousedown', function(e) {
            if (e.target.closest('a')) return;
            isDragging = true;
            moveSlider(e);
            e.preventDefault();
        });
        
        container.addEventListener('touchstart', function(e) {
            if (e.target.closest('a')) return;
            isDragging = true;
            moveSlider(e.touches[0]);
            e.preventDefault();
        });
        
        window.addEventListener('mouseup', function() {
            isDragging = false;
        });
        
        window.addEventListener('touchend', function() {
            isDragging = false;
        });
        
        window.addEventListener('mousemove', function(e) {
            if (isDragging) {
                moveSlider(e);
                e.preventDefault();
            }
        });
        
        window.addEventListener('touchmove', function(e) {
            if (isDragging) {
                moveSlider(e.touches[0]);
                e.preventDefault();
            }
        });
        
        function moveSlider(e) {
            const rect = container.getBoundingClientRect();
            const x = e.pageX - rect.left;
            const width = container.offsetWidth;
            
            let position = (x / width) * 100;
            position = Math.max(0, Math.min(100, position));
            
            afterImage.style.width = position + '%';
        }
    });
    
    // Lightbox Functionality
    const imageLinks = document.querySelectorAll('.image-link');
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <a href="#" class="close-lightbox">&times;</a>
        <div class="lightbox-content">
            <img class="lightbox-img" src="" alt="">
            <p class="lightbox-caption"></p>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeLightbox = lightbox.querySelector('.close-lightbox');
    
    imageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only open lightbox if not dragging
            if (!isDragging) {
                e.preventDefault();
                const fullSizeSrc = this.getAttribute('href');
                const caption = this.nextElementSibling.textContent;
                
                lightboxImg.src = fullSizeSrc;
                lightboxImg.alt = caption;
                lightboxCaption.textContent = caption;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    closeLightbox.addEventListener('click', function(e) {
        e.preventDefault();
        closeLightboxHandler();
    });
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightboxHandler();
        }
    });
    
    function closeLightboxHandler() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Close with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightboxHandler();
        }
    });
});