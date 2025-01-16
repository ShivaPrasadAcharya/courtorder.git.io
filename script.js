class EntrySystem {
    constructor() {
        this.entriesList = document.getElementById('entriesList');
        this.setupEventListeners();
        this.renderEntries(dataManager.getAllEntries());
    }

    setupEventListeners() {
        // Listen for updates from different components
        document.addEventListener('entriesUpdated', () => {
            this.renderEntries(dataManager.getAllEntries());
            searchManager.reset();
            filterManager.reset();
        });

        document.addEventListener('searchResults', (e) => {
            this.renderEntries(e.detail.entries);
        });

        document.addEventListener('filterResults', (e) => {
            this.renderEntries(e.detail.entries);
        });
    }

    renderEntries(entries) {
        this.entriesList.innerHTML = '';

        if (entries.length === 0) {
            this.showEmptyState();
            return;
        }

        entries.forEach(entry => {
            const entryCard = this.createEntryCard(entry);
            this.entriesList.appendChild(entryCard);
        });
    }

    createEntryCard(entry) {
        const card = document.createElement('div');
        card.classList.add(
            'entry-card',
            'bg-white',
            'rounded-lg',
            'shadow',
            'p-6',
            'mb-4',
            'relative',
            'border',
            'border-gray-200'
        );
        card.dataset.entryId = entry.i;

        // Category badges
        const badges = this.createCategoryBadges(entry.c);
        
        // Main content
        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div>
                    <span class="text-sm text-gray-500">#${entry.i}</span>
                    <h3 class="text-lg font-semibold mt-1">${entry.d}</h3>
                </div>
                <div class="flex space-x-2">
                    ${badges}
                </div>
            </div>
            
            ${entry.dp ? `<p class="text-gray-600 mb-4">${entry.dp}</p>` : ''}
            
            <div class="flex flex-wrap gap-4 mt-4">
                ${entry.cp ? `
                    <div class="flex items-center">
                        <span class="text-sm font-medium text-gray-500">Category:</span>
                        <span class="ml-2 text-sm">${entry.cp}</span>
                    </div>
                ` : ''}
                
                ${entry.u ? `
                    <div class="flex items-center">
                        <span class="text-sm font-medium text-gray-500">URL:</span>
                        <a href="${entry.u}" target="_blank" class="ml-2 text-blue-500 hover:text-blue-600 text-sm">
                            ${entry.un || entry.u}
                        </a>
                    </div>
                ` : ''}
                
                <div class="flex items-center">
                    <span class="text-sm font-medium text-gray-500">Date:</span>
                    <span class="ml-2 text-sm">${entry.dt}</span>
                </div>
            </div>
            
            <div class="absolute top-4 right-4 flex space-x-2">
                <button class="pdf-export p-1 hover:bg-gray-100 rounded" title="Export as PDF">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                </button>
                <button class="edit-entry p-1 hover:bg-gray-100 rounded" title="Edit entry">
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
            </div>
            
            <div class="entry-footer mt-4 pt-2 border-t text-sm text-gray-500 text-right">
                Shiva Prasad Acharya (2081)
            </div>
        `;

        // Add edit functionality
        const editButton = card.querySelector('.edit-entry');
        editButton.addEventListener('click', () => this.handleEdit(entry));

        // Add PDF export functionality
        const pdfButton = card.querySelector('.pdf-export');
        pdfButton.addEventListener('click', () => pdfGenerator.generatePDF(entry.i));

        return card;
    }

    createCategoryBadges(categories) {
        const badges = [];
        
        if (categories.ci) {
            badges.push(`<span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">civil</span>`);
        }
        if (categories.cr) {
            badges.push(`<span class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">criminal</span>`);
        }
        if (categories.wo) {
            badges.push(`<span class="px-2 py-1 bg-purple-100 text-orange-800 rounded-full text-xs">writ</span>`);
        }
                if (categories.oth) {
            badges.push(`<span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">others</span>`);
        }
        
        return badges.join('');
    }

    handleEdit(entry) {
        formManager.populateForm(entry);
    }

    showEmptyState() {
        this.entriesList.innerHTML = `
            <div class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No entries found</h3>
                <p class="mt-1 text-sm text-gray-500">Get started by creating a new entry.</p>
            </div>
        `;
    }
}

// Initialize the entry system
const entrySystem = new EntrySystem();
