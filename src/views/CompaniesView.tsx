import React, { useState } from 'react';
import {
  Building2,
  PlusCircle,
  Edit,
  Trash2,
  Power,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Company } from '../types';
import { CompanyModal } from '../components/CompanyModal';

interface CompaniesViewProps {
  companies: Company[];
  onSaveCompany: (company: Company) => void;
  onDeleteCompany: (companyId: string) => void;
  onToggleStatus: (company: Company) => void;
}

export const CompaniesView: React.FC<CompaniesViewProps> = ({
  companies,
  onSaveCompany,
  onDeleteCompany,
  onToggleStatus,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const handleOpenAdd = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (comp: Company) => {
    setEditingCompany(comp);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = (comp: Company) => {
    if (companies.length <= 1) {
      alert('You must have at least one sender company configured.');
      return;
    }
    if (confirm(`Are you sure you want to delete "${comp.name}"?`)) {
      onDeleteCompany(comp.id);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Companies / Senders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure sender entities, logos, default addresses, and contact info for instant label auto-load.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm transition cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add Company</span>
        </button>
      </div>

      {/* Companies List */}
      {companies.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No companies configured.</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Add your first company profile to enable automatic sender address loading on labels.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-lg transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Company</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {companies.map((comp) => {
            const isActive = comp.status === 'active';

            return (
              <div
                key={comp.id}
                className={`bg-white rounded-xl border ${
                  isActive ? 'border-slate-200' : 'border-slate-300 bg-slate-50/70'
                } shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition`}
              >
                <div className="p-5 space-y-4">
                  {/* Top: Logo and Status badge */}
                  <div className="flex items-start justify-between gap-3">
                    {comp.logo ? (
                      <div className="w-28 h-12 bg-slate-50 border border-slate-200 rounded p-1 flex items-center justify-center">
                        <img
                          src={comp.logo}
                          alt={comp.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-10 bg-blue-600 text-white font-black text-xs rounded flex items-center justify-center">
                        {comp.short_name}
                      </div>
                    )}

                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isActive ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      {isActive ? 'Active' : 'Paused'}
                    </span>
                  </div>

                  {/* Company Info */}
                  <div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-black text-slate-900 text-base leading-tight">
                        {comp.name}
                      </h3>
                      {comp.short_name && (
                        <span className="font-mono text-xs text-slate-500 font-bold">
                          ({comp.short_name})
                        </span>
                      )}
                    </div>
                    {comp.tagline && (
                      <p className="text-xs text-slate-500 mt-1 italic leading-tight">
                        {comp.tagline}
                      </p>
                    )}
                  </div>

                  {/* Contact & Address Details */}
                  <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>
                        {[comp.address_line_1, comp.address_line_2, comp.city, comp.state, comp.pincode]
                          .filter(Boolean)
                          .join(', ') || <span className="text-slate-400 italic">No default address</span>}
                      </span>
                    </div>

                    {comp.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-800">{comp.phone}</span>
                      </div>
                    )}

                    {comp.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-700 truncate">{comp.email}</span>
                      </div>
                    )}

                    {comp.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-blue-600 truncate">{comp.website}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="bg-slate-50 border-t border-slate-100 px-4 py-2.5 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onToggleStatus(comp)}
                    className={`font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      isActive ? 'text-amber-700 hover:text-amber-900' : 'text-emerald-700 hover:text-emerald-900'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{isActive ? 'Pause' : 'Activate'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(comp)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded transition cursor-pointer flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3 text-slate-500" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleConfirmDelete(comp)}
                      className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition cursor-pointer"
                      title="Delete Company"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSaveCompany}
        initialCompany={editingCompany}
      />
    </div>
  );
};
