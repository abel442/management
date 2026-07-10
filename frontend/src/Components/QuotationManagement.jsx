import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Quotation from './Quotation.jsx';

function QuotationManagement() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Alert system
  const [alert, setAlert] = useState(null);

  const API_URL = 'http://localhost:5000/api/quotations';

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setQuotations(response.data);
    } catch (error) {
      console.error("Error loading quotations:", error);
      showAlert("Error loading quotations list", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/${id}/status`, { status: newStatus });
      showAlert(`Quotation status updated to ${newStatus}`);
      fetchQuotations();
      if (selectedQuote && selectedQuote.id === id) {
        setSelectedQuote(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showAlert("Failed to update status", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quotation?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      showAlert("Quotation deleted successfully!");
      fetchQuotations();
    } catch (error) {
      console.error("Error deleting quotation:", error);
      showAlert("Failed to delete quotation", "error");
    }
  };

  const filteredQuotes = quotations.filter(q => {
    const custName = (q.customer_name || '').toLowerCase();
    const custEmail = (q.customer_email || '').toLowerCase();
    const service = (q.service_type || '').toLowerCase();
    const search = searchQuery.toLowerCase();
    const matchesSearch = custName.includes(search) || custEmail.includes(search) || service.includes(search) || String(q.id).includes(search);
    
    const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // If in creating mode, render the Quotation Creator component
  if (isCreating) {
    return (
      <Quotation 
        onBack={() => {
          setIsCreating(false);
          fetchQuotations();
        }} 
      />
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Quotations Management
          </h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">
            Review, track, update status, and build new custom quotations for clients.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-200"
        >
          Create Quotation
        </button>
      </div>

      {/* Alert Component */}
      {alert && (
        <div className={`p-4 rounded-xl border text-sm font-medium flex items-center justify-between transition-all duration-300 ${
          alert.type === 'error' 
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        }`}>
          <span>{alert.message}</span>
          <button onClick={() => setAlert(null)} className="opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-md flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="relative w-full md:w-80">
          <svg className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by ID, customer, service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 pl-10 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-550 focus:border-indigo-500 outline-none transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-400 flex-shrink-0">Status:</span>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1 overflow-x-auto w-full md:w-auto">
            {['All', 'Draft', 'Sent', 'Accepted', 'Paid', 'Declined'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === status 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quotations List */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-md overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-semibold flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading Quotations...
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-medium">
              No quotations match your criteria.
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-950/20">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-455">ID</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-455">Customer Name</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-455">Service / Goal</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-455">Total</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-455">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-455">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-455">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredQuotes.map((q) => {
                  const statusColors = {
                    Draft: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
                    Sent: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
                    Accepted: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
                    Paid: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
                    Declined: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
                  };

                  return (
                    <tr key={q.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-indigo-400">
                        #{q.id}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-white">
                        <div>{q.customer_name}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{q.customer_email}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-300">
                        <span className="font-semibold text-white">{q.service_type}</span>
                        {q.main_goal && <span className="text-[10px] text-slate-500 block">{q.main_goal}</span>}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-indigo-450 font-mono">
                        ${parseFloat(q.total || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold ${statusColors[q.status] || 'bg-slate-800'}`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-450">
                        {new Date(q.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedQuote(q)}
                            className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/10 rounded-lg text-xs font-semibold transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(q.id)}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/10 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Invoice Details Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-3xl shadow-2xl relative space-y-6">
            <button
              onClick={() => setSelectedQuote(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg p-2"
            >
              ✕
            </button>

            {/* Header info */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-450 uppercase tracking-widest block">Quotation Details</span>
                <h3 className="text-xl font-bold text-white mt-1">Quotation #{selectedQuote.id}</h3>
                <span className="text-xs text-slate-450 block mt-1">Date Created: {new Date(selectedQuote.created_at).toLocaleString()}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">Status</span>
                <select
                  value={selectedQuote.status}
                  onChange={(e) => handleUpdateStatus(selectedQuote.id, e.target.value)}
                  className="mt-1 bg-slate-950 border border-slate-800 p-2 rounded-xl text-xs text-white font-bold outline-none focus:border-indigo-500"
                >
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Paid">Paid</option>
                  <option value="Declined">Declined</option>
                </select>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Client Info</span>
                <div className="text-xs font-semibold text-white mt-1">{selectedQuote.customer_name}</div>
                {selectedQuote.customer_email && <div className="text-xs text-slate-400 mt-1 font-mono">{selectedQuote.customer_email}</div>}
                {selectedQuote.customer_phone && <div className="text-xs text-slate-400 mt-0.5">{selectedQuote.customer_phone}</div>}
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Project Scope</span>
                <div className="text-xs font-semibold text-white mt-1">Service: <span className="text-indigo-400">{selectedQuote.service_type}</span></div>
                {selectedQuote.business_profile && <div className="text-xs text-slate-400 mt-1">Profile: {selectedQuote.business_profile}</div>}
                {selectedQuote.main_goal && <div className="text-xs text-slate-400 mt-0.5">Goal: {selectedQuote.main_goal}</div>}
              </div>
            </div>

            {/* Description */}
            {selectedQuote.work_description && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Work Description</span>
                <p className="text-xs text-slate-350 bg-slate-950/30 border border-slate-800 p-3 rounded-xl leading-relaxed">
                  {selectedQuote.work_description}
                </p>
              </div>
            )}

            {/* Line items table */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Line Items</span>
              <div className="border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-950/40 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-800">
                      <th className="px-4 py-2.5">Description</th>
                      <th className="px-4 py-2.5 text-center w-16">Qty</th>
                      <th className="px-4 py-2.5 text-right w-24">Price</th>
                      <th className="px-4 py-2.5 text-right w-24">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-xs">
                    {selectedQuote.items && selectedQuote.items.length > 0 ? (
                      selectedQuote.items.map((item, idx) => (
                        <tr key={idx} className="text-slate-300">
                          <td className="px-4 py-2.5 font-medium">{item.description || 'General Development'}</td>
                          <td className="px-4 py-2.5 text-center">{item.quantity}</td>
                          <td className="px-4 py-2.5 text-right">${parseFloat(item.price || 0).toFixed(2)}</td>
                          <td className="px-4 py-2.5 text-right font-semibold text-white">${parseFloat((item.quantity * item.price) || 0).toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-4 py-6 text-center text-slate-500 italic">No line items added.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase">Grand Total Amount</span>
              <span className="text-2xl font-extrabold text-indigo-400">${parseFloat(selectedQuote.total || 0).toFixed(2)}</span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedQuote(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuotationManagement;
