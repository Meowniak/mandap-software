import React, { useState } from 'react';
import {
  X,
  Users2,
  Calendar,
  Sparkles,
  CheckCircle2,
  CheckSquare,
  Square,
  HelpCircle,
} from 'lucide-react';
import {
  Employee,
  EmployeeRole,
  EmployeeStatus,
  ProjectCategory,
  EmployeeSubEventRate,
} from '../types';
import { db } from '../services/db';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';
import { EVENT_CATEGORIES, getCategoryDefinition } from '../constants/events';

interface EmployeeFormModalProps {
  initialEmployee?: Employee;
  onClose: () => void;
  onSave: (employeeId: string) => void;
}

const AVATAR_COLORS = [
  '#6366f1', // Indigo
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#3b82f6', // Blue
  '#ef4444', // Red
];

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  initialEmployee,
  onClose,
  onSave,
}) => {
  const currencySymbol = getCurrencySymbol();
  const [name, setName] = useState(initialEmployee?.name || '');
  const [role, setRole] = useState<EmployeeRole>(
    initialEmployee?.role || 'Cinematographer'
  );
  const [email, setEmail] = useState(initialEmployee?.email || '');
  const [phone, setPhone] = useState(initialEmployee?.phone || '');
  const [projectRate, setProjectRate] = useState(
    initialEmployee?.projectRate !== undefined
      ? String(initialEmployee.projectRate)
      : '15000'
  );
  const [skillsString, setSkillsString] = useState(
    initialEmployee?.skills?.join(', ') || 'Sony FX3, DaVinci Resolve, Lightroom'
  );
  const [status, setStatus] = useState<EmployeeStatus>(
    initialEmployee?.status || 'available'
  );
  const [avatarColor, setAvatarColor] = useState(
    initialEmployee?.avatarColor || AVATAR_COLORS[0]
  );
  const [notes, setNotes] = useState(initialEmployee?.notes || '');

  // Main Events association (multiple selectable: Wedding, Corporate, etc.)
  const [associatedCategories, setAssociatedCategories] = useState<ProjectCategory[]>(
    initialEmployee?.associatedCategories && initialEmployee.associatedCategories.length > 0
      ? initialEmployee.associatedCategories
      : ['Wedding']
  );

  // Active category tab for sub-event configuration
  const [activeCategoryTab, setActiveCategoryTab] = useState<ProjectCategory>(
    initialEmployee?.associatedCategories?.[0] || 'Wedding'
  );

  // Sub-event rates dictionary: category -> subEventId -> { rate, role, active }
  const [subEventConfigs, setSubEventConfigs] = useState<
    Record<string, Record<string, { active: boolean; rate: number; role: string }>>
  >(() => {
    const configMap: Record<
      string,
      Record<string, { active: boolean; rate: number; role: string }>
    > = {};

    EVENT_CATEGORIES.forEach((catDef) => {
      configMap[catDef.category] = {};
      catDef.subEvents.forEach((sub) => {
        // Find existing rate if editing
        const existing = initialEmployee?.subEventRates?.find(
          (r) => r.category === catDef.category && r.subEventId === sub.id
        );

        if (existing) {
          configMap[catDef.category][sub.id] = {
            active: true,
            rate: existing.rate,
            role: existing.customRole || sub.defaultRole,
          };
        } else {
          configMap[catDef.category][sub.id] = {
            active: false,
            rate: 15000,
            role: sub.defaultRole,
          };
        }
      });
    });

    return configMap;
  });

  // Toggle main event association
  const toggleCategory = (cat: ProjectCategory) => {
    let updated: ProjectCategory[];
    if (associatedCategories.includes(cat)) {
      if (associatedCategories.length === 1) {
        return; // Keep at least one category
      }
      updated = associatedCategories.filter((c) => c !== cat);
      if (activeCategoryTab === cat) {
        setActiveCategoryTab(updated[0]);
      }
    } else {
      updated = [...associatedCategories, cat];
      setActiveCategoryTab(cat);

      // Auto-activate sub-events for the newly selected category with baseline rate
      setSubEventConfigs((prev) => {
        const catMap = { ...(prev[cat] || {}) };
        const catDef = getCategoryDefinition(cat);
        catDef.subEvents.forEach((s) => {
          if (!catMap[s.id]?.active) {
            catMap[s.id] = {
              active: true,
              rate: parseFloat(projectRate) || 15000,
              role: s.defaultRole,
            };
          }
        });
        return { ...prev, [cat]: catMap };
      });
    }
    setAssociatedCategories(updated);
  };

  // Toggle single sub-event
  const toggleSubEvent = (cat: ProjectCategory, subId: string) => {
    setSubEventConfigs((prev) => {
      const current = prev[cat]?.[subId] || { active: false, rate: 15000, role: '' };
      return {
        ...prev,
        [cat]: {
          ...prev[cat],
          [subId]: {
            ...current,
            active: !current.active,
          },
        },
      };
    });
  };

  // Update sub-event rate
  const updateSubEventRate = (cat: ProjectCategory, subId: string, rate: number) => {
    setSubEventConfigs((prev) => {
      const current = prev[cat]?.[subId] || { active: true, rate: 0, role: '' };
      return {
        ...prev,
        [cat]: {
          ...prev[cat],
          [subId]: {
            ...current,
            rate: Math.max(0, rate),
          },
        },
      };
    });
  };

  // Update sub-event role
  const updateSubEventRole = (cat: ProjectCategory, subId: string, roleTitle: string) => {
    setSubEventConfigs((prev) => {
      const current = prev[cat]?.[subId] || { active: true, rate: 15000, role: '' };
      return {
        ...prev,
        [cat]: {
          ...prev[cat],
          [subId]: {
            ...current,
            role: roleTitle,
          },
        },
      };
    });
  };

  // Select all sub-events in current category
  const selectAllSubEvents = (cat: ProjectCategory) => {
    setSubEventConfigs((prev) => {
      const catMap = { ...(prev[cat] || {}) };
      const catDef = getCategoryDefinition(cat);
      catDef.subEvents.forEach((s) => {
        catMap[s.id] = {
          active: true,
          rate: catMap[s.id]?.rate || parseFloat(projectRate) || 15000,
          role: catMap[s.id]?.role || s.defaultRole,
        };
      });
      return { ...prev, [cat]: catMap };
    });
  };

  // Deselect all sub-events in current category
  const deselectAllSubEvents = (cat: ProjectCategory) => {
    setSubEventConfigs((prev) => {
      const catMap = { ...(prev[cat] || {}) };
      const catDef = getCategoryDefinition(cat);
      catDef.subEvents.forEach((s) => {
        if (catMap[s.id]) {
          catMap[s.id] = { ...catMap[s.id], active: false };
        }
      });
      return { ...prev, [cat]: catMap };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rateNum = parseFloat(projectRate) || 0;
    const skills = skillsString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // Build the subEventRates array
    const compiledSubEventRates: EmployeeSubEventRate[] = [];
    associatedCategories.forEach((cat) => {
      const catDef = getCategoryDefinition(cat);
      catDef.subEvents.forEach((sub) => {
        const item = subEventConfigs[cat]?.[sub.id];
        if (item && item.active) {
          compiledSubEventRates.push({
            subEventId: sub.id,
            subEventName: sub.name,
            category: cat,
            rate: item.rate,
            customRole: item.role || sub.defaultRole,
          });
        }
      });
    });

    if (initialEmployee) {
      db.updateEmployee(initialEmployee.id, {
        name,
        role,
        email,
        phone,
        projectRate: rateNum,
        hourlyRate: rateNum,
        skills,
        status,
        avatarColor,
        notes,
        associatedCategories,
        subEventRates: compiledSubEventRates,
      });
      onSave(initialEmployee.id);
    } else {
      const created = db.createEmployee({
        name,
        role,
        email,
        phone,
        projectRate: rateNum,
        hourlyRate: rateNum,
        skills,
        status,
        avatarColor,
        joinedDate: new Date().toISOString().split('T')[0],
        notes,
        associatedCategories,
        subEventRates: compiledSubEventRates,
      });
      onSave(created.id);
    }
  };

  const currentCatDef = getCategoryDefinition(activeCategoryTab);
  const activeSubCountInCurrent = currentCatDef.subEvents.filter(
    (s) => subEventConfigs[activeCategoryTab]?.[s.id]?.active
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Users2 className="h-5 w-5 text-indigo-400" />
              <span>{initialEmployee ? 'Edit Crew Profile & Event Rates' : 'Add New Employee / Crew Member'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select main events, associated sub-events, defined roles, and individual sub-event rates
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
          {/* Basic Info Zone */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Julian Vance, Subash Thapa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Primary Studio Specialization</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as EmployeeRole)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Lead Photographer">Lead Photographer</option>
                  <option value="Cinematographer">Cinematographer</option>
                  <option value="Colorist & Video Editor">Colorist & Video Editor</option>
                  <option value="Drone Pilot & Aerial">Drone Pilot & Aerial</option>
                  <option value="Photobook & Album Designer">Photobook & Album Designer</option>
                  <option value="Sound & Audio Engineer">Sound & Audio Engineer</option>
                  <option value="Production Assistant">Production Assistant</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Baseline Overall Project Rate ({currencySymbol})
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="any"
                  placeholder="e.g. 20000"
                  value={projectRate}
                  onChange={(e) => setProjectRate(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-mono text-emerald-400 font-semibold focus:border-indigo-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500">Default fallback when sub-events are not specified</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@mandapstudio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+977 980-0000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* MAIN REQUIREMENT: EVENT & SUB-EVENT RATE CONFIGURATION */}
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-indigo-900/40 pb-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span>Main Events & Sub-Event Rates Assignment</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Select which event categories this employee handles, pick their individual sub-events, and define compensation & roles
                </p>
              </div>
              <span className="rounded bg-indigo-500/20 px-2 py-0.5 font-mono text-[10px] text-indigo-300 font-semibold self-start sm:self-auto">
                {associatedCategories.length} {associatedCategories.length === 1 ? 'Event' : 'Events'} Active
              </span>
            </div>

            {/* Step 1: Select Main Events (Multiple selection) */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-2">
                1. Select Associated Main Events <span className="text-[11px] text-slate-400 font-normal">(Select all that apply)</span>:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {EVENT_CATEGORIES.map((catDef) => {
                  const isSelected = associatedCategories.includes(catDef.category);
                  return (
                    <button
                      key={catDef.category}
                      type="button"
                      onClick={() => toggleCategory(catDef.category)}
                      className={`flex items-center gap-2 rounded-lg border p-2.5 text-xs text-left transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-600/20 text-white font-medium shadow-xs'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
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
                      <span className="truncate">{catDef.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Tab navigation for selected events */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-200">
                  2. Configure Sub-Events, Roles & Rates for:
                </label>
                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => selectAllSubEvents(activeCategoryTab)}
                    className="text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Select All
                  </button>
                  <span className="text-slate-600">·</span>
                  <button
                    type="button"
                    onClick={() => deselectAllSubEvents(activeCategoryTab)}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {/* Event Sub-Tab bar */}
              <div className="flex border-b border-slate-800 bg-slate-950/40 rounded-t-lg overflow-x-auto">
                {associatedCategories.map((cat) => {
                  const catDef = getCategoryDefinition(cat);
                  const activeCount = catDef.subEvents.filter(
                    (s) => subEventConfigs[cat]?.[s.id]?.active
                  ).length;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategoryTab(cat)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeCategoryTab === cat
                          ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{catDef.name}</span>
                      <span className="rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px] font-mono text-slate-300">
                        {activeCount}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sub-Events List & Rate Input Grid */}
              <div className="rounded-b-lg border border-t-0 border-slate-800 bg-slate-950/60 p-3 space-y-2.5 max-h-64 overflow-y-auto">
                <div className="text-[11px] text-slate-400 italic mb-1 flex items-center justify-between">
                  <span>
                    Check sub-events this employee will perform under <strong>{currentCatDef.name}</strong>:
                  </span>
                  <span className="font-mono text-indigo-300 font-medium not-italic">
                    {activeSubCountInCurrent} of {currentCatDef.subEvents.length} selected
                  </span>
                </div>

                {currentCatDef.subEvents.map((sub) => {
                  const config = subEventConfigs[activeCategoryTab]?.[sub.id] || {
                    active: false,
                    rate: 15000,
                    role: sub.defaultRole,
                  };

                  return (
                    <div
                      key={sub.id}
                      className={`rounded-lg border p-3 text-xs transition-colors ${
                        config.active
                          ? 'border-indigo-500/50 bg-indigo-950/30'
                          : 'border-slate-800/80 bg-slate-900/30 opacity-70 hover:opacity-90'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Sub-event checkbox & details */}
                        <div
                          onClick={() => toggleSubEvent(activeCategoryTab, sub.id)}
                          className="flex items-start gap-2.5 cursor-pointer flex-1"
                        >
                          <div className="pt-0.5">
                            {config.active ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border border-slate-700 bg-slate-900 shrink-0" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-200">{sub.name}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {sub.description}
                            </div>
                          </div>
                        </div>

                        {/* Role & Rate inputs when active */}
                        {config.active && (
                          <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                            {/* Role Definition Input */}
                            <div className="flex-1 sm:flex-initial">
                              <label className="block text-[10px] text-slate-400 mb-0.5">
                                Sub-Event Role
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Lead Photographer"
                                value={config.role}
                                onChange={(e) =>
                                  updateSubEventRole(activeCategoryTab, sub.id, e.target.value)
                                }
                                className="w-full sm:w-44 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-indigo-300 font-medium focus:border-indigo-500 focus:outline-none"
                              />
                            </div>

                            {/* Sub-event Rate Input */}
                            <div className="flex-1 sm:flex-initial">
                              <label className="block text-[10px] text-slate-400 mb-0.5">
                                Rate ({currencySymbol})
                              </label>
                              <div className="flex items-center gap-1">
                                <span className="text-[11px] text-slate-500 font-mono">
                                  {currencySymbol}
                                </span>
                                <input
                                  type="number"
                                  min="0"
                                  step="any"
                                  placeholder="e.g. 15000"
                                  value={config.rate}
                                  onChange={(e) =>
                                    updateSubEventRate(
                                      activeCategoryTab,
                                      sub.id,
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="w-24 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs font-mono font-semibold text-emerald-400 text-right focus:border-indigo-500 focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Status, Color, Skills & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Availability Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none capitalize"
              >
                <option value="available">Available for Assignment</option>
                <option value="on_assignment">Currently on Assignment</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Avatar Color</label>
              <div className="flex items-center gap-2">
                {AVATAR_COLORS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setAvatarColor(col)}
                    style={{ backgroundColor: col }}
                    className={`h-6 w-6 rounded-full transition-transform ${
                      avatarColor === col ? 'scale-125 ring-2 ring-white' : 'opacity-80 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Skills & Camera Gear (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Sony FX3, DaVinci Resolve, Hasselblad, DJI Inspire 3"
              value={skillsString}
              onChange={(e) => setSkillsString(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Notes / Bio</label>
            <textarea
              rows={2}
              placeholder="Specialized focus, culture ceremonies experience, equipment specifics..."
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
              {initialEmployee ? 'Update Crew Member' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
