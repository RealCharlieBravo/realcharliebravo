function generatePromoBadge(promotional) {
    if (!promotional || !promotional.enabled || promotional.type === 'none') {
        return '';
    }
    
    let badgeText = '';
    let badgeClass = promotional.type;
    
    switch (promotional.type) {
        case 'percentage':
            badgeText = `${promotional.value}% OFF`;
            break;
        case 'sale':
            badgeText = 'SALE';
            break;
        case 'bogo':
            badgeText = promotional.bogoType === 'same' ? 'BOGO' : 'BOGO ANY';
            break;
        case 'new':
            badgeText = 'NEW';
            break;
        case 'limited':
            badgeText = 'LIMITED';
            break;
        case 'custom':
            badgeText = promotional.value || 'SPECIAL';
            break;
    }
    
    return `<div class="promo-badge ${badgeClass}">${badgeText}</div>`;
}

