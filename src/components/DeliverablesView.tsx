import React, { useState } from 'react';
import {
  PackageCheck,
  BookOpen,
  Video,
  Film,
  Frame,
  HardDrive,
  Search,
  Filter,
  CheckCircle2,
  Plus,
  Clock,
  ArrowUpRight,
  Truck,
  Trash2,
} from 'lucide-react';
import { Deliverable, DeliverableType, DeliverableStatus, Project, Employee, Client } from '../types';
import { db } from '../services/db';

interface DeliverablesViewProps {
  projects: Project[];
  employees: Employee[];
  clients: Client[];
  onSelectProject: (projectId: string) => void;
}

export const DeliverablesView: React.FC<DeliverablesViewProps> = ({
  projects,
  employees,
  clients,
  onSelectProject,
}) => {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Collect all deliverables flattened with project and client info
  const allDeliverables: (Deliverable & { project: Project; client?: Client })[] = [];
  projects.forEach((proj) => {
    const client = clients.find((c) => c.id === proj.clientId);
    proj.deliverables.forEach((del) => {
      allDeliverables.push({
        ...del,
        project: proj,
        client,
      });
    });
  });

  const filtered = allDeliverables.filter((item) => {
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.specifications.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.client && item.client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.project.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });

  const handleStatusChange = (projectId: string, delId: string, newStatus: DeliverableStatus) => {
    db.updateDeliverable(projectId, delId, { status: newStatus });
  };

  const handleToggleApproval = (projectId: string, delId: string, current: boolean) => {
    db.updateDeliverable(projectId, delId, { clientApproved: !current });
  };

  const handleDeleteDeliverable = (projectId: string, delId: string) => {
    if (confirm('Delete this deliverable?')) {
      db.deleteDeliverable(projectId, delId);
    }
  };

  const getDeliverableIcon = (type: DeliverableType) => {
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
        return PackageCheck;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">
            Client Deliverables Studio
          </h2>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span>Photobooks, Reels, Highlights, Frames & Pendrives</span>
            <span aria-hidden="true">·</span>
            <span>{allDeliverables.length} Total Deliverables</span>
            <span aria-hidden="true">·</span>
            <span>Client Proofing & Lab Fabrication</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs by Deliverable Type */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'all', label: 'All Items', icon: PackageCheck, count: allDeliverables.length },
          {
            id: 'photobook',
            label: 'Photobooks',
            icon: BookOpen,
            count: allDeliverables.filter((d) => d.type === 'photobook').length,
          },
          {
            id: 'reels',
            label: 'Social Reels (9:16)',
            icon: Video,
            count: allDeliverables.filter((d) => d.type === 'reels').length,
          },
          {
            id: 'highlights',
            label: 'Cinematic Highlights',
            icon: Film,
            count: allDeliverables.filter((d) => d.type === 'highlights').length,
          },
          {
            id: 'frames',
            label: 'Wall Frames & Canvas',
            icon: Frame,
            count: allDeliverables.filter((d) => d.type === 'frames').length,
          },
          {
            id: 'pendrives',
            label: 'Engraved USB Vaults',
            icon: HardDrive,
            count: allDeliverables.filter((d) => d.type === 'pendrives').length,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = typeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                  isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search deliverables, specs, client name..."
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
            <option value="all">All Production Stages</option>
            <option value="drafting">Drafting & Asset Prep</option>
            <option value="in_progress">In Progress</option>
            <option value="client_review">Client Review & Proofing</option>
            <option value="ready_for_press">Ready for Press / Lab</option>
            <option value="completed">Completed / Packaged</option>
            <option value="delivered">Delivered to Client</option>
          </select>
        </div>
      </div>

      {/* Deliverables Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((del) => {
          const Icon = getDeliverableIcon(del.type);
          const assignedEmp = employees.find((e) => e.id === del.assignedEmployeeId);

          return (
            <div
              key={del.id}
              className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm transition-all hover:border-slate-700"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-indigo-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300">
                          {del.type}
                        </span>
                        <span className="text-xs text-slate-400">Due: <span className="font-mono text-slate-300">{del.targetDueDate}</span></span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-100 mt-1">{del.title}</h4>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteDeliverable(del.projectId, del.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Delete deliverable"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Specs */}
                <p className="mt-3 text-xs text-slate-300 bg-slate-950/60 rounded-lg p-3 border border-slate-800/80 leading-relaxed font-mono">
                  {del.specifications}
                </p>

                {/* Client & Project link */}
                <div
                  onClick={() => onSelectProject(del.projectId)}
                  className="mt-3 flex items-center justify-between text-xs text-slate-400 hover:text-indigo-300 cursor-pointer group"
                >
                  <div className="truncate">
                    <span className="text-slate-200 font-medium">{del.client?.name || 'Direct Client'}</span>
                    <span className="text-slate-600"> · </span>
                    <span className="truncate">{del.project.title}</span>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0" />
                </div>
              </div>

              {/* Status & Client Approval Footer */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Stage dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[11px]">Stage:</span>
                  <select
                    value={del.status}
                    onChange={(e) =>
                      handleStatusChange(del.projectId, del.id, e.target.value as DeliverableStatus)
                    }
                    className="rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="drafting">Drafting</option>
                    <option value="in_progress">In Progress</option>
                    <option value="client_review">Client Review</option>
                    <option value="ready_for_press">Ready for Press / Lab</option>
                    <option value="completed">Completed</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                {/* Approval toggle */}
                <button
                  onClick={() => handleToggleApproval(del.projectId, del.id, del.clientApproved)}
                  className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                    del.clientApproved
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{del.clientApproved ? 'Approved by Client' : 'Awaiting Proof Signoff'}</span>
                </button>

                {assignedEmp && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <div
                      style={{ backgroundColor: assignedEmp.avatarColor }}
                      className="h-4 w-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                    >
                      {assignedEmp.name.charAt(0)}
                    </div>
                    <span>{assignedEmp.name}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-800 p-12 text-center">
            <PackageCheck className="h-8 w-8 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-300">No deliverables match this filter</p>
            <p className="text-xs text-slate-500 mt-1">Select a different deliverable category or clear search</p>
          </div>
        )}
      </div>
    </div>
  );
};
