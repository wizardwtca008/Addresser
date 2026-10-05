import React, { useState, useRef } from 'react';
import { Printer, Download, Save, ZoomIn, ZoomOut, Maximize2, RotateCcw, Check, Sparkles, FileText } from 'lucide-react';
import { Company, CourierAddress, AppSettings } from '../types';
import { PrintableLabel } from './PrintableLabel';

interface LivePreviewProps {
  company: Company;
  address: CourierAddress;
  settings: AppSettings;
  onPrint: () => void;
  onDownloadPdf: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  isGeneratingPdf?: boolean;
  showSaveButton?: boolean;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  company,
  address,
  settings,
  onPrint,
  onDownloadPdf,
  onSave,
  isSaving = false,
  isGeneratingPdf = false,
  showSaveButton = true,
}) => {
  // Preview scale (0.5 to 1.0)
  const [zoomScale, setZoomScale] = useState<number>(0.65);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleZoom = (delta: number) => {
    setZoomScale((prev) => Math.min(1.0, Math.max(0.4, Number((prev + delta).toFixed(2)))));
  };

  const resetZoom = () => {
    setZoomScale(0.65);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* PREVIEW TOOLBAR */}
      <div className="no-print bg-slate-900 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs sm:text-sm font-bold tracking-wide uppercase font-mono text-slate-200">
            A4 Print Preview
          </span>
          <span className="hidden xl:inline-flex text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            210mm × 297mm (Top 50% Label)
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 text-xs">
          <button
            onClick={() => handleZoom(-0.1)}
            title="Zoom Out"
            className="p-1 hover:text-blue-400 text-slate-300 rounded cursor-pointer transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] text-slate-300 w-10 text-center select-none">
            {Math.round(zoomScale * 100)}%
          </span>
          <button
            onClick={() => handleZoom(0.1)}
            title="Zoom In"
            className="p-1 hover:text-blue-400 text-slate-300 rounded cursor-pointer transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetZoom}
            title="Fit to Container"
            className="p-1 hover:text-blue-400 text-slate-300 rounded cursor-pointer transition-colors ml-0.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {showSaveButton && onSave && (
            <button
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-blue-400" />
              <span>{isSaving ? 'Saving...' : 'Save Address'}</span>
            </button>
          )}

          <button
            onClick={onDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isGeneratingPdf ? 'Creating PDF...' : 'DOWNLOAD PDF'}</span>
          </button>

          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-extrabold rounded-lg shadow-md transition-all cursor-pointer ring-1 ring-blue-400/40"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT ADDRESS</span>
          </button>
        </div>
      </div>

      {/* PREVIEW VIEWPORT AREA */}
      <div
        ref={previewRef}
        className="flex-1 bg-slate-200/90 overflow-auto p-4 sm:p-8 flex justify-center items-start min-h-[480px] custom-scrollbar"
        style={{
          perspective: '1000px',
        }}
      >
        <div
          className="transition-transform duration-150 origin-top shadow-2xl rounded-sm"
          style={{
            transform: `scale(${zoomScale})`,
            transformOrigin: 'top center',
            marginBottom: `${(zoomScale - 1) * 320}px`,
          }}
        >
          {/* Exact A4 Sheet Component */}
          <PrintableLabel
            id="live-preview-a4-sheet"
            company={company}
            address={address}
            settings={settings}
          />
        </div>
      </div>

      {/* Helper Bar */}
      <div className="no-print bg-slate-100 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-slate-600" />
          <span>
            Receiver: <strong className="text-slate-700">{address.receiver_name || 'Not specified'}</strong>
            {address.center_code && (
              <span className="ml-2 font-mono bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[10.5px]">
                {address.center_code}
              </span>
            )}
          </span>
        </div>
        <div className="text-right text-[11px]">
          Company: <strong className="text-slate-800">{company.name}</strong>
        </div>
      </div>
    </div>
  );
};
