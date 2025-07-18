import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../../../components/layout';

const Reports = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        {/* Main content */}
        <div className="p-8">
          <div className="layout-content-container container mx-auto flex flex-1 flex-col">
            {/* Reports content */}
            <>
              {/* Title */}
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <p className="min-w-72 text-[32px] font-bold leading-tight tracking-light text-[#0e141b]">
                  Reports
                </p>
              </div>

              {/* Report Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                {/* Total Loans Card */}
                <div className="flex flex-col gap-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 p-6 shadow-md border border-slate-200 hover:shadow-lg transition">
                  <div className="flex items-center gap-3">
                    <svg className="text-blue-500" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" fill="currentColor"/>
                    </svg>
                    <p className="text-base font-medium leading-normal text-[#0e141b]">Total Loans</p>
                  </div>
                  <p className="text-2xl font-bold leading-tight tracking-light text-[#0e141b]">₹15,00,000</p>
                  <p className="text-sm text-[#4e7097]">Active loans: 45</p>
                </div>

                {/* Collection Rate Card */}
                <div className="flex flex-col gap-2 rounded-xl bg-gradient-to-br from-green-100 to-green-50 p-6 shadow-md border border-slate-200 hover:shadow-lg transition">
                  <div className="flex items-center gap-3">
                    <svg className="text-green-500" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l7.5 4.5-7.5 4.5z" fill="currentColor"/>
                    </svg>
                    <p className="text-base font-medium leading-normal text-[#0e141b]">Collection Rate</p>
                  </div>
                  <p className="text-2xl font-bold leading-tight tracking-light text-[#0e141b]">95%</p>
                  <p className="text-sm text-[#4e7097]">Last month: 92%</p>
                </div>

                {/* Outstanding Amount Card */}
                <div className="flex flex-col gap-2 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 p-6 shadow-md border border-slate-200 hover:shadow-lg transition">
                  <div className="flex items-center gap-3">
                    <svg className="text-purple-500" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" fill="currentColor"/>
                    </svg>
                    <p className="text-base font-medium leading-normal text-[#0e141b]">Outstanding Amount</p>
                  </div>
                  <p className="text-2xl font-bold leading-tight tracking-light text-[#0e141b]">₹5,25,000</p>
                  <p className="text-sm text-[#4e7097]">Due this month: ₹75,000</p>
                </div>
              </div>

              {/* Report Table */}
              <div className="px-4 py-3 @container">
                <div className="flex overflow-hidden rounded-lg border border-[#d0dbe7] bg-white">
                  <table className="flex-1">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-4 py-3 text-left text-[#0e141b] w-[200px] text-sm font-medium leading-normal">Report Type</th>
                        <th className="px-4 py-3 text-left text-[#0e141b] w-[200px] text-sm font-medium leading-normal">Period</th>
                        <th className="px-4 py-3 text-left text-[#0e141b] w-[200px] text-sm font-medium leading-normal">Status</th>
                        <th className="px-4 py-3 text-left text-[#0e141b] w-[200px] text-sm font-medium leading-normal">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-t-[#d0dbe7]">
                        <td className="h-[72px] px-4 py-2 text-[#4e7097] text-sm font-normal leading-normal">Monthly Collection</td>
                        <td className="h-[72px] px-4 py-2 text-[#4e7097] text-sm font-normal leading-normal">March 2024</td>
                        <td className="h-[72px] px-4 py-2">
                          <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700">Generated</span>
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#4e7097] text-sm font-bold leading-normal tracking-[0.015em]">Download</td>
                      </tr>
                      <tr className="border-t border-t-[#d0dbe7]">
                        <td className="h-[72px] px-4 py-2 text-[#4e7097] text-sm font-normal leading-normal">Loan Performance</td>
                        <td className="h-[72px] px-4 py-2 text-[#4e7097] text-sm font-normal leading-normal">Q1 2024</td>
                        <td className="h-[72px] px-4 py-2">
                          <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700">Pending</span>
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#4e7097] text-sm font-bold leading-normal tracking-[0.015em]">Generate</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 