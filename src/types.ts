export interface Company {
  id: string;
  name: string;
  address: string;
  gstin: string;
  pan: string;
  phone: string;
  email: string;
  website?: string;
  logoUrl?: string;
  assignedTools?: {
    quotationMaker?: boolean;
    [key: string]: any;
  };
  bankDetails: {
    bankName: string;
    accountNo: string;
    ifscCode: string;
    branch: string;
    upiId?: string;
  };
  bankAccounts?: {
    bankName: string;
    accountNo: string;
    ifscCode: string;
    branch: string;
    upiId?: string;
  }[];
  authorizedSignatory: {
    name: string;
    designation: string;
    signatureUrl?: string;
  };
}

export interface Scope {
  id: string;
  name: string;
  subServices: string[];
}

export interface Client {
  id: string;
  companyName: string;
  contactPerson: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pinCode: string;
  };
  gstin?: string;
  pan?: string;
  phone: string;
  email: string;
  website?: string;
  category: string;
  pricingCategory?: string;
  status?: string;
  salesPersonEmail?: string;
  createdAt?: any;
}

export interface PricingRule {
  id: string;
  category: string;
  scope: string;
  subService: string | null;
  capacityRows: {
    minCapacity: number;
    maxCapacity: number | null;
    priceType: 'Fixed' | 'Per KW';
    priceAmount: number;
  }[];
  isActive: boolean;
  effectiveFrom?: any;
}

export interface LineItem {
  id: string;
  srNo: number;
  description: string;
  serviceName?: string;
  subService?: string;
  capacity: number;
  unit: 'KW' | 'MW';
  rate: number;
  value: number;
  notes?: string;
}

export interface DeliverableItem {
  srNo: number;
  category: string;
  itemDescription: string;
  deliveryTimeline?: string;
}

export interface Quotation {
  id?: string;
  quotationNumber: string;
  proposalTitle: string;
  date: string; // ISO date
  validUntil: string; // ISO date
  referenceNumber?: string;
  
  issuingCompanyId: string;
  issuingCompanyDetails: {
    name: string;
    address: string;
    email: string;
    phone: string;
    gstin?: string;
    pan?: string;
    website?: string;
    logoUrl?: string;
    bankDetails?: {
      bankName: string;
      accountNo: string;
      ifscCode: string;
      branch: string;
      upiId?: string;
    };
    bankAccounts?: {
      bankName: string;
      accountNo: string;
      ifscCode: string;
      branch: string;
      upiId?: string;
    }[];
    authorizedSignatory?: {
      name: string;
      designation: string;
      signatureUrl?: string;
    };
    [key: string]: any;
  };

  clientId: string;
  clientDetails: any; // snapshot of client

  projectDetails: {
    projectName: string;
    capacity: number;
    unit: 'KW' | 'MW';
    location: string;
    executiveName: string;
    executiveMobile: string;
  };

  lineItems: LineItem[];
  detailedDeliverables?: DeliverableItem[];
  
  subtotal: number;
  gstType: 'CGST_SGST' | 'IGST' | 'NONE';
  gstRate: number;
  taxAmount: number;
  grandTotal: number;

  advancePayment?: {
    enabled: boolean;
    percentage: number;
    amount: number;
  };

  paymentTerms: string[];
  customPaymentTerms: string;
  termsAndConditions: string;

  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';
  createdByEmail?: string;
  salesPersonEmail?: string;
  createdAt: any;
  updatedAt: any;
}
