import React, { useState } from 'react';
import {
  X,
  HardDriveDownload,
  HardDriveUpload,
  RotateCcw,
  CheckCircle2,
  Copy,
  AlertTriangle,
  FileJson,
  Building2,
  Trash2,
  Save,
} from 'lucide-react';
import { db } from '../services/db';
import { StudioConfig } from '../types';

interface DatabaseModalProps {
  onClose: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'backup' | 'identity'>('backup');
  const [importJsonText, setImportJsonText] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const snapshot = db.getSnapshot();
  const dbJson = db.exportDatabaseJSON();
  const storageBytes = new Blob([dbJson]).size;
  const storageKB = (storageBytes / 1024).toFixed(1);

  // Studio Settings form state
  const config = snapshot.config;
  const [studioName, setStudioName] = useState(config.studioName);
  const [tagline, setTagline] = useState(config.tagline);
  const [email, setEmail] = useState(config.email);
  const [phone, setPhone] = useState(config.phone);
  const [address, setAddress] = useState(config.address);
  const [currency, setCurrency] = useState(config.currency || 'USD');
  const [taxRate, setTaxRate] = useState(String(config.taxRate * 100));
  const [bankName, setBankName] = useState(config.bankDetails.bankName);
  const [accountName, setAccountName] = useState(config.bankDetails.accountName);
  const [routing, setRouting] = useState(config.bankDetails.routingOrSwift);
  const [accountNum, setAccountNum] = useState(config.bankDetails.accountNumber);

  const showSuccess = (msg: string) => {
    setNotification(msg);
    setErrorMsg(null);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleExportDownload = () => {
    const blob = new Blob([dbJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tahoe_studio_db_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSuccess('Database backup downloaded successfully');
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(dbJson).then(() => {
      showSuccess('JSON copied to clipboard');
    });
  };

  const handleImport = () => {
    if (!importJsonText.trim()) {
      setErrorMsg('Please paste valid JSON text');
      return;
    }

    const success = db.importDatabaseJSON(importJsonText);
    if (success) {
      setImportJsonText('');
      showSuccess('Database restored successfully from JSON');
    } else {
      setErrorMsg('Failed to parse or validate JSON schema');
    }
  };

  const handleResetSeed = () => {
    if (confirm('Reset database to default demo dataset? This will reload sample weddings, films, and crew assignments.')) {
      db.resetToSeedData();
      showSuccess('Database reset to fresh demo dataset');
    }
  };

  const handleClearAllData = () => {
    if (
      confirm(
        '⚠️ ARE YOU SURE? This will remove all clients, employees, projects, expenses, and billing reports so you can start completely from scratch!'
      )
    ) {
      db.clearAllData();
      showSuccess('All data cleared! Studio database is now completely blank and ready for your records.');
    }
  };

  const handleSaveIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    const rateDecimal = parseFloat(taxRate) / 100 || 0.075;

    db.updateConfig({
      studioName,
      tagline,
      email,
      phone,
      address,
      currency,
      taxRate: rateDecimal,
      bankDetails: {
        bankName,
        accountName,
        routingOrSwift: routing,
        accountNumber: accountNum,
      },
    });

    showSuccess('Studio identity, branding, and bank wire details updated!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileJson className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                Studio Settings & Local Database
              </h3>
              <p className="text-xs text-slate-400">
                macOS Tahoe client-side persistent storage · No external cloud encryption required
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('backup')}
            className={`border-b-2 py-3 px-4 text-xs font-semibold transition-colors ${
              activeTab === 'backup'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Local Database & Reset
          </button>
          <button
            onClick={() => setActiveTab('identity')}
            className={`border-b-2 py-3 px-4 text-xs font-semibold transition-colors ${
              activeTab === 'identity'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Studio Name & Branding Settings
          </button>
        </div>

        {/* Notifications */}
        {notification && (
          <div className="bg-emerald-600/90 text-white text-xs px-6 py-2.5 flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{notification}</span>
          </div>
        )}
        {errorMsg && (
          <div className="bg-rose-600/90 text-white text-xs px-6 py-2.5 flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Body */}
        <div className="p-6 max-h-[72vh] overflow-y-auto space-y-6">
          {activeTab === 'backup' ? (
            <div className="space-y-6">
              {/* Storage telemetry stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Projects</div>
                  <div className="mt-1 font-mono text-base font-bold text-slate-200">
                    {snapshot.projects.length}
                  </div>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Crew</div>
                  <div className="mt-1 font-mono text-base font-bold text-slate-200">
                    {snapshot.employees.length}
                  </div>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Clients</div>
                  <div className="mt-1 font-mono text-base font-bold text-slate-200">
                    {snapshot.clients.length}
                  </div>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Local Size</div>
                  <div className="mt-1 font-mono text-base font-bold text-emerald-400">
                    {storageKB} KB
                  </div>
                </div>
              </div>

              {/* Start Fresh / Clear Data Box (Crucial for starting blank!) */}
              <div className="rounded-xl border border-rose-900/60 bg-rose-950/20 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <Trash2 className="h-4 w-4 text-rose-400" />
                    <span>Clear All Demo Data & Start Fresh</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Removes all sample clients, employees, projects, and invoices to begin with an empty studio database.
                  </div>
                </div>
                <button
                  onClick={handleClearAllData}
                  className="rounded-md border border-rose-600 bg-rose-600/30 px-3.5 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-600 hover:text-white transition-colors whitespace-nowrap shadow-xs"
                >
                  Clear All Data (Start Fresh)
                </button>
              </div>

              {/* Export Zone */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <HardDriveDownload className="h-4 w-4 text-emerald-400" />
                  <span>Export Database Backup (.JSON)</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Export full studio state including projects, multi-employee associations, deliverables, expenses, and automated billing invoices into an unencrypted standard JSON archive.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleExportDownload}
                    className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-xs"
                  >
                    <HardDriveDownload className="h-3.5 w-3.5" />
                    <span>Download .JSON File</span>
                  </button>
                  <button
                    onClick={handleCopyClipboard}
                    className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy JSON to Clipboard</span>
                  </button>
                </div>
              </div>

              {/* Import Zone */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <HardDriveUpload className="h-4 w-4 text-indigo-400" />
                  <span>Restore / Import Database JSON</span>
                </h4>
                <textarea
                  rows={3}
                  placeholder="Paste exported JSON here to restore complete database..."
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 p-2.5 text-xs font-mono text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleImport}
                    className="rounded-md border border-indigo-500 bg-indigo-600/20 px-4 py-1.5 text-xs font-semibold text-indigo-200 hover:bg-indigo-600/30 transition-colors"
                  >
                    Import & Replace Database
                  </button>
                </div>
              </div>

              {/* Reset Demo Data */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-200">Reset Demo Studio Dataset</div>
                  <div className="text-[11px] text-slate-500">
                    Reload pre-populated luxury weddings, corporate films, and crew assignments
                  </div>
                </div>
                <button
                  onClick={handleResetSeed}
                  className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reload Demo Data</span>
                </button>
              </div>
            </div>
          ) : (
            /* Tab: Studio Identity & Branding */
            <form onSubmit={handleSaveIdentity} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Studio Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={studioName}
                    onChange={(e) => setStudioName(e.target.value)}
                    placeholder="e.g. Tahoe Visual Works, Apex Cinema"
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Fine Art Film & Aerial Studio"
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Default Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-mono text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Studio Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Wire details */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Bank Wire / ACH Payment Instructions on Invoices
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Account Holder Name</label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Routing / SWIFT Code</label>
                    <input
                      type="text"
                      value={routing}
                      onChange={(e) => setRouting(e.target.value)}
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-mono text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Account Number</label>
                    <input
                      type="text"
                      value={accountNum}
                      onChange={(e) => setAccountNum(e.target.value)}
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-mono text-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-xs"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Studio Branding</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-800 px-6 py-3 bg-slate-950/60">
          <button
            onClick={onClose}
            className="rounded-md bg-slate-800 px-4 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
