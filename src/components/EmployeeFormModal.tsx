import React, { useState } from 'react';
import { X, Users2 } from 'lucide-react';
import { Employee, EmployeeRole, EmployeeStatus } from '../types';
import { db } from '../services/db';

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
  const [name, setName] = useState(initialEmployee?.name || '');
  const [role, setRole] = useState<EmployeeRole>(
    initialEmployee?.role || 'Cinematographer'
  );
  const [email, setEmail] = useState(initialEmployee?.email || '');
  const [phone, setPhone] = useState(initialEmployee?.phone || '');
  const [hourlyRate, setHourlyRate] = useState(
    initialEmployee?.hourlyRate ? String(initialEmployee.hourlyRate) : '125'
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rateNum = parseFloat(hourlyRate) || 100;
    const skills = skillsString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (initialEmployee) {
      db.updateEmployee(initialEmployee.id, {
        name,
        role,
        email,
        phone,
        hourlyRate: rateNum,
        skills,
        status,
        avatarColor,
        notes,
      });
      onSave(initialEmployee.id);
    } else {
      const created = db.createEmployee({
        name,
        role,
        email,
        phone,
        hourlyRate: rateNum,
        skills,
        status,
        avatarColor,
        joinedDate: new Date().toISOString().split('T')[0],
        notes,
      });
      onSave(created.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div>
            <h3 className="text-base font-semibold text-slate-100">
              {initialEmployee ? 'Edit Crew Profile' : 'Add New Employee / Crew Member'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Production role, skills, hourly rate & availability status
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
            <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Julian Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Primary Studio Role</label>
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
              <label className="block text-xs font-medium text-slate-300 mb-1">Hourly Billing Rate ($)</label>
              <input
                type="number"
                required
                min="20"
                step="any"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-mono text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@tahoestudio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+1 (530) 412-8800"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

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
              Skills & Camera/Software Gear (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. RED Raptor, DaVinci Resolve, DJI Inspire 3"
              value={skillsString}
              onChange={(e) => setSkillsString(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Notes / Bio</label>
            <textarea
              rows={2}
              placeholder="Specialized focus, certifications, awards..."
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
