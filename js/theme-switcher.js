// Theme Switcher for SITEPACKAGES Demo
// Allows users to preview different theme configurations

(function() {
    'use strict';

    // Available themes
    const themes = [
        { id: 'default', name: 'SITEPACKAGES', file: null },
        { id: 'coffee-shop', name: 'Bean & Brew (Coffee)', file: 'js/themes/coffee-shop.js' },
        { id: 'gaming-gear', name: 'NEXUS GEAR (Gaming)', file: 'js/themes/gaming-gear.js' },
        { id: 'fashion-boutique', name: 'VELVET & LACE (Fashion)', file: 'js/themes/fashion-boutique.js' },
        { id: 'fitness-gym', name: 'IRON REPUBLIC (Fitness)', file: 'js/themes/fitness-gym.js' }
    ];

    // Store original config
    let originalConfig = null;

    // Cache for loaded theme configs and preloaded status
    const themeCache = {};
    let preloadStarted = false;

    // All Pollinations image URLs used in themes - preload these
    const themeImages = [
        // Coffee shop
        'https://image.pollinations.ai/prompt/coffee%20bean%20logo%20minimalist%20brown%20cream%20vintage%20artisan?width=200&height=200&nologo=true',
        'https://image.pollinations.ai/prompt/coffee%20shop%20interior%20warm%20lighting%20wooden%20tables%20cozy%20atmosphere?width=1920&height=800&nologo=true',
        'https://image.pollinations.ai/prompt/ethiopian%20coffee%20beans%20burlap%20sack%20artisan%20roasted?width=400&height=400&nologo=true',
        'https://image.pollinations.ai/prompt/colombian%20coffee%20beans%20medium%20roast%20artisan?width=400&height=400&nologo=true',
        'https://image.pollinations.ai/prompt/coffee%20blend%20dark%20roast%20beans%20professional?width=400&height=400&nologo=true',
        'https://image.pollinations.ai/prompt/french%20press%20coffee%20maker%20glass%20stainless%20steel%20elegant?width=400&height=400&nologo=true',
        // Gaming gear
        'https://image.pollinations.ai/prompt/gaming%20logo%20neon%20green%20black%20futuristic%20esports%20hexagon?width=200&height=200&nologo=true',
        'https://image.pollinations.ai/prompt/gaming%20setup%20RGB%20lights%20neon%20green%20purple%20dark%20room%20monitors?width=1920&height=800&nologo=true',
        'https://image.pollinations.ai/prompt/mechanical%20gaming%20keyboard%20RGB%20lights%20green%20purple%20dark%20background?width=400&height=400&nologo=true',
        'https://image.pollinations.ai/prompt/gaming%20mouse%20wireless%20RGB%20ergonomic%20black%20green%20glow?width=400&height=400&nologo=true',
        'https://image.pollinations.ai/prompt/gaming%20headset%20RGB%20surround%20sound%20black%20green%20professional?width=400&height=400&nologo=true',
        'https://image.pollinations.ai/prompt/stream%20deck%20LCD%20buttons%20streaming%20setup%20RGB%20dark?width=400&height=400&nologo=true',
        // Fashion boutique
        'https://image.pollinations.ai/prompt/fashion%20boutique%20logo%20elegant%20rose%20gold%20minimalist%20feminine?width=200&height=200&nologo=true',
        'https://image.pollinations.ai/prompt/fashion%20boutique%20interior%20elegant%20rose%20gold%20pink%20marble%20luxury%20clothing%20racks?width=1920&height=800&nologo=true',
        'https://image.pollinations.ai/prompt/elegant%20silk%20blouse%20rose%20gold%20color%20fashion%20photography%20dark%20background?width=400&height=400&nologo=true',
        'https://image.pollinations.ai/prompt/cashmere%20wrap%20scarf%20cream%20color%20luxury%20fashion%20photography?width=400&height=400&nologo=true',
        'https://image.pollinations.ai/prompt/tailored%20blazer%20black%20gold%20buttons%20fashion%20photography%20elegant?width=400&height=400&nologo=true',
        'https://image.pollinations.ai/prompt/spring%20fashion%20collection%20preview%20pastel%20colors%20elegant%20clothing%20rack?width=400&height=400&nologo=true',
        // Fitness gym
        'https://image.pollinations.ai/prompt/fitness%20gym%20logo%20iron%20barbell%20red%20black%20bold%20aggressive?width=200&height=200&nologo=true',
        'https://image.pollinations.ai/prompt/gym%20interior%20dark%20red%20lighting%20weights%20barbells%20intense%20atmosphere?width=1920&height=800&nologo=true',
        'https://image.pollinations.ai/prompt/pre%20workout%20supplement%20container%20red%20black%20bold%20fitness%20product?width=400&height=400&nologo=true',
        'https://image.pollinations.ai/prompt/whey%20protein%20powder%20container%20gold%20black%20premium%20fitness?width=400&height=400&nologo=true',
        'https://image.pollinations.ai/prompt/fitness%20tank%20top%20black%20red%20logo%20athletic%20wear?width=400&height=400&nologo=true',
        'https://image.pollinations.ai/prompt/resistance%20bands%20set%20fitness%20equipment%20red%20black%20professional?width=400&height=400&nologo=true'
    ];

    // Preload all theme images in background
    function preloadThemeImages() {
        if (preloadStarted) return;
        preloadStarted = true;

        console.log('[Theme Switcher] Preloading', themeImages.length, 'theme images...');

        // Stagger the loading to avoid hammering Pollinations
        themeImages.forEach((url, index) => {
            setTimeout(() => {
                const img = new Image();
                img.src = url;
            }, index * 200); // 200ms between each request
        });
    }

    // Also preload the theme JS files
    function preloadThemeConfigs() {
        themes.forEach(theme => {
            if (theme.file && !themeCache[theme.id]) {
                fetch(theme.file)
                    .then(r => r.text())
                    .then(text => {
                        themeCache[theme.id] = text;
                        console.log('[Theme Switcher] Cached:', theme.name);
                    })
                    .catch(e => console.warn('[Theme Switcher] Failed to cache:', theme.name));
            }
        });
    }

    // Create the theme switcher UI
    function createSwitcherUI() {
        const container = document.createElement('div');
        container.id = 'theme-switcher';
        container.innerHTML = `
            <div class="theme-switcher-toggle" id="theme-toggle">
                <span class="theme-icon">🎨</span>
                <span class="theme-label">Theme Demo</span>
            </div>
            <div class="theme-switcher-panel" id="theme-panel">
                <div class="theme-panel-header">
                    <h4>Try Different Themes</h4>
                    <p>See how easily SITEPACKAGES adapts!</p>
                </div>
                <select id="theme-select">
                    ${themes.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                </select>
                <div class="theme-info">
                    <small>Each theme demonstrates different: colors, fonts, products, terminology, and effects.</small>
                </div>
            </div>
        `;

        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            #theme-switcher {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                font-family: var(--heading-font, 'Orbitron', sans-serif);
            }

            .theme-switcher-toggle {
                background: linear-gradient(135deg, var(--primary-color, #667eea), var(--secondary-color, #764ba2));
                color: white;
                padding: 12px 20px;
                border-radius: 50px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
                border: 2px solid rgba(255,255,255,0.2);
            }

            .theme-switcher-toggle:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 25px rgba(0,0,0,0.4);
            }

            .theme-icon {
                font-size: 1.2em;
            }

            .theme-label {
                font-size: 0.85em;
                font-weight: 600;
                letter-spacing: 1px;
                text-transform: uppercase;
            }

            .theme-switcher-panel {
                position: absolute;
                bottom: 60px;
                right: 0;
                background: rgba(20, 20, 30, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 15px;
                padding: 20px;
                min-width: 280px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                border: 1px solid rgba(255,255,255,0.1);
                display: none;
                animation: slideUp 0.3s ease;
            }

            .theme-switcher-panel.active {
                display: block;
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .theme-panel-header {
                margin-bottom: 15px;
                text-align: center;
            }

            .theme-panel-header h4 {
                color: white;
                margin: 0 0 5px 0;
                font-size: 1.1em;
            }

            .theme-panel-header p {
                color: rgba(255,255,255,0.6);
                margin: 0;
                font-size: 0.8em;
            }

            #theme-select {
                width: 100%;
                padding: 12px 15px;
                border-radius: 10px;
                border: 2px solid rgba(255,255,255,0.1);
                background: rgba(255,255,255,0.05);
                color: white;
                font-family: inherit;
                font-size: 0.95em;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            #theme-select:hover,
            #theme-select:focus {
                border-color: var(--primary-color, #667eea);
                outline: none;
            }

            #theme-select option {
                background: #1a1a2e;
                color: white;
                padding: 10px;
            }

            .theme-info {
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid rgba(255,255,255,0.1);
            }

            .theme-info small {
                color: rgba(255,255,255,0.5);
                font-size: 0.75em;
                line-height: 1.4;
                display: block;
            }

            .theme-loading {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
            }

            .theme-loading-spinner {
                width: 50px;
                height: 50px;
                border: 3px solid rgba(255,255,255,0.1);
                border-top-color: var(--primary-color, #667eea);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(container);

        // Set up event listeners
        const toggle = document.getElementById('theme-toggle');
        const panel = document.getElementById('theme-panel');
        const select = document.getElementById('theme-select');

        toggle.addEventListener('click', () => {
            panel.classList.toggle('active');
        });

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                panel.classList.remove('active');
            }
        });

        // Theme change handler
        select.addEventListener('change', async (e) => {
            const themeId = e.target.value;
            await loadTheme(themeId);
        });
    }

    // Load a theme
    async function loadTheme(themeId) {
        const theme = themes.find(t => t.id === themeId);
        if (!theme) return;

        // Show loading
        const loader = document.createElement('div');
        loader.className = 'theme-loading';
        loader.innerHTML = '<div class="theme-loading-spinner"></div>';
        document.body.appendChild(loader);

        try {
            if (theme.file === null) {
                // Restore original config
                if (originalConfig) {
                    window.siteConfig = JSON.parse(JSON.stringify(originalConfig));
                }
            } else {
                // Load theme config via fetch and eval
                const response = await fetch(theme.file);
                const text = await response.text();

                // Store original config if not saved
                if (!originalConfig) {
                    originalConfig = JSON.parse(JSON.stringify(window.siteConfig));
                }

                // Execute the theme file (it sets window.siteConfig)
                eval(text);
            }

            // Re-initialize the site with new config
            await reinitializeSite();

        } catch (error) {
            console.error('Error loading theme:', error);
            alert('Error loading theme. Check console for details.');
        } finally {
            // Remove loading
            loader.remove();
        }
    }

    // Reinitialize site with new config
    async function reinitializeSite() {
        const config = window.siteConfig;

        // Update CSS variables
        document.documentElement.style.setProperty('--primary-color', config.colors.primary);
        document.documentElement.style.setProperty('--secondary-color', config.colors.secondary);
        document.documentElement.style.setProperty('--tertiary-color', config.colors.tertiary || config.colors.primary);
        document.documentElement.style.setProperty('--highlight-color', config.colors.highlight);
        document.documentElement.style.setProperty('--alert-color', config.colors.alert);
        document.documentElement.style.setProperty('--background-color', config.colors.background);
        document.documentElement.style.setProperty('--text-color', config.colors.text);
        document.documentElement.style.setProperty('--heading-font', config.fonts.heading);
        document.documentElement.style.setProperty('--body-font', config.fonts.body);

        // Update site header
        const siteName = document.getElementById('site-name');
        const siteLogo = document.getElementById('site-logo');
        if (siteName) siteName.textContent = config.site.name;
        if (siteLogo) {
            siteLogo.src = config.site.logo;
            siteLogo.alt = config.site.name;
        }

        // Update hero
        const heroTitle = document.getElementById('hero-title');
        const heroDescription = document.getElementById('hero-description');
        if (heroTitle) heroTitle.textContent = config.site.name;
        if (heroDescription) heroDescription.textContent = config.site.tagline;

        // Update hero background on hero-section (matching main.js logic)
        const heroSection = document.querySelector('.hero-section');
        if (heroSection && config.site.heroBackground) {
            let heroImagePath = config.site.heroBackground;
            if (!heroImagePath.startsWith('img/') && !heroImagePath.startsWith('/') && !heroImagePath.startsWith('http')) {
                heroImagePath = 'img/' + heroImagePath;
            }

            // Apply background based on showHeroText setting
            if (config.site.showHeroText === false) {
                heroSection.classList.add('full-image');
                heroSection.style.background = `url('${heroImagePath}')`;
                heroSection.style.backgroundSize = 'cover';
                heroSection.style.backgroundPosition = 'center';
            } else {
                heroSection.classList.remove('full-image');
                heroSection.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${heroImagePath}')`;
            }
        }

        // Update navigation
        const mainNav = document.getElementById('main-navigation');
        if (mainNav && config.navigation) {
            mainNav.innerHTML = config.navigation.map(item =>
                `<li><a href="${item.url}">${item.name}</a></li>`
            ).join('') + '<li><a href="#" id="cartLink" class="cart-link">Cart <span id="cartCount">(0)</span></a></li>';
        }

        // Update filter buttons
        updateFilterButtons();

        // Update products
        updateProductGrid();

        // Update about section
        updateAboutSection();

        // Update footer
        const footerSiteName = document.getElementById('footerSiteName');
        const copyrightText = document.getElementById('copyright-text');
        if (footerSiteName) footerSiteName.textContent = config.site.name;
        if (copyrightText) copyrightText.textContent = config.site.copyright;

        // Reinitialize background effect
        reinitializeBackgroundEffect();

        // Reinitialize cart link
        const cartLink = document.getElementById('cartLink');
        if (cartLink) {
            cartLink.addEventListener('click', (e) => {
                e.preventDefault();
                const cartModal = document.getElementById('cartModal');
                if (cartModal) cartModal.style.display = 'flex';
            });
        }
    }

    // Update filter buttons based on product types
    function updateFilterButtons() {
        const config = window.siteConfig;
        const filterSection = document.querySelector('.filter-section');
        if (!filterSection || !config.products || !config.products.items) return;

        // Get unique types from products
        const types = new Set();
        Object.values(config.products.items).forEach(product => {
            if (product.type) types.add(product.type);
        });

        // Create filter buttons
        let buttonsHtml = '<button class="filter-button active" data-filter="all">All</button>';
        types.forEach(type => {
            buttonsHtml += `<button class="filter-button" data-filter="${type}">${type}</button>`;
        });

        filterSection.innerHTML = buttonsHtml;

        // Re-attach filter event listeners
        filterSection.querySelectorAll('.filter-button').forEach(btn => {
            btn.addEventListener('click', () => {
                filterSection.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterProducts(btn.dataset.filter);
            });
        });
    }

    // Filter products by type
    function filterProducts(type) {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            if (type === 'all' || card.dataset.type === type) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Update product grid
    function updateProductGrid() {
        const config = window.siteConfig;
        const grid = document.getElementById('product-grid');
        if (!grid || !config.products || !config.products.items) return;

        // Sort products by displayOrder
        const products = Object.values(config.products.items)
            .filter(p => !p.hidden)
            .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));

        grid.innerHTML = products.map(product => createProductCard(product)).join('');

        // Re-attach click handlers
        grid.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                openProductModal(card.dataset.productId);
            });
        });
    }

    // Create product card HTML
    function createProductCard(product) {
        const config = window.siteConfig;
        const packOption = product.packOptions && product.packOptions[0];
        const price = packOption ? (packOption.salePrice || packOption.regularPrice) : 0;
        const hasDiscount = packOption && packOption.salePrice && packOption.regularPrice > packOption.salePrice;

        // Promotional badge - uses .promo-badge class for tilted corner overlay
        let promoBadge = '';
        if (product.promotional && product.promotional.enabled) {
            const promo = product.promotional;
            if (promo.type === 'percentage') {
                promoBadge = `<div class="promo-badge percentage">${promo.value}% OFF</div>`;
            } else if (promo.type === 'custom') {
                promoBadge = `<div class="promo-badge custom">${promo.value}</div>`;
            } else if (promo.type === 'bogo') {
                promoBadge = `<div class="promo-badge bogo">BOGO</div>`;
            } else if (promo.type === 'sale') {
                promoBadge = `<div class="promo-badge sale">SALE</div>`;
            } else if (promo.type === 'new') {
                promoBadge = `<div class="promo-badge new">NEW</div>`;
            } else if (promo.type === 'limited') {
                promoBadge = `<div class="promo-badge limited">LIMITED</div>`;
            }
        }

        // Status badge - uses .product-status class (top-right)
        let statusBadge = '';
        if (product.status === 'comingSoon') {
            statusBadge = `<div class="product-status coming-soon">${config.terminology?.comingSoonLabel || 'COMING SOON'}</div>`;
        } else if (product.status === 'soldOut') {
            statusBadge = `<div class="product-status sold-out">${config.terminology?.soldOutLabel || 'SOLD OUT'}</div>`;
        }

        // Rating stars
        const rating = product.rating || 0;
        const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

        return `
            <div class="product-card" data-product-id="${product.id}" data-type="${product.type}">
                <img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.style.display='none'" loading="lazy">
                ${promoBadge}
                ${statusBadge}
                <div class="card-content">
                    <h3 class="card-title">${product.name}</h3>
                    <span class="product-type">${product.type}${product.variety ? ' • ' + product.variety : ''}</span>
                    ${config.products.enableRatings ? `<div class="product-rating">${stars}</div>` : ''}
                    <div class="product-price">
                        ${hasDiscount ? `<span class="regular-price">$${packOption.regularPrice}</span>` : ''}
                        <span class="current-price">$${price}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Open product modal
    function openProductModal(productId) {
        const config = window.siteConfig;
        const product = config.products.items[productId];
        if (!product) return;

        const modal = document.getElementById('productModal');
        if (!modal) return;

        // Populate modal
        document.getElementById('modalTitle').textContent = product.name;
        document.getElementById('modalImage').src = product.image;
        document.getElementById('modalType').textContent = product.type;
        document.getElementById('modalVariety').textContent = product.variety || '-';
        document.getElementById('modalDescription').textContent = product.description || '';
        document.getElementById('modalDetails').textContent = product.details || 'No details available.';
        document.getElementById('modalNotes').textContent = product.notes || 'No additional notes.';

        // Rating
        const rating = product.rating || 0;
        document.getElementById('modalRating').textContent = '★'.repeat(rating) + '☆'.repeat(5 - rating);

        // Origin/Rarity if available
        const originEl = document.getElementById('modalOrigin');
        const rarityEl = document.getElementById('modalRarity');
        if (originEl) originEl.textContent = product.origin || '-';
        if (rarityEl) rarityEl.textContent = product.rarity || '-';

        // Pack options
        const packButtons = document.getElementById('packOptionButtons');
        if (packButtons && product.packOptions) {
            packButtons.innerHTML = product.packOptions.map((opt, i) => {
                const price = opt.salePrice || opt.regularPrice;
                return `<button class="pack-option-btn ${i === 0 ? 'selected' : ''}" data-size="${opt.size}" data-price="${price}">
                    ${opt.size} - $${price}
                </button>`;
            }).join('');

            // Re-attach pack option click handlers
            packButtons.querySelectorAll('.pack-option-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    packButtons.querySelectorAll('.pack-option-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                });
            });
        }

        // Reset tabs
        document.querySelectorAll('.info-tab').forEach((tab, i) => {
            tab.classList.toggle('active', i === 0);
        });
        document.querySelectorAll('.info-tab-content').forEach((content, i) => {
            content.classList.toggle('active', i === 0);
        });

        modal.style.display = 'flex';
    }

    // Update about section
    function updateAboutSection() {
        const config = window.siteConfig;
        if (!config.about) return;

        const aboutTitle = document.getElementById('about-title');
        const aboutSubtitle = document.getElementById('about-subtitle');
        const aboutDescription = document.getElementById('about-description');
        const aboutImage = document.getElementById('about-image');

        if (aboutTitle) aboutTitle.textContent = config.about.title || '';
        if (aboutSubtitle) aboutSubtitle.textContent = config.about.subtitle || '';
        if (aboutDescription) aboutDescription.innerHTML = (config.about.description || '').replace(/\n/g, '<br>');
        if (aboutImage && config.about.image) aboutImage.src = config.about.image;
    }

    // Reinitialize background effect
    function reinitializeBackgroundEffect() {
        const config = window.siteConfig;
        const effectContainer = document.getElementById('background-effect');
        if (!effectContainer) return;

        // Clear existing effect
        effectContainer.innerHTML = '';

        // Check if effects are enabled
        if (!config.effects || !config.effects.backgroundEffect || !config.effects.backgroundEffect.enabled) {
            return;
        }

        const effect = config.effects.backgroundEffect;

        // Try to use the existing effect initialization if available
        if (typeof initBackgroundEffect === 'function') {
            initBackgroundEffect();
        } else {
            // Simple particle fallback
            createSimpleParticles(effectContainer, effect.intensity);
        }
    }

    // Simple particle effect fallback
    function createSimpleParticles(container, intensity) {
        const count = intensity === 'high' ? 80 : intensity === 'medium' ? 50 : 30;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: var(--primary-color);
                border-radius: 50%;
                opacity: ${Math.random() * 0.5 + 0.2};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${5 + Math.random() * 10}s ease-in-out infinite;
            `;
            container.appendChild(particle);
        }

        // Add float animation if not exists
        if (!document.getElementById('theme-particle-styles')) {
            const style = document.createElement('style');
            style.id = 'theme-particle-styles';
            style.textContent = `
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createSwitcherUI);
    } else {
        createSwitcherUI();
    }

})();
