/*! sp v1.1 - SITEPACKAGES Attribution */
(function() {
    'use strict';

    var SP_URL = 'https://sitepackages.net';
    var SP_TEXT = 'Powered by';
    var SP_NAME = 'SITEPACKAGES';

    // Add attribution to footer
    function addAttribution() {
        var footer = document.querySelector('footer');
        var existing = document.getElementById('sp-a');

        if (!existing && footer) {
            var html = '<div id="sp-a" class="sp-a" style="text-align:center;padding:10px 0;font-size:12px;opacity:0.7">' +
                '<a href="' + SP_URL + '" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">' +
                SP_TEXT + ' <strong>' + SP_NAME + '</strong></a></div>';
            footer.insertAdjacentHTML('beforeend', html);
        }

        // Ensure visibility if hidden
        if (existing && existing.style.display === 'none') {
            existing.style.display = 'block';
        }
    }

    // Add SITEPACKAGES to copyright text
    function updateCopyright() {
        var copyright = document.getElementById('copyright-text');
        if (copyright) {
            var text = copyright.textContent || '';
            if (!text.toLowerCase().includes('sitepackages')) {
                copyright.innerHTML += ' | Template by <a href="' + SP_URL + '" target="_blank" rel="noopener">SITEPACKAGES</a>';
            }
        }
    }

    // Add style to ensure visibility
    function addStyle() {
        var style = document.createElement('style');
        style.textContent = '.sp-a{display:block!important;visibility:visible!important;opacity:.7!important}';
        document.head.appendChild(style);
    }

    // Watch for removal and re-add
    function watchAttribution() {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.removedNodes.length > 0) {
                    mutation.removedNodes.forEach(function(node) {
                        if (node.id === 'sp-a' || (node.classList && node.classList.contains('sp-a'))) {
                            setTimeout(addAttribution, 100);
                        }
                    });
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Add generator meta tag
    function addMeta() {
        if (!document.querySelector('meta[name="generator"]')) {
            var meta = document.createElement('meta');
            meta.name = 'generator';
            meta.content = 'SITEPACKAGES Template v1.0';
            document.head.appendChild(meta);
        }
    }

    // Check license key
    function checkLicense() {
        var key = (window.siteConfig && window.siteConfig.license && window.siteConfig.license.key) ||
                  window.localStorage.getItem('sp_license_key');
        if (key && /^SP-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key)) {
            document.documentElement.setAttribute('data-sp-v', '1');
        }
    }

    // Initialize
    function init() {
        addMeta();
        addAttribution();
        updateCopyright();
        addStyle();
        watchAttribution();
        checkLicense();

        // Periodic check
        setInterval(addAttribution, 30000);
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API
    window._sp = {
        v: '1.1.0',
        c: checkLicense
    };
})();
