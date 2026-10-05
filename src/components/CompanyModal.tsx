import React, { useState, useRef } from 'react';
import { X, Upload, Building2, CheckCircle2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Company } from '../types';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (company: Company) => void;
  initialCompany?: Company | null;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCompany,
}) => {
  const [formData, setFormData] = useState<Partial<Company>>(
    initialCompany || {
      name: '',
      short_name: '',
      logo: '',
      tagline: '',
      phone: '',
      email: '',
      website: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
      country: 'India',
      status: 'active',
    }
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof Company, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (PNG, JPG, JPEG, WEBP, or SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const base64 = loadEvent.target?.result as string;
      handleInputChange('logo', base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.name?.trim()) newErrors.name = 'Company Name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const savedCompany: Company = {
      id: initialCompany?.id || `comp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: formData.name || '',
      short_name: formData.short_name || formData.name?.substring(0, 4).toUpperCase() || 'COMP',
      logo: formData.logo || '',
      tagline: formData.tagline || '',
      phone: formData.phone || '',
      email: formData.email || '',
      website: formData.website || '',
      address_line_1: formData.address_line_1 || '',
      address_line_2: formData.address_line_2 || '',
      city: formData.city || '',
      district: formData.district || '',
      state: formData.state || '',
      pincode: formData.pincode || '',
      country: formData.country || 'India',
      status: formData.status || 'active',
      created_at: initialCompany?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSave(savedCompany);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold">
              {initialCompany ? 'Edit Company Information' : 'Add New Company / Sender'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Company Name & Short Code */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            <div className="sm:col-span-8">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g. WIZARD-TECH Computer Academy"
                className={`w-full bg-white border ${
                  errors.name ? 'border-red-500' : 'border-slate-300'
                } rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Short Name / Code
              </label>
              <input
                type="text"
                value={formData.short_name || ''}
                onChange={(e) => handleInputChange('short_name', e.target.value)}
                placeholder="e.g. WTCA"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Logo Upload Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-800">Company Logo</label>
                <p className="text-[11px] text-slate-500">
                  PNG, JPG, WEBP, or SVG. Horizontal logo ratio recommended. Never distorted.
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Logo Image</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>

            {/* Logo Preview */}
            {formData.logo ? (
              <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg p-3">
                <div className="w-32 h-14 bg-slate-50 border border-slate-100 rounded flex items-center justify-center p-1 overflow-hidden">
                  <img
                    src={formData.logo}
                    alt="Logo Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="text-xs text-slate-600 flex-1">
                  <div className="font-bold text-slate-800">Logo Ready</div>
                  <div className="text-slate-500 text-[11px]">
                    Aspect ratio is locked and preserved in print.
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange('logo', '')}
                    className="text-red-600 text-xs font-medium hover:underline mt-1 cursor-pointer"
                  >
                    Remove Logo
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-slate-300 rounded-lg p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>No logo uploaded yet. Text badge will be used if left blank.</span>
              </div>
            )}
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Company Tagline / Subtitle
            </label>
            <input
              type="text"
              value={formData.tagline || ''}
              onChange={(e) => handleInputChange('tagline', e.target.value)}
              placeholder="e.g. Center of Excellence in Computer & IT Education"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contact: Phone, Email, Website */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="contact@company.com"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Website</label>
              <input
                type="text"
                value={formData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="www.company.com"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Default Address Section */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Default Sender Address
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={formData.address_line_1 || ''}
                onChange={(e) => handleInputChange('address_line_1', e.target.value)}
                placeholder="Address Line 1 (e.g. Main Road, Near Bus Stand)"
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={formData.address_line_2 || ''}
                onChange={(e) => handleInputChange('address_line_2', e.target.value)}
                placeholder="Address Line 2 (e.g. Kashi Bazar)"
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="City (e.g. Chapra)"
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={formData.district || ''}
                onChange={(e) => handleInputChange('district', e.target.value)}
                placeholder="District (e.g. Saran)"
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={formData.state || ''}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="State (e.g. Bihar)"
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={formData.pincode || ''}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                placeholder="PIN (e.g. 841301)"
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status Selection */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Status</span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="company_status"
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={() => handleInputChange('status', 'active')}
                  className="text-blue-600"
                />
                <span>Active</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="company_status"
                  value="inactive"
                  checked={formData.status === 'inactive'}
                  onChange={() => handleInputChange('status', 'inactive')}
                  className="text-blue-600"
                />
                <span>Paused / Inactive</span>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm transition cursor-pointer"
            >
              {initialCompany ? 'Save Changes' : 'Create Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
