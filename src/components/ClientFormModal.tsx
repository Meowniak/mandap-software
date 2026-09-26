import React, { useState } from 'react';
import { X, Building2 } from 'lucide-react';
import { Client } from '../types';
import { db } from '../services/db';

interface ClientFormModalProps {
  initialClient?: Client;
  onClose: () => void;
  onSave: (clientId: string) => void;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  initialClient,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(initialClient?.name || '');
  const [company, setCompany] = useState(initialClient?.company || '');
  const [email, setEmail] = useState(initialClient?.email || '');
  const [phone, setPhone] = useState(initialClient?.phone || '');
  const [city, setCity] = useState(initialClient?.city || 'Lake Tahoe, CA');
  const [notes, setNotes] = useState(initialClient?.notes || '');
  const [portalAccessCode, setPortalAccessCode] = useState(
    initialClient?.portalAccessCode || `TAHOE-${Math.floor(1000 + Math.random() * 9000)}`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialClient) {
      db.updateClient(initialClient.id, {
        name,
        company,
        email,
        phone,
        city,
        notes,
        portalAccessCode,
      });
      onSave(initialClient.id);
    } else {
      const created = db.createClient({
        name,
        company,
        email,
        phone,
        city,
        contractDate: new Date().toISOString().split('T')[0],
        notes,
        portalAccessCode,
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
              {initialClient ? 'Edit Client Account' : 'Register New Client'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Contact credentials, location & private portal code
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
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Client Name / Couple / Lead Contact
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Elena & Marcus Sterling"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Company / Event Group (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Private Wedding, Aether Robotics Inc."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="client@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+1 (415) 555-0199"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">City / Region</label>
              <input
                type="text"
                placeholder="e.g. Incline Village, NV"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Portal Access Code
              </label>
              <input
                type="text"
                placeholder="e.g. STERLING-2026"
                value={portalAccessCode}
                onChange={(e) => setPortalAccessCode(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-mono text-indigo-300 focus:border-indigo-500 focus:outline-none uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Client Preferences & Notes</label>
            <textarea
              rows={3}
              placeholder="Preferred deliverable formats, tone, primary contacts, invoice notes..."
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
              {initialClient ? 'Update Client' : 'Create Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
