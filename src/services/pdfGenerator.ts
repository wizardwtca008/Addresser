import { jsPDF } from 'jspdf';
import { Company, CourierAddress, AppSettings } from '../types';

export const formatPdfFileName = (receiverName: string, centerCode?: string): string => {
  const cleanReceiver = (receiverName || 'Recipient')
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_');

  const cleanCenter = centerCode
    ? `_${centerCode.trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '_')}`
    : '';

  return `Courier_Address_${cleanReceiver}${cleanCenter}.pdf`;
};

// Safe helper to convert an image/SVG src to an in-memory canvas data URL for jsPDF
const getRasterizedLogo = (src: string): Promise<{ dataUrl: string; width: number; height: number } | null> => {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const natWidth = img.naturalWidth || 360;
        const natHeight = img.naturalHeight || 80;
        canvas.width = natWidth;
        canvas.height = natHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        resolve({ dataUrl, width: natWidth, height: natHeight });
      } catch (e) {
        console.warn('Could not rasterize logo for PDF:', e);
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
};

/**
 * Direct High-Quality Vector PDF Generator for jsPDF.
 * Creates an exact A4 page (210mm x 297mm) where the courier label
 * occupies the top half (~148.5mm) and the bottom half is 100% blank.
 * Text is 100% vector-sharp and searchable, with zero canvas-taint or DOM errors.
 */
export const generateDirectVectorPdf = async (
  company: Company,
  address: CourierAddress,
  settings: AppSettings
): Promise<string> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  // Calculate layout coordinates
  const isBottom = settings.label_position === 'bottom';
  const startY = isBottom ? 155.5 : 7; // 7mm margin from top edge
  const cardWidth = 196; // 7mm margins on left & right
  const cardHeight = 134.5; // fits safely inside 148.5mm half-page
  const cardX = 7;

  // 1. Draw Outer Border
  doc.setDrawColor(15, 23, 42); // slate-900

  if (settings.border_style === 'double') {
    doc.setLineWidth(0.8);
    doc.roundedRect(cardX, startY, cardWidth, cardHeight, 2, 2);
    doc.setLineWidth(0.3);
    doc.roundedRect(cardX + 1.2, startY + 1.2, cardWidth - 2.4, cardHeight - 2.4, 1.5, 1.5);
  } else if (settings.border_style === 'bold') {
    doc.setLineWidth(1.2);
    doc.roundedRect(cardX, startY, cardWidth, cardHeight, 2, 2);
  } else {
    // single
    doc.setLineWidth(0.7);
    doc.roundedRect(cardX, startY, cardWidth, cardHeight, 2, 2);
  }

  // 2. Sender / Company Header
  const headerY = startY + 4;
  let textStartX = cardX + 5;

  // Try to render logo
  if (company.logo) {
    try {
      const logoData = await getRasterizedLogo(company.logo);
      if (logoData) {
        const aspect = logoData.width / logoData.height;
        const targetH = 12;
        const targetW = Math.min(38, targetH * aspect);
        doc.addImage(logoData.dataUrl, 'PNG', cardX + 4, headerY, targetW, targetH);
        textStartX = cardX + 4 + targetW + 4;
      }
    } catch (e) {
      console.warn('Logo embed skipped in PDF:', e);
    }
  }

  // Company Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(company.name.toUpperCase(), textStartX, headerY + 5.5);

  // Company Tagline
  if (settings.show_company_tagline && company.tagline) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    // Truncate if too long
    const cleanTagline = company.tagline.length > 55 ? `${company.tagline.substring(0, 52)}...` : company.tagline;
    doc.text(cleanTagline, textStartX, headerY + 9.5);
  }

  // Header Right Badge: "COURIER / SPEED POST"
  const badgeW = 34;
  const badgeH = 5.5;
  const badgeX = cardX + cardWidth - badgeW - 4;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(badgeX, headerY + 1.5, badgeW, badgeH, 1, 1, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.2);
  doc.roundedRect(badgeX, headerY + 1.5, badgeW, badgeH, 1, 1, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text('COURIER / SPEED POST', badgeX + badgeW / 2, headerY + 5.2, { align: 'center' });

  // Header separator line
  const dividerY = startY + 18;
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.4);
  doc.line(cardX + 2, dividerY, cardX + cardWidth - 2, dividerY);

  // 3. TO: Section (Receiver Details)
  let currY = dividerY + 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('TO :', cardX + 5, currY);

  // Vertical border guide line
  const guideLineX = cardX + 13;
  const guideLineStartY = currY + 1;
  const guideLineEndY = startY + cardHeight - 16;
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  doc.line(guideLineX, guideLineStartY, guideLineX, guideLineEndY);

  const contentX = guideLineX + 4;
  let lineY = currY + 4;

  // Receiver Name
  const receiverText = (address.receiver_name || 'RECEIVER NAME').toUpperCase();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(15, 23, 42);
  doc.text(receiverText, contentX, lineY);

  const nameWidth = doc.getTextWidth(receiverText);

  // Center Code (Prominent Filled Dark Badge)
  if (settings.show_center_code && address.center_code) {
    const codeText = `CENTER CODE: ${address.center_code.toUpperCase()}`;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    const codeW = doc.getTextWidth(codeText) + 5;
    const codeH = 5.5;
    const codeX = contentX + nameWidth + 5;

    // Check if fits on same line or next line
    if (codeX + codeW < cardX + cardWidth - 5) {
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(codeX, lineY - 4.5, codeW, codeH, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text(codeText, codeX + 2.5, lineY - 0.7);
    } else {
      lineY += 5.5;
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(contentX, lineY - 4.5, codeW, codeH, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text(codeText, contentX + 2.5, lineY - 0.7);
    }
  }

  // Designation & Organization
  if (address.designation || address.organization) {
    lineY += 5.2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    const orgLine = [address.designation, address.organization].filter(Boolean).join(' • ');
    doc.text(orgLine, contentX, lineY);
  }

  // Formatted Address
  lineY += 5.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);

  if (address.address_line_1) {
    doc.text(address.address_line_1, contentX, lineY);
    lineY += 4.8;
  }

  if (address.address_line_2) {
    doc.text(address.address_line_2, contentX, lineY);
    lineY += 4.8;
  }

  const areaLandmark = [address.area, address.landmark ? `(Near: ${address.landmark})` : ''].filter(Boolean).join(', ');
  if (areaLandmark) {
    doc.text(areaLandmark, contentX, lineY);
    lineY += 4.8;
  }

  const cityDist = [address.city, address.district && address.district !== address.city ? address.district : ''].filter(Boolean).join(', ');
  const statePin = [address.state, address.pincode].filter(Boolean).join(' - ');
  const fullCityLine = [cityDist, statePin].filter(Boolean).join(', ');

  if (fullCityLine) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(fullCityLine, contentX, lineY);
    lineY += 5.5;
  }

  // Contact Info
  if (settings.show_mobile_number && address.mobile) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Mobile: ${address.mobile}`, contentX, lineY);

    if (address.alternate_mobile) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`Alt Mobile: ${address.alternate_mobile}`, contentX + 50, lineY);
    }
    lineY += 4.8;
  }

  if (address.email) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Email: ${address.email}`, contentX, lineY);
    lineY += 4.5;
  }

  if (address.reference || address.remarks) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const refRemark = [
      address.reference ? `Ref: ${address.reference}` : '',
      address.remarks ? `Remarks: ${address.remarks}` : '',
    ].filter(Boolean).join('  |  ');
    doc.text(refRemark, contentX, lineY);
  }

  // 4. FROM / SENDER Footer
  if (settings.show_sender_address) {
    const footerY = startY + cardHeight - 11;
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(0.35);
    doc.line(cardX + 2, footerY - 2, cardX + cardWidth - 2, footerY - 2);

    const isDefault = address.use_default_sender !== false;
    const senderName = isDefault ? company.name : address.custom_sender?.company_name || company.name;
    const senderLine1 = isDefault ? company.address_line_1 : address.custom_sender?.address_line_1 || company.address_line_1;
    const senderCity = isDefault ? company.city : address.custom_sender?.city || company.city;
    const senderState = isDefault ? company.state : address.custom_sender?.state || company.state;
    const senderPin = isDefault ? company.pincode : address.custom_sender?.pincode || company.pincode;
    const senderPhone = isDefault ? company.phone : address.custom_sender?.phone || company.phone;

    const senderAddressStr = [senderLine1, [senderCity, senderState].filter(Boolean).join(', '), senderPin ? `PIN-${senderPin}` : '']
      .filter(Boolean)
      .join(' — ');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text('FROM / SENDER:', cardX + 4, footerY + 2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(senderName, cardX + 29, footerY + 2);

    if (senderAddressStr) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      doc.text(senderAddressStr, cardX + 29, footerY + 5.5);
    }

    if (senderPhone) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      doc.text(`Ph: ${senderPhone}`, cardX + cardWidth - 4, footerY + 2, { align: 'right' });
    }
  }

  // Save the PDF
  const fileName = formatPdfFileName(address.receiver_name, address.center_code);
  doc.save(fileName);

  return fileName;
};
