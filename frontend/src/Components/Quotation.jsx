import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Quotation({ onBack }) {
  // DB list states
  const [dbCustomers, setDbCustomers] = useState([]);
  const [dbPackages, setDbPackages] = useState([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState('');

  // 1. Customer Details State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [serviceType, setServiceType] = useState('Website');
  const [workDescription, setWorkDescription] = useState('');
  const [businessProfile, setBusinessProfile] = useState('');
  const [mainGoal, setMainGoal] = useState('');
  const [features, setFeatures] = useState([]);
  const [designLevel, setDesignLevel] = useState('');

  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const profiles = [
    { name: 'Retail / Shop', },
    { name: 'Restaurant / Cafe', },
    { name: 'Personal Brand / Influencer' },
    { name: 'Corporate / Company', },
    { name: 'Real Estate', },
    { name: 'Education / Academy', },
    { name: 'Clinic / Health Business' },
    { name: 'Tourism / Travel', },
    { name: 'Service Business', },
    { name: 'E-commerce Store', },
    { name: 'Other', }
  ];

  const goals = [
    { name: 'Just an online presence', description: 'Showcase your services and contact details' },
    { name: 'Get more leads', description: 'Grow your business with lead generation channels', },
    { name: 'Sell products online', description: 'Full e-commerce capabilities with payments', },
    { name: 'Accept bookings or appointments', description: 'Let users schedule slots online',  },
    { name: 'Show portfolio / projects', description: 'Display case studies or works beautifully', },
    { name: 'Build a premium brand image', description: 'Stunning premium design to elevate your brand',  },
    { name: 'Add AI/chat support', description: 'Interact with customers using intelligent assistants', },
    { name: 'Improve SEO visibility', description: 'Reach top search rankings and target keywords',  }
  ];

  const featuresList = [
    { name: 'Contact form', },
    { name: 'WhatsApp integration', },
    { name: 'Blog', },
    { name: 'SEO',  },
    { name: 'E-commerce',  },
    { name: 'Booking system',  },
    { name: 'Admin dashboard',  },
    { name: 'Payment integration',},
    { name: 'Multi-language', },
    { name: 'AI assistant / chatbot',  },
    { name: 'Customer account area',  },
    { name: 'Analytics dashboard', }
  ];

  const designLevels = [
    { name: 'Simple and professional', description: 'Clean, fast, and structured',  },
    { name: 'Premium and branded', description: 'Tailored branding with custom layouts',  },
    { name: 'Luxury custom experience', description: 'Bespoke animations, high-end aesthetics',  }
  ];

  // Fetch customers & packages on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, pkgRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users'),
          axios.get('http://localhost:5000/api/packages')
        ]);
        setDbCustomers(custRes.data);
        setDbPackages(pkgRes.data);
      } catch (error) {
        console.error("Error loading dropdown data:", error);
      } finally {
        setLoadingLists(false);
      }
    };
    fetchData();
  }, []);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const updateCustomerRequirementsInDb = async (customerId, updatedFields) => {
    if (!customerId) return;
    try {
      const found = dbCustomers.find(c => String(c.CusID || c.Cusid) === String(customerId));
      if (!found) return;

      const payload = {
        Cusname: found.CusName || found.Cusname || '',
        Cusemail: found.CusEmail || found.Cusemail || '',
        business_profile: found.business_profile || '',
        main_goal: found.main_goal || '',
        features: found.features || '[]',
        design_level: found.design_level || '',
        ...updatedFields
      };

      // Wrap features in JSON string if it is an array
      if (payload.features && Array.isArray(payload.features)) {
        payload.features = JSON.stringify(payload.features);
      }

      await axios.put(`http://localhost:5000/api/users/${customerId}`, payload);
      
      // Update local dbCustomers state
      setDbCustomers(prev => prev.map(c => 
        String(c.CusID || c.Cusid) === String(customerId) ? { ...c, ...updatedFields } : c
      ));
    } catch (error) {
      console.error("Error saving customer requirements in background:", error);
    }
  };

  const handleCustomerSelect = (id) => {
    setSelectedCustomerId(id);
    if (!id) {
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setBusinessProfile('');
      setMainGoal('');
      setFeatures([]);
      setDesignLevel('');
      return;
    }
    const found = dbCustomers.find(c => String(c.CusID || c.Cusid) === String(id));
    if (found) {
      setCustomerName(found.CusName || found.Cusname || '');
      setCustomerEmail(found.CusEmail || found.Cusemail || '');
      setCustomerPhone(found.CusPhone || found.Cusphone || '');
      
      setBusinessProfile(found.business_profile || '');
      setMainGoal(found.main_goal || '');
      setDesignLevel(found.design_level || '');
      
      let parsedFeatures = [];
      if (found.features) {
        try {
          parsedFeatures = typeof found.features === 'string' ? JSON.parse(found.features) : (found.features || []);
        } catch (e) {
          parsedFeatures = typeof found.features === 'string' ? found.features.split(',') : [];
        }
      }
      setFeatures(parsedFeatures);
    }
  };

  const handleProfileSelect = (profileName) => {
    const updated = businessProfile === profileName ? '' : profileName;
    setBusinessProfile(updated);
    if (selectedCustomerId) {
      updateCustomerRequirementsInDb(selectedCustomerId, { business_profile: updated });
    }
  };

  const handleGoalSelect = (goalName) => {
    const updated = mainGoal === goalName ? '' : goalName;
    setMainGoal(updated);
    if (selectedCustomerId) {
      updateCustomerRequirementsInDb(selectedCustomerId, { main_goal: updated });
    }
  };

  const handleFeatureToggle = (featureName) => {
    const updated = features.includes(featureName)
      ? features.filter(f => f !== featureName)
      : [...features, featureName];
    setFeatures(updated);
    if (selectedCustomerId) {
      updateCustomerRequirementsInDb(selectedCustomerId, { features: updated });
    }
  };

  const handleDesignLevelSelect = (levelName) => {
    const updated = designLevel === levelName ? '' : levelName;
    setDesignLevel(updated);
    if (selectedCustomerId) {
      updateCustomerRequirementsInDb(selectedCustomerId, { design_level: updated });
    }
  };

  const handlePackageSelect = (id) => {
    setSelectedPackageId(id);
    if (!id) return;
    const found = dbPackages.find(p => String(p.id) === String(id));
    if (found) {
      const nameLower = found.name.toLowerCase();
      if (nameLower.includes('app') || nameLower.includes('mobile')) {
        setServiceType('Mobile App');
      } else {
        setServiceType('Website');
      }
      setWorkDescription(found.description || '');
      setTotal(parseFloat(found.price) || 0);
    }
  };

  const handleServiceChange = (type) => {
    setServiceType(type);
    if (type !== 'Website') {
      setBusinessProfile('');
      setMainGoal('');
      setFeatures([]);
      setDesignLevel('');
    }
  };

  // 2. Budget/Price State
  const [total, setTotal] = useState(0);

  const handleSaveQuotation = async () => {
    if (!customerName) {
      showAlert("Customer Name is required", "error");
      return;
    }
    if (total <= 0) {
      showAlert("Please enter a valid quotation price", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        service_type: serviceType,
        work_description: workDescription,
        business_profile: serviceType === 'Website' ? businessProfile : '',
        main_goal: serviceType === 'Website' ? mainGoal : '',
        features: serviceType === 'Website' ? features : [],
        design_level: serviceType === 'Website' ? designLevel : '',
        items: [{ description: 'Project Development', quantity: 1, price: parseFloat(total) || 0 }],
        total: parseFloat(total) || 0,
        status: 'Draft'
      };

      await axios.post('http://localhost:5000/api/quotations', payload);
      showAlert("Quotation saved successfully!");
      if (onBack) {
        setTimeout(() => onBack(), 1000);
      }
    } catch (error) {
      console.error("Error saving quotation:", error);
      showAlert("Failed to save quotation", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-white max-w-4xl mx-auto mt-10 space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold">Create New Quotation</h2>
          <p className="text-xs text-slate-400">Enter customer details and add line items</p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg text-xs transition-colors"
          >
            ← Back to List
          </button>
        )}
      </div>

      {/* Alert Component */}
      {alert && (
        <div className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
          alert.type === 'error' 
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-450' 
            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-450'
        }`}>
          <span>{alert.message}</span>
          <button onClick={() => setAlert(null)} className="opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Customer Selector Preset */}
      <div className="space-y-2">
        <label className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Select Existing Customer (Preset)</label>
        <select
          value={selectedCustomerId}
          onChange={(e) => handleCustomerSelect(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:border-indigo-500 outline-none"
        >
          <option value="">-- Choose Customer (or fill manually below) --</option>
          {dbCustomers.map(c => (
            <option key={c.CusID || c.Cusid} value={c.CusID || c.Cusid}>
              {c.CusName || c.Cusname} ({c.CusEmail || c.Cusemail})
            </option>
          ))}
        </select>
      </div>

      {/* Package Selector Preset */}
      <div className="space-y-2">
        <label className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Select Technology Package (Preset)</label>
        <select
          value={selectedPackageId}
          onChange={(e) => handlePackageSelect(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:border-indigo-500 outline-none"
        >
          <option value="">-- Choose Technology Package (Presets line items) --</option>
          {dbPackages.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} - ${parseFloat(p.price).toFixed(2)}
            </option>
          ))}
        </select>
      </div>

      {/* Customer Info Form Fields */}
      <div className="space-y-3 pt-3 border-t border-slate-800">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Customer Information</h3>
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-white focus:border-indigo-500 outline-none"
        />
        <input
          type="email"
          placeholder="Customer Email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-white focus:border-indigo-500 outline-none"
        />
        <input
          type="text"
          placeholder="Customer Phone"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-white focus:border-indigo-500 outline-none"
        />
      </div>

      {/* 2. Customer Needs & Work Description */}
      <div className="space-y-3 pt-3 border-t border-slate-800">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Project Requirements</h3>
        
        <div>
          <label className="text-xs text-slate-400 block mb-2 font-medium">Service Needed</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleServiceChange('Mobile App')}
              className={`p-3 rounded-lg text-sm font-semibold border flex items-center justify-center gap-2 transition-all ${
                serviceType === 'Mobile App'
                  ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Mobile App
            </button>
            <button
              type="button"
              onClick={() => handleServiceChange('Website')}
              className={`p-3 rounded-lg text-sm font-semibold border flex items-center justify-center gap-2 transition-all ${
                serviceType === 'Website'
                  ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Website
            </button>
          </div>
        </div>

        {serviceType === 'Website' && (
          <div className="space-y-6 pt-3 border-t border-slate-800/50">
            {/* Step 2: Select your business profile */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">2</span>
                <label className="text-sm font-bold text-white block">Select your business profile</label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {profiles.map((profile) => (
                  <button
                    key={profile.name}
                    type="button"
                    onClick={() => handleProfileSelect(profile.name)}
                    className={`p-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2.5 transition-all ${
                      businessProfile === profile.name
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    <span className="text-base">{profile.icon}</span>
                    <span>{profile.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: What is your main goal? */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">3</span>
                <label className="text-sm font-bold text-white block">What is your main goal?</label>
              </div>
              <div className="flex flex-wrap gap-2">
                {goals.map((goal) => (
                  <button
                    key={goal.name}
                    type="button"
                    onClick={() => handleGoalSelect(goal.name)}
                    className={`px-4 py-2.5 rounded-full text-xs font-semibold border flex items-center justify-center gap-2.5 transition-all ${
                      mainGoal === goal.name
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    <span>{goal.icon}</span>
                    <span>{goal.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Which features do you need? */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">4</span>
                <label className="text-sm font-bold text-white block">Which features do you need?</label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {featuresList.map((feature) => {
                  const isChecked = features.includes(feature.name);
                  return (
                    <button
                      key={feature.name}
                      type="button"
                      onClick={() => handleFeatureToggle(feature.name)}
                      className={`p-3 rounded-xl text-xs font-semibold border flex items-center gap-3.5 transition-all text-left ${
                        isChecked
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isChecked
                          ? 'border-indigo-400 bg-indigo-500/40'
                          : 'border-slate-700 bg-slate-900/60'
                      }`}>
                        {isChecked && (
                          <span className="w-2.5 h-2.5 rounded-full bg-white block" />
                        )}
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{feature.icon}</span>
                        <span>{feature.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 5: How advanced should the design be? */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">5</span>
                <label className="text-sm font-bold text-white block">How advanced should the design be?</label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {designLevels.map((level) => (
                  <button
                    key={level.name}
                    type="button"
                    onClick={() => handleDesignLevelSelect(level.name)}
                    className={`p-4 rounded-xl text-xs font-semibold border flex flex-col items-center justify-center gap-2 transition-all ${
                      designLevel === level.name
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    <span className="text-2xl">{level.icon}</span>
                    <span className="text-xs font-bold block text-center mt-1">{level.name}</span>
                    <span className="text-[10px] text-slate-400 text-center font-normal mt-0.5 leading-relaxed">{level.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="text-xs text-slate-400 block mb-2 font-medium">Work Description</label>
          <textarea
            placeholder="Describe the work/project details..."
            value={workDescription}
            onChange={(e) => setWorkDescription(e.target.value)}
            rows="3"
            className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-white focus:border-indigo-500 outline-none resize-none"
          />
        </div>
      </div>

      {/* Quotation Price / Budget Field */}
      <div className="space-y-2 pt-3 border-t border-slate-800">
        <label className="text-xs text-slate-450 block font-semibold uppercase tracking-wider">3. Quotation Price ($)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Enter total quote amount (e.g. 3500)"
          value={total || ''}
          onChange={(e) => setTotal(parseFloat(e.target.value) || 0)}
          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-white focus:border-indigo-500 outline-none"
        />
      </div>

      {/* Summary Footer */}
      <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
        <div className="flex-1 min-w-0 pr-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase block">Active Summary</span>
          <span className="text-xs text-slate-300 block truncate">
            {customerName ? `${customerName} (${customerEmail || 'no email'})` : 'No Customer Entered'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1 truncate">
            <span className="font-semibold text-indigo-400 text-xs">
              {serviceType}
              {serviceType === 'Website' ? (
                <>
                  {' '}
                  ({[
                    businessProfile, 
                    mainGoal, 
                    features.length > 0 ? `${features.length} features` : null, 
                    designLevel
                  ].filter(Boolean).join(' | ')})
                </>
              ) : null}
            </span>
            {workDescription ? ` - ${workDescription}` : ''}
          </span>
        </div>
        <div className="text-right">
          <span className="text-slate-400 mr-2 text-xs font-bold uppercase">Grand Total:</span>
          <span className="text-lg font-bold text-indigo-400">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2 border-t border-slate-800 flex justify-end">
        <button
          onClick={handleSaveQuotation}
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center gap-2"
        >
          {saving ? 'Saving...' : 'Save Quotation'}
        </button>
      </div>

    </div>
  );
}

export default Quotation;
