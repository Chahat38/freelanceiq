import { jsPDF } from 'jspdf';
import { Invoice, ProposalOutput } from '../types';

export const generateInvoicePDF = (invoice: Invoice) => {
  const doc = new jsPDF();

  // Primary branding color #4F46E5 (Indigo)
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, 210, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('FreelanceIQ OS Invoice', 14, 20);

  doc.setFontSize(12);
  doc.text(`#${invoice.invoiceNumber}`, 160, 20);

  // Invoice Details
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Billed To:', 14, 45);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.clientName, 14, 52);
  if (invoice.clientCompany) doc.text(invoice.clientCompany, 14, 58);
  if (invoice.clientEmail) doc.text(invoice.clientEmail, 14, 64);

  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Details:', 120, 45);
  doc.setFont('helvetica', 'normal');
  doc.text(`Issue Date: ${invoice.issueDate}`, 120, 52);
  doc.text(`Due Date: ${invoice.dueDate}`, 120, 58);
  doc.text(`Payment Method: ${invoice.paymentMethod}`, 120, 64);
  doc.text(`Status: ${invoice.status}`, 120, 70);

  // Table Header
  let startY = 82;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, startY, 182, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('Description', 18, startY + 7);
  doc.text('Qty', 110, startY + 7);
  doc.text('Rate', 140, startY + 7);
  doc.text(`Total (${invoice.currency})`, 170, startY + 7);

  startY += 12;
  doc.setFont('helvetica', 'normal');

  invoice.items.forEach((item) => {
    doc.text(item.description.slice(0, 45), 18, startY);
    doc.text(item.qty.toString(), 110, startY);
    doc.text(`${invoice.currency} ${item.rate.toLocaleString()}`, 140, startY);
    doc.text(`${invoice.currency} ${item.amount.toLocaleString()}`, 170, startY);
    startY += 8;
  });

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(14, startY + 2, 196, startY + 2);
  startY += 10;

  // Totals
  const subtotal = invoice.items.reduce((acc, i) => acc + i.amount, 0);
  const taxAmount = (subtotal * (invoice.taxRate || 0)) / 100;
  const discountAmount = invoice.discount || 0;

  doc.setFont('helvetica', 'normal');
  doc.text(`Subtotal: ${invoice.currency} ${subtotal.toLocaleString()}`, 120, startY);
  startY += 6;
  if (invoice.taxRate > 0) {
    doc.text(`Tax (${invoice.taxRate}%): ${invoice.currency} ${taxAmount.toLocaleString()}`, 120, startY);
    startY += 6;
  }
  if (invoice.discount > 0) {
    doc.text(`Discount: -${invoice.currency} ${discountAmount.toLocaleString()}`, 120, startY);
    startY += 6;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(79, 70, 229);
  doc.text(`Grand Total: ${invoice.currency} ${invoice.total.toLocaleString()}`, 120, startY + 4);

  if (invoice.notes) {
    startY += 18;
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('Notes / Payment Instructions:', 14, startY);
    doc.setFont('helvetica', 'normal');
    const splitNotes = doc.splitTextToSize(invoice.notes, 180);
    doc.text(splitNotes, 14, startY + 6);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated with FreelanceIQ AI OS - www.freelanceiq.ai', 14, 285);

  doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
};

export const generateTextPDF = (filename: string, title: string, bodyText: string) => {
  const doc = new jsPDF();

  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, 210, 25, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title.slice(0, 40), 14, 16);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const splitText = doc.splitTextToSize(bodyText, 180);
  doc.text(splitText, 14, 38);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated via FreelanceIQ AI OS', 14, 285);

  doc.save(`${filename}.pdf`);
};
