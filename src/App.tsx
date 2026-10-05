import React, { useState, useEffect, useRef } from 'react';
import {
  getStoredCompanies,
  saveCompany,
  deleteCompany,
  getStoredAddresses,
  saveAddress,
  duplicateAddress,
  deleteAddress,
  getPrintLogs,
  logPrintAction,
  getStoredSettings,
  saveStoredSettings,
  getAddressDraft,
  saveAddressDraft,
  clearAddressDraft,
} from './services/storage';
import { Company, CourierAddress, PrintLog, AppSettings } from './types';
import { generateDirectVectorPdf } from './services/pdfGenerator';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ToastProvider, useToast } from './components/Toast';
import { PrintableLabel } from './components/PrintableLabel';

import { DashboardView } from './views/DashboardView';
import { CreateAddressView } from './views/CreateAddressView';
import { SavedAddressesView } from './views/SavedAddressesView';
import { CompaniesView } from './views/CompaniesView';
import { PrintHistoryView } from './views/PrintHistoryView';
import { SettingsView } from './views/SettingsView';

import {
  LayoutDashboard,
  PlusSquare,
  BookmarkCheck,
  Building2,
  History,
  Settings2,
  Menu,
  X,
} from 'lucide-react';

const createEmptyAddress = (companyId: string): CourierAddress => ({
  id: '',
  company_id: companyId,
  receiver_name: '',
  designation: '',
  center_code: '',
  organization: '',
  mobile: '',
  alternate_mobile: '',
  email: '',
  address_line_1: '',
  address_line_2: '',
  area: '',
  landmark: '',
  city: '',
  district: '',
  state: '',
  pincode: '',
  reference: '',
  remarks: '',
  use_default_sender: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_used_at: null,
});

function MainApp() {
  const { showToast } = useToast();

  // Storage states
  const [companies, setCompanies] = useState<Company[]>([]);
  const [addresses, setAddresses] = useState<CourierAddress[]>([]);
  const [printLogs, setPrintLogs] = useState<PrintLog[]>([]);
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings());

  // Navigation & UI state
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Active form state
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [currentAddress, setCurrentAddress] = useState<CourierAddress>(createEmptyAddress(''));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hasDraft, setHasDraft] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  // Dedicated Print Target State (for window.print and background PDF)
  const [printTargetAddress, setPrintTargetAddress] = useState<CourierAddress>(currentAddress);
  const [printTargetCompany, setPrintTargetCompany] = useState<Company | null>(null);

  // Load initial data
  useEffect(() => {
    refreshAllData();
  }, []);

  const refreshAllData = () => {
    const loadedCompanies = getStoredCompanies();
    const loadedAddresses = getStoredAddresses();
    const loadedLogs = getPrintLogs();
    const loadedSettings = getStoredSettings();

    setCompanies(loadedCompanies);
    setAddresses(loadedAddresses);
    setPrintLogs(loadedLogs);
    setSettings(loadedSettings);

    const initialCompanyId =
      loadedSettings.default_company_id && loadedCompanies.some((c) => c.id === loadedSettings.default_company_id)
        ? loadedSettings.default_company_id
        : loadedCompanies[0]?.id || '';

    setSelectedCompanyId(initialCompanyId);
    setPrintTargetCompany(loadedCompanies.find((c) => c.id === initialCompanyId) || loadedCompanies[0]);

    // Check draft
    const draft = getAddressDraft();
    if (draft && draft.receiver_name) {
      setHasDraft(true);
    } else {
      setCurrentAddress(createEmptyAddress(initialCompanyId));
    }
  };

  // Keep print target in sync with current address when editing
  useEffect(() => {
    setPrintTargetAddress(currentAddress);
    const comp = companies.find((c) => c.id === selectedCompanyId) || companies[0];
    if (comp) {
      setPrintTargetCompany(comp);
    }
  }, [currentAddress, selectedCompanyId, companies]);

  // Handle draft saving on address changes
  const handleAddressChange = (updated: CourierAddress) => {
    setCurrentAddress(updated);
    if (updated.receiver_name || updated.mobile || updated.address_line_1) {
      saveAddressDraft(updated);
    }
  };

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setCurrentAddress((prev) => ({
      ...prev,
      company_id: companyId,
    }));
  };

  const handleRestoreDraft = () => {
    const draft = getAddressDraft();
    if (draft) {
      setCurrentAddress({
        ...createEmptyAddress(selectedCompanyId),
        ...draft,
      });
      if (draft.company_id && companies.some((c) => c.id === draft.company_id)) {
        setSelectedCompanyId(draft.company_id);
      }
      setHasDraft(false);
      showToast('Draft restored successfully.', 'info');
    }
  };

  const handleDiscardDraft = () => {
    clearAddressDraft();
    setHasDraft(false);
    setCurrentAddress(createEmptyAddress(selectedCompanyId));
    showToast('Draft cleared.', 'info');
  };

  const handleResetAddress = () => {
    clearAddressDraft();
    setHasDraft(false);
    setEditingId(null);
    setCurrentAddress(createEmptyAddress(selectedCompanyId));
    showToast('Form fields cleared.', 'info');
  };

  // Save address handler
  const handleSaveAddress = () => {
    if (!currentAddress.receiver_name.trim()) {
      showToast('Receiver Name is required.', 'error');
      return;
    }
    if (!currentAddress.mobile.trim()) {
      showToast('Mobile Number is required.', 'error');
      return;
    }
    if (!currentAddress.address_line_1.trim()) {
      showToast('Address Line 1 is required.', 'error');
      return;
    }
    if (!currentAddress.city.trim()) {
      showToast('City is required.', 'error');
      return;
    }
    if (!currentAddress.state.trim()) {
      showToast('State is required.', 'error');
      return;
    }
    if (!currentAddress.pincode.trim()) {
      showToast('PIN Code is required.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const addressToSave: CourierAddress = {
        ...currentAddress,
        id: editingId || currentAddress.id || '',
        company_id: selectedCompanyId,
      };

      const { list, savedItem } = saveAddress(addressToSave);
      setAddresses(list);
      setCurrentAddress(savedItem);
      setEditingId(savedItem.id);
      clearAddressDraft();
      setHasDraft(false);
      showToast('Address saved successfully!', 'success');
    } catch (e) {
      showToast('Error saving address.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Print Address Handler
  const handlePrint = (targetAddr = currentAddress, targetCompId = selectedCompanyId) => {
    const comp = companies.find((c) => c.id === targetCompId) || companies[0];
    setPrintTargetAddress(targetAddr);
    setPrintTargetCompany(comp);

    // Log the print action
    const newLog = logPrintAction(
      targetAddr.id || undefined,
      comp.id,
      comp.name,
      targetAddr.receiver_name || 'Recipient',
      targetAddr.center_code,
      'print'
    );
    setPrintLogs((prev) => [newLog, ...prev]);

    // Refresh addresses to reflect updated last_used_at
    setAddresses(getStoredAddresses());

    // Small delay to allow react to render any state into print sheet
    setTimeout(() => {
      window.print();
      showToast('Print layout sent to printer.', 'success');
    }, 100);
  };

  // Download PDF Handler
  const handleDownloadPdf = async (targetAddr = currentAddress, targetCompId = selectedCompanyId) => {
    const comp = companies.find((c) => c.id === targetCompId) || companies[0];
    setPrintTargetAddress(targetAddr);
    setPrintTargetCompany(comp);

    setIsGeneratingPdf(true);
    try {
      const fileName = await generateDirectVectorPdf(comp, targetAddr, settings);

      // Log the PDF download action
      const newLog = logPrintAction(
        targetAddr.id || undefined,
        comp.id,
        comp.name,
        targetAddr.receiver_name || 'Recipient',
        targetAddr.center_code,
        'pdf_download'
      );
      setPrintLogs((prev) => [newLog, ...prev]);
      setAddresses(getStoredAddresses());

      showToast(`PDF downloaded: ${fileName}`, 'success');
    } catch (err) {
      console.error('PDF Generation Error:', err);
      showToast('Failed to generate PDF. Please try again.', 'error');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Actions from Saved Addresses & Dashboard
  const handleUseAddress = (addr: CourierAddress) => {
    setCurrentAddress({ ...addr });
    setEditingId(addr.id);
    if (addr.company_id && companies.some((c) => c.id === addr.company_id)) {
      setSelectedCompanyId(addr.company_id);
    }
    setCurrentView('create-address');
    showToast(`Loaded ${addr.receiver_name} into Create Address form.`, 'info');
  };

  const handleEditAddress = (addr: CourierAddress) => {
    handleUseAddress(addr);
  };

  const handleDuplicateAddress = (id: string) => {
    const dup = duplicateAddress(id);
    if (dup) {
      setAddresses(getStoredAddresses());
      showToast(`Duplicated as "${dup.receiver_name}".`, 'success');
    }
  };

  const handleDeleteAddress = (id: string) => {
    if (confirm('Are you sure you want to delete this saved address?')) {
      const updated = deleteAddress(id);
      setAddresses(updated);
      showToast('Address deleted successfully.', 'info');
    }
  };

  const handleQuickPrint = (addr: CourierAddress) => {
    handlePrint(addr, addr.company_id);
  };

  const handleQuickPdf = (addr: CourierAddress) => {
    handleDownloadPdf(addr, addr.company_id);
  };

  const handleSaveCompany = (company: Company) => {
    const updated = saveCompany(company);
    setCompanies(updated);
    showToast(`Company "${company.name}" saved successfully.`, 'success');
  };

  const handleDeleteCompany = (id: string) => {
    const updated = deleteCompany(id);
    setCompanies(updated);
    showToast('Company removed.', 'info');
  };

  const handleToggleCompanyStatus = (company: Company) => {
    const newStatus = company.status === 'active' ? 'inactive' : 'active';
    const updated = saveCompany({ ...company, status: newStatus });
    setCompanies(updated);
    showToast(
      `Company "${company.name}" is now ${newStatus === 'active' ? 'Active' : 'Paused'}.`,
      'info'
    );
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    const saved = saveStoredSettings(newSettings);
    setSettings(saved);
  };

  const handleOpenQuickCreate = () => {
    setEditingId(null);
    setCurrentAddress(createEmptyAddress(selectedCompanyId));
    setCurrentView('create-address');
  };

  const currentCompany =
    companies.find((c) => c.id === selectedCompanyId) ||
    companies[0] || {
      id: 'default',
      name: 'Courier Company',
      short_name: 'CAM',
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
      country: '',
      status: 'active',
      created_at: '',
      updated_at: '',
    };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased">
      {/* 
        ========================================================================
        PRINTABLE A4 CONTAINER
        Offscreen for html2canvas PDF rendering; positioned at (0, 0) during print.
        ========================================================================
      */}
      <div
        id="printable-a4-sheet-wrapper"
        style={{
          position: 'fixed',
          top: 0,
          left: '-9999px',
          width: '210mm',
          height: '297mm',
          zIndex: -100,
          backgroundColor: '#ffffff',
          pointerEvents: 'none',
        }}
      >
        {printTargetCompany && (
          <PrintableLabel
            id="printable-a4-sheet"
            company={printTargetCompany}
            address={printTargetAddress}
            settings={settings}
          />
        )}
      </div>

      {/* APP HEADER */}
      <Header
        onNavigate={(v) => {
          setCurrentView(v);
          setMobileMenuOpen(false);
        }}
        activeCompanyCount={companies.filter((c) => c.status === 'active').length}
        totalAddresses={addresses.length}
        onOpenQuickCreate={handleOpenQuickCreate}
      />

      {/* MOBILE NAVIGATION BAR (for smaller viewports) */}
      <div className="no-print lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-white">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Menu: {currentView.replace('-', ' ')}
        </span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="no-print lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 space-y-2 text-sm shadow-xl">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'create-address', label: 'Create Address', icon: PlusSquare },
            { id: 'saved-addresses', label: `Saved Addresses (${addresses.length})`, icon: BookmarkCheck },
            { id: 'companies', label: `Companies (${companies.length})`, icon: Building2 },
            { id: 'print-history', label: 'Print History', icon: History },
            { id: 'settings', label: 'Settings', icon: Settings2 },
          ].map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium cursor-pointer ${
                  active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* MAIN CONTAINER: SIDEBAR + CONTENT VIEW */}
      <div className="no-print flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex shrink-0">
          <Sidebar
            currentView={currentView}
            onNavigate={(v) => setCurrentView(v)}
            savedAddressCount={addresses.length}
            companyCount={companies.length}
          />
        </div>

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && (
              <DashboardView
                companies={companies}
                addresses={addresses}
                printLogs={printLogs}
                settings={settings}
                onNavigate={(v) => setCurrentView(v)}
                onUseAddress={handleUseAddress}
                onQuickPrint={handleQuickPrint}
                onQuickPdf={handleQuickPdf}
              />
            )}

            {currentView === 'create-address' && (
              <CreateAddressView
                companies={companies}
                selectedCompanyId={selectedCompanyId}
                onSelectCompany={handleSelectCompany}
                currentAddress={currentAddress}
                onAddressChange={handleAddressChange}
                onSaveAddress={handleSaveAddress}
                onResetAddress={handleResetAddress}
                onPrint={() => handlePrint(currentAddress, selectedCompanyId)}
                onDownloadPdf={() => handleDownloadPdf(currentAddress, selectedCompanyId)}
                settings={settings}
                hasDraft={hasDraft}
                onRestoreDraft={handleRestoreDraft}
                onDiscardDraft={handleDiscardDraft}
                isSaving={isSaving}
                isGeneratingPdf={isGeneratingPdf}
              />
            )}

            {currentView === 'saved-addresses' && (
              <SavedAddressesView
                addresses={addresses}
                companies={companies}
                onUseAddress={handleUseAddress}
                onEditAddress={handleEditAddress}
                onDuplicateAddress={handleDuplicateAddress}
                onDeleteAddress={handleDeleteAddress}
                onQuickPrint={handleQuickPrint}
                onQuickPdf={handleQuickPdf}
                onNavigateToCreate={handleOpenQuickCreate}
              />
            )}

            {currentView === 'companies' && (
              <CompaniesView
                companies={companies}
                onSaveCompany={handleSaveCompany}
                onDeleteCompany={handleDeleteCompany}
                onToggleStatus={handleToggleCompanyStatus}
              />
            )}

            {currentView === 'print-history' && (
              <PrintHistoryView
                logs={printLogs}
                addresses={addresses}
                onPrintAgain={(log) => {
                  // Find existing address or reconstruct for printing
                  const existingAddr = addresses.find((a) => a.id === log.address_id);
                  if (existingAddr) {
                    handlePrint(existingAddr, existingAddr.company_id);
                  } else {
                    const fallbackAddr = createEmptyAddress(log.company_id);
                    fallbackAddr.receiver_name = log.receiver_name;
                    fallbackAddr.center_code = log.center_code;
                    handlePrint(fallbackAddr, log.company_id);
                  }
                }}
                onClearHistory={() => {
                  localStorage.removeItem('cam_print_logs_v1');
                  setPrintLogs([]);
                  showToast('Print history cleared.', 'info');
                }}
              />
            )}

            {currentView === 'settings' && (
              <SettingsView
                settings={settings}
                companies={companies}
                onUpdateSettings={handleUpdateSettings}
                onRefreshAllData={refreshAllData}
                showToast={showToast}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
