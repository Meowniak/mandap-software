import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingDown,
  TrendingUp,
  FolderKanban,
  Trash2,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { Project, Employee, Expense, ExpenseCategory } from '../types';
import { db } from '../services/db';
import { formatCurrency } from '../utils/currency';

interface ExpensesViewProps {
  projects: Project[];
  employees: Employee[];
  onSelectProject: (projectId: string) => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  projects,
  employees,
  onSelectProject,
}) => {
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Collect all expenses flattened
  const allExpenses: (Expense & { project: Project })[] = [];
  projects.forEach((proj) => {
    proj.expenses.forEach((exp) => {
      allExpenses.push({
        ...exp,
        project: proj,
      });
    });
  });

  const filteredExpenses = allExpenses.filter((item) => {
    const matchesProj = projectFilter === 'all' || item.projectId === projectFilter;
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch =
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.receiptRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.project.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesProj && matchesCat && matchesSearch;
  });

  const totalFixedBudget = projects.reduce((s, p) => s + p.fixedBudget, 0);
  const totalExpensesLogged = allExpenses.reduce((s, e) => s + e.amount, 0);
  const netMargin = totalFixedBudget - totalExpensesLogged;

  // Breakdown by category
  const categories: ExpenseCategory[] = [
    'Equipment Rental',
    'Travel & Transportation',
    'Assistant & Crew Stipend',
    'Storage & Hard Drives',
    'Printing & Lab Fabrication',
    'Location & Studio Fees',
    'Catering & Hospitality',
    'Miscellaneous',
  ];

  const categoryTotals: Record<string, number> = {};
  categories.forEach((cat) => {
    categoryTotals[cat] = allExpenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
  });

  const handleDeleteExpense = (projectId: string, expId: string) => {
    if (confirm('Delete this expense entry?')) {
      db.deleteExpense(projectId, expId);
    }
  };

  const handleToggleStatus = (projectId: string, expId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'approved' ? 'reimbursed' : 'approved';
    db.updateExpense(projectId, expId, { status: nextStatus as any });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">
            Fixed Budget & Expense Ledger
          </h2>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span>Contracted Budget Limits vs Actual Costs</span>
            <span aria-hidden="true">·</span>
            <span>{allExpenses.length} Expense Records</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Financial Audit</span>
          </div>
        </div>
      </div>

      {/* Top Financial Stat Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
          <div className="text-xs text-slate-400">Total Fixed Contract Portfolio</div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100 tabular-nums">
            {formatCurrency(totalFixedBudget)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Combined contracted client fees
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
          <div className="text-xs text-slate-400">Total Actual Production Expenses</div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {formatCurrency(totalExpensesLogged)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Gear rentals, lab prints, flights, stipends
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
          <div className="text-xs text-slate-400">Net Studio Production Margin</div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {formatCurrency(netMargin)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {totalFixedBudget > 0 ? ((netMargin / totalFixedBudget) * 100).toFixed(1) : 0}% Gross Profit
          </div>
        </div>
      </div>

      {/* Category Breakdown Horizontal Pills */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
          Expense Breakdown by Production Category
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {categories.map((cat) => {
            const amount = categoryTotals[cat] || 0;
            return (
              <div key={cat} className="rounded-lg bg-slate-950/80 p-3 border border-slate-800/80">
                <div className="text-[11px] text-slate-400 truncate">{cat}</div>
                <div className="mt-1 font-mono font-bold text-slate-200 tabular-nums">
                  {formatCurrency(amount)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search description or receipt ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">All Studio Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} (${p.fixedBudget.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 font-medium border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Project</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Receipt Ref</th>
              <th className="py-3 px-4">Paid By</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredExpenses.map((exp) => {
              const payer = employees.find((e) => e.id === exp.paidByEmployeeId);

              return (
                <tr key={exp.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400 tabular-nums">{exp.date}</td>
                  <td
                    onClick={() => onSelectProject(exp.projectId)}
                    className="py-3 px-4 font-medium text-slate-200 hover:text-indigo-400 cursor-pointer truncate max-w-xs"
                  >
                    {exp.project.title}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-medium">{exp.category}</td>
                  <td className="py-3 px-4 text-slate-300">{exp.description}</td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{exp.receiptRef}</td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {payer ? payer.name : 'Studio Direct'}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleStatus(exp.projectId, exp.id, exp.status)}
                      className={`rounded px-2 py-0.5 text-[10px] font-mono capitalize transition-colors ${
                        exp.status === 'reimbursed'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                          : exp.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {exp.status}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-amber-300 tabular-nums">
                    {formatCurrency(exp.amount)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDeleteExpense(exp.projectId, exp.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Delete expense entry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredExpenses.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500">
                  No expense records match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
