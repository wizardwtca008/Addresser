import React, { useRef, useState } from 'react';
import {
  Settings2,
  Building2,
  Layout,
  Type,
  FileCheck,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { Company, AppSettings } from '../types';
import { exportAllDataJSON, importAllDataJSON } from '../services/storage';

interface SettingsViewProps {
  settings: AppSettings;
  companies: Company[];
  onUpdateSettings: (newSettings: AppSettings) => void;
  onRefreshAllData: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  companies,
  onUpdateSettings,
  onRefreshAllData,
  showToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [current, setCurrent] = useState<AppSettings>(settings);

  const handleChange = (key: keyof AppSettings, value: any) => {
    const updated = { ...current, [key]: value };
    setCurrent(updated);
    onUpdateSettings(updated);
    showToast('Setting updated successfully.', 'success');
  };

  const handleExportData = () => {
    const jsonStr = exportAllDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Courier_Address_Manager_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Database exported to JSON file.', 'success');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importAllDataJSON(content);
      if (success) {
        onRefreshAllData();
        showToast('Database imported successfully!', 'success');
      } else {
        showToast('Failed to import JSON backup. Invalid format.', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Title */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          System &amp; Print Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Configure default company, label typography, A4 placement, and database backup.
        </p>
      </div>

      {/* SECTION 1: DEFAULT COMPANY */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
          <Building2 className="w-5 h-5 text-blue-600" />
          <span>Default Sender Company</span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Default Company for New Addresses
          </label>
          <select
            value={current.default_company_id}
            onChange={(e) => handleChange('default_company_id', e.target.value)}
            className="w-full sm:w-96 bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.short_name})
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-1">
            This company and its logo will be pre-selected when you open the Create Address screen.
          </p>
        </div>
      </div>

      {/* SECTION 2: PRINT FORMAT & POSITION (Requirements 30 & 31) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
          <Layout className="w-5 h-5 text-indigo-600" />
          <span>Print Format &amp; A4 Layout</span>
        </div>

        {/* Label Position on A4 Page */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
            A4 Label Placement (Half-Page Specification)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
            <button
              type="button"
              onClick={() => handleChange('label_position', 'top')}
              className={`p-3.5 rounded-xl border-2 text-left cursor-pointer transition ${
                current.label_position === 'top'
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
                <span>Top Half (Recommended)</span>
                {current.label_position === 'top' && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Occupies top 148.5mm of A4. Bottom half remains clean blank.
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleChange('label_position', 'bottom')}
              className={`p-3.5 rounded-xl border-2 text-left cursor-pointer transition ${
                current.label_position === 'bottom'
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
                <span>Bottom Half</span>
                {current.label_position === 'bottom' && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Top half remains blank. Label prints on bottom 148.5mm.
              </p>
            </button>
          </div>
        </div>

        {/* Layout Theme */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Label Design Template
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'corporate',
                title: 'Professional Corporate',
                desc: 'Double-line border with distinct branding header and TO box.',
              },
              {
                id: 'minimal',
                title: 'Minimal Modern',
                desc: 'Clean subtle lines, modern typography and compact margins.',
              },
              {
                id: 'bold_border',
                title: 'Executive Bold',
                desc: 'High contrast heavy border for rough postal handling envelopes.',
              },
            ].map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => handleChange('print_layout', tmpl.id)}
                className={`p-3 rounded-lg border-2 text-left cursor-pointer transition ${
                  current.print_layout === tmpl.id
                    ? 'border-blue-600 bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}
              >
                <div className="font-bold text-xs sm:text-sm text-slate-900">{tmpl.title}</div>
                <div className="text-[11px] text-slate-500 mt-1">{tmpl.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Border Style */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">Border Style</label>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            {[
              { id: 'double', label: 'Double Line' },
              { id: 'single', label: 'Single Solid' },
              { id: 'bold', label: 'Bold 3px Solid' },
            ].map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => handleChange('border_style', b.id)}
                className={`py-2 px-3 rounded-lg text-xs font-bold border cursor-pointer transition text-center ${
                  current.border_style === b.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">Print Font Size</label>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            {[
              { id: 'compact', label: 'Compact' },
              { id: 'standard', label: 'Standard (Ideal)' },
              { id: 'large', label: 'Large (High Legibility)' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => handleChange('font_size', f.id)}
                className={`py-2 px-3 rounded-lg text-xs font-bold border cursor-pointer transition text-center ${
                  current.font_size === f.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: VISIBILITY TOGGLES */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
          <Sliders className="w-5 h-5 text-emerald-600" />
          <span>Label Information Toggles</span>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <div className="font-bold text-sm text-slate-900">Show Center Code</div>
              <div className="text-xs text-slate-500">
                Display prominent high-contrast badge (e.g. CENTER CODE: WTCA001)
              </div>
            </div>
            <input
              type="checkbox"
              checked={current.show_center_code}
              onChange={(e) => handleChange('show_center_code', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <div className="font-bold text-sm text-slate-900">Show Receiver Mobile Number</div>
              <div className="text-xs text-slate-500">
                Display primary and alternate phone numbers for delivery boy contact
              </div>
            </div>
            <input
              type="checkbox"
              checked={current.show_mobile_number}
              onChange={(e) => handleChange('show_mobile_number', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <div className="font-bold text-sm text-slate-900">Show Company Tagline</div>
              <div className="text-xs text-slate-500">
                Display institution slogan or accreditation below company title
              </div>
            </div>
            <input
              type="checkbox"
              checked={current.show_company_tagline}
              onChange={(e) => handleChange('show_company_tagline', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <div className="font-bold text-sm text-slate-900">Show Sender Return Address</div>
              <div className="text-xs text-slate-500">
                Display FROM / SENDER details in the bottom banner for return dispatch
              </div>
            </div>
            <input
              type="checkbox"
              checked={current.show_sender_address}
              onChange={(e) => handleChange('show_sender_address', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* SECTION 4: DATA BACKUP & RESTORE */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
          <FileCheck className="w-5 h-5 text-blue-600" />
          <span>Data Backup, Export &amp; Restore</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          All your saved addresses, company profiles, print history, and settings are stored locally.
          You can download a complete JSON backup or restore it onto another device anytime.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-lg transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Database JSON</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold text-xs sm:text-sm rounded-lg transition cursor-pointer"
          >
            <Upload className="w-4 h-4 text-blue-600" />
            <span>Import Database JSON</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportData}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};
