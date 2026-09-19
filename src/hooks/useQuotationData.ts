import React, { useEffect, useState, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Company, Client, PricingRule, Scope } from '../types';
import toast from 'react-hot-toast';
import { COLLECTIONS } from '../config/schema';
import { getStoredLeads, STORAGE_EVENTS } from '../lib/isolatedStorage';

export function useQuotationData() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [scopes, setScopes] = useState<Scope[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Load clients strictly from isolated quotation leads storage
      const isolatedLeads = getStoredLeads();
      setClients(isolatedLeads);

      // 2. Fetch companies from myCompanies collection if available
      try {
        const companiesRef = collection(db, 'myCompanies');
        const qCompanies = query(companiesRef, where('assignedTools.quotationMaker', '==', true));
        const compSnapshot = await getDocs(qCompanies);
        const comps = compSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Company));
        if (comps.length > 0) {
          setCompanies(comps);
        }
      } catch (e) {
        console.warn('Could not load companies from remote, keeping current list:', e);
      }

      // 3. Fetch pricing rules
      try {
        const rulesRef = collection(db, COLLECTIONS.PRICING_RULES);
        const rulesSnapshot = await getDocs(rulesRef);
        const rules = rulesSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as PricingRule));
        if (rules.length > 0) {
          setPricingRules(rules);
        }
      } catch (e) {
        console.warn('Could not load pricing rules from remote:', e);
      }

      // 4. Fetch scopes
      try {
        const scopesRef = collection(db, COLLECTIONS.SCOPES);
        const scopesSnapshot = await getDocs(scopesRef);
        const scps = scopesSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Scope));
        if (scps.length > 0) {
          setScopes(scps);
        }
      } catch (e) {
        console.warn('Could not load scopes from remote:', e);
      }
    } catch (err: any) {
      console.error('Error fetching initial data:', err);
      toast.error('Failed to load data. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Listen for isolated lead updates in real-time
    const handleLeadsUpdated = () => {
      setClients(getStoredLeads());
    };
    window.addEventListener(STORAGE_EVENTS.LEADS_UPDATED, handleLeadsUpdated);
    return () => {
      window.removeEventListener(STORAGE_EVENTS.LEADS_UPDATED, handleLeadsUpdated);
    };
  }, [fetchData]);

  return { companies, clients, pricingRules, scopes, loading, refetch: fetchData };
}
