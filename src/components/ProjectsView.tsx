import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Users2,
  PackageCheck,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  MoreVertical,
  Trash2,
  Edit,
} from 'lucide-react';
import { Project, Employee, Client, ProjectStatus } from '../types';
import { db } from '../services/db';
import { formatCurrency } from '../utils/currency';

interface ProjectsViewProps {
  projects: Project[];
  employees: Employee[];
  clients: Client[];
  onSelectProject: (projectId: string) => void;
  onNewProject: () => void;
  onEditProject: (project: Project) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  employees,
  clients,
  onSelectProject,
  onNewProject,
  onEditProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [empFilter, setEmpFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const client = clients.find((c) => c.id === project.clientId);
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client && client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesEmp =
      empFilter === 'all' || project.assignedEmployeeIds.includes(empFilter);

    return matchesSearch && matchesStatus && matchesEmp;
  });

  const handleDeleteProject = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project and all its records?')) {
      db.deleteProject(projectId);
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : 'Direct Client';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">
            Projects & Multi-Crew Assignments
          </h2>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span>Fixed Budgets & Expense Accounting</span>
            <span aria-hidden="true">·</span>
            <span>{projects.length} Total Contracts</span>
            <span aria-hidden="true">·</span>
            <span>Milestone Billing Automation</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Table
            </button>
          </div>

          <button
            onClick={onNewProject}
            className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search projects by title, client, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">All Production Statuses</option>
            <option value="lead">Lead</option>
            <option value="pre_production">Pre Production</option>
            <option value="production">Production</option>
            <option value="post_production">Post Production</option>
            <option value="deliverables_review">Deliverables Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Employee Filter */}
        <div>
          <select
            value={empFilter}
            onChange={(e) => setEmpFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">All Crew & Assignees</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const clientName = getClientName(project.clientId);
            const totalExp = project.expenses.reduce((s, e) => s + e.amount, 0);
            const netMargin = project.fixedBudget - totalExp;
            const marginPercent =
              project.fixedBudget > 0 ? Math.round((netMargin / project.fixedBudget) * 100) : 0;
            const assignedEmps = employees.filter((e) =>
              project.assignedEmployeeIds.includes(e.id)
            );

            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm transition-all hover:border-indigo-500/50 hover:bg-slate-900 cursor-pointer shadow-xs"
              >
                <div>
                  {/* Top line meta */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-mono uppercase tracking-wider text-[10px] text-indigo-400">
                      {project.category}
                    </span>
                    <span className="capitalize text-slate-300 font-medium">
                      {project.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Title & Client */}
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="text-slate-300 font-medium">{clientName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{project.location}</span>
                  </div>

                  {/* Financial Metrics Strip */}
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 text-center">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">Project Rate</div>
                      <div className="font-mono text-xs font-semibold text-slate-200 tabular-nums">
                        {formatCurrency(project.fixedBudget)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">Expenses</div>
                      <div className="font-mono text-xs font-semibold text-amber-400 tabular-nums">
                        {formatCurrency(totalExp)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">Net Margin</div>
                      <div className="font-mono text-xs font-semibold text-emerald-400 tabular-nums">
                        {marginPercent}%
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Milestones: {project.milestones.filter(m => m.status === 'completed' || m.status === 'paid' || m.status === 'billed').length}/{project.milestones.length}</span>
                      <span className="font-mono font-medium text-slate-300">{project.progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Info: Multi-Employee Crew Avatars & Deliverables Count */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px]">Crew ({assignedEmps.length}):</span>
                    <div className="flex items-center -space-x-1.5">
                      {assignedEmps.slice(0, 3).map((emp) => (
                        <div
                          key={emp.id}
                          style={{ backgroundColor: emp.avatarColor }}
                          className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white ring-1 ring-slate-900"
                          title={`${emp.name} - ${project.employeeProjectRoles?.[emp.id] || emp.role}`}
                        >
                          {emp.name.charAt(0)}
                        </div>
                      ))}
                      {assignedEmps.length > 3 && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[9px] text-slate-300 ring-1 ring-slate-900">
                          +{assignedEmps.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">
                      {project.deliverables.length} deliverables
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditProject(project);
                      }}
                      className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                      title="Edit project settings"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteProject(e, project.id)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-rose-400"
                      title="Delete project"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredProjects.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-800 p-12 text-center">
              <FolderKanban className="h-8 w-8 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-300">No projects match current filter</p>
              <p className="text-xs text-slate-500 mt-1">Try resetting search keywords or status filters</p>
              <button
                onClick={onNewProject}
                className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                + Create New Project
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-medium border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timeline</th>
                <th className="py-3 px-4">Assigned Crew</th>
                <th className="py-3 px-4 text-right">Project Rate</th>
                <th className="py-3 px-4 text-right">Expenses</th>
                <th className="py-3 px-4 text-center">Progress</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredProjects.map((p) => {
                const clientName = getClientName(p.clientId);
                const totalExp = p.expenses.reduce((s, e) => s + e.amount, 0);
                const assignedEmps = employees.filter((e) =>
                  p.assignedEmployeeIds.includes(e.id)
                );

                return (
                  <tr
                    key={p.id}
                    onClick={() => onSelectProject(p.id)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100">{p.title}</div>
                      <div className="text-[11px] text-slate-400 capitalize">{p.category}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{clientName}</td>
                    <td className="py-3.5 px-4 capitalize font-mono text-[11px] text-indigo-400">
                      {p.status.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 tabular-nums">
                      {p.startDate} - {p.endDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center -space-x-1">
                        {assignedEmps.map((emp) => (
                          <div
                            key={emp.id}
                            style={{ backgroundColor: emp.avatarColor }}
                            className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white ring-1 ring-slate-900"
                            title={emp.name}
                          >
                            {emp.name.charAt(0)}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-100 tabular-nums">
                      {formatCurrency(p.fixedBudget)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-medium text-amber-400 tabular-nums">
                      {formatCurrency(totalExp)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                      {p.progress}%
                    </td>
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEditProject(p)}
                          className="rounded p-1 text-slate-400 hover:text-slate-200"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteProject(e, p.id)}
                          className="rounded p-1 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
