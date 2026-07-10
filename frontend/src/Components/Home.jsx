import React, { useState, useEffect } from 'react';
import axios from 'axios';

const STATIC_RECENT_QUOTES = [
  { id: 104, customer_name: 'Acme Corporation', service_type: 'E-commerce Suite', total: 3500.00, status: 'Approved', created_at: '2026-07-08T12:00:00Z' },
  { id: 103, customer_name: 'Wayne Enterprises', service_type: 'AI & Chatbot Support', total: 2500.00, status: 'Pending', created_at: '2026-07-07T14:30:00Z' },
  { id: 102, customer_name: 'Stark Industries', service_type: 'Custom Mobile App', total: 5000.00, status: 'Draft', created_at: '2026-07-06T09:15:00Z' },
  { id: 101, customer_name: 'Umbrella Corporation', service_type: 'Basic Website', total: 1500.00, status: 'Approved', created_at: '2026-07-05T16:45:00Z' }
];

const STATIC_RECENT_CUSTOMERS = [
  { Cusid: 1, Cusname: 'Bruce Wayne', Cusemail: 'bruce@waynecorp.com', business_profile: 'Defense and Technology' },
  { Cusid: 2, Cusname: 'Tony Stark', Cusemail: 'tony@stark.com', business_profile: 'Clean Energy & Robotics' },
  { Cusid: 3, Cusname: 'Selina Kyle', Cusemail: 'selina@cat.org', business_profile: 'Security consulting' },
  { Cusid: 4, Cusname: 'Clark Kent', Cusemail: 'clark@dailyplanet.com', business_profile: 'Journalism / News Media' }
];

function Home({ setCurrentTab }) {
  // States for interactive SVG charts
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [activeDonut, setActiveDonut] = useState(null);

  // Stats loaded from database or static fallbacks
  const [stats, setStats] = useState({
    quotationsCount: 128,
    quotationsTotal: 142500,
    customersCount: 64,
    packagesCount: 4,
    recentQuotations: STATIC_RECENT_QUOTES,
    recentCustomers: STATIC_RECENT_CUSTOMERS
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [quotesRes, custsRes, pkgsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/quotations').catch(() => null),
          axios.get('http://localhost:5000/api/users').catch(() => null),
          axios.get('http://localhost:5000/api/packages').catch(() => null)
        ]);

        let qCount = 128;
        let qTotal = 142500;
        let cCount = 64;
        let pCount = 4;
        let qList = STATIC_RECENT_QUOTES;
        let cList = STATIC_RECENT_CUSTOMERS;

        if (quotesRes && quotesRes.data && quotesRes.data.length > 0) {
          qCount = quotesRes.data.length;
          qTotal = quotesRes.data.reduce((sum, q) => sum + (parseFloat(q.total) || 0), 0);
          qList = quotesRes.data.slice(0, 4);
        }

        if (custsRes && custsRes.data && custsRes.data.length > 0) {
          cCount = custsRes.data.length;
          cList = custsRes.data.slice(0, 4);
        }

        if (pkgsRes && pkgsRes.data && pkgsRes.data.length > 0) {
          pCount = pkgsRes.data.length;
        }

        setStats({
          quotationsCount: qCount,
          quotationsTotal: qTotal,
          customersCount: cCount,
          packagesCount: pCount,
          recentQuotations: qList,
          recentCustomers: cList
        });
      } catch (err) {
        console.warn("Could not load backend stats, using mock/static data:", err);
      }
    };
    fetchStats();
  }, []);

  // Trend data for SVG area chart (Revenue over last 6 months)
  const trendData = [
    { month: 'Jan', value: 12500, quotes: 8, x: 50, y: 173 },
    { month: 'Feb', value: 21000, quotes: 14, x: 150, y: 153 },
    { month: 'Mar', value: 35000, quotes: 21, x: 250, y: 123 },
    { month: 'Apr', value: 29500, quotes: 18, x: 350, y: 135 },
    { month: 'May', value: 52000, quotes: 31, x: 450, y: 86 },
    { month: 'Jun', value: 78000, quotes: 44, x: 550, y: 29 }
  ];

  // Donut chart segment data (Breakdown of packages distribution)
  const donutSegments = [
    { label: 'AI & Chatbot', value: 35, percentage: '35%', amount: '$49,875', rawColor: '#34d399', size: 76.97, offset: 0, textClass: 'text-emerald-400', bgClass: 'bg-emerald-500/10' },
    { label: 'E-commerce', value: 25, percentage: '25%', amount: '$35,625', rawColor: '#818cf8', size: 54.98, offset: -76.97, textClass: 'text-indigo-400', bgClass: 'bg-indigo-500/10' },
    { label: 'Mobile Apps', value: 25, percentage: '25%', amount: '$35,625', rawColor: '#a78bfa', size: 54.98, offset: -131.95, textClass: 'text-violet-400', bgClass: 'bg-violet-500/10' },
    { label: 'Basic Web', value: 15, percentage: '15%', amount: '$21,375', rawColor: '#60a5fa', size: 32.99, offset: -186.93, textClass: 'text-blue-400', bgClass: 'bg-blue-500/10' }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-blue-900/40 via-indigo-900/35 to-violet-900/30 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md overflow-hidden shadow-2xl transition-all duration-300">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">yanol tech</span>
            </h1>
            <p className="text-slate-400 sm:text-md mt-2 max-w-xl font-medium">
              Welcome to our Technology Development Company dashboard.
              We design and develop modern web applications, mobile apps, enterprise software, and digital solutions.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('quotation')}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.02] text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all duration-200"
          >
            Create New Quotation
          </button>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none -z-10" />
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Total Quotations</span>
              <h3 className="text-3xl font-bold text-white">{stats.quotationsCount}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 group-hover:bg-blue-500/25 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">+14.2%</span>
            <span className="text-slate-400">vs last month</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none -z-10" />
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Estimated Value</span>
              <h3 className="text-3xl font-bold text-white">
                ${stats.quotationsTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </h3>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 group-hover:bg-indigo-500/25 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">+20.8%</span>
            <span className="text-slate-400">vs last month</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-violet-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-xl pointer-events-none -z-10" />
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Active Clients</span>
              <h3 className="text-3xl font-bold text-white">{stats.customersCount}</h3>
            </div>
            <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl border border-violet-500/20 group-hover:bg-violet-500/25 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">+8 new</span>
            <span className="text-slate-400">registered this week</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none -z-10" />
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Service Packages</span>
              <h3 className="text-3xl font-bold text-white">{stats.packagesCount}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 group-hover:bg-emerald-500/25 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">100%</span>
            <span className="text-slate-400">packages fully operational</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Trend Line Chart */}
        <div className="lg:col-span-2 bg-slate-900/30 border border-slate-800 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between relative shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Revenue Growth Trend</h2>
              <p className="text-xs text-slate-400">Development and service quotations value (Jan - Jun)</p>
            </div>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-lg">
              Interactive SVG Graph
            </span>
          </div>

          <div className="relative h-60 w-full">
            {/* SVG Chart */}
            <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="chart-line-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="50" y1="200" x2="550" y2="200" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="50" y1="150" x2="550" y2="150" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="50" y1="100" x2="550" y2="100" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="50" y1="50" x2="550" y2="50" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

              {/* Left Axes Values */}
              <text x="40" y="204" textAnchor="end" className="fill-slate-500 text-[10px] font-semibold">$0</text>
              <text x="40" y="154" textAnchor="end" className="fill-slate-500 text-[10px] font-semibold">$20k</text>
              <text x="40" y="104" textAnchor="end" className="fill-slate-500 text-[10px] font-semibold">$45k</text>
              <text x="40" y="54" textAnchor="end" className="fill-slate-500 text-[10px] font-semibold">$75k</text>

              {/* Fill Area path */}
              <path
                d="M 50 173 L 150 154 L 250 123 L 350 135 L 450 86 L 550 29 L 550 200 L 50 200 Z"
                fill="url(#chart-area-grad)"
              />

              {/* Stroke Line */}
              <path
                d="M 50 173 L 150 154 L 250 123 L 350 135 L 450 86 L 550 29"
                fill="none"
                stroke="url(#chart-line-grad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Circles & Hover Triggers */}
              {trendData.map((d, i) => (
                <g key={i} className="group/dot">
                  {/* Invisible larger hover target circle */}
                  <circle
                    cx={d.x}
                    cy={d.y}
                    r="16"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Visual dot */}
                  <circle
                    cx={d.x}
                    cy={d.y}
                    r={hoveredPoint === i ? "7" : "4.5"}
                    className="fill-indigo-500 stroke-white stroke-2 pointer-events-none transition-all duration-200"
                  />
                </g>
              ))}

              {/* X Axis Labels */}
              {trendData.map((d, i) => (
                <text
                  key={i}
                  x={d.x}
                  y="222"
                  textAnchor="middle"
                  className={`font-bold text-[11px] transition-colors duration-150 ${
                    hoveredPoint === i ? 'fill-indigo-400' : 'fill-slate-400'
                  }`}
                >
                  {d.month}
                </text>
              ))}
            </svg>

            {/* Custom Tooltip Overlay */}
            {hoveredPoint !== null && (
              <div
                className="absolute bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3 shadow-xl backdrop-blur-md text-xs pointer-events-none transition-all duration-200 z-10"
                style={{
                  left: `${(trendData[hoveredPoint].x / 600) * 100}%`,
                  top: `${(trendData[hoveredPoint].y / 240) * 100 - 15}%`,
                  transform: 'translate(-50%, -100%)'
                }}
              >
                <div className="font-semibold text-slate-300">{trendData[hoveredPoint].month} Revenue</div>
                <div className="text-white font-extrabold text-sm my-0.5">
                  ${trendData[hoveredPoint].value.toLocaleString()}
                </div>
                <div className="text-indigo-400 text-[10px] font-medium">
                  {trendData[hoveredPoint].quotes} Active Quotes
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Donut Chart: Service Packages breakdown */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between shadow-xl">
          <div>
            <h2 className="text-xl font-bold text-white">Popularity Breakdown</h2>
            <p className="text-xs text-slate-400">Market share by service packages</p>
          </div>

          <div className="relative flex justify-center items-center my-4 h-40">
            {/* SVG Donut */}
            <svg className="w-36 h-36" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="grad-0" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="grad-1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
                <linearGradient id="grad-2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
                <linearGradient id="grad-3" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>

              {/* Background circular track */}
              <circle cx="50" cy="50" r="35" fill="transparent" stroke="#1e293b" strokeWidth="6" />

              {/* Segments */}
              {donutSegments.map((seg, i) => (
                <circle
                  key={i}
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke={`url(#grad-${i})`}
                  strokeWidth={activeDonut === i ? 9 : 7.2}
                  strokeDasharray={`${seg.size} 219.91`}
                  strokeDashoffset={seg.offset}
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-200 cursor-pointer origin-center"
                  onMouseEnter={() => setActiveDonut(i)}
                  onMouseLeave={() => setActiveDonut(null)}
                />
              ))}

              {/* Centered Texts inside Donut hole */}
              <text x="50" y="47" textAnchor="middle" dominantBaseline="middle" className="fill-slate-400 text-[6.5px] font-bold tracking-wider uppercase">
                {activeDonut !== null ? donutSegments[activeDonut].label : 'Total Value'}
              </text>
              <text x="50" y="58" textAnchor="middle" dominantBaseline="middle" className="fill-white text-[9.5px] font-extrabold">
                {activeDonut !== null ? donutSegments[activeDonut].amount : '$142,500'}
              </text>
            </svg>
          </div>

          {/* Custom Mini-Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {donutSegments.map((seg, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 p-1.5 rounded-xl border border-transparent transition-all duration-200 cursor-pointer ${
                  activeDonut === i ? 'bg-slate-800/60 border-slate-700' : 'hover:bg-slate-850/30'
                }`}
                onMouseEnter={() => setActiveDonut(i)}
                onMouseLeave={() => setActiveDonut(null)}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.rawColor }} />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-slate-400 font-bold block leading-none">{seg.label}</span>
                  <span className="text-[11px] text-white font-extrabold">{seg.percentage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Recent Activity & Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Quotation Table */}
        <div className="lg:col-span-2 bg-slate-900/30 border border-slate-800 rounded-3xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-xl font-bold text-white">Recent Quotations</h2>
                <p className="text-xs text-slate-400">Monitor status and total pricing of the latest quotes</p>
              </div>
              <button
                onClick={() => setCurrentTab('quotation-management')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 group transition-colors"
              >
                View All
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-3 pr-2">ID</th>
                    <th className="pb-3 pr-2">Customer</th>
                    <th className="pb-3 pr-2">Service Package</th>
                    <th className="pb-3 pr-2">Amount</th>
                    <th className="pb-3 pr-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {stats.recentQuotations.map((q) => (
                    <tr key={q.id} className="group hover:bg-slate-800/25 transition-colors">
                      <td className="py-3 text-slate-400 font-semibold">#{q.id}</td>
                      <td className="py-3 pr-2 font-bold text-white">{q.customer_name}</td>
                      <td className="py-3 pr-2 text-slate-300">{q.service_type || 'Custom Design'}</td>
                      <td className="py-3 pr-2 font-semibold text-indigo-300">
                        ${(parseFloat(q.total) || 0).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          q.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          q.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}>
                          {q.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Customers and quick shortcuts */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-xl font-bold text-white">Recent Clients</h2>
                <p className="text-xs text-slate-400">Newly registered customers & profiles</p>
              </div>
              <button
                onClick={() => setCurrentTab('customer-management')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 group transition-colors"
              >
                Manage
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {stats.recentCustomers.map((c) => (
                <div key={c.Cusid || c.CusID} className="flex items-center gap-3 p-2 bg-slate-900/30 hover:bg-slate-800/40 border border-slate-800/40 hover:border-slate-800 rounded-xl transition-all duration-200">
                  <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-extrabold text-xs text-indigo-400">
                    {(c.Cusname || c.CusName || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate leading-none mb-1">{c.Cusname || c.CusName}</h4>
                    <p className="text-[10px] text-slate-400 truncate leading-none">{c.Cusemail || c.CusEmail}</p>
                    {c.business_profile && (
                      <span className="inline-block text-[9px] text-slate-500 font-semibold bg-slate-950/40 border border-slate-900 px-1.5 py-0.2 mt-1 rounded">
                        {c.business_profile}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;