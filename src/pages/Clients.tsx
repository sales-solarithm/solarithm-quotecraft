import React, { useEffect, useState, useCallback } from 'react';
import { Client } from '../types';
import { Plus, Trash2 } from 'lucide-react';
import { NewClientModal } from '../components/NewClientModal';
import toast from 'react-hot-toast';
import { getStoredLeads, deleteLead, STORAGE_EVENTS } from '../lib/isolatedStorage';

export function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchClients = useCallback(() => {
    try {
      const data = getStoredLeads();
      setClients(data);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load client leads');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();

    const handleUpdate = () => {
      fetchClients();
    };
    window.addEventListener(STORAGE_EVENTS.LEADS_UPDATED, handleUpdate);
    return () => {
      window.removeEventListener(STORAGE_EVENTS.LEADS_UPDATED, handleUpdate);
    };
  }, [fetchClients]);

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this client lead?')) return;
    try {
      deleteLead(id);
      toast.success('Client lead deleted successfully');
      fetchClients();
    } catch (error) {
      console.error('Error deleting client lead:', error);
      toast.error('Failed to delete client lead');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white">Clients</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage your client directory</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B5952F] text-[#121212] px-5 py-2.5 rounded-lg font-bold transition-colors shadow-md shadow-[#D4AF37]/20 text-sm"
        >
          <Plus className="w-4 h-4 text-[#121212]" />
          Add Client
        </button>
      </div>

      <div className="bg-[#1E1E1E] border border-[#333333] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm min-w-[640px]">
            <thead className="bg-[#2A2A2A] text-gray-400 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Company Name</th>
                <th className="px-5 py-3.5 font-semibold">City</th>
                <th className="px-5 py-3.5 font-semibold">GSTIN</th>
                <th className="px-5 py-3.5 font-semibold">Phone</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333333]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-400">Loading...</td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-400">No clients found.</td>
                </tr>
              ) : (
                clients.map(client => (
                  <tr key={client.id} className="border-b border-[#333333] last:border-0 hover:bg-[#2A2A2A]/50 transition-colors text-gray-200 group">
                    <td className="px-5 py-3.5 font-medium text-white">{client.companyName}</td>
                    <td className="px-5 py-3.5 text-gray-300">{client?.address?.city || '-'}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs font-mono">{client.gstin || '-'}</td>
                    <td className="px-5 py-3.5 text-gray-300">{client.phone || '-'}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button 
                        onClick={() => handleDelete(client.id!)}
                        className="p-1.5 text-gray-400 hover:text-rose-400 transition-colors rounded-md hover:bg-[#2A2A2A]"
                        title="Delete Client"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <NewClientModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchClients();
          }}
        />
      )}
    </div>
  );
}

export default Clients;
