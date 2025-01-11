class FooterManager {
    constructor() {
        this.footerText = 'Shiva Prasad Acharya (2081)';
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for new entries being added
        document.addEventListener('entriesUpdated', () => {
            this.addFooterToEntries();
        });
    }

    addFooterToEntries() {
        const entryCards = document.querySelectorAll('.entry-card');
        entryCards.forEach(card => {
            // Check if footer already exists
            if (!card.querySelector('.entry-footer')) {
                const footer = document.createElement('div');
                footer.classList.add('entry-footer');
                footer.textContent = this.footerText;
                card.appendChild(footer);
            }
        });
    }

    getFooterHTML() {
        return `<div class="entry-footer">${this.footerText}</div>`;
    }
}

// Initialize Footer Manager
const footerManager = new FooterManager();