import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [customId, setCustomId] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  // Feedback alerts
  const [alert, setAlert] = useState(null);

  const API_URL = 'http://localhost:5000/api/users';

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      showAlert("Error loading customers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setCustomId('');
    setEditId(null);
    setIsEditing(false);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      showAlert("Name and Email are required", "error");
      return;
    }

    try {
      if (isEditing) {
        // Update customer
        await axios.put(`${API_URL}/${editId}`, {
          Cusname: name,
          Cusemail: email
        });
        showAlert("Customer updated successfully!");
      } else {
        // Create customer
        const payload = {
          Cusname: name,
          Cusemail: email
        };
        if (customId) {
          payload.Cusid = parseInt(customId);
        }
        await axios.post(API_URL, payload);
        showAlert("Customer created successfully!");
      }
      handleResetForm();
      fetchCustomers();
    } catch (error) {
      console.error("Error saving customer:", error);
      showAlert("Failed to save customer. Make sure ID is unique.", "error");
    }
  };

  const handleEditClick = (cust) => {
    setName(cust.CusName || cust.Cusname || '');
    setEmail(cust.CusEmail || cust.Cusemail || '');
    setEditId(cust.CusID || cust.Cusid);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      showAlert("Customer deleted successfully!");
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
      showAlert("Failed to delete customer", "error");
    }
  };

  const filteredCustomers = customers.filter(cust => {
    const custName = (cust.CusName || cust.Cusname || '').toLowerCase();
    const custEmail = (cust.CusEmail || cust.Cusemail || '').toLowerCase();
    const search = searchQuery.toLowerCase();
    return custName.includes(search) || custEmail.includes(search) || String(cust.CusID || cust.Cusid).includes(search);
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Customer Management
          </h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">
            Manage your customer accounts, profiles, and billing information.
          </p>
        </div>

        <button
          onClick={() => {
            if (showForm) handleResetForm();
            else setShowForm(true);
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-200"
        >
          {showForm ? 'Cancel' : 'Add Customer'}
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

      {/* Form Card */}
      {showForm && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-md max-w-2xl transition-all duration-300">
          <h3 className="text-lg font-bold text-white mb-4">
            {isEditing ? 'Edit Customer Details' : 'Register New Customer'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!isEditing && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Customer ID (Optional)</label>
                  <input
                    type="number"
                    placeholder="Auto-generated if blank"
                    value={customId}
                    onChange={(e) => setCustomId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm text-white focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>
              )}
              <div className={isEditing ? "md:col-span-2" : ""}>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm text-white focus:border-indigo-500 outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                placeholder="e.g. john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm text-white focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetForm}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs shadow-md shadow-indigo-600/10 transition-all"
              >
                {isEditing ? 'Save Changes' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Panel */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-md overflow-hidden shadow-2xl">
        {/* Search Header */}
        <div className="p-6 border-b border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <svg className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by ID, Name, or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 pl-10 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-550 focus:border-indigo-500 outline-none transition-colors"
            />
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Total Customers: {filteredCustomers.length}
          </span>
        </div>

        {/* Customers Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-semibold flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading customers...
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-medium">
              No customers found. Click "Add Customer" to get started.
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-950/20">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-450">ID</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-450">Customer Name</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-450">Email</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-450">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredCustomers.map((cust) => {
                  const id = cust.CusID || cust.Cusid;
                  const nameVal = cust.CusName || cust.Cusname;
                  const emailVal = cust.CusEmail || cust.Cusemail;
                  
                  return (
                    <tr key={id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-indigo-400">
                        #{id}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-white">
                        {nameVal}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-300 font-mono">
                        {emailVal}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2.5">
                          <button
                            onClick={() => handleEditClick(cust)}
                            className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/10 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(id)}
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
    </div>
  );
}

export default CustomerManagement;
