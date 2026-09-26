export type EmployeeRole =
  | 'Lead Photographer'
  | 'Cinematographer'
  | 'Colorist & Video Editor'
  | 'Drone Pilot & Aerial'
  | 'Photobook & Album Designer'
  | 'Sound & Audio Engineer'
  | 'Production Assistant';

export type EmployeeStatus = 'available' | 'on_assignment' | 'on_leave';

export interface EmployeeSubEventRate {
  subEventId: string;
  subEventName: string;
  category: ProjectCategory;
  rate: number; // in NPR
  customRole?: string; // specific role definition for this sub-event
}

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  email: string;
  phone: string;
  projectRate: number; // Default overall baseline rate in NPR / Rs.
  hourlyRate?: number; // Legacy backwards-compatibility
  skills: string[];
  status: EmployeeStatus;
  avatarColor: string;
  joinedDate: string;
  notes?: string;
  associatedCategories?: ProjectCategory[]; // Main events associated with (Wedding, Corporate, etc.)
  subEventRates?: EmployeeSubEventRate[]; // Sub-event assignments with rates & role definitions
}

export interface Client {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  city: string;
  contractDate: string;
  notes?: string;
  portalAccessCode: string;
  createdAt: string;
}

export type DeliverableType = 'photobook' | 'reels' | 'highlights' | 'frames' | 'pendrives' | 'custom';

export type DeliverableStatus =
  | 'drafting'
  | 'in_progress'
  | 'client_review'
  | 'ready_for_press'
  | 'completed'
  | 'delivered';

export interface Deliverable {
  id: string;
  projectId: string;
  clientId: string;
  type: DeliverableType;
  title: string;
  specifications: string;
  status: DeliverableStatus;
  targetDueDate: string;
  completedDate?: string;
  assignedEmployeeId?: string;
  notes?: string;
  clientApproved: boolean;
  trackingNumber?: string;
}

export type MilestoneStatus = 'pending' | 'in_progress' | 'completed' | 'billed' | 'paid';

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  percentage: number; // e.g. 25%
  amount: number;
  dueDate: string;
  status: MilestoneStatus;
  completedAt?: string;
  billingReportId?: string;
  associatedDeliverableIds?: string[];
}

export type ExpenseCategory =
  | 'Equipment Rental'
  | 'Travel & Transportation'
  | 'Assistant & Crew Stipend'
  | 'Storage & Hard Drives'
  | 'Printing & Lab Fabrication'
  | 'Location & Studio Fees'
  | 'Catering & Hospitality'
  | 'Software & Subscriptions'
  | 'Miscellaneous';

export type ExpenseStatus = 'approved' | 'pending' | 'reimbursed';

export interface Expense {
  id: string;
  projectId: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  paidByEmployeeId?: string;
  receiptRef: string;
  status: ExpenseStatus;
}

export type ProjectStatus =
  | 'lead'
  | 'pre_production'
  | 'production'
  | 'post_production'
  | 'deliverables_review'
  | 'completed'
  | 'archived';

export type ProjectCategory =
  | 'Wedding'
  | 'Corporate Film'
  | 'Commercial & Brand'
  | 'Editorial & Fashion'
  | 'Event & Gala';

export interface ProjectEmployeeSubEventAssignment {
  subEventId: string;
  subEventName: string;
  role: string;
  rate: number; // in NPR
}

export interface Project {
  id: string;
  clientId: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  fixedBudget: number; // Contracted Total Project Rate in NPR
  selectedSubEventIds?: string[]; // Sub-events included in this project
  assignedEmployeeIds: string[]; // Multiple employees per project
  employeeProjectRoles?: Record<string, string>; // employeeId -> specific assignment role title
  employeeProjectRates?: Record<string, number>; // employeeId -> total assigned payment amount for this project in NPR
  employeeSubEventAssignments?: Record<string, ProjectEmployeeSubEventAssignment[]>; // employeeId -> breakdown of assigned sub-events and rates
  progress: number; // 0 - 100
  deliverables: Deliverable[];
  milestones: Milestone[];
  expenses: Expense[];
  location: string;
  notes: string;
  createdAt: string;
}

export type BillingReportStatus = 'draft' | 'issued' | 'paid' | 'overdue';

export interface BillingReportLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface BillingReport {
  id: string;
  invoiceNumber: string;
  projectId: string;
  clientId: string;
  milestoneId: string;
  milestoneTitle: string;
  issueDate: string;
  dueDate: string;
  status: BillingReportStatus;
  items: BillingReportLineItem[];
  subtotal: number;
  taxRate?: number; // 0 - tax removed
  taxAmount?: number; // 0 - tax removed
  totalAmount: number;
  paidAmount: number;
  notes?: string;
  bankDetails: {
    accountName: string;
    bankName: string;
    routingOrSwift: string;
    accountNumber: string;
  };
  generatedAt: string;
}

export interface StudioConfig {
  studioName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  currency: string; // 'NPR'
  currencySymbol: string; // 'Rs.' or 'रू'
  taxRate?: number; // 0 - tax removed
  bankDetails: {
    accountName: string;
    bankName: string;
    routingOrSwift: string;
    accountNumber: string;
  };
}

export interface AppDatabase {
  projects: Project[];
  clients: Client[];
  employees: Employee[];
  billingReports: BillingReport[];
  config: StudioConfig;
  version: number;
}
