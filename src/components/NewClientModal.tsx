import React, { useState } from 'react';
import { Client } from '../types';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { useProfileStore } from '../store';
import { saveLead } from '../lib/isolatedStorage';

export function NewClientModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: (client: Client) => void }) {
  const [loading, setLoading] = useState(false);
  const { lockedEmail } = useProfileStore();
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pinCode: ''
    },
    gstin: '',
    pan: '',
    phone: '',
    email: '',
    website: '',
    pricingCategory: 'T1' as 'T1' | 'T2' | 'T3' | 'T4'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newLead = saveLead({
        companyName: formData.companyName,
        contactPerson: formData.contactPerson,
        address: formData.address,
        gstin: formData.gstin,
        pan: formData.pan,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        category: formData.pricingCategory,
        pricingCategory: formData.pricingCategory,
        status: 'Lead',
        salesPersonEmail: lockedEmail || 'sales@solarithm.com',
      });
      toast.success('Client lead added successfully');
      onSuccess(newLead);
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to add client lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#1E1E1E] w-full max-w-2xl rounded-xl border border-[#333333] border-t-2 border-t-[#D4AF37] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#2A2A2A] flex justify-between items-center bg-[#252525]">
          <h2 className="text-lg sm:text-xl font-bold text-[#D4AF37]">Add New Client</h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2A2A2A] rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-white">
          <form id="new-client-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Company Name *</label>
                <input 
                  required 
                  type="text" 
                  value={formData.companyName} 
                  onChange={e => setFormData({...formData, companyName: e.target.value})} 
                  className="w-full rounded-md border border-[#333333] bg-[#2A2A2A] px-3 py-2 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none" 
                  placeholder="e.g. Acme Solar Corp"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Contact Person</label>
                <input 
                  type="text" 
                  value={formData.contactPerson} 
                  onChange={e => setFormData({...formData, contactPerson: e.target.value})} 
                  className="w-full rounded-md border border-[#333333] bg-[#2A2A2A] px-3 py-2 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none" 
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider border-b border-[#2A2A2A] pb-1.5 mb-3">Address Details</h4>
              <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Address Line 1 *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.address.line1} 
                    onChange={e => setFormData({...formData, address: {...formData.address, line1: e.target.value}})} 
                    className="w-full rounded-md border border-[#333333] bg-[#2A2A2A] px-3 py-2 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none" 
                    placeholder="Plot / Street / Building"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Address Line 2</label>
                  <input 
                    type="text" 
                    value={formData.address.line2} 
                    onChange={e => setFormData({...formData, address: {...formData.address, line2: e.target.value}})} 
                    className="w-full rounded-md border border-[#333333] bg-[#2A2A2A] px-3 py-2 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none" 
                    placeholder="Area / Landmark"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">City *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.address.city} 
                    onChange={e => setFormData({...formData, address: {...formData.address, city: e.target.value}})} 
                    className="w-full rounded-md border border-[#333333] bg-[#2A2A2A] px-3 py-2 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">State *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.address.state} 
                    onChange={e => setFormData({...formData, address: {...formData.address, state: e.target.value}})} 
                    className="w-full rounded-md border border-[#333333] bg-[#2A2A2A] px-3 py-2 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">PIN Code *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.address.pinCode} 
                    onChange={e => setFormData({...formData, address: {...formData.address, pinCode: e.target.value}})} 
                    className="w-full rounded-md border border-[#333333] bg-[#2A2A2A] px-3 py-2 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none" 
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider border-b border-[#2A2A2A] pb-1.5 mb-3">Tax & Contact</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">GSTIN</label>
                  <input 
                    type="text" 
                    value={formData.gstin} 
                    onChange={e => setFormData({...formData, gstin: e.target.value})} 
                    className="w-full rounded-md border border-[#333333] bg-[#2A2A2A] px-3 py-2 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none" 
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">PAN</label>
                  <input 
                    type="text" 
                    value={formData.pan} 
                    onChange={e => setFormData({...formData, pan: e.target.value})} 
                    className="w-full rounded-md border border-[#333333] bg-[#2A2A2A] px-3 py-2 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none" 
                    placeholder="ABCDE1234F"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Phone *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    className="w-full rounded-md border border-[#333333] bg-[#2A2A2A] px-3 py-2 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none" 
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Email *</label>
                  <input 
                    required 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    className="w-full rounded-md border border-[#333333] bg-[#2A2A2A] px-3 py-2 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none" 
                    placeholder="billing@company.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Pricing Category</label>
              <select 
                value={formData.pricingCategory} 
                onChange={e => setFormData({...formData, pricingCategory: e.target.value as any})} 
                className="w-full rounded-md border border-[#333333] bg-[#2A2A2A] text-white px-3 py-2 text-sm focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
              >
                <option value="T1">T1 (Premium)</option>
                <option value="T2">T2 (Standard)</option>
                <option value="T3">T3 (Discounted)</option>
                <option value="T4">T4 (Special)</option>
              </select>
            </div>
          </form>
        </div>
        
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-[#2A2A2A] bg-[#252525] flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="w-full sm:w-auto px-4 py-2 rounded-lg font-semibold bg-[#2A2A2A] border border-[#333333] text-gray-300 hover:text-white hover:bg-[#333333] transition-colors text-sm"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="new-client-form" 
            disabled={loading} 
            className="w-full sm:w-auto px-5 py-2 rounded-lg font-bold bg-[#D4AF37] text-[#121212] hover:bg-[#B5952F] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-md shadow-[#D4AF37]/20"
          >
            {loading ? <span className="w-4 h-4 border-2 border-[#121212]/30 border-t-[#121212] rounded-full animate-spin"></span> : null}
            Save Client
          </button>
        </div>
      </div>
    </div>
  );
}
