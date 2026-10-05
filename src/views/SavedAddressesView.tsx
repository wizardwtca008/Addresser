import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  PlusCircle,
  Printer,
  Download,
  Copy,
  Trash2,
  Edit3,
  MapPin,
  Phone,
  Building2,
  Clock,
  CheckSquare,
  Square,
  FileCheck2,
  Calendar,
} from 'lucide-react';
import { Company, CourierAddress } from '../types';

interface SavedAddressesViewProps {
  addresses: CourierAddress[];
  companies: Company[];
  onUseAddress: (address: CourierAddress) => void;
  onEditAddress: (address: CourierAddress) => void;
  onDuplicateAddress: (addressId: string) => void;
  onDeleteAddress: (addressId: string) => void;
  onQuickPrint: (address: CourierAddress) => void;
  onQuickPdf: (address: CourierAddress) => void;
  onNavigateToCreate: () => void;
}

export const SavedAddressesView: React.FC<SavedAddressesViewProps> = ({
  addresses,
  companies,
  onUseAddress,
  onEditAddress,
  onDuplicateAddress,
  onDeleteAddress,
  onQuickPrint,
  onQuickPdf,
  onNavigateToCreate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('ALL');
  const [selectedState, setSelectedState] = useState('ALL');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'center_code'>('recent');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Unique states for filter
  const stateOptions = useMemo(() => {
    const states = new Set<string>();
    addresses.forEach((a) => {
      if (a.state) states.add(a.state);
    });
    return Array.from(states).sort();
  }, [addresses]);

  // Filtered and sorted addresses
  const filteredAddresses = useMemo(() => {
    return addresses
      .filter((addr) => {
        // Company filter
        if (selectedCompanyId !== 'ALL' && addr.company_id !== selectedCompanyId) {
          return false;
        }

        // State filter
        if (selectedState !== 'ALL' && addr.state !== selectedState) {
          return false;
        }

        // Search match (Receiver, Center Code, Mobile, Org, City, PIN)
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchName = addr.receiver_name.toLowerCase().includes(query);
          const matchCode = addr.center_code && addr.center_code.toLowerCase().includes(query);
          const matchMobile = addr.mobile.includes(query) || (addr.alternate_mobile && addr.alternate_mobile.includes(query));
          const matchOrg = addr.organization && addr.organization.toLowerCase().includes(query);
          const matchCity = addr.city.toLowerCase().includes(query);
          const matchPin = addr.pincode.includes(query);

          return matchName || matchCode || matchMobile || matchOrg || matchCity || matchPin;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.receiver_name.localeCompare(b.receiver_name);
        }
        if (sortBy === 'center_code') {
          return (a.center_code || '').localeCompare(b.center_code || '');
        }
        // default: recent (last_used_at or updated_at)
        const dateA = new Date(a.last_used_at || a.updated_at).getTime();
        const dateB = new Date(b.last_used_at || b.updated_at).getTime();
        return dateB - dateA;
      });
  }, [addresses, selectedCompanyId, selectedState, searchTerm, sortBy]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAddresses.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAddresses.map((a) => a.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-5">
      {/* Header and CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Saved Addresses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Address book for quick repeated dispatches without re-typing.
          </p>
        </div>

        <button
          onClick={onNavigateToCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm transition cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Create New Address</span>
        </button>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Receiver Name, Center Code (e.g. WTCA001), Mobile, City, PIN..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* Company Filter Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
            >
              <option value="ALL">All Companies (Senders)</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.short_name})
                </option>
              ))}
            </select>
          </div>

          {/* State Filter Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
            >
              <option value="ALL">All States</option>
              {stateOptions.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sub-toolbar: Sort By, View toggle, Count */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">
              Showing {filteredAddresses.length} of {addresses.length} addresses
            </span>
            {selectedIds.length > 0 && (
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                {selectedIds.length} Selected
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 cursor-pointer font-medium"
              >
                <option value="recent">Recently Used</option>
                <option value="name">Receiver Name (A-Z)</option>
                <option value="center_code">Center Code</option>
              </select>
            </div>

            <div className="flex items-center border border-slate-200 rounded overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                  viewMode === 'table' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                  viewMode === 'cards' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Cards
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredAddresses.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              {searchTerm || selectedCompanyId !== 'ALL' || selectedState !== 'ALL'
                ? 'No matching addresses found'
                : 'No saved addresses yet.'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              {searchTerm || selectedCompanyId !== 'ALL' || selectedState !== 'ALL'
                ? 'Try adjusting your search criteria or resetting filters.'
                : 'Create and save your first recipient address to speed up your daily courier dispatches.'}
            </p>
          </div>
          <button
            onClick={onNavigateToCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-lg transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Your First Address</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3 w-8 text-center">
                    <button onClick={toggleSelectAll} className="text-slate-500 hover:text-slate-900">
                      {selectedIds.length === filteredAddresses.length ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-3">Receiver</th>
                  <th className="py-3 px-3">Center Code</th>
                  <th className="py-3 px-3">Organization</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Mobile</th>
                  <th className="py-3 px-3">Company</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAddresses.map((addr) => {
                  const comp = companies.find((c) => c.id === addr.company_id);
                  const isSelected = selectedIds.includes(addr.id);

                  return (
                    <tr
                      key={addr.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isSelected ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => toggleSelectOne(addr.id)}
                          className="text-slate-400 hover:text-slate-800"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Receiver */}
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        <div>{addr.receiver_name}</div>
                        {addr.designation && (
                          <div className="text-[11px] text-slate-500 font-normal">
                            {addr.designation}
                          </div>
                        )}
                      </td>

                      {/* Center Code */}
                      <td className="py-3 px-3">
                        {addr.center_code ? (
                          <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                            {addr.center_code}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-xs">—</span>
                        )}
                      </td>

                      {/* Organization */}
                      <td className="py-3 px-3 text-slate-700">
                        {addr.organization || <span className="text-slate-400 italic text-xs">—</span>}
                      </td>

                      {/* Location */}
                      <td className="py-3 px-3 text-slate-600">
                        <div className="font-medium text-slate-800">{addr.city}</div>
                        <div className="text-[11px] text-slate-500">
                          {addr.state} {addr.pincode && `• ${addr.pincode}`}
                        </div>
                      </td>

                      {/* Mobile */}
                      <td className="py-3 px-3 font-mono font-medium text-slate-900">
                        {addr.mobile}
                      </td>

                      {/* Company (Sender) */}
                      <td className="py-3 px-3">
                        {comp ? (
                          <span className="inline-block text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                            {comp.short_name}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-xs">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Use Button - Loads immediately into form */}
                          <button
                            onClick={() => onUseAddress(addr)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded transition cursor-pointer"
                            title="Load in Create Address"
                          >
                            Use
                          </button>

                          {/* Quick Print */}
                          <button
                            onClick={() => onQuickPrint(addr)}
                            className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded transition cursor-pointer"
                            title="Quick Print A4"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick PDF */}
                          <button
                            onClick={() => onQuickPdf(addr)}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded transition cursor-pointer"
                            title="Download PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => onEditAddress(addr)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded transition cursor-pointer"
                            title="Edit Address"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Duplicate */}
                          <button
                            onClick={() => onDuplicateAddress(addr.id)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded transition cursor-pointer"
                            title="Duplicate Record"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => onDeleteAddress(addr.id)}
                            className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAddresses.map((addr) => {
            const comp = companies.find((c) => c.id === addr.company_id);

            return (
              <div
                key={addr.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <div className="font-black text-slate-900 text-base">{addr.receiver_name}</div>
                      {addr.organization && (
                        <div className="text-xs font-semibold text-slate-600">{addr.organization}</div>
                      )}
                    </div>
                    {addr.center_code && (
                      <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded shrink-0">
                        {addr.center_code}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 mt-3 space-y-1">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>
                        {[addr.address_line_1, addr.address_line_2, addr.city, addr.state, addr.pincode]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800">{addr.mobile}</span>
                      {addr.alternate_mobile && (
                        <span className="text-slate-500">/ {addr.alternate_mobile}</span>
                      )}
                    </div>

                    {comp && (
                      <div className="flex items-center gap-1.5 pt-1 text-[11px] text-blue-700">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Sender: {comp.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onUseAddress(addr)}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded transition text-center cursor-pointer"
                  >
                    Use
                  </button>
                  <button
                    onClick={() => onQuickPrint(addr)}
                    className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded transition cursor-pointer"
                    title="Print"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onQuickPdf(addr)}
                    className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded transition cursor-pointer"
                    title="PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDuplicateAddress(addr.id)}
                    className="p-1.5 hover:bg-slate-100 text-slate-600 rounded transition cursor-pointer"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteAddress(addr.id)}
                    className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
