// SITEPACKAGES Version Control
// This file tracks versions of all platform components

window.SITEPACKAGES = {
    // Platform version - increment on major releases
    version: "1.2.0",

    // Build date
    build: "2024-12-10",

    // Individual module versions
    modules: {
        main: "1.2.0",           // Core functionality
        promotions: "1.0.1",     // Promo badges and sales
        navigator: "1.0.0",      // Strain tree navigator
        sp: "1.0.0",             // Utility functions
        effects: "1.1.0",        // Background effects system
        agecheck: "1.0.0",       // Age verification
        cookie: "1.0.0"          // Cookie consent
    },

    // Effects module versions
    effects: {
        particles: "1.0.0",
        leaves: "1.0.0",
        stars: "1.0.0",
        snow: "1.0.0",
        rain: "1.0.0",
        fireflies: "1.0.0",
        bubbles: "1.0.0",
        confetti: "1.0.0",
        matrix: "1.0.0",
        spotlight: "1.0.0",
        floatingObject: "1.0.0",
        // Holiday effects
        christmas: "1.0.0",
        halloween: "1.0.0",
        valentines: "1.0.0",
        easter: "1.0.0",
        stpatricks: "1.0.0",
        summer: "1.0.0"
    },

    // Get formatted version string
    getVersion: function() {
        return `SITEPACKAGES v${this.version} (build ${this.build})`;
    },

    // Log version info to console
    logVersion: function() {
        console.log('%c' + this.getVersion(), 'color: #667eea; font-weight: bold; font-size: 14px;');
        console.log('Modules:', this.modules);
    },

    // Check if module version is at least specified version
    checkModuleVersion: function(module, minVersion) {
        const current = this.modules[module];
        if (!current) return false;
        return this.compareVersions(current, minVersion) >= 0;
    },

    // Compare version strings (returns -1, 0, or 1)
    compareVersions: function(v1, v2) {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);
        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const p1 = parts1[i] || 0;
            const p2 = parts2[i] || 0;
            if (p1 > p2) return 1;
            if (p1 < p2) return -1;
        }
        return 0;
    }
};

// Auto-log version on load (can be disabled)
if (typeof window.SITEPACKAGES_SILENT === 'undefined' || !window.SITEPACKAGES_SILENT) {
    document.addEventListener('DOMContentLoaded', function() {
        SITEPACKAGES.logVersion();
    });
}
