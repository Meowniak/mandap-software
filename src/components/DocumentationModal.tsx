import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Terminal,
  FolderKanban,
  Users2,
  Receipt,
  FileSpreadsheet,
  PackageCheck,
  Code,
  HardDrive,
  Sparkles,
} from 'lucide-react';

interface DocumentationModalProps {
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<'workflow' | 'install' | 'source' | 'fresh'>('workflow');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                Tahoe Studio Pro — Operating Manual & Developer Guide
              </h3>
              <p className="text-xs text-slate-400">
                Complete workflow, installation, source customization, and data management
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

        {/* Section Tabs */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/40 overflow-x-auto text-xs">
          {[
            { id: 'workflow', label: '1. Software Operation & Workflow' },
            { id: 'install', label: '2. Laptop Installation & Setup' },
            { id: 'source', label: '3. Customizing Source Code' },
            { id: 'fresh', label: '4. Clearing Data & Starting Fresh' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`border-b-2 py-3 px-4 font-semibold transition-colors whitespace-nowrap ${
                activeSection === tab.id
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 max-h-[72vh] overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed font-sans">
          {/* SECTION 1: WORKFLOW */}
          {activeSection === 'workflow' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span>End-to-End Operational Workflow</span>
                </h4>
                <p className="text-slate-400 mt-1">
                  How a creative project progresses from initial client onboarding to final physical deliverable handover and automated billing.
                </p>
              </div>

              {/* Step 1 */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <div className="font-bold text-slate-200 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-mono">1</span>
                  <span>Add or Onboard a Client</span>
                </div>
                <p className="text-slate-400">
                  Navigate to <strong>Clients & Accounts</strong> on the left sidebar and click <strong>"+ Add Client"</strong>. Enter the client or couple's name, email, phone, location, and optional private portal access code.
                </p>
              </div>

              {/* Step 2 */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <div className="font-bold text-slate-200 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-mono">2</span>
                  <span>Define Employees & Standard Project Rates</span>
                </div>
                <p className="text-slate-400">
                  Go to <strong>Employees & Crew</strong> to manage photographers, cinematographers, drone pilots, album designers, colorists, and sound engineers. You define each team member's <strong>Standard Project Rate (in NPR / Rs.)</strong> instead of an hourly rate.
                </p>
              </div>

              {/* Step 3 */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <div className="font-bold text-slate-200 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-mono">3</span>
                  <span>Create Project, Define Project Rate & Assign Crew with Automatic Payouts</span>
                </div>
                <p className="text-slate-400">
                  Click <strong>"+ New Project"</strong>. Enter the project title, client, and <strong>Total Project Rate</strong> (e.g. 50,000). When you select crew members, the software prompts you to define their rates for this project (e.g. Employee 1: 20,000, Employee 2: 12,000). The system automatically computes total crew payouts and your studio margin in real time!
                </p>
              </div>

              {/* Step 4 */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <div className="font-bold text-slate-200 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-mono">4</span>
                  <span>Track Deliverables Pipeline (Photobooks, Reels, Highlights, Frames, USBs)</span>
                </div>
                <p className="text-slate-400">
                  Inside the <strong>Deliverables Studio</strong> or directly within a project's detail view, manage each deliverable heirloom:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-400">
                  <li><strong>Photobooks</strong>: 30x40 Flush Mount, Italian leather, lay-flat silk spreads.</li>
                  <li><strong>Reels</strong>: 9:16 vertical 4K social edits.</li>
                  <li><strong>Highlights</strong>: Cinematic 4-6 min 4K films with ACES grading.</li>
                  <li><strong>Frames</strong>: Hardwood wall art & canvas prints with museum acrylic.</li>
                  <li><strong>Pendrives</strong>: Laser-engraved walnut or aluminum USB 3.2 vaults.</li>
                </ul>
              </div>

              {/* Step 5 */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <div className="font-bold text-slate-200 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-mono">5</span>
                  <span>Log Expenses & Monitor Fixed Budget Margin</span>
                </div>
                <p className="text-slate-400">
                  Open <strong>Budget & Expenses</strong> to record equipment rentals, travel tickets, lab printing fees, and assistant stipends. The system compares actual expenses against the fixed budget in real time to calculate your gross studio margin.
                </p>
              </div>

              {/* Step 6 */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <div className="font-bold text-slate-200 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-mono">6</span>
                  <span>Generate Automated Milestone Billing Reports</span>
                </div>
                <p className="text-slate-400">
                  When a milestone is reached (e.g. Booking Reserve, Shoot Wrap, Review First Cut, Physical Handover), click <strong>"Generate Automated Billing Report"</strong>. This generates an invoice including deliverable proofing verifications, tax calculation, and bank wire details ready to print or save as a PDF.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 2: INSTALLATION */}
          {activeSection === 'install' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  <span>How to Install & Run on Apple Mac M1 Pro / macOS</span>
                </h4>
                <p className="text-slate-400 mt-1">
                  Step-by-step terminal instructions to run this app locally on your laptop.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-slate-200 mb-1">Prerequisites:</h5>
                  <p className="text-slate-400">
                    Ensure you have <strong>Node.js (v18, v20, or v22)</strong> installed on your Mac. You can check by running <code className="font-mono text-indigo-300">node -v</code> in Terminal.
                  </p>
                </div>

                <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-2">
                  <div className="text-slate-500"># 1. Open Terminal on your Mac (⌘ + Space, type "Terminal")</div>
                  <div className="text-slate-500"># 2. Navigate to your project directory:</div>
                  <div className="text-emerald-400">cd /path/to/tahoe-studio-pro</div>
                  <div className="pt-2 text-slate-500"># 3. Install all dependencies:</div>
                  <div className="text-emerald-400">npm install</div>
                  <div className="pt-2 text-slate-500"># 4. Launch the local development server:</div>
                  <div className="text-emerald-400">npm run dev</div>
                </div>

                <div>
                  <h5 className="font-semibold text-slate-200 mb-1">Running in Browser:</h5>
                  <p className="text-slate-400">
                    Open Safari, Chrome, or Arc on your Mac and navigate to <code className="font-mono text-indigo-300">http://localhost:3000</code>.
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold text-slate-200 mb-1">Building for Production (Standalone):</h5>
                  <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 font-mono text-[11px] text-emerald-400">
                    npm run build<br />
                    npm run preview
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: SOURCE CUSTOMIZATION */}
          {activeSection === 'source' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Code className="h-4 w-4 text-sky-400" />
                  <span>How to Edit Core Features from Source Code</span>
                </h4>
                <p className="text-slate-400 mt-1">
                  Direct guide to modifying branding, studio names, bank details, tax rates, and roles.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                  <h5 className="font-bold text-slate-200">
                    1. Currency Settings (NPR, Rs., रू) & Studio Branding:
                  </h5>
                  <p className="text-slate-400">
                    <strong>Where to change it in the app:</strong> Click <strong>Local DB &gt; Studio Identity & Settings</strong> in the top-right header or bottom sidebar. You can set the Currency Code (e.g. <code>NPR</code>) and Local Symbol (<code>Rs.</code> or <code>रू</code>) with 1 click. Tax is removed/disabled (0%).
                  </p>
                  <p className="text-slate-400 mt-2">
                    <strong>In source code:</strong> Open <code className="font-mono text-indigo-300">src/services/db.ts</code> around line 15:
                  </p>
                  <pre className="rounded bg-slate-950 p-3 text-[11px] font-mono text-slate-300 overflow-x-auto border border-slate-800">
{`export const DEFAULT_CONFIG: StudioConfig = {
  studioName: 'Mandap Visuals',
  tagline: 'High-Fidelity Cinema & Fine Art Editorial Media',
  email: 'contact@mandapvisuals.com',
  phone: '+977 980-0000000',
  address: 'Kathmandu, Nepal',
  currency: 'NPR',
  currencySymbol: 'Rs.',
  taxRate: 0,
  bankDetails: {
    accountName: 'Mandap Visuals',
    bankName: 'Nabil Bank',
    routingOrSwift: 'NABILNPK',
    accountNumber: '••••••••5678',
  },
};`}
                  </pre>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                  <h5 className="font-bold text-slate-200">
                    2. Changing Application Title in HTML & Window Chrome:
                  </h5>
                  <ul className="list-disc pl-5 text-slate-400 space-y-1">
                    <li>Open <code className="font-mono text-indigo-300">index.html</code>: edit <code className="font-mono text-slate-200">&lt;title&gt;Your Studio Name&lt;/title&gt;</code>.</li>
                    <li>Open <code className="font-mono text-indigo-300">metadata.json</code>: update the <code className="font-mono text-slate-200">"name"</code> field.</li>
                    <li>Open <code className="font-mono text-indigo-300">src/components/MacWindowChrome.tsx</code>: adjust window title badges.</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                  <h5 className="font-bold text-slate-200">
                    3. Adding Custom Deliverable Types:
                  </h5>
                  <p className="text-slate-400">
                    Open <code className="font-mono text-indigo-300">src/types/index.ts</code> and add new types to <code className="font-mono text-indigo-300">DeliverableType</code> (e.g. <code className="font-mono text-slate-200">'raw_harddrive' | 'vr_headset' | 'teaser'</code>).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: CLEARING DATA & STARTING FRESH */}
          {activeSection === 'fresh' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-rose-400" />
                  <span>How to Remove All Demo Values & Start from a Clean Slate</span>
                </h4>
                <p className="text-slate-400 mt-1">
                  Two quick ways to wipe sample data and start completely fresh:
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                  <h5 className="font-bold text-emerald-400">
                    Method A: In-App 1-Click Clear (Fastest, No Code Needed)
                  </h5>
                  <ol className="list-decimal pl-5 space-y-1.5 text-slate-400">
                    <li>Click the <strong>"Local DB"</strong> button on the top-right macOS title bar.</li>
                    <li>In the modal, click the red button: <strong>"Clear All Data (Start Fresh)"</strong>.</li>
                    <li>Confirm the prompt. All demo clients, employees, projects, expenses, and billing reports are instantly purged, leaving you with an empty database ready for your studio records.</li>
                  </ol>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                  <h5 className="font-bold text-indigo-400">
                    Method B: Permanent Source Code Reset
                  </h5>
                  <p className="text-slate-400">
                    If you want the codebase itself to start empty by default for any fresh browser/device:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1.5 text-slate-400">
                    <li>Open <code className="font-mono text-indigo-300">src/services/db.ts</code>.</li>
                    <li>Set <code className="font-mono text-indigo-300">INITIAL_PROJECTS = []</code>, <code className="font-mono text-indigo-300">INITIAL_CLIENTS = []</code>, <code className="font-mono text-indigo-300">INITIAL_EMPLOYEES = []</code>, and <code className="font-mono text-indigo-300">INITIAL_BILLING_REPORTS = []</code>.</li>
                    <li>Clear your browser's LocalStorage or click "Clear All Data" in the app.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-800 px-6 py-3 bg-slate-950/60">
          <button
            onClick={onClose}
            className="rounded-md bg-slate-800 px-4 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
          >
            Close Manual
          </button>
        </div>
      </div>
    </div>
  );
};
