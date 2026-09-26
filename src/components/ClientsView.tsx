import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  FolderKanban,
  Edit2,
  Trash2,
  KeyRound,
  ArrowUpRight,
} from 'lucide-react';
import { Client, Project } from '../types';
import { db } from '../services/db';
import { ClientFormModal } from './ClientFormModal';

interface ClientsViewProps {
  clients: Client[];
  projects: Project[];
  onSelectProject: (projectId: string) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  projects,
  onSelectProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);

  const filteredClients = clients.filter((c) => {
    return (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleDeleteClient = (clientId: string, name: string) => {
    if (confirm(`Delete client "${name}"? Associated projects will be unlinked.`)) {
      db.deleteClient(clientId);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingClient(undefined);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">
            Clients & Accounts Directory
          </h2>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span>Client Profiles & Commissioned Projects</span>
            <span aria-hidden="true">·</span>
            <span>{clients.length} Registered Accounts</span>
            <span aria-hidden="true">·</span>
            <span>Local Database Storage</span>
          </div>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>+ Add Client</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by client name, company, city, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.map((client) => {
          const clientProjects = projects.filter((p) => p.clientId === client.id);
          const totalContractValue = clientProjects.reduce((s, p) => s + p.fixedBudget, 0);

          return (
            <div
              key={client.id}
              className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm transition-all hover:border-slate-700 shadow-xs"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{client.name}</h3>
                    {client.company && (
                      <p className="text-xs text-slate-400 mt-0.5">{client.company}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(client)}
                      className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                      title="Edit client"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.id, client.name)}
                      className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
                      title="Delete client"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mt-4 space-y-1.5 text-xs text-slate-400 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.city && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>{client.city}</span>
                    </div>
                  )}
                </div>

                {/* Lifetime spend & portal */}
                <div className="mt-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-medium">Lifetime Spend</span>
                    <div className="font-mono font-semibold text-emerald-400 tabular-nums">
                      ${totalContractValue.toLocaleString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase text-slate-500 font-medium">Portal Code</span>
                    <div className="font-mono text-indigo-300 font-medium text-[11px]">
                      {client.portalAccessCode}
                    </div>
                  </div>
                </div>

                {client.notes && (
                  <p className="mt-3 text-xs text-slate-400 line-clamp-2 bg-slate-950/40 p-2 rounded border border-slate-850">
                    {client.notes}
                  </p>
                )}
              </div>

              {/* Commissioned Projects */}
              <div className="mt-5 pt-3 border-t border-slate-800/80">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>Commissioned Projects ({clientProjects.length})</span>
                  <FolderKanban className="h-3.5 w-3.5 text-indigo-400" />
                </div>

                <div className="space-y-1.5">
                  {clientProjects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => onSelectProject(p.id)}
                      className="group/item flex items-center justify-between rounded-lg bg-slate-950/60 p-2 text-xs hover:bg-slate-950 transition-colors cursor-pointer border border-slate-800/60 hover:border-indigo-500/40"
                    >
                      <div className="truncate pr-2">
                        <div className="font-medium text-slate-200 truncate group-hover/item:text-indigo-300">
                          {p.title}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Fixed: ${p.fixedBudget.toLocaleString()} · Progress: {p.progress}%
                        </div>
                      </div>
                      <ArrowUpRight className="h-3 w-3 text-slate-500 shrink-0 opacity-0 group-hover/item:opacity-100" />
                    </div>
                  ))}

                  {clientProjects.length === 0 && (
                    <div className="text-[11px] text-slate-500 italic py-1">
                      No projects currently active for this client.
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredClients.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-800 p-12 text-center">
            <Building2 className="h-8 w-8 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-300">No clients match search query</p>
            <button
              onClick={handleCreateNew}
              className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              + Register Client
            </button>
          </div>
        )}
      </div>

      {modalOpen && (
        <ClientFormModal
          initialClient={editingClient}
          onClose={() => setModalOpen(false)}
          onSave={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};
