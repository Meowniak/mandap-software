import React, { useState } from 'react';
import {
  Users2,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  DollarSign,
  FolderKanban,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { Employee, Project, EmployeeRole } from '../types';
import { db } from '../services/db';
import { EmployeeFormModal } from './EmployeeFormModal';

interface EmployeesViewProps {
  employees: Employee[];
  projects: Project[];
  onSelectProject: (projectId: string) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  projects,
  onSelectProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>(undefined);

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'all' || emp.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDeleteEmployee = (empId: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name}? They will be unassigned from active projects.`)) {
      db.deleteEmployee(empId);
    }
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingEmployee(undefined);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">
            Employees & Production Crew
          </h2>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span>CRUD Employee Profiles</span>
            <span aria-hidden="true">·</span>
            <span>Multi-Project Association Management</span>
            <span aria-hidden="true">·</span>
            <span>{employees.length} Crew Members</span>
          </div>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>+ Add Employee</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, role, skills, camera..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Role Filter */}
        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="Lead Photographer">Lead Photographer</option>
            <option value="Cinematographer">Cinematographer</option>
            <option value="Colorist & Video Editor">Colorist & Video Editor</option>
            <option value="Drone Pilot & Aerial">Drone Pilot & Aerial</option>
            <option value="Photobook & Album Designer">Photobook & Album Designer</option>
            <option value="Sound & Audio Engineer">Sound & Audio Engineer</option>
            <option value="Production Assistant">Production Assistant</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">All Availability Statuses</option>
            <option value="available">Available</option>
            <option value="on_assignment">On Assignment</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEmployees.map((emp) => {
          // Find all projects this employee is associated with
          const associatedProjects = projects.filter((p) =>
            p.assignedEmployeeIds.includes(emp.id)
          );

          return (
            <div
              key={emp.id}
              className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm transition-all hover:border-slate-700 shadow-xs"
            >
              <div>
                {/* Top Profile Card */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      style={{ backgroundColor: emp.avatarColor }}
                      className="flex h-11 w-11 items-center justify-center rounded-full text-base font-bold text-white shadow-xs"
                    >
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">{emp.name}</h3>
                      <p className="text-xs text-indigo-400 font-medium">{emp.role}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                      title="Edit employee details"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                      className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
                      title="Delete employee"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Status & Rate Badge */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        emp.status === 'on_assignment'
                          ? 'bg-amber-400'
                          : emp.status === 'available'
                          ? 'bg-emerald-400'
                          : 'bg-slate-500'
                      }`}
                    />
                    <span className="capitalize">{emp.status.replace(/_/g, ' ')}</span>
                  </div>

                  <div className="font-mono text-slate-200 font-semibold tabular-nums">
                    ${emp.hourlyRate} <span className="text-[10px] text-slate-500 font-normal">/ hr</span>
                  </div>
                </div>

                {/* Contact & Skills */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  {emp.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>{emp.phone}</span>
                    </div>
                  )}
                </div>

                {/* Skills tags */}
                {emp.skills && emp.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {emp.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] font-mono text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Associated Projects Section (Crucial user requirement: multiple employees per project) */}
              <div className="mt-5 pt-3 border-t border-slate-800/80">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>Associated Projects ({associatedProjects.length})</span>
                  <FolderKanban className="h-3.5 w-3.5 text-indigo-400" />
                </div>

                <div className="space-y-1.5">
                  {associatedProjects.map((p) => {
                    const specificRole = p.employeeProjectRoles?.[emp.id] || emp.role;
                    return (
                      <div
                        key={p.id}
                        onClick={() => onSelectProject(p.id)}
                        className="group/item flex items-center justify-between rounded-lg bg-slate-950/60 p-2 text-xs hover:bg-slate-950 transition-colors cursor-pointer border border-slate-800/60 hover:border-indigo-500/40"
                      >
                        <div className="truncate pr-2">
                          <div className="font-medium text-slate-200 truncate group-hover/item:text-indigo-300">
                            {p.title}
                          </div>
                          <div className="text-[10px] text-indigo-400 font-mono truncate">
                            Role: {specificRole}
                          </div>
                        </div>
                        <ArrowUpRight className="h-3 w-3 text-slate-500 shrink-0 opacity-0 group-hover/item:opacity-100" />
                      </div>
                    );
                  })}

                  {associatedProjects.length === 0 && (
                    <div className="text-[11px] text-slate-500 italic py-1">
                      No active project assignments. Available for deployment.
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredEmployees.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-800 p-12 text-center">
            <Users2 className="h-8 w-8 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-300">No employees match current search</p>
            <button
              onClick={handleCreateNew}
              className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              + Add Crew Member
            </button>
          </div>
        )}
      </div>

      {/* Employee Modal */}
      {modalOpen && (
        <EmployeeFormModal
          initialEmployee={editingEmployee}
          onClose={() => setModalOpen(false)}
          onSave={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};
