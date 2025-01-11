class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.matches = [];
        this.currentMatchIndex = -1;
        this.navigationContainer = document.querySelector('.search-navigation');
        this.matchCounter = this.navigationContainer.querySelector('.match-counter');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Search input event
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
            this.updateNavigationVisibility();
        });

        // Navigation buttons
        document.querySelector('.prev-match').addEventListener('click', () => {
            this.navigateMatch(-1);
        });

        document.querySelector('.next-match').addEventListener('click', () => {
            this.navigateMatch(1);
        });

        // Clear search when entries are updated
        document.addEventListener('entriesUpdated', () => {
            this.reset();
        });
    }

    handleSearch(searchTerm) {
        searchTerm = searchTerm.toLowerCase().trim();
        const entries = dataManager.getAllEntries();
        
        // Filter entries
        const filteredEntries = entries.filter(entry => {
            return (
                entry.i.toLowerCase().includes(searchTerm) ||
                entry.d.toLowerCase().includes(searchTerm) ||
                (entry.dp && entry.dp.toLowerCase().includes(searchTerm)) ||
                (entry.cp && entry.cp.toLowerCase().includes(searchTerm)) ||
                (entry.un && entry.un.toLowerCase().includes(searchTerm))
            );
        });

        // Find matches in visible content
        if (searchTerm) {
            setTimeout(() => this.findMatches(searchTerm), 100); // Wait for DOM update
        } else {
            this.resetMatches();
        }

        // Trigger custom event for filtered results
        document.dispatchEvent(new CustomEvent('searchResults', {
            detail: { entries: filteredEntries }
        }));
    }

    findMatches(searchTerm) {
        this.matches = [];
        this.currentMatchIndex = -1;

        const entriesList = document.getElementById('entriesList');
        const walker = document.createTreeWalker(
            entriesList,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // Skip hidden elements and script content
                    if (node.parentElement.offsetHeight === 0 || 
                        node.parentElement.tagName === 'SCRIPT') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let node;
        while (node = walker.nextNode()) {
            const text = node.textContent.toLowerCase();
            let index = -1;

            while ((index = text.indexOf(searchTerm, index + 1)) !== -1) {
                this.matches.push({
                    node: node,
                    startIndex: index,
                    length: searchTerm.length
                });
            }
        }

        if (this.matches.length > 0) {
            this.currentMatchIndex = 0;
            this.highlightMatches();
            this.updateMatchCounter();
            this.scrollToCurrentMatch();
        }
    }

    highlightMatches() {
        // Remove existing highlights
        document.querySelectorAll('.search-highlight').forEach(el => {
            const parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize();
        });

        // Add new highlights
        this.matches.forEach((match, index) => {
            const text = match.node.textContent;
            const before = text.substring(0, match.startIndex);
            const matchText = text.substring(match.startIndex, match.startIndex + match.length);
            const after = text.substring(match.startIndex + match.length);

            const fragment = document.createDocumentFragment();
            fragment.appendChild(document.createTextNode(before));

            const highlight = document.createElement('span');
            highlight.textContent = matchText;
            highlight.classList.add('search-highlight');
            if (index === this.currentMatchIndex) {
                highlight.classList.add('current-match');
            }

            fragment.appendChild(highlight);
            fragment.appendChild(document.createTextNode(after));

            const parent = match.node.parentNode;
            parent.replaceChild(fragment, match.node);
        });
    }

    navigateMatch(direction) {
        if (this.matches.length === 0) return;

        this.currentMatchIndex = (this.currentMatchIndex + direction + this.matches.length) % this.matches.length;
        this.highlightMatches();
        this.updateMatchCounter();
        this.scrollToCurrentMatch();
    }

    scrollToCurrentMatch() {
        const currentHighlight = document.querySelectorAll('.search-highlight')[this.currentMatchIndex];
        if (currentHighlight) {
            currentHighlight.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    updateMatchCounter() {
        if (this.matches.length > 0) {
            this.matchCounter.textContent = `${this.currentMatchIndex + 1}/${this.matches.length}`;
        } else {
            this.matchCounter.textContent = '0/0';
        }
    }

    updateNavigationVisibility() {
        if (this.matches.length > 0) {
            this.navigationContainer.classList.remove('hidden');
        } else {
            this.navigationContainer.classList.add('hidden');
        }
    }

    resetMatches() {
        this.matches = [];
        this.currentMatchIndex = -1;
        this.updateMatchCounter();
        this.updateNavigationVisibility();
        document.querySelectorAll('.search-highlight').forEach(el => {
            const parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize();
        });
    }

    reset() {
        this.searchInput.value = '';
        this.resetMatches();
        document.dispatchEvent(new CustomEvent('searchResults', {
            detail: { entries: dataManager.getAllEntries() }
        }));
    }
}

// Initialize search manager
const searchManager = new SearchManager();