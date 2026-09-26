import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Calendar,
  Building2,
  Share2,
} from 'lucide-react';
import { BillingReport, Project, Client, StudioConfig, BillingReportStatus } from '../types';
import { db } from '../services/db';
import { formatCurrency } from '../utils/currency';

interface BillingReportModalProps {
  report: BillingReport;
  project?: Project;
  client?: Client;
  config: StudioConfig;
  onClose: () => void;
}

export const BillingReportModal: React.FC<BillingReportModalProps> = ({
  report,
  project,
  client,
  config,
  onClose,
}) => {
  const [currentStatus, setCurrentStatus] = useState<BillingReportStatus>(report.status);

  const handleStatusChange = (newStatus: BillingReportStatus) => {
    setCurrentStatus(newStatus);
    db.updateBillingReport(report.id, {
      status: newStatus,
      paidAmount: newStatus === 'paid' ? report.totalAmount : report.paidAmount,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-6">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print flex items-center justify-between border-b border-slate-800 px-6 py-3.5 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-indigo-400">
              {report.invoiceNumber}
            </span>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <span>Status:</span>
              <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value as BillingReportStatus)}
                className="rounded border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs capitalize text-slate-100 font-medium focus:outline-none"
              >
                <option value="issued">Issued / Unpaid</option>
                <option value="paid">Paid in Full</option>
                <option value="draft">Draft</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Milestone Billing Statement / Invoice Container */}
        <div className="p-8 md:p-12 bg-white text-slate-900 printable-invoice max-h-[82vh] overflow-y-auto">
          {/* Header Zone: Studio Identity & Document Type */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between pb-8 border-b border-slate-200 gap-6">
            <div>
              <div className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
                {config.studioName}
              </div>
              <p className="text-xs text-slate-600 font-sans mt-0.5">{config.tagline}</p>
              <div className="mt-3 text-xs text-slate-500 font-sans space-y-0.5">
                <p>{config.address}</p>
                <p>{config.email} · {config.phone}</p>
              </div>
            </div>

            <div className="text-left md:text-right">
              <div className="text-sm font-semibold uppercase tracking-widest text-indigo-900">
                Milestone Billing Statement
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-slate-900">
                {report.invoiceNumber}
              </div>
              <div className="mt-2 text-xs text-slate-600 space-y-0.5 font-sans">
                <div>Issue Date: <span className="font-mono text-slate-900">{report.issueDate}</span></div>
                <div>Payment Due: <span className="font-mono text-slate-900">{report.dueDate}</span></div>
                <div className="mt-1">
                  <span
                    className={`inline-block font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      currentStatus === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {currentStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Client & Project Context Zone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-slate-200 text-xs">
            <div>
              <div className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-2">
                Billed Client
              </div>
              <div className="text-base font-bold text-slate-900">
                {client?.name || 'Direct Client'}
              </div>
              {client?.company && <div className="text-slate-600 font-medium">{client.company}</div>}
              {client?.city && <div className="text-slate-500 mt-0.5">{client.city}</div>}
              <div className="text-slate-500 mt-1">{client?.email} · {client?.phone}</div>
            </div>

            <div className="md:text-right">
              <div className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-2">
                Production Engagement
              </div>
              <div className="text-base font-bold text-slate-900">
                {project?.title || 'Studio Production Contract'}
              </div>
              <div className="text-slate-600 mt-0.5 font-medium">
                Milestone: {report.milestoneTitle}
              </div>
              {project && (
                <div className="text-slate-500 font-mono text-[11px] mt-1">
                  Fixed Contract Total: {formatCurrency(project.fixedBudget)}
                </div>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-8">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-800 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 pr-4">Description / Verification Milestone</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 pl-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.items.map((item) => (
                  <tr key={item.id} className="py-4">
                    <td className="py-3.5 pr-4 text-slate-800 font-medium">
                      {item.description}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-600">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-600 tabular-nums">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-3.5 pl-4 text-right font-mono font-semibold text-slate-900 tabular-nums">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-start pt-4 pb-8 border-t border-slate-200 gap-8">
            {/* Payment Wire Instructions */}
            <div className="max-w-xs text-xs space-y-1 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="font-semibold text-slate-800 uppercase tracking-wider text-[10px]">
                Wire / ACH Payment Instructions
              </div>
              <div className="text-slate-600 font-mono text-[11px] space-y-0.5 pt-1">
                <div>Bank: <span className="font-sans text-slate-900 font-medium">{report.bankDetails.bankName}</span></div>
                <div>Account: <span className="text-slate-900">{report.bankDetails.accountName}</span></div>
                <div>Routing: <span className="text-slate-900">{report.bankDetails.routingOrSwift}</span></div>
                <div>Acct #: <span className="text-slate-900">{report.bankDetails.accountNumber}</span></div>
              </div>
            </div>

            {/* Calculations Box */}
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Milestone Total</span>
                <span className="font-mono text-slate-900 font-medium">{formatCurrency(report.totalAmount)}</span>
              </div>
              <div className="border-t-2 border-slate-900 pt-2 flex justify-between text-base font-bold text-slate-900">
                <span>Total Due</span>
                <span className="font-mono">{formatCurrency(report.totalAmount)}</span>
              </div>
              {currentStatus === 'paid' && (
                <div className="flex justify-between text-emerald-700 font-semibold text-xs pt-1">
                  <span>Paid in Full</span>
                  <span className="font-mono">-{formatCurrency(report.totalAmount)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Statement Footnote */}
          <div className="pt-6 border-t border-slate-200 text-[11px] text-slate-500 leading-relaxed">
            <p className="italic">{report.notes}</p>
            <p className="mt-2 text-[10px] text-slate-400">
              Generated automatically by Tahoe Studio Pro OS on Apple M1 Pro. All deliverables and copyright licensing governed under master visual production agreement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
