
document.addEventListener('DOMContentLoaded', function() {
    // 1. Create Player HTML & CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #aster-player {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: auto;
            min-width: 280px;
            background: rgba(16, 20, 28, 0.6);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 50px;
            padding: 10px 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 10000;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            font-family: 'Inter', sans-serif;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
        }

        #aster-player::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), transparent);
            pointer-events: none;
            z-index: -1;
        }

        #aster-player:hover {
            transform: translateY(-2px);
            background: rgba(16, 20, 28, 0.85);
            border-color: rgba(59, 130, 246, 0.3);
            box-shadow: 0 12px 40px rgba(0,0,0,0.6);
        }

        .ap-info {
            display: flex;
            flex-direction: column;
            margin-right: auto;
        }
        
        .ap-title {
            color: #fff;
            font-size: 14px;
            font-weight: 600;
            white-space: nowrap;
        }

        .ap-status {
            color: rgba(255, 255, 255, 0.5);
            font-size: 11px;
        }

        .ap-controls {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .ap-btn {
            background: none;
            border: none;
            cursor: pointer;
            color: #fff;
            padding: 8px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }

        .ap-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #3b82f6;
        }

        .ap-play-btn {
            background: rgba(59, 130, 246, 0.2);
            color: #3b82f6;
            width: 40px;
            height: 40px;
        }
        
        .ap-play-btn:hover {
            background: #3b82f6;
            color: #fff;
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
        }

        /* Equalizer Animation */
        .ap-equalizer {
            display: flex;
            gap: 2px;
            height: 12px;
            align-items: flex-end;
        }
        
        .ap-bar {
            width: 3px;
            background: #3b82f6;
            animation: bounce 1s infinite ease-in-out;
        }
        
        .ap-bar:nth-child(1) { animation-duration: 0.8s; height: 6px; }
        .ap-bar:nth-child(2) { animation-duration: 1.1s; height: 10px; }
        .ap-bar:nth-child(3) { animation-duration: 0.9s; height: 8px; }

        .paused .ap-bar {
            animation-play-state: paused;
            height: 3px !important;
            transition: height 0.3s;
        }

        @keyframes bounce {
            0%, 100% { height: 4px; }
            50% { height: 12px; }
        }

        @media (max-width: 768px) {
            #aster-player {
                bottom: 70px; /* Above bottom nav if any */
                right: 50%;
                transform: translateX(50%);
                width: 90%;
                max-width: 350px;
            }
            #aster-player:hover {
                transform: translateX(50%) translateY(-2px);
            }
        }
    `;
    document.head.appendChild(style);

    const playerHTML = `
        <div id="aster-player" class="paused">
            <div class="ap-info">
                <span class="ap-title">Aster Ambient</span>
                <span class="ap-status">Ready to play</span>
            </div>
            <div class="ap-equalizer">
                <div class="ap-bar"></div>
                <div class="ap-bar"></div>
                <div class="ap-bar"></div>
            </div>
            <div class="ap-controls">
                <button class="ap-btn ap-play-btn" id="ap-toggle">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </button>
            </div>
        </div>
        <audio id="global-audio" src="music1.mp3" loop preload="auto"></audio>
    `;

    const playerContainer = document.createElement('div');
    playerContainer.innerHTML = playerHTML;
    document.body.appendChild(playerContainer);

    // 2. Logic
    const audio = document.getElementById('global-audio');
    const player = document.getElementById('aster-player');
    const toggleBtn = document.getElementById('ap-toggle');
    const statusText = player.querySelector('.ap-status');
    
    const playIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
    const pauseIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';

    // Load state
    const savedTime = localStorage.getItem('aster_audio_time');
    const savedStatus = localStorage.getItem('aster_audio_playing');

    if (savedTime) {
        audio.currentTime = parseFloat(savedTime);
    }

    function updateUI(isPlaying) {
        if (isPlaying) {
            toggleBtn.innerHTML = pauseIcon;
            player.classList.remove('paused');
            statusText.textContent = "Playing...";
        } else {
            toggleBtn.innerHTML = playIcon;
            player.classList.add('paused');
            statusText.textContent = "Paused";
        }
    }

    function togglePlay() {
        if (audio.paused) {
            audio.play().then(() => {
                localStorage.setItem('aster_audio_playing', 'true');
                updateUI(true);
            }).catch(e => {
                console.log("Autoplay blocked", e);
                statusText.textContent = "Click to play";
            });
        } else {
            audio.pause();
            localStorage.setItem('aster_audio_playing', 'false');
            updateUI(false);
        }
    }

    toggleBtn.addEventListener('click', togglePlay);

    // Update time constantly
    audio.addEventListener('timeupdate', () => {
        localStorage.setItem('aster_audio_time', audio.currentTime);
    });

    // Attempt Auto-Resume
    if (savedStatus === 'true') {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                updateUI(true);
            }).catch(error => {
                console.log("Autoplay prevented by browser. Waiting for interaction.");
                updateUI(false);
                statusText.textContent = "Resume Music";
            });
        }
    } else {
        updateUI(false);
    }

    // 3. PJAX / Turbo-like Navigation (The "Never Stop" feature)
    // Only intercepts internal links to prevent full reload
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        
        // Validation: must be link, internal, not anchor, not target_blank
        if (!link || !link.href) return;
        if (link.target === '_blank') return;
        if (link.href.includes('#')) return;
        
        const targetUrl = new URL(link.href);
        if (targetUrl.origin !== window.location.origin) return;

        // Prevent default navigation
        e.preventDefault();
        
        // UI Feedback (optional)
        document.body.style.cursor = 'wait';

        fetch(link.href)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const newDoc = parser.parseFromString(html, 'text/html');
                
                // Replace content
                const newContent = newDoc.querySelector('.pc-container');
                const oldContent = document.querySelector('.pc-container');

                if (newContent && oldContent) {
                    oldContent.innerHTML = newContent.innerHTML;
                    
                    // Update Title
                    document.title = newDoc.title;
                    
                    // Update History
                    history.pushState(null, newDoc.title, link.href);

                    // Re-Execute Scripts (Crucial for Charts/Sidebar)
                    // We extract scripts from the NEW content and run them
                    const scripts = oldContent.querySelectorAll('script');
                    scripts.forEach(script => {
                        const newScript = document.createElement('script');
                        if (script.src) {
                            newScript.src = script.src;
                        } else {
                            newScript.textContent = script.textContent;
                        }
                        document.body.appendChild(newScript);
                    });
                    
                    // Re-init Sidebar (Assuming pcoded.js handles this on load, might need manual trigger)
                    // Try to re-trigger layout change if function exists
                    if (typeof layout_change === 'function') layout_change('dark');

                } else {
                    // Fallback if structure doesn't match
                    window.location.href = link.href;
                }
            })
            .catch(err => {
                console.error("PJAX Error:", err);
                window.location.href = link.href;
            })
            .finally(() => {
                document.body.style.cursor = 'default';
            });
    });

    // Handle Back/Forward buttons
    window.addEventListener('popstate', () => {
        window.location.reload(); // Simplest way to handle back button for now
    });
});
