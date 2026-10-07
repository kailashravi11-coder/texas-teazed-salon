const fs = require('fs');
const path = require('path');

const FILES = [
  { path: 'src/types/crm.ts', title: '1. Types & Services Definition (src/types/crm.ts)' },
  { path: 'src/utils/crmSeed.ts', title: '2. Seed Data Generator (src/utils/crmSeed.ts)' },
  { path: 'src/components/StaffLeadPortal.tsx', title: '3. Master Staff Lead Portal & CRM (src/components/StaffLeadPortal.tsx)' },
  { path: 'src/components/crm/WalkInPosModal.tsx', title: '4. Walk-In Counter POS Modal (src/components/crm/WalkInPosModal.tsx)' },
  { path: 'src/components/crm/StaffManagerModal.tsx', title: '5. Staff Manager Modal (src/components/crm/StaffManagerModal.tsx)' },
  { path: 'src/components/crm/EditPricingModal.tsx', title: '6. Edit Pricing & Formula Modal (src/components/crm/EditPricingModal.tsx)' },
  { path: 'src/components/crm/CrmReportsModal.tsx', title: '7. Commission & CSV Reports Modal (src/components/crm/CrmReportsModal.tsx)' },
  { path: 'src/components/crm/DailyZReportModal.tsx', title: '8. Daily Z-Report Modal (src/components/crm/DailyZReportModal.tsx)' },
  { path: 'src/components/crm/DigitalReceiptModal.tsx', title: '9. Digital Receipt & 1-Click Bill Modal (src/components/crm/DigitalReceiptModal.tsx)' },
  { path: 'src/components/crm/RetentionReminderModal.tsx', title: '10. 6-Week Retention Engine Modal (src/components/crm/RetentionReminderModal.tsx)' },
];

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Texas Teazed Salon - Complete CRM & POS Source Code</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; background: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
    .header { background: #1e293b; border: 1px solid #334155; padding: 24px; border-radius: 16px; margin-bottom: 24px; }
    h1 { margin: 0 0 8px 0; font-size: 24px; color: #38bdf8; }
    p { margin: 4px 0; color: #94a3b8; font-size: 14px; }
    .btn-row { margin-top: 16px; display: flex; gap: 12px; flex-wrap: wrap; }
    .btn { background: #0284c7; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; text-decoration: none; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; }
    .btn:hover { background: #0369a1; }
    .btn-secondary { background: #334155; }
    .btn-secondary:hover { background: #475569; }
    .file-card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; margin-bottom: 24px; overflow: hidden; }
    .file-header { background: #0f172a; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; }
    .file-title { font-weight: bold; color: #f1f5f9; font-size: 14px; }
    pre { margin: 0; padding: 16px; overflow-x: auto; background: #090d16; font-size: 12px; line-height: 1.5; color: #e2e8f0; font-family: "Fira Code", monospace; }
  </style>
</head>
<body>
  <div class="header">
    <h1>👑 TEXAS TEAZED SALON - COMPLETE CRM & POS SOURCE CODE</h1>
    <p>All-in-One Enterprise Staff Lead Portal, 10-Second Walk-in POS, Payroll Commission Audit, Digital Billing, and 6-Week Retention Engine.</p>
    <div class="btn-row">
      <a href="/TEXAS_TEAZED_CRM_COMPLETE_CODE.pdf" download class="btn">📥 Download Official PDF File (206 KB)</a>
      <button onclick="window.print()" class="btn btn-secondary">🖨️ Print / Save as PDF</button>
    </div>
  </div>
`;

for (const file of FILES) {
  const full = path.resolve(file.path);
  const code = fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '// Not found';
  html += `
  <div class="file-card">
    <div class="file-header">
      <span class="file-title">📄 ${file.title}</span>
      <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="copyCode('${file.path.replace(/[/.]/g, '_')}')">Copy Code</button>
    </div>
    <pre id="${file.path.replace(/[/.]/g, '_')}"><code>${escapeHtml(code)}</code></pre>
  </div>
  `;
}

html += `
  <script>
    function copyCode(id) {
      const el = document.getElementById(id);
      navigator.clipboard.writeText(el.innerText);
      alert('Code copied to clipboard! You can paste it directly into your AI chatbox.');
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(path.resolve('public/CRM_SOURCE_CODE.html'), html);
console.log('HTML viewer created at public/CRM_SOURCE_CODE.html');
