import React, { useState } from 'react';
import {
  X,
  Calendar,
  DollarSign,
  Coins,
  Users2,
  PackageCheck,
  Receipt,
  FileSpreadsheet,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
  BookOpen,
  Video,
  Film,
  Frame,
  HardDrive,
  Edit2,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import {
  Project,
  Employee,
  Client,
  Deliverable,
  Expense,
  Milestone,
  DeliverableType,
  DeliverableStatus,
  ExpenseCategory,
} from '../types';
import { db } from '../services/db';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';

interface ProjectDetailModalProps {
  project: Project;
  employees: Employee[];
  clients: Client[];
  onClose: () => void;
  onOpenBillingReport: (reportId: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  employees,
  clients,
  onClose,
  onOpenBillingReport,
}) => {
  const currencySymbol = getCurrencySymbol();
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'deliverables' | 'milestones' | 'expenses'>(
    'overview'
  );

  // Form states for adding items
  const [showAddEmployee, setShowAddEmployee] = useState<boolean>(false);
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');
  const [customRoleTitle, setCustomRoleTitle] = useState<string>('');
  const [customRateInput, setCustomRateInput] = useState<string>('');

  const [showAddDeliverable, setShowAddDeliverable] = useState<boolean>(false);
  const [newDelType, setNewDelType] = useState<DeliverableType>('photobook');
  const [newDelTitle, setNewDelTitle] = useState<string>('');
  const [newDelSpecs, setNewDelSpecs] = useState<string>('');
  const [newDelDueDate, setNewDelDueDate] = useState<string>('');
  const [newDelEmpId, setNewDelEmpId] = useState<string>('');

  const [showAddExpense, setShowAddExpense] = useState<boolean>(false);
  const [newExpCategory, setNewExpCategory] = useState<ExpenseCategory>('Equipment Rental');
  const [newExpDesc, setNewExpDesc] = useState<string>('');
  const [newExpAmount, setNewExpAmount] = useState<string>('');
  const [newExpDate, setNewExpDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newExpPaidBy, setNewExpPaidBy] = useState<string>('');
  const [newExpReceipt, setNewExpReceipt] = useState<string>('');

  const [notification, setNotification] = useState<string | null>(null);

  const client = clients.find((c) => c.id === project.clientId);

  // Financial calculations
  const totalExpenses = project.expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalCrewPayouts = project.assignedEmployeeIds.reduce((sum, id) => {
    const rate =
      project.employeeProjectRates?.[id] ??
      employees.find((e) => e.id === id)?.projectRate ??
      0;
    return sum + rate;
  }, 0);
  const netStudioMargin = project.fixedBudget - totalCrewPayouts - totalExpenses;
  const netMarginPercent =
    project.fixedBudget > 0 ? Math.round((netStudioMargin / project.fixedBudget) * 100) : 0;
  const budgetUtilization =
    project.fixedBudget > 0 ? Math.round(((totalExpenses + totalCrewPayouts) / project.fixedBudget) * 100) : 0;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSelectEmpToAssign = (empId: string) => {
    setSelectedEmpId(empId);
    const empObj = employees.find((e) => e.id === empId);
    if (empObj) {
      setCustomRateInput(String(empObj.projectRate ?? 15000));
    }
  };

  // Assign employee to project
  const handleAssignEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpId) return;

    const alreadyAssigned = project.assignedEmployeeIds.includes(selectedEmpId);
    if (alreadyAssigned) {
      showToast('Employee is already assigned to this project');
      return;
    }

    const currentAssignments = project.assignedEmployeeIds.map((id) => ({
      employeeId: id,
      roleOnProject: project.employeeProjectRoles?.[id],
      assignedRate: project.employeeProjectRates?.[id],
    }));

    const empObj = employees.find((emp) => emp.id === selectedEmpId);
    const roleToAssign = customRoleTitle.trim() || empObj?.role || 'Production Crew';
    const rateToAssign = parseFloat(customRateInput) || empObj?.projectRate || 0;

    db.assignEmployeesToProject(project.id, [
      ...currentAssignments,
      { employeeId: selectedEmpId, roleOnProject: roleToAssign, assignedRate: rateToAssign },
    ]);

    setSelectedEmpId('');
    setCustomRoleTitle('');
    setCustomRateInput('');
    setShowAddEmployee(false);
    showToast('Employee assigned to project with defined payout');
  };

  // Remove employee
  const handleRemoveEmployee = (empId: string) => {
    const updatedIds = project.assignedEmployeeIds.filter((id) => id !== empId);
    const updatedRoles = { ...(project.employeeProjectRoles || {}) };
    delete updatedRoles[empId];
    const updatedRates = { ...(project.employeeProjectRates || {}) };
    delete updatedRates[empId];

    db.updateProject(project.id, {
      assignedEmployeeIds: updatedIds,
      employeeProjectRoles: updatedRoles,
      employeeProjectRates: updatedRates,
    });
    showToast('Employee unassigned from project');
  };

  // Update employee role title
  const handleUpdateEmpRole = (empId: string, newRoleTitle: string) => {
    const updatedRoles = { ...(project.employeeProjectRoles || {}) };
    updatedRoles[empId] = newRoleTitle;
    db.updateProject(project.id, {
      employeeProjectRoles: updatedRoles,
    });
  };

  // Update employee project payout rate
  const handleUpdateEmpProjectRate = (empId: string, rate: number) => {
    db.updateEmployeeProjectRate(project.id, empId, rate);
  };

  // Add deliverable
  const handleAddDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDelTitle) return;

    db.addDeliverable(project.id, {
      clientId: project.clientId,
      type: newDelType,
      title: newDelTitle,
      specifications: newDelSpecs || 'Fine-art studio production standards',
      status: 'drafting',
      targetDueDate: newDelDueDate || project.endDate,
      assignedEmployeeId: newDelEmpId || undefined,
      clientApproved: false,
    });

    setNewDelTitle('');
    setNewDelSpecs('');
    setNewDelDueDate('');
    setShowAddDeliverable(false);
    showToast('Deliverable added to project pipeline');
  };

  // Advance deliverable status
  const handleDeliverableStatusChange = (delId: string, status: DeliverableStatus) => {
    db.updateDeliverable(project.id, delId, { status });
    showToast(`Deliverable status updated to ${status.replace(/_/g, ' ')}`);
  };

  // Toggle client approval
  const handleToggleDeliverableApproval = (delId: string, currentVal: boolean) => {
    db.updateDeliverable(project.id, delId, { clientApproved: !currentVal });
    showToast(!currentVal ? 'Client approval verified' : 'Approval unset');
  };

  // Delete deliverable
  const handleDeleteDeliverable = (delId: string) => {
    if (confirm('Delete this deliverable from project?')) {
      db.deleteDeliverable(project.id, delId);
      showToast('Deliverable removed');
    }
  };

  // Add expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(newExpAmount);
    if (isNaN(amountNum) || amountNum <= 0 || !newExpDesc) return;

    db.addExpense(project.id, {
      category: newExpCategory,
      description: newExpDesc,
      amount: amountNum,
      date: newExpDate,
      paidByEmployeeId: newExpPaidBy || undefined,
      receiptRef: newExpReceipt || `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'approved',
    });

    setNewExpDesc('');
    setNewExpAmount('');
    setNewExpReceipt('');
    setShowAddExpense(false);
    showToast('Expense logged to fixed budget');
  };

  // Generate automated billing report for milestone
  const handleGenerateBilling = (milestoneId: string) => {
    try {
      const report = db.generateAutomatedBillingReport(project.id, milestoneId);
      showToast(`Automated Billing Report ${report.invoiceNumber} created!`);
      onOpenBillingReport(report.id);
    } catch (err) {
      console.error(err);
      showToast('Error generating billing report');
    }
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
        return PackageCheck;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-6">
        {/* Modal Top Header with Tahoe styling */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-3 w-3 gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <div>
              <h3 className="text-base font-semibold text-slate-100">{project.title}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{client?.name || 'Direct Client'}</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{project.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-emerald-400">Project Rate: {formatCurrency(project.fixedBudget)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toast alert */}
        {notification && (
          <div className="bg-indigo-600/90 text-white text-xs px-6 py-2 flex items-center justify-between font-medium">
            <span>{notification}</span>
          </div>
        )}

        {/* Modal Tabs Navigation */}
        <div className="flex items-center border-b border-slate-800 px-6 bg-slate-950/30 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Progress' },
            { id: 'employees', label: `Crew & Assignees (${project.assignedEmployeeIds.length})` },
            { id: 'deliverables', label: `Deliverables (${project.deliverables.length})` },
            { id: 'milestones', label: `Milestones & Billing (${project.milestones.length})` },
            { id: 'expenses', label: `Expenses Ledger (${project.expenses.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`border-b-2 px-4 py-3 text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[72vh] overflow-y-auto space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Financial & Timeline Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-xs text-slate-400">Total Project Rate</div>
                  <div className="mt-1 text-xl font-bold font-mono text-slate-100 tabular-nums">
                    {formatCurrency(project.fixedBudget)}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    Contracted project value
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-xs text-slate-400">Assigned Crew Payouts</div>
                  <div className="mt-1 text-xl font-bold font-mono text-amber-400 tabular-nums">
                    {formatCurrency(totalCrewPayouts)}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500 font-mono">
                    {project.assignedEmployeeIds.length} crew members
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-xs text-slate-400">Other Expenses Logged</div>
                  <div className="mt-1 text-xl font-bold font-mono text-slate-300 tabular-nums">
                    {formatCurrency(totalExpenses)}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500 font-mono">
                    {project.expenses.length} receipts logged
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-xs text-slate-400">Net Studio Margin</div>
                  <div
                    className={`mt-1 text-xl font-bold font-mono tabular-nums ${
                      netStudioMargin >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {formatCurrency(netStudioMargin)}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    {netMarginPercent}% net margin
                  </div>
                </div>
              </div>

              {/* Progress & Status Bar */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Production Progress</span>
                  <span className="font-mono text-indigo-400 font-semibold">{project.progress}% Complete</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Start: <span className="font-mono text-slate-300">{project.startDate}</span></span>
                  <span>Status: <span className="capitalize text-slate-200 font-medium">{project.status.replace(/_/g, ' ')}</span></span>
                  <span>Wrap / Delivery: <span className="font-mono text-slate-300">{project.endDate}</span></span>
                </div>
              </div>

              {/* Project Meta and Location */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Production Brief & Notes
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{project.notes || 'No notes added.'}</p>
                <div className="text-xs text-slate-400 pt-2 border-t border-slate-850">
                  <span className="text-slate-500">Shoot Location: </span>
                  <span className="text-slate-200 font-medium">{project.location}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MULTI-EMPLOYEE ASSIGNMENTS */}
          {activeTab === 'employees' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-100">
                    Project Crew & Payouts Management
                  </h4>
                  <p className="text-xs text-slate-400">
                    Define custom roles and assigned project payouts for each team member
                  </p>
                </div>
                <button
                  onClick={() => setShowAddEmployee(!showAddEmployee)}
                  className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Associate Employee</span>
                </button>
              </div>

              {/* Top Live Crew Financial Strip */}
              <div className="grid grid-cols-3 gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Project Rate</div>
                  <div className="mt-0.5 font-mono text-sm font-bold text-slate-100">
                    {formatCurrency(project.fixedBudget)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Total Crew Payouts</div>
                  <div className="mt-0.5 font-mono text-sm font-bold text-amber-400">
                    {formatCurrency(totalCrewPayouts)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Studio Balance</div>
                  <div
                    className={`mt-0.5 font-mono text-sm font-bold ${
                      project.fixedBudget - totalCrewPayouts >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {formatCurrency(project.fixedBudget - totalCrewPayouts)}
                  </div>
                </div>
              </div>

              {/* Add Employee Form Drawer */}
              {showAddEmployee && (
                <form
                  onSubmit={handleAssignEmployee}
                  className="rounded-xl border border-indigo-500/40 bg-slate-950 p-4 space-y-4 shadow-xl"
                >
                  <h5 className="text-xs font-semibold text-slate-200">
                    Associate Team Member to {project.title}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Select Employee</label>
                      <select
                        value={selectedEmpId}
                        onChange={(e) => handleSelectEmpToAssign(e.target.value)}
                        required
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="">-- Choose Employee --</option>
                        {employees
                          .filter((emp) => !project.assignedEmployeeIds.includes(emp.id))
                          .map((emp) => (
                            <option key={emp.id} value={emp.id}>
                              {emp.name} ({emp.role}) - Default: {currencySymbol} {(emp.projectRate ?? 15000).toLocaleString()}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Specific Role on this Project
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Lead Director, Drone Pilot"
                        value={customRoleTitle}
                        onChange={(e) => setCustomRoleTitle(e.target.value)}
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Assigned Project Rate ({currencySymbol})
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="e.g. 20000"
                        value={customRateInput}
                        onChange={(e) => setCustomRateInput(e.target.value)}
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-mono font-semibold text-emerald-400 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddEmployee(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                    >
                      Save Assignment
                    </button>
                  </div>
                </form>
              )}

              {/* Associated Employees Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.assignedEmployeeIds.map((empId) => {
                  const emp = employees.find((e) => e.id === empId);
                  if (!emp) return null;

                  const assignedRole =
                    project.employeeProjectRoles?.[emp.id] || emp.role;
                  const assignedRate =
                    project.employeeProjectRates?.[emp.id] ?? emp.projectRate ?? 0;

                  return (
                    <div
                      key={emp.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            style={{ backgroundColor: emp.avatarColor }}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
                          >
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-100 text-xs">{emp.name}</div>
                            <div className="text-[11px] text-slate-400">{emp.email}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveEmployee(emp.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                          title="Unassign employee from project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Project Role Assignment */}
                      <div className="pt-2 border-t border-slate-800/80">
                        <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                          Role for this Project
                        </label>
                        <input
                          type="text"
                          value={assignedRole}
                          onChange={(e) => handleUpdateEmpRole(emp.id, e.target.value)}
                          className="w-full rounded-md border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs text-indigo-300 font-medium focus:border-indigo-500 focus:outline-none"
                        />
                      </div>

                      {/* Assigned Payment for this Project */}
                      <div className="pt-2 border-t border-slate-800/80">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] text-slate-400 uppercase tracking-wider">
                            Assigned Project Rate ({currencySymbol})
                          </label>
                          <span className="text-[10px] text-slate-500">Predefined: {currencySymbol} {(emp.projectRate ?? 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-400 font-mono">{currencySymbol}</span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={assignedRate}
                            onChange={(e) =>
                              handleUpdateEmpProjectRate(emp.id, parseFloat(e.target.value) || 0)
                            }
                            className="w-full rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-mono font-semibold text-emerald-400 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span className="text-slate-500">Status</span>
                        <span className="capitalize text-slate-300">{emp.status.replace(/_/g, ' ')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {project.assignedEmployeeIds.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-xs text-slate-400">
                  No employees currently assigned to this project. Click "+ Associate Employee" to deploy crew members.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DELIVERABLES */}
          {activeTab === 'deliverables' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-100">
                    Client Deliverables Management
                  </h4>
                  <p className="text-xs text-slate-400">
                    Track photobooks, reels, highlights, frames, pendrives, and custom heirlooms
                  </p>
                </div>
                <button
                  onClick={() => setShowAddDeliverable(!showAddDeliverable)}
                  className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ New Deliverable</span>
                </button>
              </div>

              {/* Add Deliverable Drawer */}
              {showAddDeliverable && (
                <form
                  onSubmit={handleAddDeliverable}
                  className="rounded-xl border border-slate-700 bg-slate-950 p-4 space-y-4"
                >
                  <h5 className="text-xs font-semibold text-slate-200">
                    Add Deliverable for {project.title}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Type</label>
                      <select
                        value={newDelType}
                        onChange={(e) => setNewDelType(e.target.value as DeliverableType)}
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200"
                      >
                        <option value="photobook">Photobook (Flush Mount / Fine Art)</option>
                        <option value="reels">Reels (9:16 Social 4K)</option>
                        <option value="highlights">Highlights (Cinematic Film 4K)</option>
                        <option value="frames">Frames (Canvas & Wood Prints)</option>
                        <option value="pendrives">Pendrives (Laser-Engraved USB)</option>
                        <option value="custom">Custom Deliverable</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-slate-400 mb-1">Title</label>
                      <input
                        type="text"
                        placeholder="e.g. 30x40 Flush Mount Italian Leather Photobook"
                        value={newDelTitle}
                        onChange={(e) => setNewDelTitle(e.target.value)}
                        required
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-slate-400 mb-1">Specifications</label>
                      <input
                        type="text"
                        placeholder="Paper weight, dimensions, binding, lamination, resolution"
                        value={newDelSpecs}
                        onChange={(e) => setNewDelSpecs(e.target.value)}
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Target Due Date</label>
                      <input
                        type="date"
                        value={newDelDueDate}
                        onChange={(e) => setNewDelDueDate(e.target.value)}
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] text-slate-400 mb-1">Assign Lead Crew Member</label>
                      <select
                        value={newDelEmpId}
                        onChange={(e) => setNewDelEmpId(e.target.value)}
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200"
                      >
                        <option value="">-- Unassigned --</option>
                        {employees.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.name} ({e.role})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddDeliverable(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                    >
                      Add Deliverable
                    </button>
                  </div>
                </form>
              )}

              {/* Deliverables List */}
              <div className="space-y-3">
                {project.deliverables.map((del) => {
                  const Icon = getDeliverableIcon(del.type);
                  const assignedEmp = employees.find((e) => e.id === del.assignedEmployeeId);

                  return (
                    <div
                      key={del.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-200">
                            <Icon className="h-4 w-4 text-indigo-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-semibold text-slate-100 text-xs">{del.title}</h5>
                              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                {del.type}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">{del.specifications}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Status select */}
                          <select
                            value={del.status}
                            onChange={(e) =>
                              handleDeliverableStatusChange(del.id, e.target.value as DeliverableStatus)
                            }
                            className="rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                          >
                            <option value="drafting">Drafting</option>
                            <option value="in_progress">In Progress</option>
                            <option value="client_review">Client Review</option>
                            <option value="ready_for_press">Ready for Press / Lab</option>
                            <option value="completed">Completed</option>
                            <option value="delivered">Delivered</option>
                          </select>

                          {/* Client Approval check */}
                          <button
                            onClick={() => handleToggleDeliverableApproval(del.id, del.clientApproved)}
                            className={`flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition-colors ${
                              del.clientApproved
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            <span>{del.clientApproved ? 'Approved' : 'Awaiting Approval'}</span>
                          </button>

                          <button
                            onClick={() => handleDeleteDeliverable(del.id)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                            title="Delete Deliverable"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Footer meta */}
                      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <span>Target: <span className="font-mono text-slate-300">{del.targetDueDate}</span></span>
                          {assignedEmp && (
                            <span>Lead: <span className="text-slate-200 font-medium">{assignedEmp.name}</span></span>
                          )}
                          {del.trackingNumber && (
                            <span>Tracking: <span className="font-mono text-indigo-400">{del.trackingNumber}</span></span>
                          )}
                        </div>
                        {del.notes && <span className="text-slate-500 italic truncate max-w-xs">{del.notes}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: MILESTONES & AUTOMATED BILLING */}
          {activeTab === 'milestones' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-100">
                  Project Milestones & Automated Billing Reports
                </h4>
                <p className="text-xs text-slate-400">
                  Milestone billing breakdown tied to project fixed contract ($
                  {project.fixedBudget.toLocaleString()}). Generate one-click verified billing reports.
                </p>
              </div>

              <div className="space-y-4">
                {project.milestones.map((m) => {
                  const isCompleted = m.status === 'completed' || m.status === 'billed' || m.status === 'paid';

                  return (
                    <div
                      key={m.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${
                                m.status === 'paid'
                                  ? 'bg-emerald-400'
                                  : m.status === 'billed'
                                  ? 'bg-sky-400'
                                  : m.status === 'completed'
                                  ? 'bg-indigo-400'
                                  : 'bg-slate-600'
                              }`}
                            />
                            <h5 className="font-semibold text-slate-100 text-xs">{m.title}</h5>
                            <span className="font-mono text-xs text-indigo-400 font-medium">
                              ({m.percentage}% · ${m.amount.toLocaleString()})
                            </span>
                          </div>
                          <div className="text-xs text-slate-400">
                            Due: <span className="font-mono text-slate-300">{m.dueDate}</span>
                            {m.completedAt && (
                              <span> · Completed on <span className="font-mono text-emerald-400">{m.completedAt}</span></span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-3">
                          {/* Status badge */}
                          <span className="font-mono text-xs capitalize text-slate-300">
                            Status: <span className="font-semibold">{m.status}</span>
                          </span>

                          {/* Quick Mark Completed */}
                          {m.status === 'pending' || m.status === 'in_progress' ? (
                            <button
                              onClick={() => {
                                db.updateMilestone(project.id, m.id, {
                                  status: 'completed',
                                  completedAt: new Date().toISOString().split('T')[0],
                                });
                                showToast('Milestone marked completed');
                              }}
                              className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800"
                            >
                              Mark Completed
                            </button>
                          ) : null}

                          {/* Generate Billing Report Button */}
                          {!m.billingReportId ? (
                            <button
                              onClick={() => handleGenerateBilling(m.id)}
                              className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow-xs"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                              <span>Generate Billing Report</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onOpenBillingReport(m.billingReportId!)}
                              className="flex items-center gap-1.5 rounded-md border border-sky-600/50 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-300 hover:bg-sky-500/20"
                            >
                              <FileSpreadsheet className="h-3.5 w-3.5" />
                              <span>View Generated Report</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: EXPENSES LEDGER */}
          {activeTab === 'expenses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-100">
                    Project Expenses & Budget Ledger
                  </h4>
                  <p className="text-xs text-slate-400">
                    Log and track all gear rentals, travel, lab printing, and assistant stipends
                  </p>
                </div>
                <button
                  onClick={() => setShowAddExpense(!showAddExpense)}
                  className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ Log Expense</span>
                </button>
              </div>

              {/* Add Expense Form Drawer */}
              {showAddExpense && (
                <form
                  onSubmit={handleAddExpense}
                  className="rounded-xl border border-slate-700 bg-slate-950 p-4 space-y-4"
                >
                  <h5 className="text-xs font-semibold text-slate-200">
                    Log New Production Expense for {project.title}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Category</label>
                      <select
                        value={newExpCategory}
                        onChange={(e) => setNewExpCategory(e.target.value as ExpenseCategory)}
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200"
                      >
                        <option value="Equipment Rental">Equipment Rental</option>
                        <option value="Travel & Transportation">Travel & Transportation</option>
                        <option value="Assistant & Crew Stipend">Assistant & Crew Stipend</option>
                        <option value="Storage & Hard Drives">Storage & Hard Drives</option>
                        <option value="Printing & Lab Fabrication">Printing & Lab Fabrication</option>
                        <option value="Location & Studio Fees">Location & Studio Fees</option>
                        <option value="Catering & Hospitality">Catering & Hospitality</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Amount ($ USD)</label>
                      <input
                        type="number"
                        placeholder="e.g. 850"
                        value={newExpAmount}
                        onChange={(e) => setNewExpAmount(e.target.value)}
                        required
                        min="1"
                        step="any"
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Date</label>
                      <input
                        type="date"
                        value={newExpDate}
                        onChange={(e) => setNewExpDate(e.target.value)}
                        required
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-slate-400 mb-1">Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Cooke Anamorphic lens rental & spare batteries"
                        value={newExpDesc}
                        onChange={(e) => setNewExpDesc(e.target.value)}
                        required
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Receipt Reference</label>
                      <input
                        type="text"
                        placeholder="e.g. REC-CAMERA-9921"
                        value={newExpReceipt}
                        onChange={(e) => setNewExpReceipt(e.target.value)}
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 font-mono"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] text-slate-400 mb-1">Paid / Reimbursable Employee</label>
                      <select
                        value={newExpPaidBy}
                        onChange={(e) => setNewExpPaidBy(e.target.value)}
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200"
                      >
                        <option value="">-- Paid by Studio Corporate Account --</option>
                        {employees.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.name} ({e.role})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddExpense(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                    >
                      Save Expense
                    </button>
                  </div>
                </form>
              )}

              {/* Expenses Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-medium border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4">Date</th>
                      <th className="py-2.5 px-4">Category</th>
                      <th className="py-2.5 px-4">Description</th>
                      <th className="py-2.5 px-4">Receipt Ref</th>
                      <th className="py-2.5 px-4">Payer</th>
                      <th className="py-2.5 px-4 text-right">Amount</th>
                      <th className="py-2.5 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
                    {project.expenses.map((exp) => {
                      const payer = employees.find((e) => e.id === exp.paidByEmployeeId);

                      return (
                        <tr key={exp.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-3 px-4 font-mono text-slate-400 tabular-nums">{exp.date}</td>
                          <td className="py-3 px-4 text-slate-300 font-medium">{exp.category}</td>
                          <td className="py-3 px-4 text-slate-200">{exp.description}</td>
                          <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{exp.receiptRef}</td>
                          <td className="py-3 px-4 text-slate-400 text-[11px]">
                            {payer ? payer.name : 'Studio Corporate'}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-semibold text-amber-300 tabular-nums">
                            ${exp.amount.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => {
                                if (confirm('Delete this expense?')) {
                                  db.deleteExpense(project.id, exp.id);
                                  showToast('Expense deleted');
                                }
                              }}
                              className="text-slate-500 hover:text-rose-400 p-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {project.expenses.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500">
                          No expenses logged for this project yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
