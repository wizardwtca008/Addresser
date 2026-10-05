import React from 'react';
import { Company, CourierAddress, AppSettings } from '../types';
import { AddressForm } from '../components/AddressForm';
import { LivePreview } from '../components/LivePreview';

interface CreateAddressViewProps {
  companies: Company[];
  selectedCompanyId: string;
  onSelectCompany: (companyId: string) => void;
  currentAddress: CourierAddress;
  onAddressChange: (updated: CourierAddress) => void;
  onSaveAddress: () => void;
  onResetAddress: () => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  settings: AppSettings;
  hasDraft: boolean;
  onRestoreDraft: () => void;
  onDiscardDraft: () => void;
  isSaving: boolean;
  isGeneratingPdf: boolean;
}

export const CreateAddressView: React.FC<CreateAddressViewProps> = ({
  companies,
  selectedCompanyId,
  onSelectCompany,
  currentAddress,
  onAddressChange,
  onSaveAddress,
  onResetAddress,
  onPrint,
  onDownloadPdf,
  settings,
  hasDraft,
  onRestoreDraft,
  onDiscardDraft,
  isSaving,
  isGeneratingPdf,
}) => {
  const currentCompany =
    companies.find((c) => c.id === selectedCompanyId) ||
    companies.find((c) => c.id === currentAddress.company_id) ||
    companies[0];

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Create Courier Address
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Fill receiver details, preview the live A4 half-page label, save and print directly.
          </p>
        </div>
      </div>

      {/* Two Column Layout: Left Form (approx 52%), Right Preview (approx 48%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-6 xl:col-span-6">
          <AddressForm
            companies={companies}
            selectedCompanyId={selectedCompanyId}
            onSelectCompany={onSelectCompany}
            address={currentAddress}
            onChange={onAddressChange}
            onSave={onSaveAddress}
            onReset={onResetAddress}
            hasDraft={hasDraft}
            onRestoreDraft={onRestoreDraft}
            onDiscardDraft={onDiscardDraft}
            isSaving={isSaving}
          />
        </div>

        {/* Right Column: Live Print Preview (Sticky on Desktop) */}
        <div className="lg:col-span-6 xl:col-span-6 lg:sticky lg:top-20">
          <LivePreview
            company={currentCompany}
            address={currentAddress}
            settings={settings}
            onPrint={onPrint}
            onDownloadPdf={onDownloadPdf}
            onSave={onSaveAddress}
            isSaving={isSaving}
            isGeneratingPdf={isGeneratingPdf}
            showSaveButton={true}
          />
        </div>
      </div>
    </div>
  );
};
