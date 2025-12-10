// Universal Cookie Consent Script for SitePackages
// Works with any site configuration

(function() {
    'use strict';
    
    // Check if cookie consent is enabled in config
    function isCookieConsentEnabled() {
        if (typeof window.siteConfig === 'undefined' || 
            !window.siteConfig.advanced || 
            !window.siteConfig.advanced.enableCookieConsent) {
            return false;
        }
        return true;
    }
    
    // Check if user has already made a choice
    function hasUserConsented() {
        return localStorage.getItem('cookieConsent') !== null;
    }
    
    // Get consent status
    function getConsentStatus() {
        return localStorage.getItem('cookieConsent') === 'accepted';
    }
    
    // Set consent status
    function setConsentStatus(accepted) {
        localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'declined');
    }
    
    // Disable Google Analytics if present
    function disableAnalytics() {
        // Look for common GA tracking IDs in the page
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            const content = script.innerHTML;
            const match = content.match(/gtag\('config',\s*['"]([^'"]+)['"]\)/);
            if (match) {
                const trackingId = match[1];
                window[`ga-disable-${trackingId}`] = true;
                console.log('Analytics disabled for:', trackingId);
            }
        });
        
        // Also disable dataLayer if it exists
        if (window.gtag) {
            window.gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
    }
    
    // Clear localStorage data (except consent choice)
    function clearLocalStorage() {
        const consentStatus = localStorage.getItem('cookieConsent');
        localStorage.clear();
        localStorage.setItem('cookieConsent', consentStatus);
    }
    
    // Handle consent acceptance
    function acceptCookies() {
        setConsentStatus(true);
        removeBanner();
    }
    
    // Handle consent decline
    function declineCookies() {
        setConsentStatus(false);
        disableAnalytics();
        clearLocalStorage();
        
        // Check if we should redirect
        const config = window.siteConfig;
        if (config && config.advanced && config.advanced.cookieRedirectOnDecline !== false) {
            // Default behavior is to redirect unless explicitly disabled
            window.location.href = 'https://www.google.com';
            return;
        }
        
        removeBanner();
    }
    
    // Remove the banner
    function removeBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.remove();
        }
    }
    
    // Create and show the banner
    function showCookieBanner() {
        // Don't show if already shown or user already decided
        if (document.getElementById('cookie-consent-banner') || hasUserConsented()) {
            return;
        }
        
        const config = window.siteConfig;
        const siteName = (config && config.site && config.site.name) || 'This site';
        const cookiePolicyUrl = (config && config.advanced && config.advanced.cookiePolicyUrl) || '';
        
        // Create banner element
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.95);
            color: white;
            padding: 20px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            border-top: 3px solid #007cba;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
        `;
        
        // Create content
        let policyLink = '';
        if (cookiePolicyUrl) {
            policyLink = ` <a href="${cookiePolicyUrl}" target="_blank" style="color: #4dabf7; text-decoration: underline;">Learn more</a>`;
        }
        
        banner.innerHTML = `
            <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; gap: 15px;">
                <div style="flex: 1; min-width: 300px;">
                    <strong>Cookie Notice:</strong> ${siteName} uses cookies for functionality and analytics. 
                    By continuing to use this site, you consent to our use of cookies.${policyLink}
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button id="cookie-accept" style="
                        background: #28a745;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: background 0.3s;
                    ">Accept Cookies</button>
                    <button id="cookie-decline" style="
                        background: #dc3545;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: background 0.3s;
                    ">Decline & Leave</button>
                </div>
            </div>
        `;
        
        // Add hover effects
        const style = document.createElement('style');
        style.textContent = `
            #cookie-accept:hover { background: #218838 !important; }
            #cookie-decline:hover { background: #c82333 !important; }
            @media (max-width: 768px) {
                #cookie-consent-banner > div {
                    flex-direction: column;
                    text-align: center;
                }
                #cookie-consent-banner button {
                    min-width: 150px;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Add to page
        document.body.appendChild(banner);
        
        // Add event listeners
        document.getElementById('cookie-accept').addEventListener('click', acceptCookies);
        document.getElementById('cookie-decline').addEventListener('click', declineCookies);
    }
    
    // Initialize when DOM is ready
    function init() {
        // Only proceed if cookie consent is enabled
        if (!isCookieConsentEnabled()) {
            return;
        }
        
        // If user already declined cookies, disable analytics immediately
        if (hasUserConsented() && !getConsentStatus()) {
            disableAnalytics();
            return;
        }
        
        // If user hasn't made a choice, show banner
        if (!hasUserConsented()) {
            showCookieBanner();
        }
    }
    
    // Wait for config to load, then initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Give config time to load
            setTimeout(init, 500);
        });
    } else {
        setTimeout(init, 500);
    }
    
    // Export functions for external use
    window.CookieConsent = {
        hasConsented: hasUserConsented,
        getStatus: getConsentStatus,
        showBanner: showCookieBanner,
        accept: acceptCookies,
        decline: declineCookies
    };
    
})();