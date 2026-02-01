function getQueryStringParameters(){var n="",r="";if(sessionStorage.getItem("isp",r))n=sessionStorage.getItem("BuyNowLink"),r=sessionStorage.getItem("isp");else try{var e=window.location.search;1==new URLSearchParams(e).get("isp")?(r="?isp=1",n="starkturial",sessionStorage.setItem("isp",r),sessionStorage.setItem("BuyNowLink",n)):n="starkturial"}catch(e){n="starkturial"}document.addEventListener("DOMContentLoaded",function(){for(var e=document.querySelectorAll(".btn-buy, .buynowlinks"),t=0;t<e.length;t++)e[t].setAttribute("href",n)}),document.addEventListener("DOMContentLoaded",function(){for(var e=document.querySelectorAll(".technology-block a,.drp-technology a, .tech-link a"),t=0;t<e.length;t++){var n=e[t].getAttribute("href");e[t].setAttribute("href",n+r)}})}getQueryStringParameters();

/* Auth UI Management */
(function() {
    let lastState = null;

    function updateAuthUI() {
        fetch('user_status.php')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                // Create a unique state string including loggedIn, username, and premium_expiration
                const newState = JSON.stringify({ 
                    loggedIn: data.loggedIn, 
                    username: data.username,
                    expiration: data.premium_expiration 
                });
                
                // Avoid unnecessary DOM updates if state hasn't changed
                if (lastState === newState) return;
                lastState = newState;

                const container = document.querySelector('.pc-header .header-wrapper .ms-auto ul.list-unstyled');
                if (!container) return;

                // Look for existing auth item or create one
                let authItem = container.querySelector('#auth-ui-item');
                if (!authItem) {
                    authItem = document.createElement('li');
                    authItem.id = 'auth-ui-item';
                    authItem.className = 'pc-h-item d-flex align-items-center';
                }

                // Position authItem before mobile-collapse if it exists externally
                const mobileCollapseBtn = document.getElementById('mobile-collapse');
                let inserted = false;
                if (mobileCollapseBtn) {
                    const mobileLi = mobileCollapseBtn.closest('li');
                    // Only move if mobileLi is a direct child of container and not authItem itself
                    if (mobileLi && mobileLi.parentElement === container && mobileLi !== authItem) {
                        // Insert before mobileLi if not already there
                        if (authItem.nextElementSibling !== mobileLi) {
                            container.insertBefore(authItem, mobileLi);
                        }
                        inserted = true;
                    }
                }

                if (!inserted && !authItem.parentElement) {
                    container.appendChild(authItem);
                }

                authItem.innerHTML = ''; // Clear current content

                if (data.loggedIn) {
                    // Connected: Show Deep Space Glass User Card
                    const card = document.createElement('div');
                    card.className = 'glass-auth-container';
                    
                    // 1. Avatar Circle (Image or First Letter)
                    const avatarLink = document.createElement('a');
                    avatarLink.href = 'profile'; // Link to profile page
                    avatarLink.className = 'glass-avatar-link';
                    avatarLink.style.textDecoration = 'none';

                    if (data.avatar && data.avatar !== 'assets/img/favicons/mstile-150x150.png' && data.avatar !== '') {
                        const img = document.createElement('img');
                        img.src = data.avatar;
                        img.className = 'glass-avatar-img';
                        img.style.width = '40px';
                        img.style.height = '40px';
                        img.style.borderRadius = '50%';
                        img.style.objectFit = 'cover';
                        img.style.border = '2px solid rgba(255, 255, 255, 0.2)';
                        img.style.marginRight = '15px';
                        img.onerror = function() {
                            this.onerror = null;
                            this.src = 'assets/img/favicons/mstile-150x150.png';
                        };
                        avatarLink.appendChild(img);
                    } else {
                        const avatar = document.createElement('div');
                        avatar.className = 'glass-avatar';
                        const initial = data.username ? data.username.charAt(0).toUpperCase() : 'U';
                        avatar.textContent = initial;
                        avatarLink.appendChild(avatar);
                    }
                    
                    // 2. User Info Section
                    const infoDiv = document.createElement('div');
                    infoDiv.className = 'glass-user-info';
                    
                    const userSpan = document.createElement('div');
                    userSpan.className = 'glass-username';
                    userSpan.textContent = data.username;
                    
                    const expSpan = document.createElement('a');
                    expSpan.className = 'glass-plan';
                    expSpan.href = 'profile';
                    expSpan.textContent = 'Your profile';
                    expSpan.style.textDecoration = 'none';
                    expSpan.style.cursor = 'pointer';

                    if (data.premium_expiration && data.premium_expiration !== 'null') {
                        expSpan.classList.add('is-premium');
                    }
                    
                    infoDiv.appendChild(userSpan);
                    infoDiv.appendChild(expSpan);
                    
                    // 2.5 Cyber Rank Section (Awesome Addition)
                    const rankDiv = document.createElement('div');
                    rankDiv.className = 'glass-rank-container';
                    
                    if (data.cyber_rank) {
                        // Apply Aswhale Fluid Theme
                        if (data.cyber_rank.rank_name === 'AsMythic') {
                            rankDiv.classList.add('rank-aswhale'); // Keep fluid effect for Max Rank
                            
                            // Interactive Tooltip Calculation
                            rankDiv.title = `Max Rank Achieved!`;
                        } else {
                            rankDiv.title = `Current Rank: ${data.cyber_rank.rank_name}`;
                        }

                        const rankTitle = document.createElement('div');
                        rankTitle.className = 'rank-title';
                        rankTitle.textContent = data.cyber_rank.rank_name || 'Ghost';
                        
                        const xpBg = document.createElement('div');
                        xpBg.className = 'xp-bar-bg';
                        
                        const xpFill = document.createElement('div');
                        xpFill.className = 'xp-bar-fill';
                        xpFill.style.width = (data.cyber_rank.xp_progress || 0) + '%';
                        
                        xpBg.appendChild(xpFill);
                        
                        const timeSpan = document.createElement('div');
                        timeSpan.className = 'rank-time';
                        timeSpan.textContent = data.cyber_rank.total_time_formatted || '0m';
                        
                        rankDiv.appendChild(rankTitle);
                        rankDiv.appendChild(xpBg);
                        rankDiv.appendChild(timeSpan);
                    }

                    // 3. Logout Button
                    const logoutBtn = document.createElement('button');
                    logoutBtn.className = 'glass-logout-btn';
                    logoutBtn.title = 'Logout';
                    logoutBtn.setAttribute('aria-label', 'Logout');
                    logoutBtn.innerHTML = '<i class="ti ti-power"></i>';
                    
                    logoutBtn.onclick = function() {
                        const form = document.createElement('form');
                        form.method = 'POST';
                        form.action = 'logout.php';
                        const input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = 'csrf_token';
                        input.value = data.csrfToken;
                        form.appendChild(input);
                        document.body.appendChild(form);
                        form.submit();
                    };
                    
                    card.appendChild(avatarLink);
                    card.appendChild(infoDiv);
                    card.appendChild(rankDiv);
                    card.appendChild(logoutBtn);
                    
                    authItem.appendChild(card);
                } else {
                    // Not connected: Buttons are now handled by PHP server-side to prevent duplicates
                }

                // Mobile Menu Toggle Logic
                // Ensure the mobile menu button is present and positioned correctly
                let mobileCollapse = document.getElementById('mobile-collapse');
                
                // If existing mobile-collapse is found but we want to ensure it's next to auth on mobile
                // logic here depends on layout. 
                // If it's missing, we inject it.
                if (!mobileCollapse) {
                    const mobileBtn = document.createElement('a');
                    mobileBtn.href = '#';
                    mobileBtn.className = 'pc-head-link ms-2 d-inline-block d-lg-none'; // Visible only on mobile
                    mobileBtn.id = 'mobile-collapse';
                    mobileBtn.innerHTML = '<i class="ti ti-menu-2"></i>';
                    
                    mobileBtn.onclick = function(e) {
                        e.preventDefault();
                        const sidebar = document.querySelector('.pc-sidebar');
                        if (sidebar) {
                            if (sidebar.classList.contains('mob-sidebar-active')) {
                                sidebar.classList.remove('mob-sidebar-active');
                            } else {
                                sidebar.classList.add('mob-sidebar-active');
                            }
                        }
                    };
                    
                    authItem.appendChild(mobileBtn); // Add it next to auth buttons
                } else {
                    // If it exists, we might want to move it to be next to auth if it's not?
                    // But usually it is. 
                    // The user said "add the button". If it's already there, we do nothing.
                }
            })
            .catch(error => console.error('Auth UI Error:', error));
    }

    // Initial check when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateAuthUI);
    } else {
        updateAuthUI();
    }
    
    // Polling every 5 seconds for real-time status check
    setInterval(updateAuthUI, 5000);
})();
