import React, { useState } from 'react';
import {
  PlusCircle,
  Building2,
  BookmarkCheck,
  Printer,
  Download,
  ArrowRight,
  Clock,
  MapPin,
  Phone,
  Search,
  CheckCircle2,
  Sparkles,
  FileText,
} from 'lucide-react';
import { Company, CourierAddress, PrintLog, AppSettings } from '../types';

interface DashboardViewProps {
  companies: Company[];
  addresses: CourierAddress[];
  printLogs: PrintLog[];
  settings: AppSettings;
  onNavigate: (view: string) => void;
  onUseAddress: (address: CourierAddress) => void;
  onQuickPrint: (address: CourierAddress) => void;
  onQuickPdf: (address: CourierAddress) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  companies,
  addresses,
  printLogs,
  settings,
  onNavigate,
  onUseAddress,
  onQuickPrint,
  onQuickPdf,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate Recently Used Addresses (sorted by last_used_at or updated_at)
  const recentlyUsed = [...addresses]
    .filter((a) => a.last_used_at || a.updated_at)
    .sort((a, b) => {
      const dateA = new Date(a.last_used_at || a.updated_at).getTime();
      const dateB = new Date(b.last_used_at || b.updated_at).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  // Search filter
  const filteredAddresses = searchTerm.trim()
    ? addresses.filter((a) => {
        const query = searchTerm.toLowerCase();
        return (
          a.receiver_name.toLowerCase().includes(query) ||
          (a.center_code && a.center_code.toLowerCase().includes(query)) ||
          a.mobile.includes(query) ||
          a.city.toLowerCase().includes(query) ||
          a.pincode.includes(query) ||
          (a.organization && a.organization.toLowerCase().includes(query))
        );
      })
    : [];

  const activeCompanies = companies.filter((c) => c.status === 'active');

  return (
    <div className="space-y-6">
      {/* HERO BANNER & MAIN CTA */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero-Typing Courier Dispatch System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Courier Address Manager
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Generate standard corporate A4 half-page labels for all company dispatches. Select sender, pick receiver, print or download PDF in seconds.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('create-address')}
              className="flex items-center gap-2.5 px-5 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              <span>+ Create New Courier Address</span>
            </button>
            <button
              onClick={() => onNavigate('saved-addresses')}
              className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white font-semibold text-sm rounded-xl border border-slate-700 transition cursor-pointer"
            >
              <BookmarkCheck className="w-4 h-4 text-emerald-400" />
              <span>Browse Saved Addresses ({addresses.length})</span>
            </button>
          </div>
        </div>

        {/* Decorative background grid pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden lg:flex items-center justify-center">
          <FileText className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Saved Addresses */}
        <div
          onClick={() => onNavigate('saved-addresses')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Ready to Dispatch
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{addresses.length}</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Total Saved Addresses</div>
          </div>
        </div>

        {/* Total Companies */}
        <div
          onClick={() => onNavigate('companies')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              {activeCompanies.length} Active
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{companies.length}</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Configured Companies</div>
          </div>
        </div>

        {/* Total Print & PDF Logs */}
        <div
          onClick={() => onNavigate('print-history')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition">
              <Printer className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              A4 Dispatches
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{printLogs.length}</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Total Labels Generated</div>
          </div>
        </div>
      </div>

      {/* QUICK SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Quick search by Receiver Name, Center Code (e.g. WTCA001), Mobile, or City..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>

        {/* If user is typing search in dashboard */}
        {searchTerm.trim() && (
          <div className="mt-3 border-t border-slate-100 pt-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Found {filteredAddresses.length} matching addresses:
            </div>
            {filteredAddresses.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No matching addresses found.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredAddresses.map((addr) => {
                  const comp = companies.find((c) => c.id === addr.company_id);
                  return (
                    <div
                      key={addr.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 transition"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{addr.receiver_name}</span>
                          {addr.center_code && (
                            <span className="text-[11px] font-mono font-bold bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded">
                              {addr.center_code}
                            </span>
                          )}
                          {comp && (
                            <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-medium">
                              {comp.short_name}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 truncate mt-0.5">
                          {[addr.address_line_1, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')} • Ph: {addr.mobile}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-3">
                        <button
                          onClick={() => onUseAddress(addr)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs font-semibold cursor-pointer"
                        >
                          Use
                        </button>
                        <button
                          onClick={() => onQuickPrint(addr)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold cursor-pointer"
                        >
                          Print
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* RECENTLY USED ADDRESSES (Requirement 18) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Recently Used Addresses</h2>
          </div>
          <button
            onClick={() => onNavigate('saved-addresses')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({addresses.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentlyUsed.length === 0 ? (
          <div className="p-8 text-center text-slate-500 space-y-2">
            <p className="text-sm">No recently used addresses yet.</p>
            <button
              onClick={() => onNavigate('create-address')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Create your first address
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentlyUsed.map((addr) => {
              const comp = companies.find((c) => c.id === addr.company_id);
              return (
                <div
                  key={addr.id}
                  className="p-4 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-black text-slate-950 text-sm sm:text-base">
                        {addr.receiver_name}
                      </span>
                      {addr.center_code && (
                        <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                          {addr.center_code}
                        </span>
                      )}
                      {comp && (
                        <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                          {comp.name}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {[addr.address_line_1, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {addr.mobile}
                      </span>
                    </div>
                  </div>

                  {/* 1-Click Fast Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onUseAddress(addr)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-semibold text-xs rounded-lg transition cursor-pointer"
                      title="Open in Create Address form"
                    >
                      Use
                    </button>
                    <button
                      onClick={() => onQuickPdf(addr)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-700 border border-emerald-300 font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1"
                      title="Download PDF directly"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                    <button
                      onClick={() => onQuickPrint(addr)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-extrabold text-xs rounded-lg shadow-sm transition cursor-pointer flex items-center gap-1"
                      title="Print A4 Label directly"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Again</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QUICK COMPANY PROFILES */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Configured Senders &amp; Companies
            </h3>
          </div>
          <button
            onClick={() => onNavigate('companies')}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Manage Companies
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {companies.map((comp) => (
            <div
              key={comp.id}
              className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-start gap-3"
            >
              {comp.logo ? (
                <div className="w-12 h-10 bg-white border border-slate-200 rounded p-1 flex items-center justify-center shrink-0">
                  <img src={comp.logo} alt={comp.name} className="max-h-full max-w-full object-contain" />
                </div>
              ) : (
                <div className="w-12 h-10 bg-blue-600 text-white font-black text-xs rounded flex items-center justify-center shrink-0">
                  {comp.short_name}
                </div>
              )}
              <div className="min-w-0 flex-1 text-xs">
                <div className="font-bold text-slate-900 truncate">{comp.name}</div>
                <div className="text-[11px] text-slate-500 truncate">{comp.tagline}</div>
                <div className="text-[11px] text-slate-600 mt-1 truncate">
                  {[comp.city, comp.state].filter(Boolean).join(', ')} • {comp.phone}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
