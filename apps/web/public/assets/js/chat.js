class ChatSystem {
    constructor() {
        this.userListOpen = false;
        this.activeConversations = {}; // { conversationId: { element: div, lastId: 0 } }
        this.pollingInterval = 2000; // Faster polling for real-time feel
        this.totalUnread = 0;
        this.typingLastSent = {};
        this.searchTerm = ''; // Add search term state
        this.lastUsers = []; // Cache users for filtering
        this.init();
    }

    escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    init() {
        // Create main container if not exists
        if (!document.querySelector('.chat-widget-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'chat-widget-wrapper';
            document.body.appendChild(wrapper);
        }

        this.wrapper = document.querySelector('.chat-widget-wrapper');
        this.createUserListWindow();
        
        // Restore state
        this.loadState();

        this.startPolling();
        
        // Initial load
        this.loadUsers();
    }

    async fetchAPI(action, data = {}) {
        const formData = new FormData();
        formData.append('action', action);
        for (const key in data) {
            formData.append(key, data[key]);
        }

        try {
            const response = await fetch('chat_api.php', {
                method: 'POST',
                body: formData
            });
            return await response.json();
        } catch (error) {
            console.error('Chat API Error:', error);
            return { error: 'Connection failed' };
        }
    }

    async makeItRain() {
        if (!confirm("Are you sure you want to Make It Rain? \n\nCost: 5,000 Stardust\nEffect: Distributes to last 20 active users.")) return;
        
        try {
            const res = await this.fetchAPI('rain');
            if (res.error) {
                alert("Error: " + res.error);
            } else {
                alert(`🌧️ BOOM! You dropped 5,000 Stardust on ${res.count} users! (+${res.amount} each)`);
                // Trigger confetti if available
                if (typeof confetti === 'function') {
                    confetti({ particleCount: 200, spread: 100, origin: { y: 0.8 } });
                }
            }
        } catch (e) {
            console.error(e);
            alert("Network error.");
        }
    }

    createUserListWindow() {
        // Singleton check: Prevent duplicate creation
        const existing = document.getElementById('chat-user-list');
        if (existing) {
            this.userListWindow = existing;
            
            // Fix: Ensure Rain button exists even if window was cached
            const controls = existing.querySelector('.chat-controls');
            if (controls && !controls.querySelector('[onclick="chatSystem.makeItRain()"]')) {
                const rainBtn = document.createElement('button');
                rainBtn.className = 'chat-btn';
                rainBtn.title = 'Make it Rain (5k SD)';
                rainBtn.innerHTML = '<i class="ti ti-cloud-rain" style="color: #0ea5e9;"></i>';
                rainBtn.onclick = () => chatSystem.makeItRain();
                // Insert as first child
                controls.insertBefore(rainBtn, controls.firstChild);
            }
            return;
        }

        const div = document.createElement('div');
        div.className = 'chat-window minimized';
        div.id = 'chat-user-list';
        div.innerHTML = `
            <div class="chat-header" onclick="chatSystem.toggleUserList()">
                <div class="chat-title">
                    <i class="ti ti-messages"></i>
                    <span>Chat</span>
                    <span class="chat-unread-badge" style="display: none;">0</span>
                </div>
                <div class="chat-controls">
                    <button class="chat-btn" title="Make it Rain (5k SD)" onclick="chatSystem.makeItRain()"><i class="ti ti-cloud-rain" style="color: #0ea5e9;"></i></button>
                    <button class="chat-btn"><i class="ti ti-chevron-up"></i></button>
                </div>
            </div>
            <div class="chat-body">
                <div class="chat-search-container">
                    <input type="text" id="chat-user-search" class="chat-search-input" placeholder="Search users..." 
                           onkeyup="chatSystem.filterUsers(this.value)">
                </div>
                <div class="chat-user-list">
                    <!-- Users loaded via JS -->
                    <div style="padding: 20px; text-align: center; color: #64748b;">Loading...</div>
                </div>
            </div>
        `;
        this.wrapper.appendChild(div);
        this.userListWindow = div;
    }

    toggleUserList() {
        this.userListOpen = !this.userListOpen;
        this.userListWindow.classList.toggle('minimized', !this.userListOpen);
        const icon = this.userListWindow.querySelector('.chat-controls i');
        icon.className = this.userListOpen ? 'ti ti-chevron-down' : 'ti ti-chevron-up';
        
        if (this.userListOpen) {
            this.loadUsers();
        }
        this.saveState();
    }

    toggleChatWindow(id) {
        const el = document.getElementById(id);
        if (el) {
            el.classList.toggle('minimized');
            this.saveState();
        }
    }

    async showUserProfile(userId) {
        // Remove existing modal if any
        const existing = document.getElementById('glass-profile-modal');
        if (existing) existing.remove();

        const res = await this.fetchAPI('get_user_profile', { user_id: userId });
        if (!res || !res.user) {
            console.error("User profile not found");
            return;
        }

        const user = res.user;
        const bannerStyle = user.profile_banner 
            ? `background-image: url('${user.profile_banner}'); background-size: cover; background-position: center;` 
            : `background: linear-gradient(135deg, #3b82f6, #6366f1);`;
        
        const isOnline = user.is_online;
        const statusColor = isOnline ? '#10b981' : '#64748b';
        const statusText = isOnline ? 'Online' : 'Offline';

        const modal = document.createElement('div');
        modal.id = 'glass-profile-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6); backdrop-filter: blur(5px);
            z-index: 10000; display: flex; align-items: center; justify-content: center;
            animation: fadeInOverlay 0.3s ease-out;
        `;

        // Socials
        let socialsHtml = '';
        let delay = 0.1;
        if (user.social_discord) {
            socialsHtml += `<a href="#" class="social-btn" title="Discord: ${user.social_discord}" style="animation-delay: ${delay}s" onclick="navigator.clipboard.writeText('${user.social_discord}'); alert('Discord ID copied!'); return false;"><i class="ti ti-brand-discord"></i></a>`;
            delay += 0.1;
        }
        if (user.social_twitter) {
            const xUrl = user.social_twitter.startsWith('http') ? user.social_twitter : 'https://x.com/' + user.social_twitter;
            socialsHtml += `<a href="${xUrl}" target="_blank" rel="noopener noreferrer" class="social-btn" title="X: ${user.social_twitter}" style="animation-delay: ${delay}s"><img class="x-logo-icon" src="assets/img/brand/x-logo-white.svg" alt="" aria-hidden="true"></a>`;
            delay += 0.1;
        }
        if (user.social_portfolio) {
            const pfUrl = user.social_portfolio.startsWith('http') ? user.social_portfolio : 'https://'+user.social_portfolio;
            socialsHtml += `<a href="${pfUrl}" target="_blank" rel="noopener noreferrer" class="social-btn" title="Portfolio: ${user.social_portfolio}" style="animation-delay: ${delay}s"><i class="ti ti-world"></i></a>`;
            delay += 0.1;
        }

        // Wallet Logic
        let walletHtml = '';
        if (user.wallet) {
             walletHtml = `
                <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 12px; font-size: 0.9rem; color: #cbd5e1; margin-bottom: 20px; word-break: break-all;">
                    <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 5px;">Wallet</div>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap;">
                        <span style="font-family: monospace; word-break: break-all;">${user.wallet}</span>
                        <i class="ti ti-copy" style="cursor: pointer; color: #3b82f6;" onclick="navigator.clipboard.writeText('${user.wallet}'); this.className='ti ti-check'; setTimeout(()=>this.className='ti ti-copy', 2000);" title="Copy Address"></i>
                    </div>
                </div>
            `;
        }
        
        // Border Logic
        const borderClass = user.active_border_class || '';
        
        // Fix: Apply styles to wrapper, not image, for correct border rendering
        const wrapperStyle = `width: 100px; height: 100px; display: inline-block; position: relative; border-radius: 50%;`;
        const imgStyle = `width: 100%; height: 100%; border-radius: 50%; object-fit: cover;`;

        const nameColor = user.active_name_effect_class ? '' : 'color: #f1f5f9;';

        modal.innerHTML = `
            <div class="glass-panel profile-card" style="width: 90%; max-width: 400px; max-height: 85vh; overflow-y: auto; padding: 0; position: relative; animation: scaleInCard 0.3s ease-out;">
                <!-- Close Button -->
                <button onclick="document.getElementById('glass-profile-modal').remove()" style="position: absolute; top: 15px; right: 15px; z-index: 10; background: rgba(0,0,0,0.3); border: none; color: white; border-radius: 50%; width: 32px; height: 32px; cursor: pointer;"><i class="ti ti-x"></i></button>
                
                <!-- Banner -->
                <div style="height: 120px; width: 100%; ${bannerStyle}"></div>
                
                <!-- Content -->
                <div style="padding: 0 25px 25px 25px; margin-top: -50px; text-align: center;">
                    <!-- Avatar and Name Wrapper -->
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
                        <!-- Avatar -->
                        <div style="position: relative; margin-bottom: 15px;">
                            <div class="${borderClass}" style="${wrapperStyle}">
                                <img src="${user.avatar || 'assets/img/favicons/mstile-150x150.png'}" style="${imgStyle}">
                            </div>
                        </div>
                        
                        <!-- Name -->
                        <div style="width: 100%;">
                            <h3 class="${user.active_name_effect_class || ''}" data-text="${this.escapeHtml(user.username)}" style="margin: 0; font-size: 1.5rem; ${nameColor}">${this.escapeHtml(user.username)}</h3>
                        </div>
                    </div>
                    
                    <div style="font-size: 0.8rem; color: ${user.rank_color || '#94a3b8'}; margin-bottom: 5px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 15px;">
                        ${user.rank_label || 'Member'}
                    </div>
                    <div style="color: ${statusColor}; font-size: 0.85rem; margin-bottom: 15px;">● ${statusText}</div>
                    
                    ${user.bio ? `<div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 12px; font-size: 0.9rem; color: #cbd5e1; margin-bottom: 20px; font-style: italic;">"${this.escapeHtml(user.bio)}"</div>` : ''}
                    
                    <div class="profile-socials" style="display: flex; justify-content: center; gap: 15px; margin-bottom: 20px;">
                        ${socialsHtml}
                    </div>

                    ${walletHtml}

                    <div style="font-size: 0.75rem; color: #64748b; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
                        Member since ${new Date(user.created_at).toLocaleDateString()}
                    </div>
                </div>
            </div>
            <style>
                .social-btn {
                    width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.05); 
                    display: flex; align-items: center; justify-content: center; color: #94a3b8; 
                    text-decoration: none; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.1);
                    opacity: 0; animation: fadeInUp 0.4s forwards;
                }
                .social-btn:hover { background: rgba(59, 130, 246, 0.2); color: white; transform: translateY(-3px); border-color: rgba(59, 130, 246, 0.5); }
                .profile-socials .x-logo-icon{width:1em;height:1em;display:block;opacity:.9}
                @keyframes scaleInCard { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            </style>
        `;

        document.body.appendChild(modal);
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    async loadUsers() {
        const res = await this.fetchAPI('get_users');
        if (res.users) {
            this.lastUsers = res.users; // Cache for filtering
            if (res.currentUser) {
                this.currentUser = res.currentUser;
            }
            this.totalUnread = res.users.reduce((sum, u) => sum + (parseInt(u.unread_count) || 0), 0);
            this.updateTotalUnreadBadge();
            this.renderUserList();
            this.updateChatAvatars();
        }
    }

    updateChatAvatars() {
        if (!this.lastUsers) return;
        
        // Create maps
        const userMap = {};
        const userNameMap = {};
        this.lastUsers.forEach(u => {
            userMap[u.id] = u.avatar;
            userNameMap[u.username] = u.avatar;
        });

        // Add current user to maps to ensure self-avatar updates
        if (this.currentUser) {
            userMap[this.currentUser.id] = this.currentUser.avatar;
            userNameMap[this.currentUser.username] = this.currentUser.avatar;
        }

        // Update all open chat windows
        const chatWindows = document.querySelectorAll('.chat-window');
        chatWindows.forEach(win => {
            // Strategy 1: Update by data-user-id (New/Reloaded messages)
            const avatarsWithId = win.querySelectorAll('.chat-message-header img[data-user-id]');
            avatarsWithId.forEach(img => {
                const uid = img.dataset.userId;
                if (userMap[uid] && !img.src.includes(userMap[uid])) {
                     img.src = userMap[uid];
                }
            });

            // Strategy 2: Fallback by Username (Legacy messages in current session)
            const allHeaders = win.querySelectorAll('.chat-message-header');
            allHeaders.forEach(header => {
                const img = header.querySelector('img');
                // Skip if no image or if already handled by ID strategy
                if (!img || img.hasAttribute('data-user-id')) return;

                const nameSpan = header.querySelector('span');
                if (nameSpan) {
                    const name = nameSpan.textContent;
                    if (userNameMap[name] && !img.src.includes(userNameMap[name])) {
                        img.src = userNameMap[name];
                    }
                }
            });
            
            // Also update the chat window metadata/dataset if it's a private chat
            if (win.dataset.userId && userMap[win.dataset.userId]) {
                 win.dataset.avatar = userMap[win.dataset.userId];
            }
        });
    }

    filterUsers(term) {
        this.searchTerm = term.toLowerCase();
        this.renderUserList();
    }

    renderUserList() {
        const list = this.userListWindow.querySelector('.chat-user-list');
        const publicRoom = `
            <div class="chat-user-item" onclick="chatSystem.openPublicRoom()">
                <div class="chat-user-info">
                    <div class="chat-user-name">Global</div>
                    <div class="chat-user-status">
                        <span style="color:#0ea5e9; font-size: 10px;">● Global Channel</span>
                    </div>
                </div>
            </div>
        `;

        // Filter users
        const filteredUsers = this.lastUsers.filter(u => {
            const matchesSearch = u.username.toLowerCase().includes(this.searchTerm);
            const isOnline = (u.is_online == 1 || u.is_online === true);
            const hasUnread = (parseInt(u.unread_count) || 0) > 0;

            // If searching: Show anyone matching the name
            if (this.searchTerm.length > 0) {
                return matchesSearch;
            }

            // If NOT searching: Show only Online OR Unread
            return isOnline || hasUnread;
        });

        let usersHtml = '';
        if (filteredUsers.length === 0) {
            usersHtml = '<div style="padding: 20px; text-align: center; color: #64748b;">No users found</div>';
        } else {
            usersHtml = filteredUsers.map(u => {
                const isOnline = (u.is_online == 1 || u.is_online === true);
                const statusColor = isOnline ? '#10b981' : '#64748b';
                const statusText = isOnline ? 'Online' : 'Offline';
                const nameEffect = u.active_name_effect_class || '';
                const safeUsername = this.escapeHtml(u.username);
                
                return `
                <div class="chat-user-item" onclick="chatSystem.openConversation(${u.id}, '${u.username.replace(/'/g, "\\'")}', '${u.avatar || 'assets/img/favicons/mstile-150x150.png'}', '${nameEffect}')">
                    <div class="chat-user-info">
                        <div class="chat-user-name ${nameEffect}" data-text="${safeUsername}">${safeUsername}</div>
                        <div class="chat-user-status">
                            <span style="color:${statusColor}; font-size: 10px;">● ${statusText}</span>
                        </div>
                    </div>
                    ${u.unread_count > 0 ? `<div class="chat-unread-badge">${u.unread_count}</div>` : ''}
                </div>
            `}).join('');
        }

        list.innerHTML = publicRoom + usersHtml;
    }

    updateTotalUnreadBadge() {
        const badge = this.userListWindow.querySelector('.chat-title .chat-unread-badge');
        if (this.totalUnread > 0) {
            badge.textContent = this.totalUnread;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    async openConversation(userId, username, avatar, nameEffect = '') {
        // Check if already open
        if (document.getElementById(`chat-window-user-${userId}`)) {
            const win = document.getElementById(`chat-window-user-${userId}`);
            win.classList.remove('minimized');
            win.querySelector('input').focus();
            
            // Mark as read immediately if opening existing window
            const cid = win.dataset.conversationId;
            this.markAsRead(cid);
            
            // Mobile: Close user list to focus on chat
            if (window.innerWidth <= 768 && this.userListOpen) {
                this.toggleUserList();
            }
            return;
        }

        // Get or create conversation ID
        const res = await this.fetchAPI('get_conversation', { target_id: userId });
        if (res.error) {
            console.error(res.error);
            return;
        }

        const conversationId = res.conversation_id;
        
        // Mobile: Close user list before opening new chat
        if (window.innerWidth <= 768 && this.userListOpen) {
            this.toggleUserList();
        }

        this.createChatWindow(conversationId, userId, username, avatar, nameEffect);
        this.saveState();
    }

    createChatWindow(conversationId, userId, username, avatar, nameEffect = '') {
        // Prevent duplicates (Memory check)
        if (this.activeConversations[conversationId]) return;

        // Prevent duplicates (DOM check)
        const existingDom = document.getElementById(`chat-window-user-${userId}`);
        if (existingDom) {
            // Re-attach if needed or just update reference
            this.activeConversations[conversationId] = {
                element: existingDom,
                lastId: 0 // Reset or try to recover? safer to 0 and let loadMessages handle it
            };
            return;
        }

        const div = document.createElement('div');
        div.className = 'chat-window';
        div.id = `chat-window-user-${userId}`; // Store by User ID for easy lookup
        div.dataset.conversationId = conversationId;
        // Save metadata for persistence
        div.dataset.userId = userId;
        div.dataset.username = username;
        div.dataset.avatar = avatar;
        div.dataset.nameEffect = nameEffect;
        
        const safeUsername = this.escapeHtml(username);

        div.innerHTML = `
            <div class="chat-header" onclick="chatSystem.toggleChatWindow('${div.id}')">
                <div class="chat-title">
                    <span class="${nameEffect}" data-text="${safeUsername}">${safeUsername}</span>
                </div>
                <div class="chat-controls">
                    <button class="chat-btn" onclick="event.stopPropagation(); chatSystem.closeConversation(${conversationId})"><i class="ti ti-x"></i></button>
                </div>
            </div>
            <div class="chat-body">
                <div class="chat-messages" id="messages-${conversationId}"></div>
                <div class="chat-typing" id="typing-${conversationId}" style="display:none; padding: 4px 12px; font-size: 11px; color: #94a3b8;">Typing...</div>
                
                <div class="chat-input-area" style="position: relative;">
                    <input type="text" class="chat-input" placeholder="Type a message..." onkeypress="chatSystem.handleInput(event, ${conversationId})" oninput="chatSystem.notifyTyping(${conversationId})">
                    <button class="chat-send-btn" onclick="chatSystem.sendMessage(${conversationId})"><i class="ti ti-send"></i></button>
                </div>
            </div>
        `;
        
        // Insert before user list
        this.wrapper.insertBefore(div, this.userListWindow);
        
        // Track
        this.activeConversations[conversationId] = {
            element: div,
            lastId: 0
        };

        // Initial load & Mark Read
        this.loadMessages(conversationId);
        this.markAsRead(conversationId);
    }

    closeConversation(conversationId) {
        if (this.activeConversations[conversationId]) {
            this.activeConversations[conversationId].element.remove();
            delete this.activeConversations[conversationId];
            this.saveState();
        }
    }

    async sendMessage(conversationId) {
        const input = this.activeConversations[conversationId].element.querySelector('input');
        const message = input.value.trim();
        if (!message) return;

        input.value = ''; // Clear early
        
        try {
            const res = await this.fetchAPI('send_message', {
                conversation_id: conversationId,
                message: message
            });

            if (res.error) {
                console.error("Failed to send message: " + res.error);
                input.value = message; // Restore message
                input.style.borderColor = 'red';
                setTimeout(() => input.style.borderColor = '', 2000);
                return;
            }
            
            // Immediate update
            this.loadMessages(conversationId);
        } catch (e) {
            console.error("Network error. Message not sent.");
            input.value = message; // Restore message
            input.style.borderColor = 'red';
            setTimeout(() => input.style.borderColor = '', 2000);
        }
    }

    async deleteMessage(messageId, element) {
        if (!confirm("Voulez-vous vraiment supprimer ce message ?")) return;

        try {
            const res = await this.fetchAPI('delete_message', { message_id: messageId });
            
            if (res.status === 'ok') {
                // Animation de suppression
                element.style.transition = 'all 0.3s ease';
                element.style.opacity = '0';
                element.style.transform = 'scale(0.9)';
                setTimeout(() => element.remove(), 300);
            } else {
                alert("Erreur: " + (res.error || "Impossible de supprimer le message"));
            }
        } catch (e) {
            console.error("Delete error:", e);
        }
    }

    handleInput(e, conversationId) {
        if (e.key === 'Enter') {
            this.sendMessage(conversationId);
        }
    }

    notifyTyping(conversationId) {
        const now = Date.now();
        const last = this.typingLastSent[conversationId] || 0;
        if (now - last < 800) {
            return;
        }
        this.typingLastSent[conversationId] = now;
        this.fetchAPI('typing', { conversation_id: conversationId });
    }

    async markAsRead(conversationId) {
        await this.fetchAPI('mark_read', { conversation_id: conversationId });
    }

    // Utility to format time
    formatTime(dateStr) {
        if (!dateStr) return '';
        try {
            // Fix SQL timestamp for JS Date compatibility (Safari/iOS)
            const date = new Date(dateStr.replace(' ', 'T')); 
            return new Intl.DateTimeFormat('default', {
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (e) {
            return '';
        }
    }

    async loadMessages(conversationId) {
        if (!this.activeConversations[conversationId]) return;

        const lastId = this.activeConversations[conversationId].lastId || 0;
        const res = await this.fetchAPI('get_messages', {
            conversation_id: conversationId,
            last_id: lastId
        });

        const typingEl = document.getElementById(`typing-${conversationId}`);
        if (typingEl) {
            if (res.is_typing) {
                typingEl.style.display = 'block';
            } else {
                typingEl.style.display = 'none';
            }
        }

        if (res.messages && res.messages.length > 0) {
            console.time('renderMessages'); // Performance check
            console.log(`Chat: Received ${res.messages.length} messages for CID ${conversationId}`);
            const container = document.getElementById(`messages-${conversationId}`);
            if (!container) return; // Safety check

            // Check if user is scrolled to bottom
            const isScrolledToBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 50;
            
            // Check if window is minimized or not visible
            const isMinimized = this.activeConversations[conversationId].element.classList.contains('minimized');
            
            let hasNewIncoming = false;

            // Create a fragment to minimize reflows
            const fragment = document.createDocumentFragment();

            res.messages.forEach(msg => {
                // Prevent duplicates
                const msgId = parseInt(msg.id);
                if (msgId <= this.activeConversations[conversationId].lastId) return;

                // Update lastId
                this.activeConversations[conversationId].lastId = msgId;

                const msgDiv = document.createElement('div');
                // Ensure is_me is boolean (API might return 0/1)
                const isMe = (msg.is_me == 1 || msg.is_me === true);
                msgDiv.className = `chat-message ${isMe ? 'sent' : 'received'}`;
                
                // Add username for received messages
                if (!isMe) {
                    const senderHeader = document.createElement('div');
                    senderHeader.className = 'chat-message-header';
                    senderHeader.style.display = 'flex';
                    senderHeader.style.alignItems = 'center';
                    senderHeader.style.marginBottom = '4px';
                    senderHeader.style.marginLeft = '4px';
                    // Clickable Profile
                    senderHeader.style.cursor = 'pointer'; 
                    senderHeader.onclick = () => this.showUserProfile(msg.sender_id);
                    senderHeader.title = "View Profile";

                    // Avatar Container (Wrapper for borders)
                    const avatarWrapper = document.createElement('div');
                    avatarWrapper.className = 'chat-avatar-wrapper';
                    // NUCLEAR OPTION: Force styles via cssText to override everything
                    avatarWrapper.style.cssText = 'display: inline-block; position: relative; border-radius: 50%; margin-right: 6px; width: 32px !important; height: 32px !important; min-width: 32px !important; max-width: 32px !important;';
                    
                    // Apply Border Class to Wrapper
                    if (msg.active_border_class) {
                        avatarWrapper.classList.add(msg.active_border_class);
                    }

                    // Avatar Image
                    const avatarImg = document.createElement('img');
                    avatarImg.src = msg.avatar || 'assets/img/favicons/mstile-150x150.png';
                    avatarImg.className = 'avatar-img'; 
                    
                    // NUCLEAR OPTION: Force image to fit wrapper perfectly
                    avatarImg.style.cssText = 'width: 100% !important; height: 100% !important; border-radius: 50% !important; object-fit: cover !important; max-width: none !important; min-width: 0 !important; display: block !important;';
                    
                    if (!msg.active_border_class) {
                        // Add border via cssText safely
                        avatarWrapper.style.cssText += ' border: 1px solid rgba(255,255,255,0.1); padding: 0;';
                    }
                    
                    avatarWrapper.appendChild(avatarImg);

                    // Name Container (Flex Column)
                    const nameContainer = document.createElement('div');
                    nameContainer.style.display = 'flex';
                    nameContainer.style.flexDirection = 'column';
                    nameContainer.style.lineHeight = '1.2';

                    const senderName = document.createElement('span');
                    senderName.style.fontSize = '11px';
                    senderName.style.fontWeight = '600';
                    senderName.textContent = msg.username;
                    senderName.setAttribute('data-text', msg.username);
                    
                    // Apply Name Effect
                    if (msg.active_name_effect_class) {
                        senderName.className = msg.active_name_effect_class;
                    } else {
                        senderName.style.color = '#94a3b8';
                    }

                    nameContainer.appendChild(senderName);

                    senderHeader.appendChild(avatarWrapper);
                    senderHeader.appendChild(nameContainer);
                    msgDiv.appendChild(senderHeader);
                }

                const msgContent = document.createElement('div');
                msgContent.innerHTML = this.linkify(msg.message);
                
                // Add Timestamp
                const timeSpan = document.createElement('span');
                timeSpan.className = 'chat-time';
                timeSpan.dataset.timestamp = msg.created_at; // Add data attribute for dynamic updates
                timeSpan.textContent = this.formatTime(msg.created_at);
                
                msgDiv.appendChild(msgContent);
                msgDiv.appendChild(timeSpan);
                msgDiv.title = msg.created_at;

                // Handle Output
                if (isMe) {
                    // Create Wrapper for Sent Messages (Button + Message)
                    const wrapper = document.createElement('div');
                    wrapper.className = 'chat-message-group sent';
                    
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'chat-delete-btn';
                    deleteBtn.innerHTML = '<i class="ti ti-trash"></i>';
                    deleteBtn.title = 'Supprimer';
                    deleteBtn.onclick = (e) => {
                        e.stopPropagation();
                        // Delete the wrapper (which contains the message)
                        this.deleteMessage(msg.id, wrapper);
                    };

                    wrapper.appendChild(deleteBtn);
                    wrapper.appendChild(msgDiv);
                    fragment.appendChild(wrapper);
                } else {
                    fragment.appendChild(msgDiv);
                }
                
                if (!isMe) hasNewIncoming = true;
            });
            
            // Append all at once
            container.appendChild(fragment);
            console.timeEnd('renderMessages');

            // Auto scroll if was at bottom or new message is mine
            // Force scroll on initial load (lastId === 0)
            if (lastId === 0 || isScrolledToBottom || res.messages.some(m => (m.is_me == 1 || m.is_me === true))) {
                // Use requestAnimationFrame for smoother scrolling
                requestAnimationFrame(() => {
                    container.scrollTop = container.scrollHeight;
                });
            }

            // Mark read if open and active
            if (hasNewIncoming && !isMinimized) {
                this.markAsRead(conversationId);
            }
        }
    }

    async openPublicRoom() {
        const existing = document.getElementById('chat-window-user-public');
        if (existing) {
            existing.classList.remove('minimized');
            const input = existing.querySelector('input');
            if (input) {
                input.focus();
            }
            const cid = existing.dataset.conversationId;
            this.markAsRead(cid);

            if (window.innerWidth <= 768 && this.userListOpen) {
                this.toggleUserList();
            }
            return;
        }

        const res = await this.fetchAPI('get_public_conversation');
        if (res.error) {
            console.error(res.error);
            return;
        }

        const conversationId = res.conversation_id;

        if (window.innerWidth <= 768 && this.userListOpen) {
            this.toggleUserList();
        }

        this.createChatWindow(conversationId, 'public', 'Global', '');
        this.saveState();
    }

    // Utility to make links clickable
    linkify(text) {
        // Escape HTML first to prevent XSS
        const div = document.createElement('div');
        div.textContent = text;
        let escaped = div.innerHTML;
        
        // Regex for URLs
        const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        // Regex for www. without http
        const wwwRegex = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        
        return escaped
            .replace(urlRegex, '<a href="$1" target="_blank" style="color: #3b82f6; text-decoration: underline;">$1</a>')
            .replace(wwwRegex, '$1<a href="http://$2" target="_blank" style="color: #3b82f6; text-decoration: underline;">$2</a>');
    }

    startPolling() {
        setInterval(() => {
            // Always reload users to get unread counts
            this.loadUsers();

            // Update all active conversations
            Object.keys(this.activeConversations).forEach(cid => {
                this.loadMessages(cid);
            });

            // Update my status
            this.fetchAPI('update_status');

        }, this.pollingInterval);

        // Dynamic Time Update (every 60s)
        setInterval(() => {
            document.querySelectorAll('.chat-time[data-timestamp]').forEach(el => {
                el.textContent = this.formatTime(el.dataset.timestamp);
            });
        }, 60000);
    }

    // Persistence Methods
    saveState() {
        const state = {
            userListOpen: this.userListOpen,
            openChats: []
        };

        Object.keys(this.activeConversations).forEach(cid => {
            const el = this.activeConversations[cid].element;
            state.openChats.push({
                conversationId: cid,
                userId: el.dataset.userId,
                username: el.dataset.username,
                avatar: el.dataset.avatar,
                nameEffect: el.dataset.nameEffect || '',
                isMinimized: el.classList.contains('minimized')
            });
        });
        localStorage.setItem('aster_chat_state_v2', JSON.stringify(state));
    }

    loadState() {
        const saved = localStorage.getItem('aster_chat_state_v2');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                
                // Restore User List State
                if (state.userListOpen) {
                    this.toggleUserList(); // This sets this.userListOpen = true and removes .minimized
                }

                // Restore Chats
                if (state.openChats && Array.isArray(state.openChats)) {
                    state.openChats.forEach(chat => {
                        this.createChatWindow(chat.conversationId, chat.userId, chat.username, chat.avatar, chat.nameEffect || '');
                        // Apply minimized state
                        if (chat.isMinimized) {
                            const el = document.getElementById(`chat-window-user-${chat.userId}`);
                            if (el) el.classList.add('minimized');
                        } else {
                            // If createChatWindow defaults to minimized? No, it doesn't.
                            // But if we want to ensure it's open:
                             const el = document.getElementById(`chat-window-user-${chat.userId}`);
                             if (el) el.classList.remove('minimized');
                        }
                    });
                }
            } catch (e) {
                console.error("Failed to load chat state", e);
            }
        } else {
            // Migration from v1 or fallback
            const oldSaved = localStorage.getItem('aster_open_chats');
            if (oldSaved) {
                try {
                    const openChats = JSON.parse(oldSaved);
                    openChats.forEach(chat => {
                        this.createChatWindow(chat.conversationId, chat.userId, chat.username, chat.avatar);
                    });
                    // Clear old
                    localStorage.removeItem('aster_open_chats');
                } catch(e) {}
            }
        }
    }
}

// Initialize
const chatSystem = new ChatSystem();
