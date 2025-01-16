class FormManager {
    constructor() {
        this.form = document.getElementById('entryForm');
        this.formSection = document.getElementById('formSection');
        this.addEntryBtn = document.getElementById('addEntryBtn');
        this.codeField = document.getElementById('generatedCode');
        this.copyButton = document.getElementById('copyCode');
        this.resetButton = document.getElementById('resetForm');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Toggle form visibility
        this.addEntryBtn.addEventListener('click', () => this.toggleForm());

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time code generation
        this.form.addEventListener('input', () => this.updateGeneratedCode());

        // Copy button
        this.copyButton.addEventListener('click', () => this.copyCodeToClipboard());

        // Reset button
        this.resetButton.addEventListener('click', () => this.resetForm());

        // Date input validation
        const dateInput = document.getElementById('entryDate');
        dateInput.addEventListener('input', (e) => this.validateDateFormat(e.target));

        // Close form when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#formSection') && 
                !e.target.closest('#addEntryBtn') && 
                !this.formSection.classList.contains('hidden')) {
                this.hideForm();
            }
        });
    }

    toggleForm() {
        if (this.formSection.classList.contains('hidden')) {
            this.showForm();
        } else {
            this.hideForm();
        }
    }

    showForm() {
        this.formSection.classList.remove('hidden');
        this.formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    hideForm() {
        this.formSection.classList.add('hidden');
    }

    handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        const formData = this.getFormData();

        try {
            if (formData.i && dataManager.isIdExists(formData.i)) {
                dataManager.updateEntry(formData.i, formData);
                this.showSuccessMessage('Entry updated successfully!');
            } else {
                dataManager.addEntry(formData);
                this.showSuccessMessage('Entry saved successfully!');
            }
            
            this.resetForm();
            this.hideForm();
            
            // Trigger entries list update
            document.dispatchEvent(new CustomEvent('entriesUpdated'));
        } catch (error) {
            if (error.message === 'ID already exists') {
                this.showError('entryId', 'This ID already exists. Please use a different ID.');
            } else {
                this.showError(null, 'Failed to save entry. Please try again.');
            }
        }
    }

    getFormData() {
        return {
            i: document.getElementById('entryId').value,
            d: document.getElementById('description').value,
            dp: document.getElementById('descriptionPlus').value,
            c: {
                
                ci: document.getElementById('civil').checked ? 1 : 0,
                cr: document.getElementById('criminal').checked ? 1 : 0,
                wo: document.getElementById('writ').checked ? 1 : 0,
                oth: document.getElementById('others').checked ? 1 : 0
                             
            },
            cp: document.getElementById('categoryPlus').value,
            u: document.getElementById('url').value,
            un: document.getElementById('urlName').value,
            dt: document.getElementById('entryDate').value
        };
    }

    updateGeneratedCode() {
        const formData = this.getFormData();
        this.codeField.value = dataManager.generateEntryCode(formData);
    }

    validateForm() {
        let isValid = true;

        // Required fields
        const requiredFields = ['entryId', 'description', 'entryDate'];
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                this.showError(fieldId, `${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)} is required`);
                isValid = false;
            }
        });

        // Date format validation
        const dateField = document.getElementById('entryDate');
        if (!this.isValidDateFormat(dateField.value)) {
            this.showError('entryDate', 'Please use YYYY-MM-DD format');
            isValid = false;
        }

        return isValid;
    }

    isValidDateFormat(dateStr) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateStr)) return false;
        
        const date = new Date(dateStr);
        return date instanceof Date && !isNaN(date);
    }

    validateDateFormat(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 4) {
            value = value.slice(0, 4) + '-' + value.slice(4);
        }
        if (value.length >= 7) {
            value = value.slice(0, 7) + '-' + value.slice(7);
        }
        input.value = value.slice(0, 10);
    }

    copyCodeToClipboard() {
        this.codeField.select();
        document.execCommand('copy');
        
        // Visual feedback
        this.copyButton.classList.add('copy-success');
        this.copyButton.textContent = 'Copied!';
        
        setTimeout(() => {
            this.copyButton.classList.remove('copy-success');
            this.copyButton.textContent = 'Copy';
        }, 1500);
    }

    resetForm() {
        this.form.reset();
        this.codeField.value = '';
        this.clearErrors();
    }

    populateForm(entry) {
        document.getElementById('entryId').value = entry.i;
        document.getElementById('description').value = entry.d;
        document.getElementById('descriptionPlus').value = entry.dp || '';
        document.getElementById('civil').checked = entry.c.ci === 1;
        document.getElementById('criminal').checked = entry.c.cr === 1;
        document.getElementById('writ').checked = entry.c.wo === 1;
        document.getElementById('others').checked = entry.c.oth === 1;
        document.getElementById('categoryPlus').value = entry.cp || '';
        document.getElementById('url').value = entry.u || '';
        document.getElementById('urlName').value = entry.un || '';
        document.getElementById('entryDate').value = entry.dt;

        this.updateGeneratedCode();
        this.showForm();
    }

    showError(fieldId, message) {
        if (fieldId) {
            const field = document.getElementById(fieldId);
            field.classList.add('error');
            
            // Create or update error message
            let errorDiv = field.nextElementSibling;
            if (!errorDiv || !errorDiv.classList.contains('error-message')) {
                errorDiv = document.createElement('div');
                errorDiv.classList.add('error-message', 'text-red-500', 'text-sm', 'mt-1');
                field.parentNode.insertBefore(errorDiv, field.nextSibling);
            }
            errorDiv.textContent = message;
        }
    }

    clearErrors() {
        const errorFields = this.form.querySelectorAll('.error');
        const errorMessages = this.form.querySelectorAll('.error-message');
        
        errorFields.forEach(field => field.classList.remove('error'));
        errorMessages.forEach(msg => msg.remove());
    }

    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.classList.add(
            'success-message',
            'fixed',
            'top-4',
            'right-4',
            'bg-green-500',
            'text-white',
            'px-6',
            'py-3',
            'rounded-lg',
            'shadow-lg'
        );
        successDiv.textContent = message;
        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.style.opacity = '0';
            setTimeout(() => successDiv.remove(), 300);
        }, 2000);
    }
}

// Initialize form manager
const formManager = new FormManager();
