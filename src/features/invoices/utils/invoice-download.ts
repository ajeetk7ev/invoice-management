import type { Invoice } from '../types/invoice.types'
import { formatCurrency } from './invoice-calculations'

/**
 * Generates an HTML invoice document and triggers native browser printing / Save to PDF.
 */
export function printInvoice(invoice: Invoice): void {
  const printWindow = window.open('', '_blank', 'width=900,height=800')
  if (!printWindow) {
    alert('Please allow popups to print or download the invoice.')
    return
  }

  const itemsHtml = invoice.lineItems
    .map(
      (item, idx) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${idx + 1}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
        <strong>${item.description}</strong>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatCurrency(item.unitPrice, invoice.currency)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">${(item.taxRate * 100).toFixed(0)}%</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600;">${formatCurrency(item.amount, invoice.currency)}</td>
    </tr>
  `
    )
    .join('')

  const statusColor =
    invoice.status === 'PAID'
      ? '#059669'
      : invoice.status === 'PENDING'
      ? '#d97706'
      : invoice.status === 'OVERDUE'
      ? '#e11d48'
      : '#64748b'

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice - ${invoice.invoiceNumber}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            margin: 40px;
            font-size: 14px;
            line-height: 1.5;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .brand-title {
            font-size: 26px;
            font-weight: 800;
            color: #1e3a8a;
            margin: 0;
            letter-spacing: -0.5px;
          }
          .brand-subtitle {
            font-size: 12px;
            color: #64748b;
            margin: 4px 0 0 0;
          }
          .invoice-title {
            text-align: right;
          }
          .invoice-number {
            font-size: 20px;
            font-weight: 700;
            margin: 0;
          }
          .status-badge {
            display: inline-block;
            margin-top: 6px;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 700;
            color: white;
            background-color: ${statusColor};
            text-transform: uppercase;
          }
          .parties {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .party-card {
            width: 46%;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
          }
          .party-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #64748b;
            font-weight: 700;
            margin-bottom: 6px;
          }
          .dates-bar {
            display: flex;
            background: #f1f5f9;
            padding: 12px 16px;
            border-radius: 6px;
            margin-bottom: 24px;
            justify-content: space-between;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th {
            background-color: #0f172a;
            color: white;
            padding: 10px;
            font-size: 12px;
            text-transform: uppercase;
          }
          .totals-section {
            display: flex;
            justify-content: flex-end;
          }
          .totals-table {
            width: 340px;
            margin-bottom: 20px;
          }
          .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            font-size: 13px;
          }
          .totals-row.grand-total {
            border-top: 2px solid #0f172a;
            padding-top: 10px;
            font-size: 16px;
            font-weight: 800;
            color: #1e3a8a;
          }
          .totals-row.balance {
            border-top: 1px dashed #cbd5e1;
            padding-top: 8px;
            font-weight: 700;
            color: #e11d48;
          }
          .footer {
            margin-top: 40px;
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
            font-size: 12px;
            color: #64748b;
            text-align: center;
          }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="brand-title">FREIGHTFOX</h1>
            <p class="brand-subtitle">Enterprise Logistics & Freight Solutions</p>
            <p style="font-size: 12px; color: #475569; margin-top: 8px;">
              GSTIN: 29AABCF1234F1Z8<br/>
              Logistics Gateway Tower, Suite 400<br/>
              Bangalore, KA, India - 560100
            </p>
          </div>
          <div class="invoice-title">
            <h2 class="invoice-number">${invoice.invoiceNumber}</h2>
            <div class="status-badge">${invoice.status}</div>
          </div>
        </div>

        <div class="dates-bar">
          <div><strong>Issue Date:</strong> ${invoice.issueDate}</div>
          <div><strong>Due Date:</strong> ${invoice.dueDate}</div>
          <div><strong>Currency:</strong> ${invoice.currency}</div>
          ${invoice.trackingNumber ? `<div><strong>Waybill / Tracking:</strong> ${invoice.trackingNumber}</div>` : ''}
        </div>

        <div class="parties">
          <div class="party-card">
            <div class="party-label">Billed To</div>
            <div style="font-weight: 700; font-size: 15px;">${invoice.customer.company}</div>
            <div>Attn: ${invoice.customer.name}</div>
            <div>Email: ${invoice.customer.email}</div>
            ${invoice.customer.taxId ? `<div>GSTIN/Tax ID: ${invoice.customer.taxId}</div>` : ''}
            <div>${invoice.customer.address || 'Standard Commercial Hub'}, ${invoice.customer.city || 'Bangalore'}</div>
          </div>
          <div class="party-card">
            <div class="party-label">Logistics Transit Details</div>
            <div><strong>Origin:</strong> ${invoice.originHub || 'Central Warehouse Hub'}</div>
            <div><strong>Destination:</strong> ${invoice.destinationHub || 'Regional Distribution Center'}</div>
            <div><strong>Terms:</strong> ${invoice.paymentTerms || 'Net 30 Days'}</div>
            ${invoice.notes ? `<div style="margin-top: 6px; font-style: italic; color: #64748b;">Notes: ${invoice.notes}</div>` : ''}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 40px; text-align: center;">#</th>
              <th style="text-align: left;">Description</th>
              <th style="width: 70px; text-align: right;">Qty</th>
              <th style="width: 120px; text-align: right;">Unit Price</th>
              <th style="width: 80px; text-align: right;">GST Rate</th>
              <th style="width: 130px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals-section">
          <div class="totals-table">
            <div class="totals-row">
              <span>Subtotal:</span>
              <span>${formatCurrency(invoice.subtotal, invoice.currency)}</span>
            </div>
            <div class="totals-row">
              <span>Total Tax (GST):</span>
              <span>${formatCurrency(invoice.tax, invoice.currency)}</span>
            </div>
            <div class="totals-row grand-total">
              <span>Total Amount:</span>
              <span>${formatCurrency(invoice.total, invoice.currency)}</span>
            </div>
            <div class="totals-row">
              <span>Amount Paid:</span>
              <span>${formatCurrency(invoice.amountPaid, invoice.currency)}</span>
            </div>
            <div class="totals-row balance">
              <span>Balance Due:</span>
              <span>${formatCurrency(invoice.amountDue, invoice.currency)}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for choosing FreightFox. For billing inquiries, contact finance@freightfox.ai</p>
          <p style="font-size: 11px; color: #94a3b8;">This is a computer-generated tax invoice and requires no physical signature.</p>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          }
        </script>
      </body>
    </html>
  `

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
}
