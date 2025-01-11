// Data storage configuration
const STORAGE_KEY = 'entrySystem';
const MAX_ENTRIES = 7;

// Sample initial data
const initialData = {
    key: 'entrySystem',
    entries: [{
        i: '0001',
        d: 'Example entry',
        dp: '',
        c: {
            s: 1,
            i: 0,
            p: 1
        },
        cp: 'High',
        u: '',
        un: '',
        dt: '2025-01-11'
    }]
};

class DataManager {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (!storedData) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        }
    }

    getAllEntries() {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return data.entries;
    }

    getEntryById(id) {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return data.entries.find(entry => entry.i === id);
    }

    addEntry(entry) {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        
        // Check for duplicate ID
        if (this.isIdExists(entry.i)) {
            throw new Error('ID already exists');
        }

        // Add new entry and maintain max entries limit
        data.entries.unshift(entry);
        if (data.entries.length > MAX_ENTRIES) {
            data.entries = data.entries.slice(0, MAX_ENTRIES);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    }

    updateEntry(id, updatedEntry) {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        const index = data.entries.findIndex(entry => entry.i === id);
        
        if (index === -1) {
            throw new Error('Entry not found');
        }

        data.entries[index] = updatedEntry;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    }

    isIdExists(id) {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return data.entries.some(entry => entry.i === id);
    }

    generateEntryCode(entry) {
        return `{i:'${entry.i}',d:'${entry.d}',dp:'${entry.dp}',c:{s:${entry.c.s},i:${entry.c.i},p:${entry.c.p}},cp:'${entry.cp}',u:'${entry.u}',un:'${entry.un}',dt:'${entry.dt}'}`;
    }
}

// Create global instance
const dataManager = new DataManager();