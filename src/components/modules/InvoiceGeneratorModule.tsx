import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice, InvoiceItem, Currency } from '../../types';
import { generateInvoicePDF } from '../../lib/pdfGenerator';
import { FileCode, Download, Printer, Plus, Trash2, CheckCircle2, DollarSign } from 'lucide-react';

export const InvoiceGeneratorModule: React.FC = () => {
  const { addInvoice, showToast, currency: globalCurrency } = useApp();

  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-109');
  const [clientName, setClientName] = useState('Sarah Jenkins');
  const [clientCompany, setClientCompany] = useState('SaaSify Studio (UK)');
  const [clientEmail, setClientEmail] = useState('sarah@saasify.co.uk');
  const [projectName, setProjectName] = useState('React Dashboard & API Integration');
  const [currency, setCurrency] = useState<Currency>(globalCurrency || 'USD');
  const [issueDate, setIssueDate] = useState('2026-07-22');
  const [dueDate, setDueDate] = useState('2026-08-05');
  const [paymentMethod, setPaymentMethod] = useState('Wise / Bank Transfer / Payoneer');
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('Bank: HBL Pakistan / Account: PK12HABB000123456789 / Payoneer ID: chahathassanain@gmail.com');

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Frontend React 19 UI & Dashboard Development', qty: 1, rate: 800, amount: 800 },
    { id: '2', description: 'REST API Integration & State Persistence', qty: 1, rate: 400, amount: 400 },
  ]);

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: 'Additional Milestone / Support',
      qty: 1,
      rate: 150,
      amount: 150,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'qty' || field === 'rate') {
            updated.amount = (Number(updated.qty) || 0) * (Number(updated.rate) || 0);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const subtotal = items.reduce((acc, i) => acc + i.amount, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount - discount;

  const handleGenerateInvoice = () => {
    const newInvoice: Invoice = {
      id: 'inv_' + Date.now(),
      invoiceNumber,
      clientName,
      clientCompany,
      clientEmail,
      projectName,
      items,
      currency,
      taxRate,
      discount,
      issueDate,
      dueDate,
      paymentMethod,
      status: 'Pending',
      total,
      notes,
      createdAt: new Date().toLocaleDateString(),
    };

    addInvoice(newInvoice);
    generateInvoicePDF(newInvoice);
    showToast(`Invoice #${invoiceNumber} created & PDF downloaded!`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900/80 border border-slate-800 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Multi-Currency Invoice Generator</h1>
            <p className="text-xs text-slate-400">
              Create and export professional client invoices in USD, PKR, or EUR with PDF download.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
          <button
            onClick={handleGenerateInvoice}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Download PDF Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Details */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Invoice Number</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="USD">USD ($)</option>
                <option value="PKR">PKR (Rs)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Client Company</label>
              <input
                type="text"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Client Email</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Payment Method</label>
              <input
                type="text"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200">Invoice Items / Milestones</span>
              <button
                onClick={handleAddItem}
                className="px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium rounded-lg transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="md:col-span-6">
                    <label className="text-[10px] text-slate-500 md:hidden block mb-0.5">Description</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      placeholder="Line item description..."
                      className="w-full bg-slate-900 md:bg-transparent text-xs text-slate-100 p-1.5 md:p-0 rounded md:rounded-none border md:border-none border-slate-800 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-3 md:col-span-5 gap-2 items-center">
                    <div>
                      <label className="text-[10px] text-slate-500 md:hidden block mb-0.5">Qty</label>
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                        className="w-full bg-slate-900 text-xs text-slate-100 p-1.5 rounded text-center border border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 md:hidden block mb-0.5">Rate</label>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                        className="w-full bg-slate-900 text-xs text-slate-100 p-1.5 rounded text-right border border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 md:hidden block mb-0.5">Amount</label>
                      <div className="text-xs font-semibold text-slate-200 text-right py-1.5">
                        {item.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end md:justify-center md:col-span-1 pt-1 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Notes / Payment Instructions</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Invoice Summary Card */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider pb-3 border-b border-slate-800">
              Invoice Calculation
            </h3>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold">{currency} {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Tax Rate (%):</span>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-16 bg-slate-950 border border-slate-800 rounded p-1 text-right text-xs"
                />
              </div>

              <div className="flex justify-between items-center">
                <span>Discount ({currency}):</span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-20 bg-slate-950 border border-slate-800 rounded p-1 text-right text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between text-base font-bold text-white">
                <span>Grand Total:</span>
                <span className="text-indigo-400">{currency} {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateInvoice}
            className="mt-8 w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs rounded-2xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Generate & Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
