import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Users2,
  Coins,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Tag,
} from 'lucide-react';
import {
  Project,
  Employee,
  Client,
  ProjectCategory,
  ProjectStatus,
  ProjectEmployeeSubEventAssignment,
} from '../types';
import { db } from '../services/db';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';
import { EVENT_CATEGORIES, getCategoryDefinition } from '../constants/events';

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
  const currencySymbol = getCurrencySymbol();
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
    initialProject?.fixedBudget ? String(initialProject.fixedBudget) : '50000'
  );
  const [location, setLocation] = useState(initialProject?.location || 'Kathmandu, Nepal');
  const [notes, setNotes] = useState(initialProject?.notes || '');
  const [progress, setProgress] = useState(initialProject?.progress || 10);

  // Sub-events included in this project
  const [selectedSubEventIds, setSelectedSubEventIds] = useState<string[]>(() => {
    if (initialProject?.selectedSubEventIds && initialProject.selectedSubEventIds.length > 0) {
      return initialProject.selectedSubEventIds;
    }
    const catDef = getCategoryDefinition(initialProject?.category || 'Wedding');
    return catDef.subEvents.map((s) => s.id);
  });

  // Multi-employee selection
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>(
    initialProject?.assignedEmployeeIds || [employees[0]?.id].filter(Boolean)
  );

  // Expanded employee cards in the payout definition drawer
  const [expandedEmpId, setExpandedEmpId] = useState<string | null>(
    initialProject?.assignedEmployeeIds?.[0] || employees[0]?.id || null
  );

  // Sub-event assignments per employee: employeeId -> ProjectEmployeeSubEventAssignment[]
  const [employeeAssignments, setEmployeeAssignments] = useState<
    Record<string, ProjectEmployeeSubEventAssignment[]>
  >(() => {
    const map: Record<string, ProjectEmployeeSubEventAssignment[]> = {};
    const currentCat = initialProject?.category || 'Wedding';
    const catDef = getCategoryDefinition(currentCat);

    employees.forEach((emp) => {
      if (initialProject?.employeeSubEventAssignments?.[emp.id]) {
        map[emp.id] = initialProject.employeeSubEventAssignments[emp.id];
      } else {
        // Auto-assign from employee's defined sub-events for this category
        const matchingRates = (emp.subEventRates || []).filter((r) => r.category === currentCat);
        if (matchingRates.length > 0) {
          map[emp.id] = matchingRates.map((r) => ({
            subEventId: r.subEventId,
            subEventName: r.subEventName,
            role: r.customRole || emp.role,
            rate: r.rate,
          }));
        } else {
          // Fallback to primary role & standard project rate
          map[emp.id] = [
            {
              subEventId: 'full_project',
              subEventName: 'Full Project Execution',
              role: emp.role,
              rate: emp.projectRate ?? 15000,
            },
          ];
        }
      }
    });

    return map;
  });

  // When category changes, update project sub-events and refresh employee assignments from their profile
  const handleCategoryChange = (newCat: ProjectCategory) => {
    setCategory(newCat);
    const catDef = getCategoryDefinition(newCat);
    const allSubs = catDef.subEvents.map((s) => s.id);
    setSelectedSubEventIds(allSubs);

    // Re-assign employees from their profile for the new category
    setEmployeeAssignments((prev) => {
      const updated = { ...prev };
      employees.forEach((emp) => {
        const matching = (emp.subEventRates || []).filter((r) => r.category === newCat);
        if (matching.length > 0) {
          updated[emp.id] = matching.map((r) => ({
            subEventId: r.subEventId,
            subEventName: r.subEventName,
            role: r.customRole || emp.role,
            rate: r.rate,
          }));
        } else {
          updated[emp.id] = [
            {
              subEventId: 'full_project',
              subEventName: 'Full Project Execution',
              role: emp.role,
              rate: emp.projectRate ?? 15000,
            },
          ];
        }
      });
      return updated;
    });
  };

  // Toggle project sub-event
  const toggleProjectSubEvent = (subId: string) => {
    if (selectedSubEventIds.includes(subId)) {
      if (selectedSubEventIds.length > 1) {
        setSelectedSubEventIds(selectedSubEventIds.filter((id) => id !== subId));
      }
    } else {
      setSelectedSubEventIds([...selectedSubEventIds, subId]);
    }
  };

  // Toggle employee selection for project
  const toggleEmployee = (empId: string) => {
    if (selectedEmployeeIds.includes(empId)) {
      setSelectedEmployeeIds(selectedEmployeeIds.filter((id) => id !== empId));
      if (expandedEmpId === empId) {
        setExpandedEmpId(null);
      }
    } else {
      setSelectedEmployeeIds([...selectedEmployeeIds, empId]);
      setExpandedEmpId(empId);

      // If employee doesn't have assignments yet, populate from profile
      if (!employeeAssignments[empId] || employeeAssignments[empId].length === 0) {
        const emp = employees.find((e) => e.id === empId);
        const matching = (emp?.subEventRates || []).filter((r) => r.category === category);

        if (matching.length > 0) {
          setEmployeeAssignments((prev) => ({
            ...prev,
            [empId]: matching.map((r) => ({
              subEventId: r.subEventId,
              subEventName: r.subEventName,
              role: r.customRole || emp?.role || 'Production Crew',
              rate: r.rate,
            })),
          }));
        } else {
          setEmployeeAssignments((prev) => ({
            ...prev,
            [empId]: [
              {
                subEventId: 'full_project',
                subEventName: 'Full Project Execution',
                role: emp?.role || 'Production Crew',
                rate: emp?.projectRate ?? 15000,
              },
            ],
          }));
        }
      }
    }
  };

  // Toggle a sub-event assignment for an employee
  const toggleSubEventForEmployee = (
    empId: string,
    subId: string,
    subName: string,
    defaultRole: string,
    defaultRate: number
  ) => {
    setEmployeeAssignments((prev) => {
      const currentList = prev[empId] || [];
      const exists = currentList.find((a) => a.subEventId === subId);

      if (exists) {
        return {
          ...prev,
          [empId]: currentList.filter((a) => a.subEventId !== subId),
        };
      } else {
        return {
          ...prev,
          [empId]: [
            ...currentList,
            {
              subEventId: subId,
              subEventName: subName,
              role: defaultRole,
              rate: defaultRate,
            },
          ],
        };
      }
    });
  };

  // Update specific rate of an employee's assigned sub-event
  const handleUpdateSubEventRate = (empId: string, subId: string, newRate: number) => {
    setEmployeeAssignments((prev) => {
      const currentList = prev[empId] || [];
      return {
        ...prev,
        [empId]: currentList.map((a) =>
          a.subEventId === subId ? { ...a, rate: Math.max(0, newRate) } : a
        ),
      };
    });
  };

  // Update specific role of an employee's assigned sub-event
  const handleUpdateSubEventRole = (empId: string, subId: string, newRole: string) => {
    setEmployeeAssignments((prev) => {
      const currentList = prev[empId] || [];
      return {
        ...prev,
        [empId]: currentList.map((a) =>
          a.subEventId === subId ? { ...a, role: newRole } : a
        ),
      };
    });
  };

  // Compute total payout for each employee (sum of their active sub-event rates)
  const getEmployeeTotalPayout = (empId: string): number => {
    const list = employeeAssignments[empId] || [];
    return list.reduce((sum, a) => sum + (a.rate || 0), 0);
  };

  // Overall financial calculations with reference to Total Project Rate
  const projectRateNum = parseFloat(fixedBudget) || 0;
  const totalCrewPayout = selectedEmployeeIds.reduce(
    (sum, id) => sum + getEmployeeTotalPayout(id),
    0
  );
  const studioNetMargin = projectRateNum - totalCrewPayout;
  const marginPercent =
    projectRateNum > 0 ? Math.round((studioNetMargin / projectRateNum) * 100) : 0;

  const currentCatDef = getCategoryDefinition(category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetNum = parseFloat(fixedBudget) || 0;

    // Filter only assignments and rates for selected employees
    const filteredAssignments: Record<string, ProjectEmployeeSubEventAssignment[]> = {};
    const filteredRates: Record<string, number> = {};
    const filteredRoles: Record<string, string> = {};

    selectedEmployeeIds.forEach((id) => {
      const assignments = employeeAssignments[id] || [];
      filteredAssignments[id] = assignments;
      filteredRates[id] = assignments.reduce((sum, a) => sum + (a.rate || 0), 0);

      const emp = employees.find((e) => e.id === id);
      const rolesSummary =
        assignments.map((a) => a.role).filter(Boolean).join(', ') || emp?.role || 'Production Crew';
      filteredRoles[id] = rolesSummary;
    });

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
        selectedSubEventIds,
        assignedEmployeeIds: selectedEmployeeIds,
        employeeProjectRates: filteredRates,
        employeeProjectRoles: filteredRoles,
        employeeSubEventAssignments: filteredAssignments,
      });
      onSave(initialProject.id);
    } else {
      // Create initial milestones based on project rate:
      // 30% Booking, 35% Production Shoot, 20% First Cut, 15% Final Handover
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
        selectedSubEventIds,
        assignedEmployeeIds: selectedEmployeeIds,
        employeeProjectRates: filteredRates,
        employeeProjectRoles: filteredRoles,
        employeeSubEventAssignments: filteredAssignments,
        deliverables: [
          {
            id: `del-${Date.now()}-1`,
            projectId: '',
            clientId,
            type: 'photobook',
            title: 'Flush Mount Fine Art Photobook',
            specifications: 'Lay-flat silk paper, embossed cover, presentation box',
            status: 'drafting',
            targetDueDate: endDate,
            clientApproved: false,
          },
          {
            id: `del-${Date.now()}-2`,
            projectId: '',
            clientId,
            type: 'highlights',
            title: '4K Cinematic Highlight Film',
            specifications: 'Color graded in ACES, licensed music, mastered 4K',
            status: 'drafting',
            targetDueDate: endDate,
            clientApproved: false,
          },
          {
            id: `del-${Date.now()}-3`,
            projectId: '',
            clientId,
            type: 'reels',
            title: '9:16 Social Media Viral Reels Pack (x3)',
            specifications: 'Color timed for mobile displays, hook edits',
            status: 'drafting',
            targetDueDate: endDate,
            clientApproved: false,
          },
        ],
        milestones: [
          {
            id: `ms-${Date.now()}-1`,
            projectId: '',
            title: 'Contract Booking Reserve (30%)',
            percentage: 30,
            amount: m1Amount,
            dueDate: startDate,
            status: 'pending',
          },
          {
            id: `ms-${Date.now()}-2`,
            projectId: '',
            title: 'Production Days Wrap & Raw Ingestion (35%)',
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
            title: 'Physical Deliverables Handover (15%)',
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
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <span>{initialProject ? 'Edit Project Settings' : 'Create New Studio Project'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Define project rate, select event category & sub-events, and auto-assign crew payments
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* Title & Client */}
          <div className="space-y-4">
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
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Main Event Category
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as ProjectCategory)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-indigo-300 font-semibold focus:border-indigo-500 focus:outline-none"
                >
                  {EVENT_CATEGORIES.map((catDef) => (
                    <option key={catDef.category} value={catDef.category}>
                      {catDef.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Financial and Timeline row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Total Project Rate ({currencySymbol})
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="any"
                  placeholder="e.g. 50000"
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
          </div>

          {/* SECTION: INCLUDED SUB-EVENTS FOR THIS PROJECT */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
                  Sub-Events Included in this {category} Project
                </label>
                <span className="text-[11px] text-slate-400">
                  Select all ceremonial / operational phases involved in this project
                </span>
              </div>
              <span className="text-xs font-mono text-indigo-400 font-semibold">
                {selectedSubEventIds.length} of {currentCatDef.subEvents.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {currentCatDef.subEvents.map((sub) => {
                const isSelected = selectedSubEventIds.includes(sub.id);
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => toggleProjectSubEvent(sub.id)}
                    className={`flex items-center gap-2 rounded-lg border p-2 text-xs text-left transition-colors ${
                      isSelected
                        ? 'border-indigo-500/60 bg-indigo-950/30 text-slate-100 font-medium'
                        : 'border-slate-800/80 bg-slate-900/30 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-600 text-white'
                          : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                    </div>
                    <span className="truncate">{sub.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION: CREW SELECTION & AUTOMATIC SUB-EVENT ROLE & RATE ASSIGNMENT */}
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-indigo-900/40 pb-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                  <Users2 className="h-4 w-4 text-indigo-400" />
                  <span>Assign Crew & Auto-Assign Sub-Event Roles</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  When you select an employee, their sub-event roles & rates are automatically loaded from their profile
                </p>
              </div>
              <span className="rounded bg-indigo-500/20 px-2 py-0.5 font-mono text-[10px] text-indigo-300 font-semibold self-start sm:self-auto">
                {selectedEmployeeIds.length} Crew Assigned
              </span>
            </div>

            {/* Employee Selection Chips */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-2">
                Select Team Members for this Project:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
                {employees.map((emp) => {
                  const isSelected = selectedEmployeeIds.includes(emp.id);
                  const matchingSubCount = (emp.subEventRates || []).filter(
                    (r) => r.category === category
                  ).length;

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
                      <div className="flex items-center gap-2 truncate">
                        <div
                          style={{ backgroundColor: emp.avatarColor }}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white shrink-0"
                        >
                          {emp.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <div className="font-medium truncate">{emp.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {emp.role} · {matchingSubCount} configured {category} sub-events
                          </div>
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

            {/* Prompted: Individual Employee Sub-Event Rates & Roles Breakdown */}
            {selectedEmployeeIds.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-300">
                    Sub-Event Assignments & Rates Breakdown
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Auto-assigned from crew profile; editable for this project
                  </span>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {selectedEmployeeIds.map((empId) => {
                    const emp = employees.find((e) => e.id === empId);
                    if (!emp) return null;

                    const assignments = employeeAssignments[empId] || [];
                    const totalEmpPayout = getEmployeeTotalPayout(empId);
                    const isExpanded = expandedEmpId === empId;

                    return (
                      <div
                        key={emp.id}
                        className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden"
                      >
                        {/* Employee summary row */}
                        <div
                          onClick={() => setExpandedEmpId(isExpanded ? null : empId)}
                          className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-850/60 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              style={{ backgroundColor: emp.avatarColor }}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shrink-0"
                            >
                              {emp.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-100 text-xs flex items-center gap-2">
                                <span>{emp.name}</span>
                                <span className="text-[10px] text-indigo-400 font-normal">
                                  ({emp.role})
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {assignments.length} sub-events assigned
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-[10px] text-slate-400 uppercase">Payout</div>
                              <div className="font-mono text-xs font-bold text-emerald-400">
                                {formatCurrency(totalEmpPayout)}
                              </div>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* Expanded sub-events assignment drawer */}
                        {isExpanded && (
                          <div className="border-t border-slate-800/80 bg-slate-950/60 p-3 space-y-2 text-xs">
                            <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                              <span>Check sub-events assigned to {emp.name}:</span>
                              <span className="text-[10px] text-slate-500">
                                Rates preloaded from employee profile
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              {currentCatDef.subEvents
                                .filter((sub) => selectedSubEventIds.includes(sub.id))
                                .map((sub) => {
                                  const assignment = assignments.find(
                                    (a) => a.subEventId === sub.id
                                  );
                                  const isAssigned = !!assignment;

                                  // Find default rate from profile if not yet assigned
                                  const profileRate = (emp.subEventRates || []).find(
                                    (r) => r.category === category && r.subEventId === sub.id
                                  );

                                  const activeRate =
                                    assignment?.rate ?? profileRate?.rate ?? emp.projectRate ?? 15000;
                                  const activeRole =
                                    assignment?.role ??
                                    profileRate?.customRole ??
                                    sub.defaultRole ??
                                    emp.role;

                                  return (
                                    <div
                                      key={sub.id}
                                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-lg border gap-2 transition-colors ${
                                        isAssigned
                                          ? 'border-indigo-500/40 bg-indigo-950/30'
                                          : 'border-slate-850 bg-slate-900/30 opacity-60'
                                      }`}
                                    >
                                      <div
                                        onClick={() =>
                                          toggleSubEventForEmployee(
                                            emp.id,
                                            sub.id,
                                            sub.name,
                                            activeRole,
                                            activeRate
                                          )
                                        }
                                        className="flex items-center gap-2 cursor-pointer flex-1"
                                      >
                                        <div
                                          className={`flex h-4 w-4 items-center justify-center rounded border ${
                                            isAssigned
                                              ? 'border-indigo-500 bg-indigo-600 text-white'
                                              : 'border-slate-700 bg-slate-900'
                                          }`}
                                        >
                                          {isAssigned && (
                                            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                                          )}
                                        </div>
                                        <span className="font-medium text-slate-200 truncate">
                                          {sub.name}
                                        </span>
                                      </div>

                                      {isAssigned && (
                                        <div className="flex items-center gap-2 pl-6 sm:pl-0">
                                          <input
                                            type="text"
                                            placeholder="Role for sub-event"
                                            value={assignment.role}
                                            onChange={(e) =>
                                              handleUpdateSubEventRole(
                                                emp.id,
                                                sub.id,
                                                e.target.value
                                              )
                                            }
                                            className="w-36 rounded border border-slate-700 bg-slate-950 px-2 py-0.5 text-xs text-indigo-300 focus:border-indigo-500 focus:outline-none"
                                          />

                                          <div className="flex items-center gap-1">
                                            <span className="text-[10px] text-slate-500 font-mono">
                                              {currencySymbol}
                                            </span>
                                            <input
                                              type="number"
                                              min="0"
                                              step="any"
                                              value={assignment.rate}
                                              onChange={(e) =>
                                                handleUpdateSubEventRate(
                                                  emp.id,
                                                  sub.id,
                                                  parseFloat(e.target.value) || 0
                                                )
                                              }
                                              className="w-24 rounded border border-slate-700 bg-slate-950 px-2 py-0.5 text-xs font-mono font-semibold text-emerald-400 text-right focus:border-indigo-500 focus:outline-none"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Real-time automatic calculations against total project */}
                <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl border border-slate-800 bg-slate-950 p-3 text-center text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Total Project Rate
                    </div>
                    <div className="mt-0.5 font-mono text-sm font-bold text-slate-100">
                      {formatCurrency(projectRateNum)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Sub-Event Crew Total
                    </div>
                    <div className="mt-0.5 font-mono text-sm font-bold text-amber-400">
                      {formatCurrency(totalCrewPayout)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Studio Net Margin
                    </div>
                    <div
                      className={`mt-0.5 font-mono text-sm font-bold ${
                        studioNetMargin >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {formatCurrency(studioNetMargin)} ({marginPercent}%)
                    </div>
                  </div>
                </div>

                {studioNetMargin < 0 && (
                  <div className="flex items-center gap-1.5 text-[11px] text-rose-400 bg-rose-950/30 p-2.5 rounded-lg border border-rose-900/50">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>Warning: Total assigned sub-event payouts exceed the total project rate!</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Production Location</label>
            <input
              type="text"
              placeholder="e.g. Kathmandu, Pokhara, Lake Tahoe"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Production Notes & Brief</label>
            <textarea
              rows={2}
              placeholder="Client creative direction, specific cultural rituals, camera package notes..."
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
              {initialProject ? 'Save Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
