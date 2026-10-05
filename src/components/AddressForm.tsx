import React, { useState, useEffect } from 'react';
import {
  Building2,
  User,
  MapPin,
  Phone,
  Mail,
  Hash,
  FileText,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { Company, CourierAddress } from '../types';

interface AddressFormProps {
  companies: Company[];
  selectedCompanyId: string;
  onSelectCompany: (companyId: string) => void;
  address: CourierAddress;
  onChange: (updated: CourierAddress) => void;
  onSave: () => void;
  onReset: () => void;
  hasDraft?: boolean;
  onRestoreDraft?: () => void;
  onDiscardDraft?: () => void;
  isSaving?: boolean;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  companies,
  selectedCompanyId,
  onSelectCompany,
  address,
  onChange,
  onSave,
  onReset,
  hasDraft = false,
  onRestoreDraft,
  onDiscardDraft,
  isSaving = false,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const currentCompany = companies.find((c) => c.id === selectedCompanyId) || companies[0];

  const handleFieldChange = (field: keyof CourierAddress, value: any) => {
    onChange({
      ...address,
      [field]: value,
    });

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleCustomSenderChange = (field: string, value: string) => {
    onChange({
      ...address,
      custom_sender: {
        ...(address.custom_sender || {}),
        [field]: value,
      },
    });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!address.receiver_name?.trim()) newErrors.receiver_name = 'Receiver Name is required';
    if (!address.mobile?.trim()) newErrors.mobile = 'Mobile Number is required';
    if (!address.address_line_1?.trim()) newErrors.address_line_1 = 'Address Line 1 is required';
    if (!address.city?.trim()) newErrors.city = 'City is required';
    if (!address.state?.trim()) newErrors.state = 'State is required';
    if (!address.pincode?.trim()) newErrors.pincode = 'PIN Code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave();
    }
  };

  return (
    <div id="form-column" className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6">
      {/* Draft Recovery Notification Banner */}
      {hasDraft && onRestoreDraft && onDiscardDraft && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm text-blue-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Unsaved draft found from earlier session. Restore previous draft?</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onRestoreDraft}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs transition cursor-pointer"
            >
              Restore
            </button>
            <button
              type="button"
              onClick={onDiscardDraft}
              className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-medium rounded text-xs transition cursor-pointer"
            >
              Start Fresh
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ==============================================
            SECTION A: COMPANY / SENDER
        ============================================== */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">SECTION A — COMPANY / SENDER</h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              Auto-Loaded
            </span>
          </div>

          <div className="space-y-4">
            {/* Select Company Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Select Company *
              </label>
              <select
                value={selectedCompanyId}
                onChange={(e) => onSelectCompany(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.short_name}) {c.status === 'inactive' ? '— [Paused]' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Loaded Company Card */}
            {currentCompany && (
              <div className="bg-white border border-slate-200 rounded-lg p-3.5 flex items-start gap-3.5">
                {currentCompany.logo ? (
                  <div className="w-16 h-12 flex items-center justify-center bg-slate-50 border border-slate-100 rounded p-1 shrink-0">
                    <img
                      src={currentCompany.logo}
                      alt={currentCompany.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-12 bg-blue-100 rounded flex items-center justify-center font-bold text-blue-700 text-sm shrink-0">
                    {currentCompany.short_name}
                  </div>
                )}
                <div className="min-w-0 flex-1 text-xs">
                  <div className="font-bold text-slate-900 text-sm truncate">{currentCompany.name}</div>
                  <div className="text-slate-500 truncate mt-0.5">{currentCompany.tagline}</div>
                  <div className="text-slate-600 mt-1">
                    {[
                      currentCompany.address_line_1,
                      currentCompany.city,
                      currentCompany.state,
                      currentCompany.pincode,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                  <div className="text-slate-500 mt-0.5 flex flex-wrap gap-x-3">
                    {currentCompany.phone && <span>Ph: {currentCompany.phone}</span>}
                    {currentCompany.email && <span>Email: {currentCompany.email}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Toggle: Use Default Company Address */}
            <div className="pt-1">
              <label className="flex items-center gap-2.5 text-sm text-slate-700 font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={address.use_default_sender !== false}
                  onChange={(e) => handleFieldChange('use_default_sender', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span>Use Default Company Address</span>
              </label>

              {/* If unchecked, allow manual sender editing */}
              {address.use_default_sender === false && (
                <div className="mt-3 p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-lg space-y-3 text-xs">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Custom Sender Address Override (This Dispatch Only)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      placeholder="Sender Company Name"
                      value={address.custom_sender?.company_name || ''}
                      onChange={(e) => handleCustomSenderChange('company_name', e.target.value)}
                      className="bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="Sender Phone"
                      value={address.custom_sender?.phone || ''}
                      onChange={(e) => handleCustomSenderChange('phone', e.target.value)}
                      className="bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="Sender Address Line 1"
                      value={address.custom_sender?.address_line_1 || ''}
                      onChange={(e) => handleCustomSenderChange('address_line_1', e.target.value)}
                      className="bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 sm:col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={address.custom_sender?.city || ''}
                      onChange={(e) => handleCustomSenderChange('city', e.target.value)}
                      className="bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="State & PIN"
                      value={address.custom_sender?.state || ''}
                      onChange={(e) => handleCustomSenderChange('state', e.target.value)}
                      className="bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ==============================================
            SECTION B: RECEIVER DETAILS
        ============================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">SECTION B — RECEIVER DETAILS</h2>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              * Indicates Required Field
            </span>
          </div>

          {/* Row 1: Receiver Name & Center Code */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            <div className="sm:col-span-7">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Receiver Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address.receiver_name}
                onChange={(e) => handleFieldChange('receiver_name', e.target.value)}
                placeholder="e.g. Rahul Kumar"
                className={`w-full bg-white border ${
                  errors.receiver_name ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                } rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold`}
              />
              {errors.receiver_name && (
                <p className="text-[11px] text-red-600 mt-1">{errors.receiver_name}</p>
              )}
            </div>

            {/* DEDICATED CENTER CODE FIELD (Requirement 5) */}
            <div className="sm:col-span-5">
              <label className="block text-xs font-bold text-indigo-900 mb-1 flex items-center justify-between">
                <span>Center Code</span>
                <span className="text-[10px] text-indigo-600 bg-indigo-50 font-semibold px-1.5 py-0.2 rounded border border-indigo-200">
                  Prominent
                </span>
              </label>
              <input
                type="text"
                value={address.center_code || ''}
                onChange={(e) => handleFieldChange('center_code', e.target.value)}
                placeholder="e.g. WTCA001"
                className="w-full bg-indigo-50/50 border border-indigo-300 rounded-lg px-3 py-2 text-sm text-indigo-950 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
              />
            </div>
          </div>

          {/* Row 2: Designation & Company/Institute */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Designation / Role <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={address.designation || ''}
                onChange={(e) => handleFieldChange('designation', e.target.value)}
                placeholder="e.g. Center Director / Coordinator"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Company / Institute Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={address.organization || ''}
                onChange={(e) => handleFieldChange('organization', e.target.value)}
                placeholder="e.g. WIZARD-TECH Computer Academy"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          {/* Row 3: Mobile & Alternate Mobile & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={address.mobile}
                onChange={(e) => handleFieldChange('mobile', e.target.value)}
                placeholder="e.g. 9876543210"
                className={`w-full bg-white border ${
                  errors.mobile ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                } rounded-lg px-3 py-2 text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.mobile && (
                <p className="text-[11px] text-red-600 mt-1">{errors.mobile}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Alternate Mobile <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="tel"
                value={address.alternate_mobile || ''}
                onChange={(e) => handleFieldChange('alternate_mobile', e.target.value)}
                placeholder="e.g. 9876500000"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email Address <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="email"
                value={address.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="e.g. center@gmail.com"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 4: Address Line 1 & Line 2 */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address.address_line_1}
                onChange={(e) => handleFieldChange('address_line_1', e.target.value)}
                placeholder="e.g. Main Road, Near XYZ Complex"
                className={`w-full bg-white border ${
                  errors.address_line_1 ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                } rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.address_line_1 && (
                <p className="text-[11px] text-red-600 mt-1">{errors.address_line_1}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Address Line 2 <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={address.address_line_2 || ''}
                onChange={(e) => handleFieldChange('address_line_2', e.target.value)}
                placeholder="e.g. 1st Floor, Building No. 4"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 5: Area / Locality & Landmark */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Area / Locality <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={address.area || ''}
                onChange={(e) => handleFieldChange('area', e.target.value)}
                placeholder="e.g. Kashi Bazar"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Landmark <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={address.landmark || ''}
                onChange={(e) => handleFieldChange('landmark', e.target.value)}
                placeholder="e.g. Opposite State Bank"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 6: City, District, State, PIN Code */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => handleFieldChange('city', e.target.value)}
                placeholder="e.g. Chapra"
                className={`w-full bg-white border ${
                  errors.city ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                } rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.city && <p className="text-[11px] text-red-600 mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                District <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={address.district || ''}
                onChange={(e) => handleFieldChange('district', e.target.value)}
                placeholder="e.g. Saran"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address.state}
                onChange={(e) => handleFieldChange('state', e.target.value)}
                placeholder="e.g. Bihar"
                className={`w-full bg-white border ${
                  errors.state ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                } rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.state && <p className="text-[11px] text-red-600 mt-1">{errors.state}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                PIN Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address.pincode}
                onChange={(e) => handleFieldChange('pincode', e.target.value)}
                placeholder="e.g. 841301"
                className={`w-full bg-white border ${
                  errors.pincode ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                } rounded-lg px-3 py-2 text-sm text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.pincode && <p className="text-[11px] text-red-600 mt-1">{errors.pincode}</p>}
            </div>
          </div>

          {/* Row 7: Reference Number & Remarks (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                GST / Reference / Tracking No. <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={address.reference || ''}
                onChange={(e) => handleFieldChange('reference', e.target.value)}
                placeholder="e.g. AWB123456 / DISPATCH-001"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Remarks / Delivery Instructions <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={address.remarks || ''}
                onChange={(e) => handleFieldChange('remarks', e.target.value)}
                placeholder="e.g. Urgent Delivery / Call before delivery"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* FORM ACTIONS */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Fields</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-sm transition cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Address For Future Use'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
