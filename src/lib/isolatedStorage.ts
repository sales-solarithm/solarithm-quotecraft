import { Client, Quotation } from '../types';

export const STORAGE_KEYS = {
  LEADS: 'solarithm_quotation_leads',
  DRAFT_QUOTES: 'solarithm_draft_quotes',
} as const;

export const STORAGE_EVENTS = {
  LEADS_UPDATED: 'solarithm:leads_updated',
  QUOTES_UPDATED: 'solarithm:quotes_updated',
} as const;

// Default initial leads for sandbox isolation
const DEFAULT_INITIAL_LEADS: Client[] = [
  {
    id: 'lead-1',
    companyName: 'Adani Green Energy Ltd',
    contactPerson: 'Rajesh Sharma',
    address: {
      line1: 'Sector 25, Commercial Belt',
      line2: 'Near Infocity',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pinCode: '382007',
    },
    gstin: '24AAACA1234A1Z5',
    pan: 'AAACA1234A',
    phone: '+91 98250 12345',
    email: 'r.sharma@adanigreen.com',
    category: 'T1',
    status: 'Lead',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'lead-2',
    companyName: 'Tata Power Renewable Energy Ltd',
    contactPerson: 'Pooja Verma',
    address: {
      line1: 'Cyber Towers, Hitech City',
      line2: 'Phase 2',
      city: 'Hyderabad',
      state: 'Telangana',
      pinCode: '500081',
    },
    gstin: '36AAACT5678B1Z2',
    pan: 'AAACT5678B',
    phone: '+91 99490 67890',
    email: 'pooja.verma@tatapower.com',
    category: 'T2',
    status: 'Lead',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'lead-3',
    companyName: 'CleanMax Enviro Energy Solutions',
    contactPerson: 'Vikram Mehta',
    address: {
      line1: 'Godrej One, Pirojshanagar',
      line2: 'Vikhroli East',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400079',
    },
    gstin: '27AABCC9012C1Z8',
    pan: 'AABCC9012C',
    phone: '+91 98200 45678',
    email: 'vikram.m@cleanmax.com',
    category: 'T1',
    status: 'Lead',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Default initial draft quotations for sandbox isolation
const DEFAULT_INITIAL_QUOTES: Quotation[] = [
  {
    id: 'quote-sample-1',
    quotationNumber: `QT-${new Date().getFullYear()}-001`,
    proposalTitle: 'PROPOSAL FOR 500 KW ROOFTOP SOLAR PV SYSTEM',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    referenceNumber: 'REF/SOL/2026/042',
    issuingCompanyId: 'comp-1',
    issuingCompanyDetails: {
      name: 'Solarithm Energy Private Limited',
      address: 'Plot 42, Tech Corridor, Whitefield, Bengaluru, Karnataka - 560066',
      email: 'sales@solarithm.com',
      phone: '+91 80 4123 4567',
      gstin: '29ABCDE1234F1Z5',
      pan: 'ABCDE1234F',
      website: 'www.solarithm.com',
      bankDetails: {
        bankName: 'HDFC Bank Ltd',
        accountNo: '50200012345678',
        ifscCode: 'HDFC0001234',
        branch: 'Whitefield Branch, Bengaluru',
        upiId: 'solarithm@hdfcbank',
      },
      authorizedSignatory: {
        name: 'Arjun K. Rao',
        designation: 'Director - Commercials',
      },
    },
    clientId: 'lead-2',
    clientDetails: {
      id: 'lead-2',
      companyName: 'Tata Power Renewable Energy Ltd',
      contactPerson: 'Pooja Verma',
      address: {
        line1: 'Cyber Towers, Hitech City',
        city: 'Hyderabad',
        state: 'Telangana',
        pinCode: '500081',
      },
      gstin: '36AAACT5678B1Z2',
      phone: '+91 99490 67890',
      email: 'pooja.verma@tatapower.com',
      category: 'T2',
    },
    projectDetails: {
      projectName: 'Tata Hyderabad Tech Hub Solar Plant',
      capacity: 500,
      unit: 'KW',
      location: 'Hyderabad, Telangana',
      executiveName: 'Siddharth Patel',
      executiveMobile: '+91 98765 43210',
    },
    lineItems: [
      {
        id: 'li-1',
        srNo: 1,
        description: 'Complete Detailed Engineering, Site Survey, Layout Optimization & Structural Assessment for 500 KWp Grid-tied Solar PV System',
        capacity: 500,
        unit: 'KW',
        rate: 120,
        value: 60000,
      },
      {
        id: 'li-2',
        srNo: 2,
        description: 'Electrical SLD, Cable Sizing, Protection Coordination & CEIG Statutory Approval Documentation',
        capacity: 500,
        unit: 'KW',
        rate: 80,
        value: 40000,
      },
    ],
    detailedDeliverables: [
      {
        srNo: 1,
        category: 'A. Site Surveys & Civil Design',
        itemDescription: 'Detailed Drone Topographical Survey, 3D Shadow Analysis & Module Mounting Structure (MMS) Purlin Design',
        deliveryTimeline: '10 business days',
      },
      {
        srNo: 2,
        category: 'B. Electrical Engineering',
        itemDescription: 'DC String Layout, Inverter Station Sizing, AC DB Design, Earth Pit Calculations & Lightning Protection System',
        deliveryTimeline: '14 business days',
      },
      {
        srNo: 3,
        category: 'C. Statutory Submittals',
        itemDescription: 'CEIG Drawings, DISCOM Net-Metering Filing dossier & SCADA / Remote Monitoring specification',
        deliveryTimeline: '21 business days',
      },
    ],
    subtotal: 100000,
    gstType: 'CGST_SGST',
    gstRate: 18,
    taxAmount: 18000,
    grandTotal: 118000,
    advancePayment: {
      enabled: true,
      percentage: 25,
      amount: 29500,
    },
    paymentTerms: [
      '25% Advance payment along with Purchase Order / Work Order confirmation',
      '50% On submission and approval of detailed structural & electrical layouts',
      '25% Upon final statutory submittal and handover of complete engineering dossiers',
    ],
    customPaymentTerms: '',
    termsAndConditions: '1. Prices quoted are strictly valid for 30 days from the date of quotation issuance.\n2. Taxes: GST @ 18% is applicable as per statutory Indian tax regulations.\n3. Turnaround: All engineering deliverables shall commence upon receipt of advance commercial mobilization.\n4. Client Scope: Provision of site access, civil architectural drawings, and utility sanctioned load particulars.',
    status: 'Draft',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Helper to notify other parts of the app when storage changes
function notify(eventName: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(eventName));
  }
}

// ----------------------------------------------------
// LEADS (Pre-sales prospects stored in isolated key)
// ----------------------------------------------------

export function getStoredLeads(): Client[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADS);
    if (raw === null) {
      // Initialize with default leads if key does not exist yet
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(DEFAULT_INITIAL_LEADS));
      return DEFAULT_INITIAL_LEADS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading from isolated leads storage:', err);
    return [];
  }
}

export function saveLead(leadData: Omit<Client, 'id' | 'createdAt'> & { id?: string }): Client {
  const currentLeads = getStoredLeads();
  const id = leadData.id || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const existingIndex = currentLeads.findIndex(l => l.id === id);
  let updatedLead: Client;

  if (existingIndex >= 0) {
    updatedLead = {
      ...currentLeads[existingIndex],
      ...leadData,
      id,
    };
    currentLeads[existingIndex] = updatedLead;
  } else {
    updatedLead = {
      ...leadData,
      id,
      status: leadData.status || 'Lead',
      category: leadData.category || (leadData as any).pricingCategory || 'T1',
      createdAt: now,
    };
    currentLeads.unshift(updatedLead);
  }

  try {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(currentLeads));
    notify(STORAGE_EVENTS.LEADS_UPDATED);
  } catch (err) {
    console.error('Error saving to isolated leads storage:', err);
  }

  return updatedLead;
}

export function deleteLead(id: string): void {
  const currentLeads = getStoredLeads();
  const filtered = currentLeads.filter(l => l.id !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(filtered));
    notify(STORAGE_EVENTS.LEADS_UPDATED);
  } catch (err) {
    console.error('Error deleting from isolated leads storage:', err);
  }
}

// ----------------------------------------------------
// DRAFT QUOTES (Quotations stored in isolated key)
// ----------------------------------------------------

export function getStoredDraftQuotes(): Quotation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRAFT_QUOTES);
    if (raw === null) {
      // Initialize with default draft quote if key does not exist yet
      localStorage.setItem(STORAGE_KEYS.DRAFT_QUOTES, JSON.stringify(DEFAULT_INITIAL_QUOTES));
      return DEFAULT_INITIAL_QUOTES;
    }
    const parsed = JSON.parse(raw);
    const quotes: Quotation[] = Array.isArray(parsed)
      ? parsed.map(q => ({
          ...q,
          id: q.id || q.quotationNumber || `quote_${Date.now()}`,
        }))
      : [];
    // Sort descending by creation/update timestamp
    return quotes.sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt || a.date || 0).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt || b.date || 0).getTime();
      return timeB - timeA;
    });
  } catch (err) {
    console.error('Error reading from isolated draft quotes storage:', err);
    return [];
  }
}

export function getDraftQuoteById(id: string): Quotation | null {
  const quotes = getStoredDraftQuotes();
  return quotes.find(q => q.id === id || q.quotationNumber === id) || null;
}

export function saveDraftQuote(quoteData: Partial<Quotation> & { id?: string }): Quotation {
  const currentQuotes = getStoredDraftQuotes();
  const id = quoteData.id || quoteData.quotationNumber || `quote_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const existingIndex = currentQuotes.findIndex(q => q.id === id || q.quotationNumber === id);
  let savedQuote: Quotation;

  if (existingIndex >= 0) {
    savedQuote = {
      ...currentQuotes[existingIndex],
      ...quoteData,
      id,
      updatedAt: now,
    } as Quotation;
    currentQuotes[existingIndex] = savedQuote;
  } else {
    savedQuote = {
      ...quoteData,
      id,
      createdAt: now,
      updatedAt: now,
      status: quoteData.status || 'Draft',
    } as Quotation;
    currentQuotes.unshift(savedQuote);
  }

  try {
    localStorage.setItem(STORAGE_KEYS.DRAFT_QUOTES, JSON.stringify(currentQuotes));
    notify(STORAGE_EVENTS.QUOTES_UPDATED);
  } catch (err) {
    console.error('Error saving to isolated draft quotes storage:', err);
  }

  return savedQuote;
}

export async function deleteDraftQuote(idOrNumber: string): Promise<void> {
  if (!idOrNumber) return;
  const currentQuotes = getStoredDraftQuotes();
  const filtered = currentQuotes.filter(
    q => q.id !== idOrNumber && q.quotationNumber !== idOrNumber
  );

  try {
    localStorage.setItem(STORAGE_KEYS.DRAFT_QUOTES, JSON.stringify(filtered));
    notify(STORAGE_EVENTS.QUOTES_UPDATED);
  } catch (err) {
    console.error('Error deleting from isolated draft quotes storage:', err);
  }

  // Also clean up from Firestore if mirrored there
  try {
    if (typeof window !== 'undefined') {
      const { db } = await import('./firebase');
      const { doc, deleteDoc } = await import('firebase/firestore');
      if (db) {
        await Promise.allSettled([
          deleteDoc(doc(db, 'proposals', idOrNumber)),
          deleteDoc(doc(db, 'quotations', idOrNumber)),
        ]);
      }
    }
  } catch {
    // Non-blocking background Firestore cleanup
  }
}

export function getNextSequentialQuotationNo(year: number = new Date().getFullYear()): string {
  const quotes = getStoredDraftQuotes();
  const prefix = `QT-${year}-`;
  let maxSeq = 0;

  quotes.forEach(q => {
    const qNum = q.quotationNumber || '';
    if (qNum.startsWith(prefix)) {
      const numPart = parseInt(qNum.replace(prefix, ''), 10);
      if (!isNaN(numPart) && numPart > maxSeq) {
        maxSeq = numPart;
      }
    } else {
      const match = qNum.match(new RegExp(`^QT-${year}-(\\d+)`));
      if (match && match[1]) {
        const numPart = parseInt(match[1], 10);
        if (!isNaN(numPart) && numPart > maxSeq) {
          maxSeq = numPart;
        }
      }
    }
  });

  const nextSeq = maxSeq + 1;
  return `${prefix}${String(nextSeq).padStart(3, '0')}`;
}
