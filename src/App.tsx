import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { useAuthStore } from './store';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { QuotationEditor } from './pages/QuotationEditor';
import { Toaster } from 'react-hot-toast';

import { Dashboard } from './pages/Dashboard';
import { Quotations } from './pages/Quotations';
import { Clients } from './pages/Clients';
import { Companies } from './pages/Companies';

export default function App() {
  const { setUser, setRole, setInitialized } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role as any);
          } else {
            setRole('sales');
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole('sales');
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setInitialized(true);
    });

    return () => unsubscribe();
  }, [setUser, setRole, setInitialized]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quotations" element={<Quotations />} />
            <Route path="/quotations/new" element={<QuotationEditor />} />
            <Route path="/quotations/edit/:id" element={<QuotationEditor />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/companies" element={<Companies />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
