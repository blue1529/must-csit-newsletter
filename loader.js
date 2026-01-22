// Typewriter Configuration
        const text = "Welcome to CSIT Society Newsletter";
        const typewriterElement = document.getElementById('typewriter');
        const loadingBar = document.getElementById('loadingBar');
        const loader = document.getElementById('csit-loader');
        
        let i = 0;
        let typingSpeed = 100; // milliseconds per character
        
        // Typewriter Function
        function typeWriter() {
            if (i < text.length) {
                typewriterElement.innerHTML = text.substring(0, i + 1) + '<span class="typewriter-cursor"></span>';
                i++;
                
                // Update loading bar progress
                loadingBar.style.width = `${(i / text.length) * 100}%`;
                
                // Random speed variation for natural feel
                setTimeout(typeWriter, typingSpeed + Math.random() * 50);
            } else {
                // Animation complete - add final cursor blink
                typewriterElement.innerHTML = text + '<span class="typewriter-cursor"></span>';
                
                // Wait a moment, then fade out loader
                setTimeout(() => {
                    loader.style.opacity = '0';
                    loader.style.transition = 'opacity 0.5s ease';
                    
                    // Remove loader from DOM after fade out
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 500);
                }, 1000);
            }
        }
        
        // Start the typewriter effect when page loads
        window.addEventListener('load', () => {
            setTimeout(typeWriter, 500); // Short delay before starting
        });
        
        // Optional: Skip loader if page takes too long to load
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (i < text.length) {
                    loader.style.display = 'none';
                }
            }, 5000); // 5 second timeout
        });