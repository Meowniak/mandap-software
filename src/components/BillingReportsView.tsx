import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Printer,
  DollarSign,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowUpRight,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { BillingReport, Project, Client, Milestone, StudioConfig } from '../types';
import { db } from '../services/db';

interface BillingReportsViewProps {
  billingReports: BillingReport[];
  projects: Project[];
  clients: Client[];
  config: StudioConfig;
  onOpenReport: (reportId: string) => void;
  onSelectProject: (projectId: string) => void;
}

export const BillingReportsView: React.FC<BillingReportsViewProps> = ({
  billingReports,
  projects,
  clients,
  config,
  onOpenReport,
  onSelectProject,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGeneratorDrawer, setShowGeneratorDrawer] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('');

  const selectedProjObj = projects.find((p) => p.id === selectedProjectId);
  const availableMilestones = selectedProjObj ? selectedProjObj.milestones : [];

  const filteredReports = billingReports.filter((rep) => {
    const proj = projects.find((p) => p.id === rep.projectId);
    const cli = clients.find((c) => c.id === rep.clientId);

    const matchesStatus = statusFilter === 'all' || rep.status === statusFilter;
    const matchesSearch =
      rep.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.milestoneTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (proj && proj.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (cli && cli.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const totalInvoiced = billingReports.reduce((s, r) => s + r.totalAmount, 0);
  const totalPaid = billingReports
    .filter((r) => r.status === 'paid')
    .reduce((s, r) => s + r.totalAmount, 0);
  const totalOutstanding = totalInvoiced - totalPaid;

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !selectedMilestoneId) return;

    try {
      const rep = db.generateAutomatedBillingReport(selectedProjectId, selectedMilestoneId);
      setShowGeneratorDrawer(false);
      onOpenReport(rep.id);
    } catch (err) {
      console.error(err);
      alert('Failed to generate billing report');
    }
  };

  const handleDeleteReport = (e: React.MouseEvent, reportId: string) => {
    e.stopPropagation();
    if (confirm('Delete this billing report record?')) {
      db.deleteBillingReport(reportId);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">
            Automated Milestone Billing & Invoices
          </h2>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span>Automated Milestone Reports for Completed Phases</span>
            <span aria-hidden="true">·</span>
            <span>{billingReports.length} Invoices Generated</span>
            <span aria-hidden="true">·</span>
            <span>Print & PDF Export Engine</span>
          </div>
        </div>

        <button
          onClick={() => setShowGeneratorDrawer(!showGeneratorDrawer)}
          className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-xs"
        >
          <Sparkles className="h-4 w-4" />
          <span>Generate Milestone Invoice</span>
        </button>
      </div>

      {/* Generator Drawer */}
      {showGeneratorDrawer && (
        <form
          onSubmit={handleGenerateReport}
          className="rounded-xl border border-indigo-500/40 bg-slate-900 p-5 space-y-4 shadow-xl animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Generate Automated Billing Report for Milestone
            </h4>
            <button
              type="button"
              onClick={() => setShowGeneratorDrawer(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Select Project
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  setSelectedMilestoneId('');
                }}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} (Budget: ${p.fixedBudget.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Select Milestone to Bill
              </label>
              <select
                value={selectedMilestoneId}
                onChange={(e) => setSelectedMilestoneId(e.target.value)}
                required
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
              >
                <option value="">-- Choose Milestone --</option>
                {availableMilestones.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.percentage}% · ${m.amount.toLocaleString()}) [{m.status}]
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-xs"
            >
              Create & Preview Invoice
            </button>
          </div>
        </form>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
          <div className="text-xs text-slate-400">Total Billed via Milestones</div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100 tabular-nums">
            ${totalInvoiced.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-400">Across {billingReports.length} statements</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
          <div className="text-xs text-slate-400">Total Collected & Cleared</div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            ${totalPaid.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-400">Direct wire & ACH deposits</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
          <div className="text-xs text-slate-400">Outstanding Receivables</div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-400 tabular-nums">
            ${totalOutstanding.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-400">Awaiting client payment</div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search invoice number, client, project, or milestone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">All Payment Statuses</option>
            <option value="issued">Issued / Unpaid</option>
            <option value="paid">Paid in Full</option>
            <option value="draft">Draft</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 font-medium border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Invoice #</th>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Project</th>
              <th className="py-3 px-4">Milestone Release</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Total Amount</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredReports.map((rep) => {
              const proj = projects.find((p) => p.id === rep.projectId);
              const cli = clients.find((c) => c.id === rep.clientId);

              return (
                <tr
                  key={rep.id}
                  onClick={() => onOpenReport(rep.id)}
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                    {rep.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-200">
                    {cli ? cli.name : 'Direct Client'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 truncate max-w-xs">
                    {proj ? proj.title : 'Project'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 truncate max-w-xs">
                    {rep.milestoneTitle}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 tabular-nums">
                    {rep.dueDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        rep.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {rep.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-100 tabular-nums">
                    ${rep.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onOpenReport(rep.id)}
                        className="rounded p-1 text-slate-400 hover:text-indigo-300"
                        title="View / Print Statement"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteReport(e, rep.id)}
                        className="rounded p-1 text-slate-400 hover:text-rose-400"
                        title="Delete invoice record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredReports.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  No billing reports found. Click "Generate Milestone Invoice" above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
