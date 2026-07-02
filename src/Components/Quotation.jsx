import React, { useState } from 'react';

function Quotation() {
  // 1. Customer Details State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // 2. Items List State (starts with one empty item row)
  const [items, setItems] = useState([
    { description: '', quantity: 1, price: 0 }
  ]);

  // 3. Function to Add a new row to the items array
  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }]);
  };

  // 4. Function to Update a field in a specific item row by its index
  const updateItem = (index, field, value) => {
    const updated = [...items];
    
    // Parse quantity and price as numbers, keep description as text
    updated[index][field] = field === 'description' ? value : parseFloat(value) || 0;
    
    setItems(updated);
  };

  // 5. Function to Remove a row from the items array
  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // 6. Calculate total on the fly
  const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-white max-w-xl mx-auto mt-10 space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold">Simple Quotation Form</h2>
        <p className="text-xs text-slate-400">Enter customer details and add line items</p>
      </div>

      {/* Customer Info Form Fields */}
      <div className="space-y-3">
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

      {/* Line Items List Form Fields */}
      <div className="space-y-3 pt-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Line Items</h3>
          <button
            onClick={addItem}
            className="px-2.5 py-1 bg-indigo-6.50 hover:bg-indigo-600 rounded text-xs font-semibold text-white transition-colors"
          >
            + Add Row
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              {/* Description Input */}
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 p-2 rounded-lg text-xs text-white outline-none"
              />
              
              {/* Quantity Input */}
              <input
                type="number"
                min="1"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                className="w-12 bg-slate-950 border border-slate-800 p-2 rounded-lg text-xs text-center text-white outline-none"
              />
              
              {/* Price Input */}
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Price"
                value={item.price || ''}
                onChange={(e) => updateItem(index, 'price', e.target.value)}
                className="w-20 bg-slate-950 border border-slate-800 p-2 rounded-lg text-xs text-right text-white outline-none"
              />
              
              {/* Delete Row Button */}
              <button
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
                className="text-rose-450 hover:text-rose-450 disabled:opacity-30 p-1 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase block">Active Summary</span>
          <span className="text-xs text-slate-300">
            {customerName ? `${customerName} (${customerEmail || 'no email'})` : 'No Customer Entered'}
          </span>
        </div>
        <div className="text-right">
          <span className="text-slate-400 mr-2 text-xs font-bold uppercase">Grand Total:</span>
          <span className="text-lg font-bold text-indigo-400">${total.toFixed(2)}</span>
        </div>
      </div>

    </div>
  );
}

export default Quotation;
