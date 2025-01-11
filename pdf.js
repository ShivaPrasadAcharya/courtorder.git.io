class PDFGenerator {
    constructor() {
        this.jsPDF = window.jspdf.jsPDF;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.pdf-export')) {
                const entryCard = e.target.closest('.entry-card');
                const entryId = entryCard.dataset.entryId;
                this.generatePDF(entryId);
            }
        });
    }

    async generatePDF(entryId) {
        const entry = dataManager.getEntryById(entryId);
        if (!entry) return;

        const doc = new this.jsPDF();

        // Set up document
        doc.setFontSize(16);
        doc.text(`Entry Details - ${entry.i}`, 20, 20);
        
        // Add content
        doc.setFontSize(12);
        let yPosition = 40;
        
        const addContent = (label, value) => {
            if (value) {
                // Check if we need a new page
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                // Handle long text with word wrap
                const splitText = doc.splitTextToSize(`${label}: ${value}`, 170);
                doc.text(splitText, 20, yPosition);
                yPosition += 10 * splitText.length;
            }
        };

        // Add entry details
        addContent('Description', entry.d);
        addContent('Extended Description', entry.dp);
        addContent('Categories', this.getCategoryText(entry.c));
        addContent('Category Plus', entry.cp);
        addContent('URL', entry.u);
        addContent('URL Name', entry.un);
        addContent('Date', entry.dt);

        // Add footer on each page
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(128);
            doc.text(
                'Shiva Prasad Acharya (2081)', 
                doc.internal.pageSize.getWidth() - 60,
                doc.internal.pageSize.getHeight() - 10
            );
        }

        // Save the PDF
        doc.save(`entry-${entry.i}.pdf`);
    }

    getCategoryText(categories) {
        const categoryLabels = [];
        if (categories.s) categoryLabels.push('Show Cause');
        if (categories.i) categoryLabels.push('Interim');
        if (categories.p) categoryLabels.push('Priority');
        return categoryLabels.join(', ');
    }
}

// Initialize PDF Generator
const pdfGenerator = new PDFGenerator();