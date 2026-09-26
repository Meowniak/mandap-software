# Tahoe Studio Pro — Operational Manual & Developer Guide
**Designed for Apple Mac M1 Pro / macOS Tahoe 26**

---

## Table of Contents
1. [Software Overview & Full Operational Workflow](#1-software-overview--full-operational-workflow)
   - [Workflow Step-by-Step](#workflow-step-by-step)
   - [Managing Clients](#managing-clients)
   - [Managing Employees & Production Crew](#managing-employees--production-crew)
   - [Creating Projects & Multi-Employee Assignment](#creating-projects--multi-employee-assignment)
   - [Fixed Budget & Expense Ledger](#fixed-budget--expense-ledger)
   - [Deliverables Pipeline (Photobooks, Reels, Highlights, Frames, Pendrives)](#deliverables-pipeline)
   - [Automated Milestone Billing Reports](#automated-milestone-billing-reports)
2. [How to Install & Run on Laptop](#2-how-to-install--run-on-laptop)
3. [How to Edit Core Features from Source Code](#3-how-to-edit-core-features-from-source-code)
   - [Renaming "Tahoe Visual Works" & Branding](#renaming-tahoe-visual-works--branding)
   - [Modifying Banking / Wire Transfer Instructions](#modifying-banking--wire-transfer-instructions)
   - [Changing Tax Rates & Currency](#changing-tax-rates--currency)
   - [Adding or Modifying Production Roles & Deliverables](#adding-or-modifying-production-roles--deliverables)
4. [How to Remove Demo Values & Start from a Clean Slate](#4-how-to-remove-demo-values--start-from-a-clean-slate)
   - [Option A: 1-Click UI Wipe (Fastest)](#option-a-1-click-ui-wipe-fastest)
   - [Option B: Source Code Default Wipe](#option-b-source-code-default-wipe)
   - [Option C: Browser Cache Reset](#option-c-browser-cache-reset)

---

## 1. Software Overview & Full Operational Workflow

### Workflow Step-by-Step

```
[1. Add Client] ──> [2. Add Crew / Employees] ──> [3. Create Project & Fix Budget]
                                                           │
                                                           ▼
[6. Automated Billing] <── [5. Log Expenses] <── [4. Assign Crew & Deliverables]
```

### Managing Clients
1. Click **Clients & Accounts** in the sidebar.
2. Click **"+ Add Client"**:
   - Enter Client / Couple Name (e.g., `Elena & Marcus Sterling`).
   - Enter Company / Event Group (optional).
   - Enter Email, Phone, and City / Shoot Location.
   - Set a private **Portal Access Code** (e.g., `STERLING-2026`).
3. Click **Create Client**.
4. The client's profile card tracks lifetime spend across all projects and provides 1-click links to their ongoing engagements.

### Managing Employees & Production Crew
1. Click **Employees & Crew** in the sidebar.
2. Click **"+ Add Employee"**:
   - Enter Full Name, Role (Lead Photographer, Cinematographer, Colorist, Drone Pilot, Album Designer, Sound Engineer, Production Assistant).
   - Enter Hourly Billing Rate ($/hr).
   - Enter Email and Phone.
   - Select Availability Status (`Available`, `On Assignment`, `On Leave`).
   - Add Skills & Gear tags (e.g., `RED V-Raptor, DaVinci Resolve, DJI Inspire 3`).
   - Pick an avatar badge color.
3. Click **Add Employee**.
4. To edit any employee, click the **Pencil icon** on their card.
5. To remove an employee, click the **Trash icon**. The system automatically unassigns them from any active projects.

### Creating Projects & Multi-Employee Assignment
1. Click **Projects & Assignees** or the **"+ New Project"** button on the Dashboard.
2. Fill in:
   - **Project Title**: e.g., `Sterling Lakeside Estate Gala & Nuptials`.
   - **Client Account**: Select from your registered clients dropdown.
   - **Category**: `Wedding`, `Corporate Film`, `Commercial & Brand`, `Editorial & Fashion`, or `Event & Gala`.
   - **Fixed Contract Budget**: e.g., `$28,500.00`.
   - **Timeline**: Start Date and Final Handover Date.
   - **Location**: e.g., `Emerald Bay, Lake Tahoe, CA`.
   - **Crew & Multi-Employee Assignment**: Check off all team members assigned to this shoot.
3. Click **Create Project**.
4. Open the project by clicking its card:
   - Inside the **Crew & Assignees** tab, you can assign custom on-set titles to each team member (e.g., *Lead Director*, *A-Cam Operator*, *Drone Pilot*, *Colorist*).

### Fixed Budget & Expense Ledger
1. Every project has a strict **Fixed Contract Budget**.
2. Open the **Budget & Expenses** tab (or the project's **Expenses Ledger** tab):
   - Click **"+ Log Expense"**.
   - Select Category: `Equipment Rental`, `Travel & Transportation`, `Assistant & Crew Stipend`, `Storage & Hard Drives`, `Printing & Lab Fabrication`, `Location & Studio Fees`, `Catering & Hospitality`, or `Miscellaneous`.
   - Enter Amount, Date, Description, and Receipt Reference (e.g., `REC-CAMERA-9921`).
   - Select the crew member who paid for reimbursement.
3. The dashboard and project drawer automatically display:
   - Total Expenses Logged
   - Remaining Budget
   - Net Studio Profit Margin ($ and %)
   - Budget health indicator (Safe, Caution, Over budget).

### Deliverables Pipeline
Tahoe Studio Pro has specialized support for physical and digital client heirlooms:
- **Photobooks**: Flush-mount Italian leather or linen albums, paper weight (e.g. 280gsm silk velvet), blind embossing, and matching clamshell boxes.
- **Reels**: 9:16 vertical 4K social edits with sound design.
- **Highlights**: 4K cinematic film cuts with ACES color grading and licensed scores.
- **Frames**: Fine-art canvas and hardwood wall frames with museum glass.
- **Pendrives**: Laser-engraved walnut or aluminum USB 3.2 vaults with RAW archives.

To manage deliverables:
1. Go to **Deliverables Studio** (or open any project > **Deliverables** tab).
2. Click **"+ New Deliverable"** to add an item.
3. Use the **Stage dropdown** to advance status: `Drafting` ➔ `In Progress` ➔ `Client Review` ➔ `Ready for Press / Lab` ➔ `Completed` ➔ `Delivered`.
4. Toggle **Client Proofing Sign-off** when client confirms approval.
5. Enter courier or tracking numbers.

### Automated Milestone Billing Reports
1. In any project, navigate to the **Milestones & Billing** tab.
2. Projects automatically calculate milestone payment releases tied to the fixed budget (e.g., 30% Booking, 35% Shoot Wrap, 20% First Cut Review, 15% Physical Handover).
3. When a milestone is ready or completed, click **"Generate Automated Billing Report"**.
4. The system automatically creates a statement:
   - Milestone release calculation ($ and %)
   - Verification of completed deliverables
   - Sales tax calculation
   - Wire transfer & ACH bank details
5. Click **"Print / Save PDF"** to print or export a clean PDF without browser UI chrome.
6. Toggle the status from `Issued` to `Paid in Full` once funds clear.

---

## 2. How to Install & Run on Laptop

### Prerequisites
- An Apple Mac (M1/M2/M3 Pro, Max, or Intel) running macOS (Tahoe, Sonoma, or Ventura).
- **Node.js**: v18.0.0 or higher.
  - To check: open Terminal (`⌘ + Space`, type `Terminal`) and run:
    ```bash
    node -v
    ```
  - If not installed, download from [nodejs.org](https://nodejs.org) or install via Homebrew (`brew install node`).

### Installation Steps

1. **Open Terminal** on your Mac.
2. **Navigate to the project folder**:
   ```bash
   cd /path/to/tahoe-studio-pro
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Launch the development server**:
   ```bash
   npm run dev
   ```
5. **Open in Browser**:
   Open Safari, Google Chrome, or Arc and go to:
   ```
   http://localhost:3000
   ```

### Building for Offline / Standalone Production
If you want to build an optimized production version:
```bash
npm run build
npm run preview
```

---

## 3. How to Edit Core Features from Source Code

### Renaming "Tahoe Visual Works" & Branding

#### Method 1: In-App UI (Instant, No Code Required)
1. Click the **"Local DB"** button in the top-right corner of the window.
2. Select the **"Studio Name & Branding Settings"** tab.
3. Edit the **Studio Brand Name**, Tagline, Email, Phone, and Address.
4. Click **"Save Studio Branding"**. All titles and invoices update instantly.

#### Method 2: In Source Code
Open file: `src/services/db.ts` (around line 15):
```typescript
export const DEFAULT_CONFIG: StudioConfig = {
  studioName: 'YOUR STUDIO NAME',     // <-- Change here
  tagline: 'YOUR CUSTOM TAGLINE',     // <-- Change here
  email: 'contact@yourdomain.com',    // <-- Change here
  phone: '+1 (555) 000-0000',
  address: 'Your Studio Address, City, State ZIP',
  currency: 'USD',
  taxRate: 0.075, // 7.5% tax rate
  bankDetails: {
    accountName: 'Your Company LLC',
    bankName: 'Your Bank Name',
    routingOrSwift: '123456789',
    accountNumber: '••••••••1234',
  },
};
```

To change the browser page tab title:
- Open `index.html` and change `<title>Your Studio Name</title>`.
- Open `metadata.json` and change `"name": "Your Studio Name"`.

### Modifying Banking / Wire Transfer Instructions
In `src/services/db.ts`, update the `bankDetails` object inside `DEFAULT_CONFIG` (or in the in-app Settings modal). These details appear on all generated automated billing reports.

### Changing Tax Rates & Currency
In `src/services/db.ts`, update `taxRate: 0.075` (e.g., `0.08` for 8%, `0.0` for no tax).

### Adding or Modifying Production Roles & Deliverables
1. **Roles**: Open `src/types/index.ts` and edit `EmployeeRole`:
   ```typescript
   export type EmployeeRole =
     | 'Lead Photographer'
     | 'Cinematographer'
     | 'Colorist & Video Editor'
     | 'Drone Pilot & Aerial'
     | 'Photobook & Album Designer'
     | 'Sound & Audio Engineer'
     | 'Production Assistant'
     | 'Lighting Technician'; // Add custom roles here
   ```
2. **Deliverables**: Open `src/types/index.ts` and edit `DeliverableType`:
   ```typescript
   export type DeliverableType =
     | 'photobook'
     | 'reels'
     | 'highlights'
     | 'frames'
     | 'pendrives'
     | 'custom';
   ```

---

## 4. How to Remove Demo Values & Start from a Clean Slate

### Option A: 1-Click UI Wipe (Recommended & Instant)
You do not need to delete code to wipe the demo data:
1. Click the **"Local DB"** button in the top-right navigation bar.
2. In the modal, find the red box: **"Clear All Demo Data & Start Fresh"**.
3. Click **"Clear All Data (Start Fresh)"**.
4. Confirm the prompt.
5. All sample clients, employees, projects, expenses, and invoices will be purged. Your studio database is now a 100% blank slate.

*(If you ever want the sample data back for reference, you can click "Reload Demo Data" at any time).*

### Option B: Source Code Default Wipe
If you want the software to always initialize empty on any new laptop or fresh browser session:
1. Open `src/services/db.ts`.
2. Locate the initial data arrays:
   - Line ~35: `export const INITIAL_EMPLOYEES: Employee[] = [];`
   - Line ~115: `export const INITIAL_CLIENTS: Client[] = [];`
   - Line ~150: `export const INITIAL_PROJECTS: Project[] = [];`
   - Line ~480: `export const INITIAL_BILLING_REPORTS: BillingReport[] = [];`
3. Replace the contents of those arrays with empty arrays `[]`.
4. Run:
   ```bash
   npm run build
   ```

### Option C: Browser LocalStorage Reset
To wipe the database via browser Developer Tools:
1. In Safari or Chrome, press `Option + Command + I` to open Developer Tools.
2. Go to the **Application** (or **Storage**) tab.
3. Under **Local Storage**, right-click and delete `tahoe_studio_db_v1`.
4. Refresh the page.

---

## Keyboard Shortcuts (macOS)
- **⌘ + K**: Open Spotlight Quick Search (instantly search projects, crew, clients, and invoices).
- **⌘ + P**: Print or save PDF when viewing a Milestone Billing Report.
- **ESC**: Close any active modal.
