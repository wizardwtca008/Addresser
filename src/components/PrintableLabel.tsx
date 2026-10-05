import React from 'react';
import { Company, CourierAddress, AppSettings } from '../types';

interface PrintableLabelProps {
  company: Company;
  address: CourierAddress;
  settings: AppSettings;
  id?: string;
}

export const PrintableLabel: React.FC<PrintableLabelProps> = ({
  company,
  address,
  settings,
  id = 'printable-a4-sheet',
}) => {
  // Determine sender details (either default company or custom override)
  const isDefaultSender = address.use_default_sender !== false;
  const senderName = isDefaultSender ? company.name : address.custom_sender?.company_name || company.name;
  const senderLine1 = isDefaultSender ? company.address_line_1 : address.custom_sender?.address_line_1 || company.address_line_1;
  const senderLine2 = isDefaultSender ? company.address_line_2 : address.custom_sender?.address_line_2 || company.address_line_2;
  const senderCity = isDefaultSender ? company.city : address.custom_sender?.city || company.city;
  const senderState = isDefaultSender ? company.state : address.custom_sender?.state || company.state;
  const senderPincode = isDefaultSender ? company.pincode : address.custom_sender?.pincode || company.pincode;
  const senderPhone = isDefaultSender ? company.phone : address.custom_sender?.phone || company.phone;
  const senderEmail = isDefaultSender ? company.email : address.custom_sender?.email || company.email;

  // Format sender address cleanly
  const senderAddressParts = [
    senderLine1,
    senderLine2,
    [senderCity, senderState].filter(Boolean).join(', '),
    senderPincode ? `PIN - ${senderPincode}` : '',
  ].filter(Boolean);

  // Format receiver address components without empty lines or extraneous commas
  const areaAndLandmark = [address.area, address.landmark ? `(Near: ${address.landmark})` : '']
    .filter(Boolean)
    .join(', ');

  const cityAndDistrict = [address.city, address.district && address.district !== address.city ? address.district : '']
    .filter(Boolean)
    .join(', ');

  const stateAndPin = [address.state, address.pincode].filter(Boolean).join(' - ');

  // Border styles
  const getBorderClass = () => {
    switch (settings.border_style) {
      case 'double':
        return 'border-[3.5px] border-double border-slate-900';
      case 'bold':
        return 'border-[3px] border-slate-900 shadow-none';
      case 'single':
      default:
        return 'border-2 border-slate-900';
    }
  };

  // Font size multipliers
  const getFontSizeClasses = () => {
    switch (settings.font_size) {
      case 'compact':
        return {
          title: 'text-[17px] leading-tight',
          centerCode: 'text-[13px]',
          receiver: 'text-[16px] leading-tight',
          body: 'text-[12px] leading-snug',
          meta: 'text-[11px]',
        };
      case 'large':
        return {
          title: 'text-[22px] leading-tight',
          centerCode: 'text-[16px]',
          receiver: 'text-[22px] leading-tight',
          body: 'text-[14.5px] leading-snug',
          meta: 'text-[13px]',
        };
      case 'standard':
      default:
        return {
          title: 'text-[19px] leading-tight',
          centerCode: 'text-[14.5px]',
          receiver: 'text-[19px] leading-tight',
          body: 'text-[13.5px] leading-snug',
          meta: 'text-[12px]',
        };
    }
  };

  const fonts = getFontSizeClasses();

  // The Half-page label element (exact physical target ~210mm wide × 148.5mm tall)
  const renderLabelCard = () => (
    <div
      style={{
        width: '210mm',
        height: '148.5mm',
        padding: '7mm',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
      }}
      className="flex flex-col justify-start"
    >
      {/* Outer Bordered Card */}
      <div
        className={`w-full h-full rounded-md ${getBorderClass()} bg-white p-[5mm] flex flex-col justify-between overflow-hidden relative text-slate-900`}
        style={{
          boxSizing: 'border-box',
        }}
      >
        {/* HEADER SECTION: Company Branding */}
        <div className="border-b-[1.5px] border-slate-800 pb-[3mm] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            {/* Logo with preserved aspect ratio */}
            {company.logo && (
              <div className="flex-shrink-0 flex items-center justify-center max-w-[130px] max-h-[50px]">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="max-h-[46px] max-w-[125px] w-auto h-auto object-contain"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className={`font-black text-slate-950 uppercase tracking-tight ${fonts.title}`}>
                {company.name}
              </h1>
              {settings.show_company_tagline && company.tagline && (
                <p className="text-[10.5px] font-medium text-slate-600 tracking-wide truncate mt-0.5">
                  {company.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Quick badge */}
          <div className="text-right flex-shrink-0 pl-2">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded">
              COURIER / SPEED POST
            </span>
          </div>
        </div>

        {/* MAIN BODY: TO (Receiver Details) */}
        <div className="flex-1 py-[3mm] flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-extrabold text-[13px] tracking-widest text-slate-900 uppercase underline decoration-2 underline-offset-4">
                TO :
              </span>
            </div>

            <div className="pl-3 border-l-2 border-slate-400">
              {/* Receiver Name */}
              <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1">
                <span className={`font-black text-slate-950 uppercase tracking-wide ${fonts.receiver}`}>
                  {address.receiver_name || 'RECEIVER NAME'}
                </span>

                {/* Center Code - Prominently Displayed (Requirement 5) */}
                {settings.show_center_code && address.center_code && (
                  <span className={`inline-flex items-center font-black bg-slate-900 text-white px-2.5 py-0.5 rounded tracking-wider ${fonts.centerCode}`}>
                    CENTER CODE: {address.center_code}
                  </span>
                )}
              </div>

              {/* Designation & Organization */}
              {(address.designation || address.organization) && (
                <div className="text-slate-800 font-semibold text-[13px] mt-0.5">
                  {[address.designation, address.organization].filter(Boolean).join(' • ')}
                </div>
              )}

              {/* Formatted Address */}
              <div className={`text-slate-800 font-medium mt-1.5 space-y-0.5 ${fonts.body}`}>
                {address.address_line_1 && <div className="leading-tight">{address.address_line_1}</div>}
                {address.address_line_2 && <div className="leading-tight">{address.address_line_2}</div>}
                {areaAndLandmark && <div className="leading-tight">{areaAndLandmark}</div>}
                {(cityAndDistrict || stateAndPin) && (
                  <div className="font-bold text-slate-900 leading-tight">
                    {[cityAndDistrict, stateAndPin].filter(Boolean).join(', ')}
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className={`mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-900 font-semibold ${fonts.meta}`}>
                {settings.show_mobile_number && address.mobile && (
                  <div className="flex items-center gap-1 font-bold">
                    <span className="text-slate-700">Mobile:</span>
                    <span className="text-slate-950 font-black">{address.mobile}</span>
                  </div>
                )}

                {address.alternate_mobile && (
                  <div className="flex items-center gap-1 text-slate-700">
                    <span>Alt Mobile:</span>
                    <span className="font-bold text-slate-900">{address.alternate_mobile}</span>
                  </div>
                )}

                {address.email && (
                  <div className="flex items-center gap-1 text-slate-600">
                    <span>Email:</span>
                    <span className="font-normal text-slate-800">{address.email}</span>
                  </div>
                )}
              </div>

              {/* Optional Reference or Remarks */}
              {(address.reference || address.remarks) && (
                <div className="mt-1 text-[11px] text-slate-600 flex flex-wrap gap-x-3 italic">
                  {address.reference && (
                    <span>
                      <strong className="not-italic font-bold text-slate-800">Ref:</strong> {address.reference}
                    </span>
                  )}
                  {address.remarks && (
                    <span>
                      <strong className="not-italic font-bold text-slate-800">Remarks:</strong> {address.remarks}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER SECTION: FROM (Sender Details) */}
        {settings.show_sender_address && (
          <div className="border-t-[1.5px] border-slate-800 pt-[2mm] text-[10.5px] text-slate-700 flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <span className="font-black text-slate-950 uppercase tracking-wider text-[11px]">
                FROM / SENDER:{' '}
              </span>
              <strong className="text-slate-900 font-bold">{senderName}</strong>
              {senderAddressParts.length > 0 && (
                <span className="ml-1 text-slate-700 font-normal">
                  — {senderAddressParts.join(', ')}
                </span>
              )}
            </div>
            <div className="text-right flex-shrink-0 text-slate-800 font-medium">
              {senderPhone && <div>Ph: <span className="font-bold">{senderPhone}</span></div>}
              {company.website && !senderPhone && <div className="text-slate-600">{company.website}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const isTop = settings.label_position !== 'bottom';

  return (
    <div
      id={id}
      style={{
        width: '210mm',
        height: '297mm',
        backgroundColor: '#ffffff',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
      }}
      className="print-sheet mx-auto select-none"
    >
      {isTop ? (
        <>
          {/* Top Half (~148.5mm) */}
          {renderLabelCard()}
          {/* Bottom Half (~148.5mm) is intentionally 100% BLANK as per requirement 8 */}
          <div
            style={{
              width: '210mm',
              height: '148.5mm',
              backgroundColor: '#ffffff',
              boxSizing: 'border-box',
            }}
            className="border-t border-dashed border-slate-200/40 print:border-none relative flex items-center justify-center text-slate-300 text-xs no-print select-none"
          >
            <span>[ Bottom Half Blank — Safe for A4 Folding / Receipt / Package Space ]</span>
          </div>
        </>
      ) : (
        <>
          {/* Top Half Blank */}
          <div
            style={{
              width: '210mm',
              height: '148.5mm',
              backgroundColor: '#ffffff',
              boxSizing: 'border-box',
            }}
            className="border-b border-dashed border-slate-200/40 print:border-none relative flex items-center justify-center text-slate-300 text-xs no-print select-none"
          >
            <span>[ Top Half Blank ]</span>
          </div>
          {/* Bottom Half (~148.5mm) */}
          {renderLabelCard()}
        </>
      )}
    </div>
  );
};
