import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuotationData } from '../hooks/useQuotationData';
import { LineItem, Quotation, DeliverableItem } from '../types';
import toast from 'react-hot-toast';
import { 
  getStoredDraftQuotes, 
  getDraftQuoteById, 
  saveDraftQuote, 
  getNextSequentialQuotationNo 
} from '../lib/isolatedStorage';
import { 
  Plus, 
  Trash2, 
  Save, 
  Building, 
  Download, 
  Upload, 
  X, 
  Landmark, 
  PenTool, 
  Image as ImageIcon,
  ListChecks
} from 'lucide-react';
import { NewClientModal } from '../components/NewClientModal';
import { PDFDownloadButton } from '../components/PDFDownloadButton';
import { useProfileStore } from '../store';

const DEFAULT_PROPOSAL_TITLE = "SOLAR POWER PLANT PROPOSAL: ROOF TOP / CAPTIVE / GRID CONNECTED";

const DEFAULT_TERMS = `1. All GST, Duties, Levies, Cess etc. Extra if Any
2. Transport charges, insurance charges: N.A.
3. Supply, Erection & Commissioning Period: 6 Months
4. Validity period for this quote: 15 Days
5. All extra and additional material/work: As Per Actual
6. Subject to Surat Jurisdiction`;

const DEFAULT_PAYMENT_TERMS = [
  "25% Advance against PO",
  "25% after CEIG Drawing Approval",
  "25% After Charging Approval",
  "25% After Wheeling Agreement"
];

const INITIAL_DELIVERABLES: DeliverableItem[] = [
  { 
    srNo: 1, 
    category: 'Engineering & Design', 
    itemDescription: 'Detailed Solar Plant Layout, Single Line Diagram (SLD), String Design & Shadow Analysis Report', 
    deliveryTimeline: 'Within 7 Days of PO' 
  },
  { 
    srNo: 2, 
    category: 'Statutory & CEIG', 
    itemDescription: 'Preparation & Submission of CEIG Drawing Dossier, Liaison with DISCOM / GETCO / CEIG Authorities', 
    deliveryTimeline: 'Within 15 Days' 
  },
  { 
    srNo: 3, 
    category: 'Civil & Structure', 
    itemDescription: 'MMS Structural Design, Array Foundation Details & STAAD Pro Wind Load Analysis Report', 
    deliveryTimeline: 'Within 10 Days' 
  },
  { 
    srNo: 4, 
    category: 'Testing & Commissioning', 
    itemDescription: 'Pre-Commissioning Checklist, CT-PT & ABT Meter Testing Dossier, Synchronization & Wheeling Support', 
    deliveryTimeline: 'At Commissioning Stage' 
  }
];

export function QuotationEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { clients, loading, refetch } = useQuotationData();
  const { lockedEmail } = useProfileStore();
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  
  const [saving, setSaving] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);

  // Proposal Title
  const [proposalTitle, setProposalTitle] = useState(() => {
    const saved = localStorage.getItem('proposalTitle');
    return saved || DEFAULT_PROPOSAL_TITLE;
  });

  useEffect(() => {
    if (!id) {
      localStorage.setItem('proposalTitle', proposalTitle);
    }
  }, [proposalTitle, id]);
  
  // Issuing Company Details with Logo, Website, Bank & Signatory
  const [myCompany, setMyCompany] = useState(() => {
    const saved = localStorage.getItem('myCompany');
    const parsed = saved ? JSON.parse(saved) : null;
    return {
      name: parsed?.name || '',
      address: parsed?.address || '',
      email: parsed?.email || '',
      phone: parsed?.phone || '',
      gstin: parsed?.gstin || '',
      pan: parsed?.pan || '',
      website: parsed?.website || '',
      logoUrl: parsed?.logoUrl || '',
      bankDetails: {
        bankName: parsed?.bankDetails?.bankName || parsed?.bankAccounts?.[0]?.bankName || '',
        accountNo: parsed?.bankDetails?.accountNo || parsed?.bankAccounts?.[0]?.accountNo || '',
        ifscCode: parsed?.bankDetails?.ifscCode || parsed?.bankAccounts?.[0]?.ifscCode || '',
        branch: parsed?.bankDetails?.branch || parsed?.bankAccounts?.[0]?.branch || '',
        upiId: parsed?.bankDetails?.upiId || ''
      },
      authorizedSignatory: {
        name: parsed?.authorizedSignatory?.name || '',
        designation: parsed?.authorizedSignatory?.designation || 'Project Director / Partner',
        signatureUrl: parsed?.authorizedSignatory?.signatureUrl || ''
      }
    };
  });

  useEffect(() => {
    if (!id) {
      localStorage.setItem('myCompany', JSON.stringify(myCompany));
    }
  }, [myCompany, id]);

  const [selectedClientId, setSelectedClientId] = useState('');
  
  // Date calculation helper
  const calculateValidUntil = (baseDateStr: string, days: number): string => {
    if (!baseDateStr) return '';
    const parts = baseDateStr.split('-');
    if (parts.length !== 3) return '';
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const [quotationNo, setQuotationNo] = useState(`QT-${new Date().getFullYear()}-001`);
  const [date, setDate] = useState(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });
  
  const [validityPreset, setValidityPreset] = useState<string>('15');
  const [validUntil, setValidUntil] = useState(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return calculateValidUntil(`${y}-${m}-${d}`, 15);
  });

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    if (validityPreset !== 'custom') {
      const days = parseInt(validityPreset, 10);
      if (!isNaN(days)) {
        setValidUntil(calculateValidUntil(newDate, days));
      }
    }
  };

  const handlePresetChange = (preset: string) => {
    setValidityPreset(preset);
    if (preset !== 'custom') {
      const days = parseInt(preset, 10);
      if (!isNaN(days)) {
        setValidUntil(calculateValidUntil(date, days));
      }
    }
  };

  const handleValidUntilChange = (newValidUntil: string) => {
    setValidUntil(newValidUntil);
    if (date && newValidUntil) {
      const p1 = date.split('-').map(Number);
      const p2 = newValidUntil.split('-').map(Number);
      const d1 = new Date(p1[0], p1[1] - 1, p1[2]).getTime();
      const d2 = new Date(p2[0], p2[1] - 1, p2[2]).getTime();
      const diffDays = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
      if ([15, 30, 45, 60].includes(diffDays)) {
        setValidityPreset(String(diffDays));
      } else {
        setValidityPreset('custom');
      }
    } else {
      setValidityPreset('custom');
    }
  };

  const [refNo, setRefNo] = useState('');

  const [projectDetails, setProjectDetails] = useState({
    projectName: '',
    scope: '',
    subService: '',
    capacity: 0,
    unit: 'KW' as 'KW' | 'MW',
    location: '',
    executiveName: '',
    executiveMobile: ''
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', srNo: 1, description: '', serviceName: '', subService: '', capacity: 0, unit: 'KW', rate: 0, value: 0 }
  ]);

  // Tax & GST Selector state
  const [gstType, setGstType] = useState<'CGST_SGST' | 'IGST' | 'NONE'>('CGST_SGST');

  // Advance Payment state
  const [advanceEnabled, setAdvanceEnabled] = useState(true);
  const [advancePercentage, setAdvancePercentage] = useState(25);

  // Detailed Scope Deliverables table
  const [detailedDeliverables, setDetailedDeliverables] = useState<DeliverableItem[]>(INITIAL_DELIVERABLES);

  const [paymentTerms, setPaymentTerms] = useState<string[]>(DEFAULT_PAYMENT_TERMS);
  const [customPaymentTerms, setCustomPaymentTerms] = useState('');
  const [termsAndConditions, setTermsAndConditions] = useState(DEFAULT_TERMS);

  // Generate dynamic sequential quotation number when creating a new quotation
  useEffect(() => {
    if (id) return; // In edit mode, preserve existing quotation number
    const nextSeq = getNextSequentialQuotationNo();
    setQuotationNo(nextSeq);
  }, [id]);

  // Load existing quotation data when in edit mode (:id)
  useEffect(() => {
    if (!id) return;
    setLoadingDoc(true);
    try {
      const qData = getDraftQuoteById(id);
      if (qData) {
        if (qData.proposalTitle) setProposalTitle(qData.proposalTitle);
        if (qData.issuingCompanyDetails) setMyCompany((prev: any) => ({ ...prev, ...qData.issuingCompanyDetails }));
        if (qData.clientId) setSelectedClientId(qData.clientId);
        if (qData.quotationNumber) setQuotationNo(qData.quotationNumber);
        if (qData.date) setDate(qData.date);
        if (qData.validUntil) {
          setValidUntil(qData.validUntil);
          if (qData.date) {
            const p1 = qData.date.split('-').map(Number);
            const p2 = qData.validUntil.split('-').map(Number);
            const d1 = new Date(p1[0], p1[1] - 1, p1[2]).getTime();
            const d2 = new Date(p2[0], p2[1] - 1, p2[2]).getTime();
            const diffDays = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
            if ([15, 30, 45, 60].includes(diffDays)) {
              setValidityPreset(String(diffDays));
            } else {
              setValidityPreset('custom');
            }
          } else {
            setValidityPreset('custom');
          }
        }
        if (qData.referenceNumber) setRefNo(qData.referenceNumber);
        if (qData.projectDetails) setProjectDetails((prev: any) => ({ ...prev, ...qData.projectDetails }));
        if (qData.lineItems && qData.lineItems.length > 0) setLineItems(qData.lineItems);
        if (qData.gstType) setGstType(qData.gstType);
        if (qData.advancePayment) {
          setAdvanceEnabled(qData.advancePayment.enabled ?? true);
          setAdvancePercentage(qData.advancePayment.percentage ?? 25);
        }
        if (qData.detailedDeliverables && qData.detailedDeliverables.length > 0) {
          setDetailedDeliverables(qData.detailedDeliverables);
        }
        if (qData.paymentTerms) setPaymentTerms(qData.paymentTerms);
        if (qData.customPaymentTerms) setCustomPaymentTerms(qData.customPaymentTerms);
        if (qData.termsAndConditions) setTermsAndConditions(qData.termsAndConditions);
      } else {
        toast.error('Quotation draft not found.');
        navigate('/quotations');
      }
    } catch (error) {
      console.error('Error fetching quotation from isolated storage:', error);
      toast.error('Failed to load quotation for editing.');
    } finally {
      setLoadingDoc(false);
    }
  }, [id, navigate]);

  const selectedClient = clients.find(c => c.id === selectedClientId);

  // Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (PNG, JPG, WebP, SVG).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo file size must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setMyCompany(prev => ({
        ...prev,
        logoUrl: base64
      }));
      toast.success('Company Logo uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setMyCompany(prev => ({
      ...prev,
      logoUrl: ''
    }));
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  // Signature Upload
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Signature image size must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setMyCompany(prev => ({
        ...prev,
        authorizedSignatory: {
          ...prev.authorizedSignatory,
          signatureUrl: base64
        }
      }));
      toast.success('Digital signature uploaded!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSignature = () => {
    setMyCompany(prev => ({
      ...prev,
      authorizedSignatory: {
        ...prev.authorizedSignatory,
        signatureUrl: ''
      }
    }));
    if (signatureInputRef.current) {
      signatureInputRef.current.value = '';
    }
  };

  const handleLineItemChange = (index: number, field: keyof LineItem, val: any) => {
    const newItems = [...lineItems];
    const current = { ...newItems[index], [field]: val };
    
    if (field === 'capacity' || field === 'rate') {
      const cap = field === 'capacity' ? Number(val) || 0 : current.capacity || 0;
      const rt = field === 'rate' ? Number(val) || 0 : current.rate || 0;
      current.value = cap * rt;
    }
    
    newItems[index] = current;
    setLineItems(newItems);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { 
      id: Math.random().toString(36).substr(2, 9), 
      srNo: lineItems.length + 1, 
      description: '', 
      serviceName: '', 
      subService: '', 
      capacity: 0, 
      unit: projectDetails.unit || 'KW', 
      rate: 0, 
      value: 0 
    }]);
  };

  const removeLineItem = (index: number) => {
    const newItems = lineItems.filter((_, i) => i !== index);
    newItems.forEach((item, i) => item.srNo = i + 1);
    setLineItems(newItems);
  };

  // Detailed Deliverables Handlers
  const addDeliverable = () => {
    setDetailedDeliverables([
      ...detailedDeliverables,
      {
        srNo: detailedDeliverables.length + 1,
        category: 'Engineering & Design',
        itemDescription: '',
        deliveryTimeline: 'Within 7-10 Days'
      }
    ]);
  };

  const removeDeliverable = (index: number) => {
    const updated = detailedDeliverables.filter((_, i) => i !== index);
    updated.forEach((d, i) => d.srNo = i + 1);
    setDetailedDeliverables(updated);
  };

  const handleDeliverableChange = (index: number, field: keyof DeliverableItem, value: any) => {
    const updated = [...detailedDeliverables];
    updated[index] = { ...updated[index], [field]: value };
    setDetailedDeliverables(updated);
  };

  // Financial Calculations
  const subtotal = lineItems.reduce((acc, item) => acc + (item.value || 0), 0);
  const gstRate = gstType === 'NONE' ? 0 : 18;
  const taxAmount = (subtotal * gstRate) / 100;
  const grandTotal = subtotal + taxAmount;
  
  const advanceAmount = advanceEnabled 
    ? Math.round((grandTotal * (Number(advancePercentage) || 0)) / 100) 
    : 0;

  const currentQuotation: Quotation = {
    quotationNumber: quotationNo,
    proposalTitle,
    date,
    validUntil,
    referenceNumber: refNo,
    issuingCompanyId: 'manual_entry',
    issuingCompanyDetails: myCompany,
    clientId: selectedClient?.id || '',
    clientDetails: selectedClient,
    projectDetails,
    lineItems,
    detailedDeliverables,
    subtotal,
    gstType,
    gstRate,
    taxAmount,
    grandTotal,
    advancePayment: {
      enabled: advanceEnabled,
      percentage: Number(advancePercentage) || 0,
      amount: advanceAmount
    },
    paymentTerms,
    customPaymentTerms,
    termsAndConditions,
    status: 'Draft',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const handleSaveOrUpdate = async () => {
    if (!myCompany.name || !myCompany.email) {
      toast.error('Please enter your company name and email.');
      return;
    }
    if (!selectedClient) {
      toast.error('Please select a client.');
      return;
    }

    setSaving(true);
    try {
      let finalQuotationNo = quotationNo.trim() || `QT-${new Date().getFullYear()}-001`;

      // Check for duplicate quotation number in isolated draft quotes storage
      const existingQuotes = getStoredDraftQuotes();
      const hasDuplicate = existingQuotes.some(docSnap => docSnap.quotationNumber === finalQuotationNo && docSnap.id !== id);

      if (hasDuplicate) {
        // Automatically find next sequence
        const autoAssignedNo = getNextSequentialQuotationNo();
        toast((t) => (
          <span>
            Quotation <b>{finalQuotationNo}</b> already exists. Reassigned to <b>{autoAssignedNo}</b>.
          </span>
        ), { icon: '⚠️', duration: 4000 });

        finalQuotationNo = autoAssignedNo;
        setQuotationNo(autoAssignedNo);
      }

      const quotationToSave: Partial<Quotation> = {
        ...currentQuotation,
        quotationNumber: finalQuotationNo,
        createdByEmail: lockedEmail || 'sales@solarithm.com',
        salesPersonEmail: lockedEmail || 'sales@solarithm.com',
        status: currentQuotation.status || 'Draft',
        ...(id ? { id } : {})
      };

      saveDraftQuote(quotationToSave);
      toast.success(id ? 'Quotation draft updated successfully!' : 'Quotation draft saved successfully!');
      navigate('/quotations');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to save quotation.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingDoc) return <div className="p-8 text-center text-gray-400">Loading quotation workspace...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif">
            {id ? 'Edit Quotation' : 'Create Quotation'}
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
            {id ? 'Update quotation draft and modify scope or commercial details' : 'Generate an executive solar proposal with comprehensive scope and commercial terms'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          {myCompany.name && selectedClient ? (
            <PDFDownloadButton 
              data={currentQuotation} 
              fileName={`${quotationNo}.pdf`}
              className="flex items-center justify-center gap-2 bg-[#2A2A2A] hover:bg-[#333333] text-[#D4AF37] border border-[#333333] px-4 py-2 rounded-lg font-bold transition-colors shadow-sm text-sm"
            >
              <Download className="w-4 h-4 text-[#D4AF37]" />
              <span>Download PDF</span>
            </PDFDownloadButton>
          ) : (
            <button 
              onClick={() => toast.error('Please enter Company Name and select a Client to generate PDF.')}
              className="flex items-center justify-center gap-2 bg-[#2A2A2A]/50 text-gray-500 border border-[#333333] px-4 py-2 rounded-lg font-bold cursor-not-allowed text-sm"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          )}
          <button 
            onClick={handleSaveOrUpdate}
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B5952F] text-[#121212] font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm shadow-md shadow-[#D4AF37]/20"
          >
            <Save className="w-4 h-4 text-[#121212]" />
            {saving ? 'Saving...' : id ? 'Update Quotation' : 'Save Draft'}
          </button>
        </div>
      </div>

      {/* Issuing Company Details Section with Logo & Signature */}
      <div className="bg-[#1E1E1E] border border-[#333333] rounded-xl p-4 sm:p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#2A2A2A] pb-2">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-base font-bold text-[#D4AF37]">Issuing Company Details & Branding</h3>
          </div>
          <span className="text-xs text-gray-400">Persists locally across all quotations</span>
        </div>

        {/* Company Logo & General Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Logo Upload Box */}
          <div className="md:col-span-1">
            <label className="block text-xs font-semibold mb-2 text-gray-400 uppercase tracking-wider">Company Brand Logo</label>
            <input 
              ref={logoInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleLogoUpload} 
              className="hidden" 
            />
            {myCompany.logoUrl ? (
              <div className="p-3 bg-[#2A2A2A] border border-[#333333] rounded-lg flex flex-col items-center gap-3">
                <div className="h-20 w-full bg-white rounded border border-[#333333] flex items-center justify-center p-2 overflow-hidden shadow-inner">
                  <img 
                    src={myCompany.logoUrl} 
                    alt="Company Logo" 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex gap-3 w-full justify-center">
                  <button 
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="text-xs font-medium text-[#D4AF37] hover:underline flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" /> Change
                  </button>
                  <button 
                    type="button"
                    onClick={handleRemoveLogo}
                    className="text-xs font-medium text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="w-full h-28 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#333333] bg-[#2A2A2A] hover:bg-[#333333]/50 rounded-lg text-xs text-gray-400 hover:text-white transition-all"
              >
                <ImageIcon className="w-6 h-6 text-[#D4AF37]" />
                <span className="font-medium">Upload Company Logo</span>
                <span className="text-[10px] text-gray-500">PNG, JPG, SVG up to 2MB</span>
              </button>
            )}
          </div>

          {/* Company Fields */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-400">Company Name *</label>
              <input
                type="text"
                value={myCompany.name}
                onChange={e => setMyCompany({ ...myCompany, name: e.target.value })}
                className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                placeholder="e.g. Solarithm Solutions LLP"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-400">Email *</label>
              <input
                type="email"
                value={myCompany.email}
                onChange={e => setMyCompany({ ...myCompany, email: e.target.value })}
                className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                placeholder="e.g. info@solarithm.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-400">Phone / Mobile</label>
              <input
                type="text"
                value={myCompany.phone}
                onChange={e => setMyCompany({ ...myCompany, phone: e.target.value })}
                className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                placeholder="e.g. +91 9876543210"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-400">Website</label>
              <input
                type="text"
                value={myCompany.website}
                onChange={e => setMyCompany({ ...myCompany, website: e.target.value })}
                className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                placeholder="e.g. www.solarithm.com"
              />
            </div>
          </div>

          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium mb-1.5 text-gray-400">GSTIN</label>
              <input
                type="text"
                value={myCompany.gstin}
                onChange={e => setMyCompany({ ...myCompany, gstin: e.target.value })}
                className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                placeholder="e.g. 24AAAAA0000A1Z5"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium mb-1.5 text-gray-400">PAN</label>
              <input
                type="text"
                value={myCompany.pan}
                onChange={e => setMyCompany({ ...myCompany, pan: e.target.value })}
                className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                placeholder="e.g. ABCDE1234F"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium mb-1.5 text-gray-400">Registered Address</label>
              <input
                type="text"
                value={myCompany.address}
                onChange={e => setMyCompany({ ...myCompany, address: e.target.value })}
                className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                placeholder="e.g. 101 Corporate Arena, Ring Road, Surat, Gujarat - 395007"
              />
            </div>
          </div>
        </div>

        {/* Bank & Settlement Details */}
        <div className="border-t border-[#2A2A2A] pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Landmark className="w-4 h-4 text-[#D4AF37]" />
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Company Bank Details</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-400">Bank Name</label>
              <input
                type="text"
                value={myCompany.bankDetails?.bankName || ''}
                onChange={e => setMyCompany({
                  ...myCompany,
                  bankDetails: { ...myCompany.bankDetails, bankName: e.target.value }
                })}
                className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                placeholder="e.g. HDFC Bank"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-400">Account Number</label>
              <input
                type="text"
                value={myCompany.bankDetails?.accountNo || ''}
                onChange={e => setMyCompany({
                  ...myCompany,
                  bankDetails: { ...myCompany.bankDetails, accountNo: e.target.value }
                })}
                className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                placeholder="e.g. 50200012345678"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-400">IFSC Code</label>
              <input
                type="text"
                value={myCompany.bankDetails?.ifscCode || ''}
                onChange={e => setMyCompany({
                  ...myCompany,
                  bankDetails: { ...myCompany.bankDetails, ifscCode: e.target.value.toUpperCase() }
                })}
                className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                placeholder="e.g. HDFC0001234"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-400">Branch Name</label>
              <input
                type="text"
                value={myCompany.bankDetails?.branch || ''}
                onChange={e => setMyCompany({
                  ...myCompany,
                  bankDetails: { ...myCompany.bankDetails, branch: e.target.value }
                })}
                className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                placeholder="e.g. Ring Road Branch"
              />
            </div>
          </div>
        </div>

        {/* Authorized Signatory & Digital Signature */}
        <div className="border-t border-[#2A2A2A] pt-4">
          <div className="flex items-center gap-2 mb-3">
            <PenTool className="w-4 h-4 text-[#D4AF37]" />
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Authorized Signatory & Digital Signature</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-400">Signatory Person Name</label>
              <input
                type="text"
                value={myCompany.authorizedSignatory?.name || ''}
                onChange={e => setMyCompany({
                  ...myCompany,
                  authorizedSignatory: { ...myCompany.authorizedSignatory, name: e.target.value }
                })}
                className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                placeholder="e.g. Rajesh Patel"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-400">Designation</label>
              <input
                type="text"
                value={myCompany.authorizedSignatory?.designation || ''}
                onChange={e => setMyCompany({
                  ...myCompany,
                  authorizedSignatory: { ...myCompany.authorizedSignatory, designation: e.target.value }
                })}
                className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                placeholder="e.g. Project Director / Partner"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-400">Digital Signature Image</label>
              <input 
                ref={signatureInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleSignatureUpload} 
                className="hidden" 
              />
              
              {myCompany.authorizedSignatory?.signatureUrl ? (
                <div className="flex items-center gap-3 p-2 bg-[#2A2A2A] border border-[#333333] rounded-lg">
                  <div className="h-12 w-24 bg-white rounded border border-[#333333] flex items-center justify-center p-1 overflow-hidden shadow-inner">
                    <img 
                      src={myCompany.authorizedSignatory.signatureUrl} 
                      alt="Signature Preview" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-xs text-gray-400 font-medium">Signature uploaded</span>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => signatureInputRef.current?.click()}
                        className="text-xs text-[#D4AF37] hover:underline font-medium"
                      >
                        Change
                      </button>
                      <button 
                        type="button"
                        onClick={handleRemoveSignature}
                        className="text-xs text-rose-400 hover:underline font-medium flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => signatureInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 border border-dashed border-[#333333] bg-[#2A2A2A] hover:bg-[#333333]/50 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white transition-colors h-[42px]"
                >
                  <Upload className="w-4 h-4 text-[#D4AF37]" />
                  <span>Upload Signature (PNG / JPG)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Client & Project Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Details */}
        <div className="bg-[#1E1E1E] border border-[#333333] rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2 mb-4">
            <h3 className="text-base font-bold text-[#D4AF37]">Bill To (Client)</h3>
            <button onClick={() => setShowNewClientModal(true)} className="text-xs font-semibold text-[#D4AF37] hover:underline">
              + New Client
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-400">Select Client</label>
              <select 
                value={selectedClientId} 
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40"
              >
                <option value="" className="bg-[#1E1E1E] text-white py-1">-- Select Client --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id} className="bg-[#1E1E1E] text-white py-1">
                    {c.companyName}
                  </option>
                ))}
              </select>
            </div>

            {selectedClient && (
              <div className="p-4 bg-[#2A2A2A] border border-[#333333] rounded-lg text-sm space-y-1">
                <p className="font-bold text-white">{selectedClient.companyName}</p>
                <p className="text-gray-300">{selectedClient.address?.line1}</p>
                <p className="text-gray-400 text-xs">{selectedClient.address?.city}, {selectedClient.address?.state} - {selectedClient.address?.pinCode}</p>
                <div className="flex gap-4 text-xs text-gray-400 mt-2 pt-2 border-t border-[#333333]">
                  <span>Category: <span className="font-medium text-[#D4AF37]">{selectedClient.pricingCategory}</span></span>
                  {selectedClient.gstin && <span>GSTIN: {selectedClient.gstin}</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-[#1E1E1E] border border-[#333333] rounded-xl p-4 sm:p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#D4AF37] mb-4 border-b border-[#2A2A2A] pb-2">Project Details</h3>
          <div className="space-y-4">
            {/* Editable Proposal Title Banner */}
            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-400">Proposal Heading / Title Banner</label>
              <input 
                type="text" 
                value={proposalTitle}
                onChange={e => setProposalTitle(e.target.value)}
                className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                placeholder="e.g. SOLAR POWER PLANT PROPOSAL: ROOF TOP / CAPTIVE / GRID CONNECTED"
              />
            </div>

            {/* Quotation No & Date of Issue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-400">Quotation No. *</label>
                <input 
                  type="text" 
                  value={quotationNo}
                  onChange={e => setQuotationNo(e.target.value)}
                  className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm font-mono font-semibold focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                  placeholder="e.g. QT-2026-001"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-400">Date of Issue *</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={e => handleDateChange(e.target.value)}
                  className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40"
                />
              </div>
            </div>

            {/* Validity Date & Quick-Select Validity Duration Helper */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-gray-400">Validity Date</label>
                  <span className="text-[10px] text-[#D4AF37]">Expires On</span>
                </div>
                <input 
                  type="date" 
                  value={validUntil}
                  onChange={e => handleValidUntilChange(e.target.value)}
                  className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-400">Validity Preset Duration</label>
                <select
                  value={validityPreset}
                  onChange={e => handlePresetChange(e.target.value)}
                  className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                >
                  <option value="15" className="bg-[#1E1E1E] text-white py-1">15 Days (Standard)</option>
                  <option value="30" className="bg-[#1E1E1E] text-white py-1">30 Days (1 Month)</option>
                  <option value="45" className="bg-[#1E1E1E] text-white py-1">45 Days</option>
                  <option value="60" className="bg-[#1E1E1E] text-white py-1">60 Days (2 Months)</option>
                  <option value="custom" className="bg-[#1E1E1E] text-white py-1">Custom / Manual Date</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-400">Project Name</label>
                <input 
                  type="text" 
                  value={projectDetails.projectName}
                  onChange={e => setProjectDetails({...projectDetails, projectName: e.target.value})}
                  className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                  placeholder="e.g. 3.8 MW Solar"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-400">Location</label>
                <input 
                  type="text" 
                  value={projectDetails.location}
                  onChange={e => setProjectDetails({...projectDetails, location: e.target.value})}
                  className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                  placeholder="e.g. Kutch, Gujarat"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-400">Capacity & Unit</label>
                <div className="flex">
                  <input 
                    type="number" 
                    value={projectDetails.capacity || ''}
                    onChange={e => setProjectDetails({...projectDetails, capacity: Number(e.target.value)})}
                    className="w-full rounded-l-lg bg-[#2A2A2A] border border-[#333333] text-white px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                    placeholder="e.g. 3.8"
                  />
                  <select
                    value={projectDetails.unit}
                    onChange={e => {
                      const newUnit = e.target.value as 'KW' | 'MW';
                      setProjectDetails({...projectDetails, unit: newUnit});
                      setLineItems(lineItems.map(item => ({ ...item, unit: newUnit })));
                    }}
                    className="rounded-r-lg border border-l-0 border-[#333333] bg-[#2A2A2A] text-[#D4AF37] px-3 py-2 text-sm font-semibold focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="MW" className="bg-[#1E1E1E] text-white py-1">MW</option>
                    <option value="KW" className="bg-[#1E1E1E] text-white py-1">KW</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-400">Executive Name</label>
                <input 
                  type="text" 
                  value={projectDetails.executiveName}
                  onChange={e => setProjectDetails({...projectDetails, executiveName: e.target.value})}
                  className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                  placeholder="e.g. Anand Sharma"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-400">Executive Mobile</label>
                <input 
                  type="text" 
                  value={projectDetails.executiveMobile}
                  onChange={e => setProjectDetails({...projectDetails, executiveMobile: e.target.value})}
                  className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                  placeholder="e.g. +91 9988776655"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-400">Reference / Tender No.</label>
                <input 
                  type="text" 
                  value={refNo}
                  onChange={e => setRefNo(e.target.value)}
                  className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                  placeholder="e.g. REF/SOLAR/2026/04"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scope of Work & Pricing Table */}
      <div className="bg-[#1E1E1E] border border-[#333333] rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#2A2A2A] pb-2">
          <h3 className="text-base font-bold text-[#D4AF37]">Scope of Work & Commercial Pricing</h3>
          <span className="text-xs text-gray-400">Rates in INR per capacity unit</span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm text-left min-w-[720px]">
            <thead className="text-xs text-gray-400 uppercase font-semibold bg-[#2A2A2A] rounded-t-md">
              <tr>
                <th className="py-3 px-4 rounded-tl-md w-12 text-center">Sr.</th>
                <th className="py-3 px-4">Scope & Technical Deliverables</th>
                <th className="py-3 px-4 w-28 text-center">Capacity</th>
                <th className="py-3 px-4 w-24 text-center">Unit</th>
                <th className="py-3 px-4 w-40 text-right">Rate (INR / Unit)</th>
                <th className="py-3 px-4 w-40 text-right">Amount (INR)</th>
                <th className="py-3 px-4 rounded-tr-md w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333333]">
              {lineItems.map((item, index) => (
                <tr key={item.id} className="border-b border-[#333333] hover:bg-[#2A2A2A]/50 text-gray-200 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-400 text-center">{item.srNo}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-2">
                      <textarea 
                        value={item.description}
                        onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                        className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500 resize-y min-h-[42px]"
                        placeholder="Enter scope description and deliverables..."
                        rows={1}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <input 
                      type="number" 
                      value={item.capacity || ''}
                      onChange={(e) => handleLineItemChange(index, 'capacity', Number(e.target.value))}
                      className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-[#D4AF37] text-center"
                      placeholder="0"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <select 
                      value={item.unit}
                      onChange={(e) => handleLineItemChange(index, 'unit', e.target.value)}
                      className="w-full rounded-md border border-[#333333] bg-[#2A2A2A] text-white px-2 py-1.5 font-semibold focus:outline-none focus:border-[#D4AF37] text-center text-xs"
                    >
                      <option value="KW" className="bg-[#1E1E1E] text-white py-1">KW</option>
                      <option value="MW" className="bg-[#1E1E1E] text-white py-1">MW</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <div className="relative">
                      <input 
                        type="number" 
                        value={item.rate || ''}
                        onChange={(e) => handleLineItemChange(index, 'rate', Number(e.target.value))}
                        className="w-full bg-[#2A2A2A] border border-[#333333] text-white pl-2 pr-12 py-1.5 rounded-md text-sm focus:outline-none focus:border-[#D4AF37] text-right font-medium"
                        placeholder="0"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase pointer-events-none">
                        /{item.unit}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <input 
                      type="number" 
                      value={item.value || ''}
                      onChange={(e) => handleLineItemChange(index, 'value', Number(e.target.value))}
                      className="w-full bg-[#2A2A2A] border border-[#333333] text-white px-2 py-1.5 rounded-md text-sm focus:outline-none focus:border-[#D4AF37] font-semibold text-right"
                      placeholder="0"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button 
                      onClick={() => removeLineItem(index)}
                      className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-[#2A2A2A] rounded-md transition-colors"
                      title="Delete row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
          <button 
            onClick={addLineItem}
            className="flex items-center gap-2 bg-[#2A2A2A] hover:bg-[#333333] text-[#D4AF37] border border-[#333333] px-4 py-2 rounded-lg font-bold transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Add Row
          </button>
          
          {/* Tax, Advance & Total Summary Box */}
          <div className="w-full sm:w-80 bg-[#2A2A2A] rounded-xl p-5 border border-[#333333] space-y-3 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Subtotal:</span>
              <span className="font-semibold text-white">INR {subtotal.toLocaleString('en-IN')}</span>
            </div>

            {/* GST Selector Dropdown */}
            <div className="space-y-1.5 border-t border-[#333333] pt-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                GST / Tax Category
              </label>
              <select
                value={gstType}
                onChange={(e) => setGstType(e.target.value as any)}
                className="w-full rounded-lg border border-[#333333] bg-[#1E1E1E] text-white px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40"
              >
                <option value="CGST_SGST" className="bg-[#1E1E1E] text-white py-1">CGST (9%) + SGST (9%) — Intra-State (18%)</option>
                <option value="IGST" className="bg-[#1E1E1E] text-white py-1">IGST (18%) — Inter-State / Out of State (18%)</option>
                <option value="NONE" className="bg-[#1E1E1E] text-white py-1">Exempt / None (0%)</option>
              </select>
            </div>

            <div className="flex justify-between items-center text-gray-400 text-xs pb-1">
              <span>Tax Calculated:</span>
              <span className="font-semibold text-white">INR {taxAmount.toLocaleString('en-IN')}</span>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between font-bold text-base border-t border-[#333333] pt-2">
              <span className="text-white">Grand Total:</span>
              <span className="text-[#D4AF37] text-lg">
                INR {grandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Advance Payment Calculator */}
            <div className="border-t border-[#333333] pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-200">
                  <input 
                    type="checkbox" 
                    checked={advanceEnabled}
                    onChange={e => setAdvanceEnabled(e.target.checked)}
                    className="rounded border-[#333333] bg-[#1E1E1E] text-[#D4AF37] focus:ring-[#D4AF37]"
                  />
                  <span>Advance Payment</span>
                </label>
                {advanceEnabled && (
                  <div className="flex items-center gap-1">
                    <input 
                      type="number" 
                      min="0" 
                      max="100" 
                      value={advancePercentage}
                      onChange={e => setAdvancePercentage(Number(e.target.value))}
                      className="w-12 text-center rounded-md border border-[#333333] bg-[#1E1E1E] text-white px-1 py-0.5 text-xs font-bold focus:outline-none focus:border-[#D4AF37]"
                    />
                    <span className="text-xs text-gray-400">%</span>
                  </div>
                )}
              </div>

              {advanceEnabled && (
                <div className="flex justify-between items-center bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg px-2.5 py-1.5 text-xs">
                  <span className="text-[#D4AF37] font-medium">Required Advance:</span>
                  <span className="font-bold text-[#D4AF37]">INR {advanceAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Row Detailed Scope Deliverables & Submittals Table */}
      <div className="bg-[#1E1E1E] border border-[#333333] rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#2A2A2A] pb-2">
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-base font-bold text-[#D4AF37]">Detailed Scope Deliverables & Submittals</h3>
          </div>
          <span className="text-xs text-gray-400">Technical milestone outputs & statutory packages</span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm text-left min-w-[700px]">
            <thead className="text-xs text-gray-400 uppercase font-semibold bg-[#2A2A2A] rounded-t-md">
              <tr>
                <th className="py-3 px-4 rounded-tl-md w-12 text-center">Sr.</th>
                <th className="py-3 px-4 w-48">Category / Stage</th>
                <th className="py-3 px-4">Deliverable Description</th>
                <th className="py-3 px-4 w-48">Timeline / Format</th>
                <th className="py-3 px-4 rounded-tr-md w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333333]">
              {detailedDeliverables.map((item, index) => (
                <tr key={index} className="border-b border-[#333333] hover:bg-[#2A2A2A]/50 text-gray-200 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-400 text-center">{item.srNo}</td>
                  <td className="py-3 px-4">
                    <input 
                      type="text" 
                      value={item.category}
                      onChange={e => handleDeliverableChange(index, 'category', e.target.value)}
                      className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-md px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                      placeholder="e.g. Electrical / CEIG"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <textarea 
                      value={item.itemDescription}
                      onChange={e => handleDeliverableChange(index, 'itemDescription', e.target.value)}
                      className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500 resize-y min-h-[38px]"
                      placeholder="Describe specific engineering drawing, calculation, or approval document..."
                      rows={1}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input 
                      type="text" 
                      value={item.deliveryTimeline || ''}
                      onChange={e => handleDeliverableChange(index, 'deliveryTimeline', e.target.value)}
                      className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500"
                      placeholder="e.g. Within 10 Days"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button 
                      onClick={() => removeDeliverable(index)}
                      className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-[#2A2A2A] rounded-md transition-colors"
                      title="Delete deliverable"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-2">
          <button 
            onClick={addDeliverable}
            className="flex items-center gap-2 bg-[#2A2A2A] hover:bg-[#333333] text-[#D4AF37] border border-[#333333] px-3.5 py-1.5 rounded-lg font-semibold text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#D4AF37]" /> Add Deliverable Row
          </button>
        </div>
      </div>

      {/* Payment Terms & Terms & Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Terms */}
        <div className="bg-[#1E1E1E] border border-[#333333] rounded-xl p-4 sm:p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#D4AF37] mb-4 border-b border-[#2A2A2A] pb-2">Payment Terms</h3>
          <div className="space-y-3 mb-4">
            {DEFAULT_PAYMENT_TERMS.map((term, i) => (
              <label key={i} className="flex items-start gap-3 text-sm cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={paymentTerms.includes(term)}
                  onChange={(e) => {
                    if (e.target.checked) setPaymentTerms([...paymentTerms, term]);
                    else setPaymentTerms(paymentTerms.filter(t => t !== term));
                  }}
                  className="mt-1 rounded text-[#D4AF37] focus:ring-[#D4AF37] bg-[#2A2A2A] border-[#333333]"
                />
                <span className="text-gray-300 leading-tight text-xs">{term}</span>
              </label>
            ))}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5 text-gray-400">Custom Payment Terms</label>
            <textarea 
              value={customPaymentTerms}
              onChange={e => setCustomPaymentTerms(e.target.value)}
              className="w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500 min-h-[80px]"
              placeholder="Enter custom terms..."
            />
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-[#1E1E1E] border border-[#333333] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col">
          <h3 className="text-base font-bold text-[#D4AF37] mb-4 border-b border-[#2A2A2A] pb-2">Terms & Conditions</h3>
          <textarea 
            value={termsAndConditions}
            onChange={e => setTermsAndConditions(e.target.value)}
            className="flex-1 w-full bg-[#2A2A2A] border border-[#333333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder:text-gray-500 min-h-[200px]"
          />
        </div>
      </div>

      {showNewClientModal && (
        <NewClientModal 
          onClose={() => setShowNewClientModal(false)}
          onSuccess={(client) => {
            setShowNewClientModal(false);
            refetch();
            setSelectedClientId(client.id);
          }}
        />
      )}
    </div>
  );
}

export default QuotationEditor;
