import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  FolderKanban,
  Users2,
  PackageCheck,
  Building2,
  FileSpreadsheet,
  ArrowRight,
} from 'lucide-react';
import { Project, Employee, Client, Deliverable, BillingReport } from '../types';

interface SpotlightSearchModalProps {
  projects: Project[];
  employees: Employee[];
  clients: Client[];
  billingReports: BillingReport[];
  onClose: () => void;
  onSelectProject: (projectId: string) => void;
  onSelectTab: (tab: string) => void;
  onOpenReport: (reportId: string) => void;
}

export const SpotlightSearchModal: React.FC<SpotlightSearchModalProps> = ({
  projects,
  employees,
  clients,
  billingReports,
  onClose,
  onSelectProject,
  onSelectTab,
  onOpenReport,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const cleanQ = query.trim().toLowerCase();

  const matchingProjects = cleanQ
    ? projects.filter(
        (p) =>
          p.title.toLowerCase().includes(cleanQ) ||
          p.location.toLowerCase().includes(cleanQ) ||
          p.category.toLowerCase().includes(cleanQ)
      )
    : projects.slice(0, 3);

  const matchingEmployees = cleanQ
    ? employees.filter(
        (e) =>
          e.name.toLowerCase().includes(cleanQ) ||
          e.role.toLowerCase().includes(cleanQ) ||
          e.skills.some((s) => s.toLowerCase().includes(cleanQ))
      )
    : employees.slice(0, 2);

  const matchingClients = cleanQ
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(cleanQ) ||
          (c.company && c.company.toLowerCase().includes(cleanQ)) ||
          c.city.toLowerCase().includes(cleanQ)
      )
    : clients.slice(0, 2);

  const matchingInvoices = cleanQ
    ? billingReports.filter(
        (r) =>
          r.invoiceNumber.toLowerCase().includes(cleanQ) ||
          r.milestoneTitle.toLowerCase().includes(cleanQ)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/80 p-4 pt-20 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden animate-fade-in">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3.5 bg-slate-950/80">
          <Search className="h-5 w-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type to search projects, employees, deliverables, invoices..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
          />
          <kbd className="rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Projects */}
          {matchingProjects.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-2 mb-1.5 flex items-center gap-1.5">
                <FolderKanban className="h-3 w-3 text-indigo-400" />
                <span>Projects ({matchingProjects.length})</span>
              </div>
              <div className="space-y-1">
                {matchingProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProject(p.id);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-lg p-2 text-left hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="truncate pr-2">
                      <div className="font-medium text-slate-200 group-hover:text-indigo-300">
                        {p.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Budget: ${p.fixedBudget.toLocaleString()} · Progress: {p.progress}%
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0 opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Employees */}
          {matchingEmployees.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-2 mb-1.5 flex items-center gap-1.5">
                <Users2 className="h-3 w-3 text-indigo-400" />
                <span>Crew & Employees ({matchingEmployees.length})</span>
              </div>
              <div className="space-y-1">
                {matchingEmployees.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => {
                      onSelectTab('employees');
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-lg p-2 text-left hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        style={{ backgroundColor: e.avatarColor }}
                        className="h-6 w-6 rounded-full text-[10px] font-bold text-white flex items-center justify-center shrink-0"
                      >
                        {e.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-200 group-hover:text-indigo-300">
                          {e.name}
                        </div>
                        <div className="text-[11px] text-slate-400">{e.role}</div>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">${e.hourlyRate}/hr</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clients */}
          {matchingClients.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-2 mb-1.5 flex items-center gap-1.5">
                <Building2 className="h-3 w-3 text-indigo-400" />
                <span>Clients ({matchingClients.length})</span>
              </div>
              <div className="space-y-1">
                {matchingClients.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectTab('clients');
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-lg p-2 text-left hover:bg-slate-800/80 transition-colors group"
                  >
                    <div>
                      <div className="font-medium text-slate-200 group-hover:text-indigo-300">
                        {c.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{c.city}</div>
                    </div>
                    <span className="font-mono text-[10px] text-indigo-400">
                      {c.portalAccessCode}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Invoices */}
          {matchingInvoices.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-2 mb-1.5 flex items-center gap-1.5">
                <FileSpreadsheet className="h-3 w-3 text-indigo-400" />
                <span>Milestone Invoices ({matchingInvoices.length})</span>
              </div>
              <div className="space-y-1">
                {matchingInvoices.map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => {
                      onOpenReport(inv.id);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-lg p-2 text-left hover:bg-slate-800/80 transition-colors group"
                  >
                    <div>
                      <div className="font-mono text-indigo-400 font-bold">
                        {inv.invoiceNumber}
                      </div>
                      <div className="text-[11px] text-slate-300">{inv.milestoneTitle}</div>
                    </div>
                    <span className="font-mono font-bold text-slate-100">
                      ${inv.totalAmount.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
