import React, { useState } from 'react';
import { History, Printer, Download, Search, Trash2, Calendar, Clock, User, Building2 } from 'lucide-react';
import { PrintLog, CourierAddress } from '../types';

interface PrintHistoryViewProps {
  logs: PrintLog[];
  addresses: CourierAddress[];
  onPrintAgain: (log: PrintLog) => void;
  onClearHistory: () => void;
}

export const PrintHistoryView: React.FC<PrintHistoryViewProps> = ({
  logs,
  addresses,
  onPrintAgain,
  onClearHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<'ALL' | 'print' | 'pdf_download'>('ALL');

  const filteredLogs = logs.filter((log) => {
    if (actionFilter !== 'ALL' && log.action_type !== actionFilter) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchReceiver = log.receiver_name.toLowerCase().includes(q);
      const matchCenter = log.center_code && log.center_code.toLowerCase().includes(q);
      const matchCompany = log.company_name.toLowerCase().includes(q);
      return matchReceiver || matchCenter || matchCompany;
    }
    return true;
  });

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return {
        date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      };
    } catch {
      return { date: isoStr, time: '' };
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Print &amp; Dispatch History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Log of all printed labels and downloaded PDFs with 1-click reprint.
          </p>
        </div>

        {logs.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Clear all print and dispatch logs?')) {
                onClearHistory();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Filter toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Receiver, Center Code, Company..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-medium text-slate-600">Action:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-800 cursor-pointer font-medium"
          >
            <option value="ALL">All Actions</option>
            <option value="print">Printed Only</option>
            <option value="pdf_download">PDF Downloaded Only</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500 space-y-2">
          <History className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No print or dispatch history found.</p>
          <p className="text-xs text-slate-500">
            Whenever you print a label or download a PDF, an entry will be logged here for quick re-use.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date &amp; Time</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Receiver</th>
                  <th className="py-3 px-4">Center Code</th>
                  <th className="py-3 px-4">Sender Company</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => {
                  const { date, time } = formatDate(log.created_at);
                  const isPrint = log.action_type === 'print';

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 text-slate-600">
                        <div className="font-semibold text-slate-800">{date}</div>
                        <div className="text-[11px] text-slate-400">{time}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                            isPrint
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {isPrint ? <Printer className="w-3 h-3" /> : <Download className="w-3 h-3" />}
                          <span>{isPrint ? 'Printed' : 'PDF Export'}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-900">
                        {log.receiver_name}
                      </td>

                      <td className="py-3 px-4">
                        {log.center_code ? (
                          <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                            {log.center_code}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-xs">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {log.company_name}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onPrintAgain(log)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs rounded-lg transition cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Again</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
