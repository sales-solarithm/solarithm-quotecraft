import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Quotation } from '../types';
import { FileText, DollarSign, Clock, CheckCircle, Plus, Edit3, Download, Trash2 } from 'lucide-react';
import { PDFDownloadButton } from '../components/PDFDownloadButton';
import toast from 'react-hot-toast';
import { getStoredDraftQuotes, deleteDraftQuote, STORAGE_EVENTS } from '../lib/isolatedStorage';

export function Dashboard() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [quoteToDelete, setQuoteToDelete] = useState<Quotation | null>(null);

  const fetchDashboardData = useCallback(() => {
    try {
      const data = getStoredDraftQuotes();
      setQuotations(data.slice(0, 10));
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    const handleQuotesUpdated = () => {
      fetchDashboardData();
    };
    window.addEventListener(STORAGE_EVENTS.QUOTES_UPDATED, handleQuotesUpdated);
    return () => {
      window.removeEventListener(STORAGE_EVENTS.QUOTES_UPDATED, handleQuotesUpdated);
    };
  }, [fetchDashboardData]);

  const executeDelete = async (id: string) => {
    try {
      await deleteDraftQuote(id);
      setQuotations(prev => prev.filter(item => item.id !== id && item.quotationNumber !== id));
      toast.success('Quotation deleted successfully');
    } catch (error) {
      console.error('Error deleting draft quotation:', error);
      toast.error('Failed to delete draft');
    } finally {
      setQuoteToDelete(null);
    }
  };

  const deleteQuote = async (id?: string) => {
    if (!id) return;

    let confirmed = false;
    let blockedBySandbox = false;

    try {
      const startTime = performance.now();
      confirmed = window.confirm('Are you sure you want to delete this quotation?');
      const elapsed = performance.now() - startTime;
      if (!confirmed && elapsed < 10) {
        blockedBySandbox = true;
      }
    } catch {
      blockedBySandbox = true;
    }

    if (blockedBySandbox) {
      const target = quotations.find(q => q.id === id || q.quotationNumber === id) || ({ id, quotationNumber: id } as Quotation);
      setQuoteToDelete(target);
      return;
    }

    if (!confirmed) return;

    await executeDelete(id);
  };

  const totalValue = quotations.reduce((sum, q) => sum + (q.grandTotal || 0), 0);
  const pendingCount = quotations.filter(q => q.status === 'Draft' || q.status === 'Sent' || !q.status).length;
  const approvedCount = quotations.filter(q => q.status === 'Accepted').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header with Title and Create Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white">Overview</h1>
          <p className="text-gray-400 mt-1 text-sm">Welcome to Solarithm QuoteCraft</p>
        </div>
        <Link 
          to="/quotations/new" 
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B5952F] text-[#121212] font-bold px-5 py-2.5 rounded-lg transition-colors shadow-md shadow-[#D4AF37]/20 text-sm"
        >
          <Plus className="w-4 h-4 text-[#121212]" />
          Create New Quotation
        </Link>
      </div>

      {/* KPI Cards Grid - 1 col on mobile, 2 cols on tablets (md), 4 cols on desktop (lg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-[#1E1E1E] border border-[#333333] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Quotations</p>
              <h3 className="text-2xl font-bold text-white font-serif mt-0.5">{quotations.length}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-[#1E1E1E] border border-[#333333] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg border border-[#D4AF37]/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Pipeline Value</p>
              <h3 className="text-2xl font-bold text-white font-serif mt-0.5">₹{totalValue.toLocaleString('en-IN')}</h3>
            </div>
          </div>
        </div>

        <div className="bg-[#1E1E1E] border border-[#333333] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Pending Drafts</p>
              <h3 className="text-2xl font-bold text-white font-serif mt-0.5">{pendingCount}</h3>
            </div>
          </div>
        </div>

        <div className="bg-[#1E1E1E] border border-[#333333] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Approved Quotes</p>
              <h3 className="text-2xl font-bold text-white font-serif mt-0.5">{approvedCount}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Quotations Table Card */}
      <div className="bg-[#1E1E1E] border border-[#333333] rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#333333] flex justify-between items-center bg-[#1E1E1E]">
          <h2 className="text-base font-bold text-white tracking-wide">Recent Quotations</h2>
          <Link to="/quotations" className="text-xs font-semibold text-[#D4AF37] hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm min-w-[640px]">
            <thead className="bg-[#2A2A2A] text-gray-400 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Quote No</th>
                <th className="py-3.5 px-4 font-semibold">Client</th>
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold">Amount</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333333]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-gray-400">Loading quotations...</td>
                </tr>
              ) : quotations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-gray-400">No recent quotations found.</td>
                </tr>
              ) : (
                quotations.map(q => (
                  <tr key={q.id} className="border-b border-[#333333] hover:bg-[#2A2A2A]/50 text-gray-200 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white">{q.quotationNumber}</td>
                    <td className="py-3.5 px-4 text-gray-300">{q.clientDetails?.companyName || '-'}</td>
                    <td className="py-3.5 px-4 text-gray-400 text-xs">{q.date}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">₹{q.grandTotal?.toLocaleString('en-IN') || 0}</td>
                    <td className="py-3.5 px-4">
                      <span className={
                        q.status === 'Accepted' ? 'badge-approved' :
                        q.status === 'Rejected' ? 'badge-rejected' :
                        'badge-warning'
                      }>
                        {q.status || 'Draft'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link 
                          to={`/quotations/edit/${q.id}`}
                          className="p-1.5 text-gray-400 hover:text-[#D4AF37] hover:bg-[#2A2A2A] transition-colors rounded-md"
                          title="Edit Draft"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <PDFDownloadButton 
                          data={q} 
                          fileName={`${q.quotationNumber || 'quotation'}.pdf`}
                          className="p-1.5 text-gray-400 hover:text-[#D4AF37] hover:bg-[#2A2A2A] transition-colors rounded-md inline-flex items-center justify-center"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </PDFDownloadButton>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteQuote(q.id || q.quotationNumber);
                          }}
                          className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-[#2A2A2A] rounded-md transition-colors cursor-pointer"
                          title="Delete Quotation"
                          id={`delete-quote-${q.quotationNumber || q.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* In-App Confirmation Safeguard Modal */}
      {quoteToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="bg-[#1E1E1E] border border-[#333333] rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 id="delete-dialog-title" className="text-base font-bold text-white">Delete Quotation</h3>
                <p className="text-xs text-gray-400 font-mono">
                  {quoteToDelete.quotationNumber || quoteToDelete.id}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-300">
              Are you sure you want to delete this quotation?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setQuoteToDelete(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white bg-[#2A2A2A] hover:bg-[#333333] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => executeDelete(quoteToDelete.id || quoteToDelete.quotationNumber)}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-md shadow-rose-900/20"
              >
                Delete Quotation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
