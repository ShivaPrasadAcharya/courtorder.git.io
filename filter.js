class FilterManager {
    constructor() {
        this.filterDropdownBtn = document.getElementById('filterDropdownBtn');
        this.filterDropdown = document.getElementById('filterDropdown');
        this.categoryFilters = document.getElementById('categoryFilters');
        this.categoryPlusFilters = document.getElementById('categoryPlusFilters');
        this.selectedCategories = new Set();
        this.selectedCategoryPlus = new Set();
        this.setupEventListeners();
        this.initializeFilters();
    }

    setupEventListeners() {
        // Toggle dropdown
        this.filterDropdownBtn.addEventListener('click', () => {
            this.filterDropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#filterDropdownBtn') && !e.target.closest('#filterDropdown')) {
                this.filterDropdown.classList.add('hidden');
            }
        });

        // Listen for changes in entries to update filter options
        document.addEventListener('entriesUpdated', () => {
            this.initializeFilters();
        });
    }

    initializeFilters() {
        // Clear existing filters
        this.categoryFilters.innerHTML = '';
        this.categoryPlusFilters.innerHTML = '';

        // Add predefined category filters
        this.categoryFilters.innerHTML = `
            <div class="filter-group">
                <h4>Categories</h4>
                <div class="filter-option">
                    <input type="checkbox" id="filter-civil" 
                        ${this.selectedCategories.has('civil') ? 'checked' : ''}>
                    <label for="filter-civil">civil</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" id="filter-criminal"
                        ${this.selectedCategories.has('criminal') ? 'checked' : ''}>
                    <label for="filter-criminal">criminal</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" id="filter-writ"
                        ${this.selectedCategories.has('writ') ? 'checked' : ''}>
                    <label for="filter-writ">writ</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" id="filter-others"
                        ${this.selectedCategories.has('others') ? 'checked' : ''}>
                    <label for="filter-others">others</label>
                </div>
            </div>
        `;

        // Add dynamic category plus filters
        const entries = dataManager.getAllEntries();
        const uniqueCategoryPlus = new Set(entries.map(entry => entry.cp).filter(Boolean));

        if (uniqueCategoryPlus.size > 0) {
            let categoryPlusHTML = '<div class="filter-group"><h4>Category Plus</h4>';
            uniqueCategoryPlus.forEach(category => {
                categoryPlusHTML += `
                    <div class="filter-option">
                        <input type="checkbox" id="filter-cp-${category}"
                            ${this.selectedCategoryPlus.has(category) ? 'checked' : ''}>
                        <label for="filter-cp-${category}">${category}</label>
                    </div>
                `;
            });
            categoryPlusHTML += '</div>';
            this.categoryPlusFilters.innerHTML = categoryPlusHTML;
        }

        // Add event listeners to checkboxes
        this.addCheckboxListeners();
    }

    addCheckboxListeners() {
        // Category checkboxes
        const categoryCheckboxes = this.categoryFilters.querySelectorAll('input[type="checkbox"]');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const category = checkbox.id.replace('filter-', '').replace(/-/g, '');
                if (checkbox.checked) {
                    this.selectedCategories.add(category);
                } else {
                    this.selectedCategories.delete(category);
                }
                this.applyFilters();
            });
        });

        // Category Plus checkboxes
        const categoryPlusCheckboxes = this.categoryPlusFilters.querySelectorAll('input[type="checkbox"]');
        categoryPlusCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const category = checkbox.id.replace('filter-cp-', '');
                if (checkbox.checked) {
                    this.selectedCategoryPlus.add(category);
                } else {
                    this.selectedCategoryPlus.delete(category);
                }
                this.applyFilters();
            });
        });
    }

    applyFilters() {
        const entries = dataManager.getAllEntries();
        let filteredEntries = entries;

        // Apply category filters
        if (this.selectedCategories.size > 0) {
            filteredEntries = filteredEntries.filter(entry => {
                return (
                    (this.selectedCategories.has('civil') && entry.c.ci) ||
                    (this.selectedCategories.has('criminal') && entry.c.cr) ||
                    (this.selectedCategories.has('writ') && entry.c.wo) ||
                    (this.selectedCategories.has('others') && entry.c.oth)
                );
            });
        }

        // Apply category plus filters
        if (this.selectedCategoryPlus.size > 0) {
            filteredEntries = filteredEntries.filter(entry => 
                this.selectedCategoryPlus.has(entry.cp)
            );
        }

        // Trigger custom event for filtered results
        document.dispatchEvent(new CustomEvent('filterResults', {
            detail: { entries: filteredEntries }
        }));
    }

    reset() {
        this.selectedCategories.clear();
        this.selectedCategoryPlus.clear();
        this.initializeFilters();
        document.dispatchEvent(new CustomEvent('filterResults', {
            detail: { entries: dataManager.getAllEntries() }
        }));
    }
}

// Initialize filter manager
const filterManager = new FilterManager();
