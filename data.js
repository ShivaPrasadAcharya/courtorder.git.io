// Data storage configuration
const STORAGE_KEY = 'entrySystem';
const MAX_ENTRIES = 7;

// Sample initial data
const initialData = {
    key: 'entrySystem',
    entries: [
       {
           i:'0001',d:'arun chaudhary, pil, locus standii, exaustion of alternative remedy, cb, writ quashed, election, basanta joshi, sc',dp:'ट्याक्टरमा आगो लगाएको कसूरमा सजाय भई कैद असुल उपर हुन बाँकी रहेको अवस्थामा झूठा विवरण भरी उमेद्वार भएको र निर्वाचन जितेपछि राष्ट्रपतिबाट कैद मिनाहा भएको ',c:{ci:0,cr:0,wo:1,oth:0},cp:'संक्षिप्त आदेश, निसु राखी रिट खारेज, ',u:'https://www.onlinekhabar.com/2025/01/1605647/arun-chaudharys-mp-post-saved-supreme-court-dismisses-writ',un:'ok khabar with order',dt:'2081-10-02'
       }
    ]
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
        const fields = Object.keys(entry.c)
            .map(key => `${key}:${entry.c[key]}`)
            .join(',');
        return `{i:'${entry.i}',d:'${entry.d}',dp:'${entry.dp}',c:{${fields}},cp:'${entry.cp}',u:'${entry.u}',un:'${entry.un}',dt:'${entry.dt}'}`;
    }
}

// Create global instance
const dataManager = new DataManager();
