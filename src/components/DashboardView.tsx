import React, { useState } from 'react';
import {
  TrendingUp,
  Receipt,
  FolderKanban,
  CheckCircle2,
  Clock,
  BookOpen,
  Video,
  Film,
  Frame,
  HardDrive,
  Users2,
  AlertCircle,
  CalendarDays,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { Project, Employee, Client, Deliverable } from '../types';
import { formatCurrency } from '../utils/currency';

interface DashboardViewProps {
  projects: Project[];
  employees: Employee[];
  clients: Client[];
  onSelectProject: (projectId: string) => void;
  onNavigateToTab: (tab: string) => void;
  onNewProject: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  employees,
  clients,
  onSelectProject,
  onNavigateToTab,
  onNewProject,
}) => {
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'active'>('active');

  // Calculate aggregates
  const totalFixedBudget = projects.reduce((acc, p) => acc + p.fixedBudget, 0);

  const totalExpenses = projects.reduce((acc, p) => {
    const projExpenses = p.expenses.reduce((sum, e) => sum + e.amount, 0);
    return acc + projExpenses;
  }, 0);

  const netStudioMargin = totalFixedBudget - totalExpenses;
  const netMarginPercent = totalFixedBudget > 0 ? (netStudioMargin / totalFixedBudget) * 100 : 0;

  // Flatten deliverables
  const allDeliverables: (Deliverable & { projectTitle: string; clientName: string })[] = [];
  projects.forEach((p) => {
    const client = clients.find((c) => c.id === p.clientId);
    p.deliverables.forEach((d) => {
      allDeliverables.push({
        ...d,
        projectTitle: p.title,
        clientName: client ? client.name : 'Unknown Client',
      });
    });
  });

  const pendingDeliverables = allDeliverables.filter((d) => d.status !== 'delivered');
  const photobooksCount = allDeliverables.filter((d) => d.type === 'photobook').length;
  const reelsCount = allDeliverables.filter((d) => d.type === 'reels').length;
  const highlightsCount = allDeliverables.filter((d) => d.type === 'highlights').length;
  const framesCount = allDeliverables.filter((d) => d.type === 'frames').length;
  const pendrivesCount = allDeliverables.filter((d) => d.type === 'pendrives').length;

  const filteredTimelineProjects = projects.filter((p) =>
    timelineFilter === 'active'
      ? ['pre_production', 'production', 'post_production', 'deliverables_review'].includes(p.status)
      : true
  );

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : 'Direct Client';
  };

  const getDeliverableIcon = (type: string) => {
    switch (type) {
      case 'photobook':
        return BookOpen;
      case 'reels':
        return Video;
      case 'highlights':
        return Film;
      case 'frames':
        return Frame;
      case 'pendrives':
        return HardDrive;
      default:
        return CheckCircle2;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">
            Studio Operations Overview
          </h2>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span>Apple Silicon M1 Pro Studio Engine</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Local Ledger</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-medium">All Data Synchronized</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToTab('billing')}
            className="rounded-md border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Milestone Invoices
          </button>
          <button
            onClick={onNewProject}
            className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-xs"
          >
            <span>+ New Project</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Contracted Budget */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Fixed Contracted Value</span>
            <FolderKanban className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-3 text-2xl font-bold font-mono tabular-nums text-slate-100">
            {formatCurrency(totalFixedBudget)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span>Across {projects.length} signed production contracts</span>
          </div>
        </div>

        {/* Total Production Expenses */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Production Expenses</span>
            <Receipt className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-3 text-2xl font-bold font-mono tabular-nums text-amber-300">
            {formatCurrency(totalExpenses)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span>Gear, travel, lab & fabrication</span>
          </div>
        </div>

        {/* Net Studio Operating Margin */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Net Studio Margin</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3 text-2xl font-bold font-mono tabular-nums text-emerald-400">
            {formatCurrency(netStudioMargin)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="font-mono font-medium text-emerald-300">
              {netMarginPercent.toFixed(1)}%
            </span>
            <span>gross profitability ratio</span>
          </div>
        </div>

        {/* Deliverables Pipeline */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Deliverables in Flight</span>
            <Clock className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-3 text-2xl font-bold font-mono tabular-nums text-sky-300">
            {pendingDeliverables.length}{' '}
            <span className="text-sm font-normal text-slate-400">/ {allDeliverables.length}</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span>Albums, reels, films, frames & USBs</span>
          </div>
        </div>
      </div>

      {/* Interactive Project Timeline & Gantt Visualizer */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-indigo-400" />
              <span>Project Timelines & Production Milestones</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-project timeline with phase checkpoints, crew allocation, and deliverable handoffs
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setTimelineFilter('active')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                timelineFilter === 'active'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Active Projects ({projects.filter((p) => p.status !== 'completed').length})
            </button>
            <button
              onClick={() => setTimelineFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                timelineFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({projects.length})
            </button>
          </div>
        </div>

        {/* Timeline Bars Grid */}
        <div className="mt-6 space-y-5">
          {filteredTimelineProjects.map((project) => {
            const clientName = getClientName(project.clientId);
            const assignedEmps = employees.filter((e) =>
              project.assignedEmployeeIds.includes(e.id)
            );
            const projectExpensesSum = project.expenses.reduce((acc, e) => acc + e.amount, 0);
            const budgetPercentUsed =
              project.fixedBudget > 0
                ? Math.min(100, Math.round((projectExpensesSum / project.fixedBudget) * 100))
                : 0;

            const completedMilestones = project.milestones.filter(
              (m) => m.status === 'completed' || m.status === 'billed' || m.status === 'paid'
            ).length;

            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className="group cursor-pointer rounded-lg border border-slate-800/80 bg-slate-950/60 p-4 transition-all hover:border-slate-700 hover:bg-slate-950"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  {/* Left: Project & Client Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                        {project.title}
                      </h4>
                      <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{clientName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{project.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{project.startDate} to {project.endDate}</span>
                    </div>
                  </div>

                  {/* Right: Budget & Assignees Preview */}
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    {/* Fixed Budget vs Expenses */}
                    <div className="text-right">
                      <div className="font-mono font-medium text-slate-200 tabular-nums">
                        {formatCurrency(projectExpensesSum)} / {formatCurrency(project.fixedBudget)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {budgetPercentUsed}% expense ratio
                      </div>
                    </div>

                    {/* Assigned Employees Avatars */}
                    <div className="flex items-center -space-x-1.5">
                      {assignedEmps.slice(0, 4).map((emp) => (
                        <div
                          key={emp.id}
                          style={{ backgroundColor: emp.avatarColor }}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-slate-950"
                          title={`${emp.name} (${project.employeeProjectRoles?.[emp.id] || emp.role})`}
                        >
                          {emp.name.charAt(0)}
                        </div>
                      ))}
                      {assignedEmps.length > 4 && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px] text-slate-300 ring-2 ring-slate-950">
                          +{assignedEmps.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Visual Progress Bar & Milestones Strip */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <span className="capitalize text-slate-300 font-medium">
                        {project.status.replace(/_/g, ' ')}
                      </span>
                      <span>— Progress {project.progress}%</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {completedMilestones} of {project.milestones.length} milestones cleared
                    </span>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-800/80">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>

                  {/* Milestone flags under bar */}
                  <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    {project.milestones.map((ms) => {
                      const isDone = ms.status === 'completed' || ms.status === 'billed' || ms.status === 'paid';
                      return (
                        <div
                          key={ms.id}
                          className="flex items-center gap-1.5 truncate text-slate-400"
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                              isDone ? 'bg-emerald-400' : 'bg-slate-600'
                            }`}
                          />
                          <span className={`truncate ${isDone ? 'text-slate-300' : 'text-slate-500'}`}>
                            {ms.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Deliverables Horizon & Team Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deliverables Management Horizon */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-indigo-400" />
                  <span>Deliverables Pipeline</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Physical & digital client heirlooms in fabrication
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab('deliverables')}
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>

            {/* Deliverable Type Breakdown Counters */}
            <div className="mt-4 grid grid-cols-5 gap-2 text-center">
              <div className="rounded-lg border border-slate-800/80 bg-slate-950 p-2.5">
                <BookOpen className="h-4 w-4 mx-auto text-indigo-400 mb-1" />
                <div className="text-xs font-mono font-bold text-slate-200">{photobooksCount}</div>
                <div className="text-[10px] text-slate-400">Books</div>
              </div>
              <div className="rounded-lg border border-slate-800/80 bg-slate-950 p-2.5">
                <Video className="h-4 w-4 mx-auto text-sky-400 mb-1" />
                <div className="text-xs font-mono font-bold text-slate-200">{reelsCount}</div>
                <div className="text-[10px] text-slate-400">Reels</div>
              </div>
              <div className="rounded-lg border border-slate-800/80 bg-slate-950 p-2.5">
                <Film className="h-4 w-4 mx-auto text-amber-400 mb-1" />
                <div className="text-xs font-mono font-bold text-slate-200">{highlightsCount}</div>
                <div className="text-[10px] text-slate-400">Films</div>
              </div>
              <div className="rounded-lg border border-slate-800/80 bg-slate-950 p-2.5">
                <Frame className="h-4 w-4 mx-auto text-emerald-400 mb-1" />
                <div className="text-xs font-mono font-bold text-slate-200">{framesCount}</div>
                <div className="text-[10px] text-slate-400">Frames</div>
              </div>
              <div className="rounded-lg border border-slate-800/80 bg-slate-950 p-2.5">
                <HardDrive className="h-4 w-4 mx-auto text-purple-400 mb-1" />
                <div className="text-xs font-mono font-bold text-slate-200">{pendrivesCount}</div>
                <div className="text-[10px] text-slate-400">USBs</div>
              </div>
            </div>

            {/* Urgent / In-Progress Deliverables List */}
            <div className="mt-4 space-y-2.5">
              {pendingDeliverables.slice(0, 4).map((d) => {
                const Icon = getDeliverableIcon(d.type);
                return (
                  <div
                    key={d.id}
                    onClick={() => onNavigateToTab('deliverables')}
                    className="flex items-center justify-between rounded-lg border border-slate-800/60 bg-slate-950/40 px-3.5 py-2.5 text-xs hover:border-slate-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded bg-slate-800 text-slate-300">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-medium text-slate-200 truncate max-w-xs">{d.title}</div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {d.clientName} · {d.projectTitle}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[11px] text-slate-300 capitalize">
                        {d.status.replace(/_/g, ' ')}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">Due {d.targetDueDate}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Multi-Employee Assignment & Crew Roster */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                  <Users2 className="h-4 w-4 text-indigo-400" />
                  <span>Crew Deployment & Roles</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Multi-employee project assignments and current status
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab('employees')}
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>Manage Crew</span>
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {employees.slice(0, 5).map((emp) => {
                const assignedCount = projects.filter((p) =>
                  p.assignedEmployeeIds.includes(emp.id)
                ).length;

                return (
                  <div
                    key={emp.id}
                    onClick={() => onNavigateToTab('employees')}
                    className="flex items-center justify-between rounded-lg border border-slate-800/60 bg-slate-950/40 p-3 text-xs hover:border-slate-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        style={{ backgroundColor: emp.avatarColor }}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs"
                      >
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-200">{emp.name}</div>
                        <div className="text-[11px] text-slate-400">{emp.role}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-mono font-medium text-indigo-300 tabular-nums">
                          {assignedCount} {assignedCount === 1 ? 'project' : 'projects'}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-mono">
                          {formatCurrency(emp.projectRate ?? 15000)} / proj
                        </div>
                      </div>
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          emp.status === 'on_assignment'
                            ? 'bg-amber-400'
                            : emp.status === 'available'
                            ? 'bg-emerald-400'
                            : 'bg-slate-500'
                        }`}
                        title={emp.status}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
