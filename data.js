// Data storage configuration
const STORAGE_KEY = 'entrySystem';
const MAX_ENTRIES = 7;

// Sample initial data
const initialData = {
    key: 'entrySystem',
    entries: [
{i:'0006',d:'ok ok ok ok',dp:'ok ok ok',c:{pq:0,pp:0,da:1,pa:0,doi:0,tax:0,uv:0,eq:0,rec:1,ree:0,ci:0,cr:0,writ:0,coc:0,sco:0,iodp:0,ionifh:0,ioni:0,ioit:0,ios:0,ioi:0,efb:0,fb:0,si:0,db:0,cb:0,pg:0,png:0},cp:'double tax',u:'',un:'',dt:'2081-09-27'};
        {
            i: '0001',
            d: 'Example entry',
            dp: '',
            c: {
                pq: 0,
                pp: 0,
                da: 0,
                pa: 0,
                doi: 0,
                tax: 0,
                uv: 0,
                eq: 0,
                rec: 0,
                ree: 0,
                ci: 0,
                cr: 0,
                writ: 0,
                coc: 0,
                sco: 0,
                iodp: 0,
                ionifh: 0,
                ioni: 0,
                ioit: 0,
                ios: 0,
                ioi: 0,
                efb: 0,
                fb: 0,
                si: 0,
                db: 0,
                cb: 0,
                pg: 0,
                png: 0
            },
            cp: 'High',
            u: '',
            un: '',
            dt: '2025-01-11'
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
