import React from 'react';

function Home({ setCurrentTab }) {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-blue-900/40 via-indigo-900/35 to-violet-900/30 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">yanol tech</span>
            </h1>
            <p className="text-slate-400  sm:text-md mt-2 max-w-xl text-bold">
              Welcome to our Technology Development Company dashboard.

          We design and develop modern web applications, mobile apps, enterprise software, and digital solutions. </p>
          </div>
          {/* <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentTab('quotations')}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-200"
            >
              Open Quotation Creator
            </button>
          </div> */}
        </div>
      </div>

      {/* Shortcuts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => setCurrentTab('quotations')}
          className="w-full flex flex-col items-start p-6 bg-slate-900/50 hover:bg-slate-850/60 border border-slate-800 rounded-2xl text-left group transition-all duration-200 relative overflow-hidden"
        >
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl mb-4 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-md font-bold text-white block">Quotation Creator</span>
          <span className="text-xs text-slate-450 mt-1 block">Create invoices and quotes with real-time tax math</span>
        </button>

        <button
          onClick={() => setCurrentTab('tables')}
          className="w-full flex flex-col items-start p-6 bg-slate-900/50 hover:bg-slate-850/60 border border-slate-800 rounded-2xl text-left group transition-all duration-200 relative overflow-hidden"
        >
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl mb-4 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-md font-bold text-white block">Tables Sandbox</span>
          <span className="text-xs text-slate-450 mt-1 block">Explore pre-styled responsive tables</span>
        </button>

        <button
          onClick={() => setCurrentTab('forms')}
          className="w-full flex flex-col items-start p-6 bg-slate-900/50 hover:bg-slate-850/60 border border-slate-800 rounded-2xl text-left group transition-all duration-200 relative overflow-hidden"
        >
          <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl mb-4 border border-violet-500/20 group-hover:bg-violet-500/20 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <span className="text-md font-bold text-white block">Forms Sandbox</span>
          <span className="text-xs text-slate-450 mt-1 block">Check out form field custom validation layouts</span>
        </button>
      </div>
    </div>
  );
}

export default Home;