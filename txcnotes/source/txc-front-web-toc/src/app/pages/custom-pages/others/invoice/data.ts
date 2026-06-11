interface InvoiceItem {
    id: number;
    name: string;
    description: string;
    qty: number;
    unit_cost: number;
    total: number;
}

interface invoice {
    customer?: string;
    notes?: string;
    invoice_date?: string;
    invoice_id?: string;
    invoice_status?: string;
    address?: {
        line_1?: string;
        city?: string;
        state?: string;
        zip?: number;
        phone?: string;
    };
    billing_address?: {
        line_1?: string;
        city?: string;
        state?: string;
        zip?: number;
        phone?: string;
    };
    items: InvoiceItem[];
    due_date?: string;
    sub_total?: number;
    vat?: number;
    total?: number;
};

const invoiceData: invoice = {
    customer: 'Greeva Navadiya',
    notes: 'All accounts are to be paid within 7 days from receipt of invoice. To be paid by cheque or credit card or direct payment online. If account is not paid within 7 days the credits details supplied as confirmation of work undertaken will be charged the agreed quoted fee noted above',
    invoice_date: 'Jul 17, 2019',
    due_date: 'Jul 27, 2019',
    invoice_id: '#12345',
    invoice_status: 'Paid',
    address: {
        line_1: '795 Folsom Ave, Suite 600',
        city: 'San Francisco',
        state: 'CA',
        zip: 94107,
        phone: '(123) 456-7890',
    },
    billing_address: {
        line_1: '795 Folsom Ave, Suite 600',
        city: 'San Francisco',
        state: 'CA',
        zip: 94107,
        phone: '(123) 456-7890',
    },
    items: [
        {
            id: 1,
            name: 'Laptop',
            description: 'Brand Model VGN-TXN27N/B 11.1" Notebook PC',
            qty: 1,
            unit_cost: 1799.00,
            total: 1799.00,
        },
        {
            id: 2,
            name: 'Warranty',
            description: 'Two Year Extended Warranty - Parts and Labor',
            qty: 3,
            unit_cost: 499.00,
            total: 1497.00,
        },
        {
            id: 3,
            name: 'LED',
            description: '80cm (32) HD Ready LED TV',
            qty: 2,
            unit_cost: 412.00,
            total: 824.00,
        },
    ],
    sub_total: 4120.00,
    vat: 515.00,
    total: 4635.00,
};

export { invoice, invoiceData };