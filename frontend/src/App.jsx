import Sidebar from './Components/Sidebar.jsx';
import Home from './Components/Home.jsx';
import Quotation from './Components/Quotation.jsx';
import QuotationManagement from './Components/QuotationManagement.jsx';
import CustomerManagement from './Components/CustomerManagement.jsx';
import PackageManagement from './Components/PackageManagement.jsx';
import React, { useState , useEffect} from 'react';
import axios from 'axios'; 


const App = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1 min-h-screen overflow-y-auto">
        {currentTab === 'dashboard' && (
          <Home setCurrentTab={setCurrentTab} />
        )}
        {currentTab === 'quotation' && (
          <Quotation onBack={() => setCurrentTab('quotation-management')} />
        )}
        {currentTab === 'quotation-management' && (
          <QuotationManagement />
        )}
        {currentTab === 'customer-management' && (
          <CustomerManagement />
        )}
        {currentTab === 'package' && (
          <PackageManagement />
        )}
      </main>
    </div>
  );
};

export default App;