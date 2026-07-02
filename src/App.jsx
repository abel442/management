import React, { useState } from 'react';
import Sidebar from './Components/Sidebar.jsx';
import Home from './Components/Home.jsx';
import Quotation from './Components/Quotation.jsx';

const App = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1 min-h-screen overflow-y-auto">
        {currentTab === 'dashboard' && (
          <Home setCurrentTab={setCurrentTab} />
        )}
        {currentTab === 'quotations' && (
          <Quotation />
        )}
        {currentTab === 'tables' && (
          <div className="p-8 max-w-7xl mx-auto">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-md">
              <h1 className="text-3xl font-extrabold tracking-tight text-white mb-6 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Tables</h1>
              <p className="text-slate-400">Placeholder for tables content.</p>
            </div>
          </div>
        )}
        {currentTab === 'forms' && (
          <div className="p-8 max-w-7xl mx-auto">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-md">
              <h1 className="text-3xl font-extrabold tracking-tight text-white mb-6 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Forms</h1>
              <p className="text-slate-400">Placeholder for general forms content.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;