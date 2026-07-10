import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PackageManagement() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  // Feedback alerts
  const [alert, setAlert] = useState(null);

  const API_URL = 'http://localhost:5000/api/packages';

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
      showAlert("Error loading packages", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleResetForm = () => {
    setName('');
    setPrice('');
    setDescription('');
    setFeatures('');
    setEditId(null);
    setIsEditing(false);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      showAlert("Name and Price are required", "error");
      return;
    }

    try {
      const payload = {
        name,
        price: parseFloat(price) || 0,
        description,
        features: features
      };

      if (isEditing) {
        // Update package
        await axios.put(`${API_URL}/${editId}`, payload);
        showAlert("Package updated successfully!");
      } else {
        // Create package
        await axios.post(API_URL, payload);
        showAlert("Package created successfully!");
      }
      handleResetForm();
      fetchPackages();
    } catch (error) {
      console.error("Error saving package:", error);
      showAlert("Failed to save package", "error");
    }
  };

  const handleEditClick = (pkg) => {
    setName(pkg.name || '');
    setPrice(pkg.price || '');
    setDescription(pkg.description || '');
    setFeatures(pkg.features || '');
    setEditId(pkg.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      showAlert("Package deleted successfully!");
      fetchPackages();
    } catch (error) {
      console.error("Error deleting package:", error);
      showAlert("Failed to delete package", "error");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Package Management
          </h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">
            Define technology development project packages, details, features, and base pricing.
          </p>
        </div>

        <button
          onClick={() => {
            if (showForm) handleResetForm();
            else setShowForm(true);
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-200"
        >
          {showForm ? 'Cancel' : 'Add Package'}
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
            {isEditing ? 'Edit Package Details' : 'Create New Development Package'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Package Name</label>
                <input
                  type="text"
                  placeholder="e.g. Startup MVP Landing Page"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm text-white focus:border-indigo-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Base Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 1999.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm text-white focus:border-indigo-500 outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Brief Description</label>
              <textarea
                rows="3"
                placeholder="Give a short summary of this package package..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm text-white focus:border-indigo-500 outline-none resize-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Key Features (Comma Separated)</label>
              <input
                type="text"
                placeholder="e.g. Responsive Design, SEO Ready, 5 Custom Pages, Contact Form"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm text-white focus:border-indigo-500 outline-none transition-colors"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Separate distinct features with commas.</span>
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
                {isEditing ? 'Save Changes' : 'Publish Package'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Grid View */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-semibold flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading Packages...
        </div>
      ) : packages.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 font-medium">
          No technology packages found. Click "Add Package" to create your first package.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const featureList = pkg.features 
              ? pkg.features.split(',').map(f => f.trim()).filter(Boolean)
              : [];

            return (
              <div key={pkg.id} className="relative bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md overflow-hidden flex flex-col justify-between shadow-xl hover:border-slate-700/80 transition-all duration-200 group">
                {/* Decorative glow */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-300 pointer-events-none" />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-white tracking-tight">{pkg.name}</h3>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block leading-none">Starting at</span>
                      <span className="text-lg font-extrabold text-indigo-400 block mt-0.5">${parseFloat(pkg.price).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[40px]">
                    {pkg.description || 'No description provided.'}
                  </p>
                  
                  <div className="pt-4 border-t border-slate-800/60">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2.5">Key Deliverables</span>
                    {featureList.length > 0 ? (
                      <ul className="space-y-2">
                        {featureList.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-[11px] text-slate-300 font-medium">
                            <svg className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-xs text-slate-500 italic">No features specified</span>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/40 flex justify-end gap-2.5">
                  <button
                    onClick={() => handleEditClick(pkg)}
                    className="px-3.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/10 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Edit Package
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/10 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PackageManagement;
