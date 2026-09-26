import React, { useState } from 'react';
import { X, Calendar, DollarSign, Users2 } from 'lucide-react';
import { Project, Employee, Client, ProjectCategory, ProjectStatus } from '../types';
import { db } from '../services/db';

interface ProjectFormModalProps {
  employees: Employee[];
  clients: Client[];
  initialProject?: Project;
  onClose: () => void;
  onSave: (projectId: string) => void;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  employees,
  clients,
  initialProject,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(initialProject?.title || '');
  const [clientId, setClientId] = useState(initialProject?.clientId || (clients[0]?.id || ''));
  const [category, setCategory] = useState<ProjectCategory>(initialProject?.category || 'Wedding');
  const [status, setStatus] = useState<ProjectStatus>(initialProject?.status || 'pre_production');
  const [startDate, setStartDate] = useState(
    initialProject?.startDate || new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    initialProject?.endDate ||
      new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [fixedBudget, setFixedBudget] = useState(
    initialProject?.fixedBudget ? String(initialProject.fixedBudget) : '18500'
  );
  const [location, setLocation] = useState(initialProject?.location || 'Lake Tahoe, CA');
  const [notes, setNotes] = useState(initialProject?.notes || '');
  const [progress, setProgress] = useState(initialProject?.progress || 10);

  // Multi-employee selection
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>(
    initialProject?.assignedEmployeeIds || [employees[0]?.id].filter(Boolean)
  );

  const toggleEmployee = (empId: string) => {
    if (selectedEmployeeIds.includes(empId)) {
      setSelectedEmployeeIds(selectedEmployeeIds.filter((id) => id !== empId));
    } else {
      setSelectedEmployeeIds([...selectedEmployeeIds, empId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetNum = parseFloat(fixedBudget) || 10000;

    if (initialProject) {
      db.updateProject(initialProject.id, {
        title,
        clientId,
        category,
        status,
        startDate,
        endDate,
        fixedBudget: budgetNum,
        location,
        notes,
        progress,
        assignedEmployeeIds: selectedEmployeeIds,
      });
      onSave(initialProject.id);
    } else {
      // Create initial milestones based on fixed budget:
      // 30% Booking, 35% Production Shoot, 20% First Cut, 15% Final Deliverables Handover
      const m1Amount = Math.round(budgetNum * 0.3);
      const m2Amount = Math.round(budgetNum * 0.35);
      const m3Amount = Math.round(budgetNum * 0.2);
      const m4Amount = budgetNum - (m1Amount + m2Amount + m3Amount);

      const newProj = db.createProject({
        title,
        clientId,
        category,
        status,
        startDate,
        endDate,
        fixedBudget: budgetNum,
        location,
        notes,
        progress,
        assignedEmployeeIds: selectedEmployeeIds,
        employeeProjectRoles: {},
        deliverables: [
          {
            id: `del-${Date.now()}-1`,
            projectId: '',
            clientId,
            type: 'photobook',
            title: '30x40 Flush Mount Fine Art Photobook',
            specifications: 'Lay-flat silk paper, embossed leather cover, custom presentation box',
            status: 'drafting',
            targetDueDate: endDate,
            clientApproved: false,
          },
          {
            id: `del-${Date.now()}-2`,
            projectId: '',
            clientId,
            type: 'highlights',
            title: '5-Minute 4K Cinematic Highlight Film',
            specifications: 'Color graded in ACES, licensed score, mastered ProRes 422HQ',
            status: 'drafting',
            targetDueDate: endDate,
            clientApproved: false,
          },
          {
            id: `del-${Date.now()}-3`,
            projectId: '',
            clientId,
            type: 'reels',
            title: '4x 9:16 Social Reels (4K)',
            specifications: 'Vertical cinematic cuts optimized for social platforms',
            status: 'drafting',
            targetDueDate: endDate,
            clientApproved: false,
          },
        ],
        milestones: [
          {
            id: `ms-${Date.now()}-1`,
            projectId: '',
            title: 'Contract Booking & Retainer (30%)',
            percentage: 30,
            amount: m1Amount,
            dueDate: startDate,
            status: 'completed',
            completedAt: new Date().toISOString().split('T')[0],
          },
          {
            id: `ms-${Date.now()}-2`,
            projectId: '',
            title: 'Production Shoot Days Wrap (35%)',
            percentage: 35,
            amount: m2Amount,
            dueDate: startDate,
            status: 'pending',
          },
          {
            id: `ms-${Date.now()}-3`,
            projectId: '',
            title: 'First Cut & Digital Preview Review (20%)',
            percentage: 20,
            amount: m3Amount,
            dueDate: endDate,
            status: 'pending',
          },
          {
            id: `ms-${Date.now()}-4`,
            projectId: '',
            title: 'Physical Deliverables Handover & Archive (15%)',
            percentage: 15,
            amount: m4Amount,
            dueDate: endDate,
            status: 'pending',
          },
        ],
        expenses: [],
      });
      onSave(newProj.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div>
            <h3 className="text-base font-semibold text-slate-100">
              {initialProject ? 'Edit Project Settings' : 'Create New Studio Project'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure fixed contract budget, timeline, and multi-employee crew assignments
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Project Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Vance Lakefront Gala & Autumn Nuptials"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Client Account</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                required
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.company ? `(${c.company})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Production Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
              >
                <option value="Wedding">Wedding</option>
                <option value="Corporate Film">Corporate Film</option>
                <option value="Commercial & Brand">Commercial & Brand</option>
                <option value="Editorial & Fashion">Editorial & Fashion</option>
                <option value="Event & Gala">Event & Gala</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Fixed Contract Budget ($ USD)
              </label>
              <input
                type="number"
                required
                min="500"
                step="any"
                value={fixedBudget}
                onChange={(e) => setFixedBudget(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-mono text-emerald-400 font-semibold focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Production Start</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Final Handover</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none capitalize"
              >
                <option value="lead">Lead</option>
                <option value="pre_production">Pre Production</option>
                <option value="production">Production</option>
                <option value="post_production">Post Production</option>
                <option value="deliverables_review">Deliverables Review</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Progress Percentage ({progress}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value))}
                className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
            <input
              type="text"
              placeholder="e.g. Emerald Bay, Lake Tahoe, CA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Multiple Employee Assignment Section */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-slate-200">
                Associated Employees & Crew ({selectedEmployeeIds.length} assigned)
              </label>
              <span className="text-[11px] text-slate-400">Multiple employees can be assigned</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
              {employees.map((emp) => {
                const isSelected = selectedEmployeeIds.includes(emp.id);
                return (
                  <div
                    key={emp.id}
                    onClick={() => toggleEmployee(emp.id)}
                    className={`flex items-center justify-between rounded-md p-2 text-xs cursor-pointer border transition-colors ${
                      isSelected
                        ? 'border-indigo-500/60 bg-indigo-950/40 text-slate-100'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        style={{ backgroundColor: emp.avatarColor }}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white shrink-0"
                      >
                        {emp.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <div className="font-medium truncate">{emp.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{emp.role}</div>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="rounded accent-indigo-600 pointer-events-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Production Notes & Brief</label>
            <textarea
              rows={3}
              placeholder="Client vision, creative direction, gear requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none resize-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-xs"
            >
              {initialProject ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
