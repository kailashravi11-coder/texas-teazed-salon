const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const FILES_TO_INCLUDE = [
  {
    title: '1. CRM TypeScript Definitions & Services',
    path: 'src/types/crm.ts',
    description: 'Core interfaces (SalonClientRecord, SalonStaffMember, ServiceMenuItem), menu pricing, and initial team list.',
  },
  {
    title: '2. CRM Seed Data Generator',
    path: 'src/utils/crmSeed.ts',
    description: 'Realistic Houston/League City salon data covering walk-ins, online leads, pricing, discounts, formulas, and 4-6 weeks retention clients.',
  },
  {
    title: '3. Master Staff Lead Portal & CRM Engine',
    path: 'src/components/StaffLeadPortal.tsx',
    description: 'Central portal dashboard: Passcode authentication, interactive calendar, scope switcher (day vs all-time), 5-KPI live counters, client cards list, and retention tabs.',
  },
  {
    title: '4. Walk-In Counter POS Modal',
    path: 'src/components/crm/WalkInPosModal.tsx',
    description: '10-second instant counter registration with auto-fed menu pricing, 3-way dynamic discount calculator ($ and %), payment methods, and stylist tips.',
  },
  {
    title: '5. Staff HRM & Stylist Lifecycle Modal',
    path: 'src/components/crm/StaffManagerModal.tsx',
    description: 'Active/inactive team toggles, add stylist, delete stylist, and role management.',
  },
  {
    title: '6. Edit Pricing, Formula & Discount Modal',
    path: 'src/components/crm/EditPricingModal.tsx',
    description: 'Live price adjustments, technical color formula vault, and customer notes editor.',
  },
  {
    title: '7. Payroll Commission & CSV Reports Modal',
    path: 'src/components/crm/CrmReportsModal.tsx',
    description: '8-KPI production dashboard, custom date-range picker (1-day, 7-day, 15-day bi-weekly), stylist commission tiers, and 1-click CSV download.',
  },
  {
    title: '8. Daily End-of-Day Z-Report Modal',
    path: 'src/components/crm/DailyZReportModal.tsx',
    description: 'Nightly closing financial audit for salon owner with register cash, cards, Zelle, tips, and 1-click SMS/WhatsApp dispatch.',
  },
  {
    title: '9. 1-Click WhatsApp & SMS Digital Receipt Modal',
    path: 'src/components/crm/DigitalReceiptModal.tsx',
    description: 'Zero-paper luxury digital invoice with 1-click SMS, 1-click WhatsApp, clipboard copy, and printable PDF/thermal layout.',
  },
  {
    title: '10. 6-Week Client Retention Rebooking Modal',
    path: 'src/components/crm/RetentionReminderModal.tsx',
    description: 'Automated 4-6 weeks elapsed rebooking engine with standard friendly and $10 OFF promotion text dispatch.',
  },
];

async function generatePDF() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, 'TEXAS_TEAZED_CRM_COMPLETE_CODE.pdf');
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 40, bottom: 40, left: 40, right: 40 },
    autoFirstPage: true,
    bufferPages: true,
  });

  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  // --- COVER PAGE ---
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#1a2e22');

  doc.fillColor('#f7f9f2');
  doc.font('Helvetica-Bold').fontSize(26).text('TEXAS TEAZED SALON', 40, 100, { align: 'center' });
  doc.fontSize(16).fillColor('#d4af37').text('ENTERPRISE CRM, POS & RETENTION ENGINE', { align: 'center' });

  doc.moveDown(1);
  doc.fontSize(12).fillColor('#ffffff').text('COMPLETE SOURCE CODE REPOSITORY & INTEGRATION BLUEPRINT', { align: 'center' });

  doc.moveDown(2);
  doc.rect(40, 200, doc.page.width - 80, 1).fill('#d4af37');

  doc.moveDown(2);
  doc.fontSize(10).fillColor('#e5e7eb').font('Helvetica');
  const summaryText = 
    'This document contains the 100% complete, unedited source code for the salon management portal.\n\n' +
    'How to use with AI Studio / any LLM for a new website:\n' +
    '1. Feed this document (or copy the files) into the AI chatbox.\n' +
    '2. Provide your new salon logo, services, and branding colors.\n' +
    '3. Prompt the AI: "Integrate this complete 10-file CRM & POS engine into my new website with matching styles."\n' +
    '4. The AI will directly create the components, types, and modals with zero guesswork.';
  doc.text(summaryText, 60, 220, { width: doc.page.width - 120, lineGap: 5 });

  doc.moveDown(3);
  doc.fontSize(12).fillColor('#d4af37').font('Helvetica-Bold').text('INCLUDED MODULES & FILES:', 60, 360);
  doc.moveDown(0.5);

  let yOffset = 385;
  FILES_TO_INCLUDE.forEach((f, idx) => {
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#ffffff').text(`${idx + 1}. ${f.path}`, 60, yOffset);
    doc.fontSize(8).font('Helvetica').fillColor('#9ca3af').text(`   - ${f.title}`, 60, yOffset + 11);
    yOffset += 24;
  });

  doc.fontSize(9).fillColor('#6b7280').text('Production-ready TypeScript / React SPA Code • League City / Houston, TX', 40, doc.page.height - 60, { align: 'center' });

  // --- SOURCE CODE PAGES ---
  for (const fileInfo of FILES_TO_INCLUDE) {
    doc.addPage();
    const fullPath = path.resolve(fileInfo.path);
    const content = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, 'utf8') : '// File not found';

    // File Header
    doc.rect(30, 25, doc.page.width - 60, 50).fill('#1a2e22');
    doc.fillColor('#d4af37').font('Helvetica-Bold').fontSize(11).text(fileInfo.title.toUpperCase(), 40, 33);
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9).text(`File: ${fileInfo.path}`, 40, 48);
    doc.fillColor('#9ca3af').font('Helvetica').fontSize(8).text(fileInfo.description, 40, 60, { width: doc.page.width - 80 });

    doc.moveDown(3.5);

    // Code lines
    doc.fillColor('#111827').font('Courier').fontSize(7);
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const lineNum = String(i + 1).padStart(4, ' ') + ' | ';
      const lineText = lines[i];

      // Check if we need a new page
      if (doc.y > doc.page.height - 50) {
        doc.addPage();
        // Mini banner on continuation pages
        doc.rect(30, 20, doc.page.width - 60, 20).fill('#1a2e22');
        doc.fillColor('#d4af37').font('Helvetica-Bold').fontSize(8).text(`${fileInfo.path} (continued)`, 40, 26);
        doc.moveDown(1.5);
        doc.fillColor('#111827').font('Courier').fontSize(7);
      }

      // Render line with number
      doc.fillColor('#6b7280').text(lineNum, { continued: true });
      doc.fillColor('#1a2e22').text(lineText);
    }
  }

  // --- ADD PAGE NUMBERS ---
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i);
    if (i > 0) {
      doc.fontSize(8).fillColor('#6b7280').font('Helvetica')
        .text(`Texas Teazed Salon CRM Source Code • Page ${i + 1} of ${range.count}`, 40, doc.page.height - 30, { align: 'center' });
    }
  }

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      console.log('PDF successfully created at:', outputPath);
      resolve(outputPath);
    });
    writeStream.on('error', reject);
  });
}

generatePDF().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
