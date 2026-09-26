import {
  AppDatabase,
  Client,
  Employee,
  Project,
  Deliverable,
  Expense,
  Milestone,
  BillingReport,
  StudioConfig,
} from '../types';

const STORAGE_KEY = 'tahoe_studio_db_v1';

export const DEFAULT_CONFIG: StudioConfig = {
  studioName: 'Mandap Visuals',
  tagline: 'High-Fidelity Cinema, Wedding & Fine Art Media',
  email: 'operations@mandapvisuals.com',
  phone: '+977 9801122330',
  address: 'Kathmandu, Nepal',
  currency: 'NPR',
  currencySymbol: 'Rs.',
  taxRate: 0,
  bankDetails: {
    accountName: 'Mandap Visuals Pvt. Ltd.',
    bankName: 'Nabil Bank / Global IME Bank',
    routingOrSwift: 'NABILNPKA',
    accountNumber: '••••••••8912',
  },
};

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Julian Vance',
    role: 'Lead Photographer',
    email: 'julian@mandapstudio.com',
    phone: '+977 9801122331',
    projectRate: 20000,
    skills: ['Hasselblad X2D', 'Leica M11', 'Medium Format Stills', 'Natural Light Framing'],
    status: 'on_assignment',
    avatarColor: '#6366f1',
    joinedDate: '2023-01-15',
    notes: 'Primary creative director for gala, wedding and architecture assignments.',
  },
  {
    id: 'emp-2',
    name: 'Maya Chen',
    role: 'Cinematographer',
    email: 'maya@mandapstudio.com',
    phone: '+977 9801122332',
    projectRate: 15000,
    skills: ['RED V-Raptor 8K', 'Sony FX6', 'Gimbal Stabilization', 'Anamorphic Glass'],
    status: 'on_assignment',
    avatarColor: '#06b6d4',
    joinedDate: '2023-04-01',
    notes: 'Master of motion storytelling, high-speed tracking and low-light scenes.',
  },
  {
    id: 'emp-3',
    name: 'Liam O’Connor',
    role: 'Colorist & Video Editor',
    email: 'liam@mandapstudio.com',
    phone: '+977 9801122333',
    projectRate: 12000,
    skills: ['DaVinci Resolve Studio', 'ACES Workflow', 'Grain Synthesis', 'Audio Ducking'],
    status: 'available',
    avatarColor: '#10b981',
    joinedDate: '2023-08-10',
    notes: 'Handles all final conform, SDR/HDR grades, and pacing for reels and highlight films.',
  },
  {
    id: 'emp-4',
    name: 'Elena Rostova',
    role: 'Photobook & Album Designer',
    email: 'elena@mandapstudio.com',
    phone: '+977 9801122334',
    projectRate: 10000,
    skills: ['Adobe InDesign', 'Editorial Typography', 'Italian Binding Specs', 'Foil Stamping'],
    status: 'on_assignment',
    avatarColor: '#ec4899',
    joinedDate: '2024-02-01',
    notes: 'Curates layout pacing, flush-mount page spreads, and fine-art paper selection.',
  },
  {
    id: 'emp-5',
    name: 'Devin Kumar',
    role: 'Drone Pilot & Aerial',
    email: 'devin@mandapstudio.com',
    phone: '+977 9801122335',
    projectRate: 12000,
    skills: ['Part 107 Licensed', 'DJI Inspire 3 (8K CinemaDNG)', 'Mountain Terrain Flight', 'FPV Pro'],
    status: 'available',
    avatarColor: '#f59e0b',
    joinedDate: '2024-05-18',
    notes: 'Aerial specialist licensed for national forest and coastal operations.',
  },
  {
    id: 'emp-6',
    name: 'Chloe Dubois',
    role: 'Sound & Audio Engineer',
    email: 'chloe@mandapstudio.com',
    phone: '+977 9801122336',
    projectRate: 8000,
    skills: ['Sound Devices 833', 'DPA Lavaliers', 'Ambience Foley', 'Dialogue Restoration'],
    status: 'available',
    avatarColor: '#8b5cf6',
    joinedDate: '2024-09-01',
    notes: 'Clean field recordings, vow capture, speech enhancement and film mixing.',
  },
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'Elena & Marcus Sterling',
    company: 'Private Wedding Client',
    email: 'elena.sterling@vancemail.com',
    phone: '+1 (415) 890-2341',
    city: 'Emerald Bay, Lake Tahoe, CA',
    contractDate: '2026-06-12',
    notes: '3-day estate gala and vows. Requesting full physical heirlooms: 2 flush albums, 4K highlights, teak frame.',
    portalAccessCode: 'STERLING-2026',
    createdAt: '2026-06-12T10:00:00Z',
  },
  {
    id: 'cli-2',
    name: 'Aether Robotics Corp',
    company: 'Aether Robotics Inc.',
    email: 'marketing@aetherrobotics.io',
    phone: '+1 (650) 441-9920',
    city: 'San Francisco & Reno, NV',
    contractDate: '2026-07-05',
    notes: 'Autonomous drone fleet launch film, high-speed reels, executive portraits, and VIP archival pendrives.',
    portalAccessCode: 'AETHER-KEYNOTE',
    createdAt: '2026-07-05T14:30:00Z',
  },
  {
    id: 'cli-3',
    name: 'Solace Luxury Sanctuary',
    company: 'Solace Hospitality Group',
    email: 'curator@solaceluxury.com',
    phone: '+1 (775) 302-8812',
    city: 'Incline Village, NV',
    contractDate: '2026-08-14',
    notes: 'Fall/Winter resort campaign. Requires architectural gallery frames, vertical reels, and master pendrives.',
    portalAccessCode: 'SOLACE-TAHOE',
    createdAt: '2026-08-14T09:15:00Z',
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    clientId: 'cli-1',
    title: 'Sterling Lakeside Estate Gala & Nuptials',
    category: 'Wedding',
    status: 'post_production',
    startDate: '2026-08-20',
    endDate: '2026-10-15',
    fixedBudget: 85000,
    assignedEmployeeIds: ['emp-1', 'emp-2', 'emp-3', 'emp-4', 'emp-5'],
    employeeProjectRoles: {
      'emp-1': 'Lead Director & Still Stills Master',
      'emp-2': 'A-Cam Cinematographer',
      'emp-3': 'Lead Editor & Colorist',
      'emp-4': 'Fine Art Photobook Designer',
      'emp-5': 'Inspire 3 Aerial Pilot',
    },
    employeeProjectRates: {
      'emp-1': 20000,
      'emp-2': 15000,
      'emp-3': 12000,
      'emp-4': 10000,
      'emp-5': 12000,
    },
    progress: 72,
    location: 'Vance Lakefront Estate, Emerald Bay, CA',
    notes: 'High-end multi-camera shoot with same-day sneak peeks, Italian linen photobooks, and heirloom teak frames.',
    createdAt: '2026-06-15T09:00:00Z',
    deliverables: [
      {
        id: 'del-1',
        projectId: 'proj-1',
        clientId: 'cli-1',
        type: 'photobook',
        title: '30x40cm Flush Mount Italian Leather Photobook',
        specifications: '60 lay-flat pages, 280gsm silk velvet lamination, blind embossed cover, matching clamshell box',
        status: 'ready_for_press',
        targetDueDate: '2026-10-10',
        assignedEmployeeId: 'emp-4',
        clientApproved: true,
        notes: 'Proofing approved by client on Sep 22. Sent to GraphiStudio lab.',
        trackingNumber: 'GRAPHI-IT-9921',
      },
      {
        id: 'del-2',
        projectId: 'proj-1',
        clientId: 'cli-1',
        type: 'highlights',
        title: '6-Minute 4K Cinematic Highlight Film',
        specifications: 'Color graded in ACES, licensed orchestral audio, mastered for Apple ProRes 422HQ',
        status: 'client_review',
        targetDueDate: '2026-09-30',
        assignedEmployeeId: 'emp-3',
        clientApproved: false,
        notes: 'Cut v2 uploaded to Frame.io review link. Client requested slight trim on vows transition.',
      },
      {
        id: 'del-3',
        projectId: 'proj-1',
        clientId: 'cli-1',
        type: 'reels',
        title: '4x 9:16 Cinematic Social Reels (60s)',
        specifications: 'High-energy vertical cuts with sound design, optimized for Instagram HDR & TikTok',
        status: 'completed',
        targetDueDate: '2026-09-15',
        completedDate: '2026-09-14',
        assignedEmployeeId: 'emp-3',
        clientApproved: true,
        notes: 'Delivered via client cloud folder. Very high client praise.',
      },
      {
        id: 'del-4',
        projectId: 'proj-1',
        clientId: 'cli-1',
        type: 'frames',
        title: '24x36 Natural Teak Wall Frame with Museum Glass',
        specifications: 'Archival pigment print on Hahnemühle Photo Rag, anti-reflective 99% UV museum acrylic',
        status: 'in_progress',
        targetDueDate: '2026-10-12',
        assignedEmployeeId: 'emp-1',
        clientApproved: true,
        notes: 'Framing at Tahoe Custom Woodcraft lab. Awaiting pickup.',
      },
      {
        id: 'del-5',
        projectId: 'proj-1',
        clientId: 'cli-1',
        type: 'pendrives',
        title: 'Custom Walnut USB 3.2 Vault (256GB RAW & Master JPEGs)',
        specifications: 'Engraved couple initials, magnetic velvet closure, high-speed Kingston encrypted drive',
        status: 'in_progress',
        targetDueDate: '2026-10-14',
        assignedEmployeeId: 'emp-4',
        clientApproved: false,
        notes: 'Flash drives arrived at studio. Waiting for final album and highlight renders before copying.',
      },
    ],
    milestones: [
      {
        id: 'ms-1',
        projectId: 'proj-1',
        title: 'Contract Booking & Production Reserve (30%)',
        percentage: 30,
        amount: 8550,
        dueDate: '2026-06-20',
        status: 'paid',
        completedAt: '2026-06-18',
        billingReportId: 'rep-1',
      },
      {
        id: 'ms-2',
        projectId: 'proj-1',
        title: 'Production Days Wrap & Raw Ingestion (35%)',
        percentage: 35,
        amount: 9975,
        dueDate: '2026-08-25',
        status: 'paid',
        completedAt: '2026-08-24',
        billingReportId: 'rep-2',
      },
      {
        id: 'ms-3',
        projectId: 'proj-1',
        title: 'First Cut & Digital Sneak Peek Review (20%)',
        percentage: 20,
        amount: 5700,
        dueDate: '2026-09-20',
        status: 'completed',
        completedAt: '2026-09-18',
      },
      {
        id: 'ms-4',
        projectId: 'proj-1',
        title: 'Physical Deliverables Handover & Archive (15%)',
        percentage: 15,
        amount: 4275,
        dueDate: '2026-10-15',
        status: 'pending',
      },
    ],
    expenses: [
      {
        id: 'exp-1',
        projectId: 'proj-1',
        category: 'Equipment Rental',
        description: 'RED V-Raptor second body & Cooke anamorphic lenses (3 days)',
        amount: 1450,
        date: '2026-08-19',
        paidByEmployeeId: 'emp-2',
        receiptRef: 'REC-SF-CAMERA-8891',
        status: 'approved',
      },
      {
        id: 'exp-2',
        projectId: 'proj-1',
        category: 'Printing & Lab Fabrication',
        description: 'GraphiStudio custom Italian leather sample & binding setup',
        amount: 1280,
        date: '2026-09-12',
        paidByEmployeeId: 'emp-4',
        receiptRef: 'REC-GRAPHI-0041',
        status: 'approved',
      },
      {
        id: 'exp-3',
        projectId: 'proj-1',
        category: 'Storage & Hard Drives',
        description: '3x SanDisk Extreme Pro 4TB NVMe SSD + 10x Walnut USBs',
        amount: 620,
        date: '2026-08-18',
        paidByEmployeeId: 'emp-1',
        receiptRef: 'REC-AMZN-99120',
        status: 'approved',
      },
      {
        id: 'exp-4',
        projectId: 'proj-1',
        category: 'Travel & Transportation',
        description: 'Crew boat shuttle across Emerald Bay & gear transit',
        amount: 480,
        date: '2026-08-21',
        paidByEmployeeId: 'emp-5',
        receiptRef: 'REC-TAHOE-MARINA-12',
        status: 'approved',
      },
      {
        id: 'exp-5',
        projectId: 'proj-1',
        category: 'Catering & Hospitality',
        description: 'Crew production meals for 5 on-site staff (2 shoot days)',
        amount: 395,
        date: '2026-08-21',
        paidByEmployeeId: 'emp-1',
        receiptRef: 'REC-CATERING-882',
        status: 'reimbursed',
      },
    ],
  },
  {
    id: 'proj-2',
    clientId: 'cli-2',
    title: 'Aether Autonomous Drone Global Keynote Campaign',
    category: 'Corporate Film',
    status: 'production',
    startDate: '2026-09-01',
    endDate: '2026-11-05',
    fixedBudget: 60000,
    assignedEmployeeIds: ['emp-2', 'emp-5', 'emp-6', 'emp-3'],
    employeeProjectRoles: {
      'emp-2': 'Director of Photography',
      'emp-5': 'Lead Aerial Coordinator',
      'emp-6': 'Production Sound Recordist',
      'emp-3': 'Lead VFX & Colorist',
    },
    employeeProjectRates: {
      'emp-2': 18000,
      'emp-5': 15000,
      'emp-6': 8000,
      'emp-3': 12000,
    },
    progress: 45,
    location: 'Reno Drone Test Range & SF Headquarters',
    notes: 'Keynote introduction video, high-speed chase reels, and luxury archival media packages for investor kits.',
    createdAt: '2026-07-10T11:00:00Z',
    deliverables: [
      {
        id: 'del-201',
        projectId: 'proj-2',
        clientId: 'cli-2',
        type: 'highlights',
        title: '3-Minute 8K Flagship Product Reveal Film',
        specifications: 'CGI integration plates, sound design by Dolby Atmos certified lab, HDR10 Master',
        status: 'in_progress',
        targetDueDate: '2026-10-25',
        assignedEmployeeId: 'emp-2',
        clientApproved: false,
        notes: 'Principal photography completed at desert airstrip.',
      },
      {
        id: 'del-202',
        projectId: 'proj-2',
        clientId: 'cli-2',
        type: 'reels',
        title: '6x Product Feature Teaser Reels (9:16)',
        specifications: '30-45s vertical teasers highlighting speed, autonomous obstacle avoidance, and battery',
        status: 'drafting',
        targetDueDate: '2026-10-18',
        assignedEmployeeId: 'emp-3',
        clientApproved: false,
      },
      {
        id: 'del-203',
        projectId: 'proj-2',
        clientId: 'cli-2',
        type: 'pendrives',
        title: '50x Branded Aluminum Keynote Press USB Vaults (64GB)',
        specifications: 'Anodized space gray aluminum, laser etched company logo, preloaded with B-roll & press kit',
        status: 'in_progress',
        targetDueDate: '2026-11-01',
        assignedEmployeeId: 'emp-5',
        clientApproved: true,
        notes: 'Aluminum cases manufactured in Reno lab.',
      },
      {
        id: 'del-204',
        projectId: 'proj-2',
        clientId: 'cli-2',
        type: 'frames',
        title: '4x Executive Boardroom Brushed Aluminum Print Displays',
        specifications: '30x40 direct UV print on brushed dibond aluminum with float standoff mount',
        status: 'drafting',
        targetDueDate: '2026-11-04',
        assignedEmployeeId: 'emp-2',
        clientApproved: false,
      },
    ],
    milestones: [
      {
        id: 'ms-201',
        projectId: 'proj-2',
        title: 'Project Kickoff & Flight Safety Clearances (25%)',
        percentage: 25,
        amount: 8500,
        dueDate: '2026-09-05',
        status: 'paid',
        completedAt: '2026-09-04',
        billingReportId: 'rep-3',
      },
      {
        id: 'ms-202',
        projectId: 'proj-2',
        title: 'Flight Test Aerials & Stage A Photography (35%)',
        percentage: 35,
        amount: 11900,
        dueDate: '2026-09-28',
        status: 'in_progress',
      },
      {
        id: 'ms-203',
        projectId: 'proj-2',
        title: 'Post-Production VFX & Sound Master (25%)',
        percentage: 25,
        amount: 8500,
        dueDate: '2026-10-22',
        status: 'pending',
      },
      {
        id: 'ms-204',
        projectId: 'proj-2',
        title: 'Final Keynote Assets & Press USB Delivery (15%)',
        percentage: 15,
        amount: 5100,
        dueDate: '2026-11-05',
        status: 'pending',
      },
    ],
    expenses: [
      {
        id: 'exp-201',
        projectId: 'proj-2',
        category: 'Equipment Rental',
        description: 'Phantom Flex 4K High-Speed Camera for rotor blade capture',
        amount: 2200,
        date: '2026-09-10',
        paidByEmployeeId: 'emp-2',
        receiptRef: 'REC-VISION-RENTALS-01',
        status: 'approved',
      },
      {
        id: 'exp-202',
        projectId: 'proj-2',
        category: 'Location & Studio Fees',
        description: 'Desert airstrip permit & runway security coordinator fee',
        amount: 1800,
        date: '2026-09-08',
        paidByEmployeeId: 'emp-5',
        receiptRef: 'REC-NV-FAA-PERMIT',
        status: 'approved',
      },
      {
        id: 'exp-203',
        projectId: 'proj-2',
        category: 'Storage & Hard Drives',
        description: '50x Custom laser-engraved 64GB USB drives bulk order',
        amount: 875,
        date: '2026-09-14',
        paidByEmployeeId: 'emp-5',
        receiptRef: 'REC-USB-PROMO-900',
        status: 'pending',
      },
    ],
  },
  {
    id: 'proj-3',
    clientId: 'cli-3',
    title: 'Solace Resort Winter Brand Campaign',
    category: 'Commercial & Brand',
    status: 'pre_production',
    startDate: '2026-10-01',
    endDate: '2026-11-20',
    fixedBudget: 50000,
    assignedEmployeeIds: ['emp-1', 'emp-3'],
    employeeProjectRoles: {
      'emp-1': 'Lead Photographer',
      'emp-3': 'Colorist & Video Editor',
    },
    employeeProjectRates: {
      'emp-1': 20000,
      'emp-3': 12000,
    },
    progress: 15,
    location: 'Incline Village Mountain Lodge, NV',
    notes: 'Architectural stills, lounge promotional reels, and hardcover concierge photobooks.',
    createdAt: '2026-08-16T15:00:00Z',
    deliverables: [
      {
        id: 'del-301',
        projectId: 'proj-3',
        clientId: 'cli-3',
        type: 'photobook',
        title: '3x Hardcover Luxury Concierge Suite Photobooks',
        specifications: '30x30cm, Japanese binding, matte paper, customized for penthouse suites',
        status: 'drafting',
        targetDueDate: '2026-11-15',
        assignedEmployeeId: 'emp-4',
        clientApproved: false,
      },
      {
        id: 'del-302',
        projectId: 'proj-3',
        clientId: 'cli-3',
        type: 'reels',
        title: '8x Winter Haven Atmosphere Reels',
        specifications: 'Fireplace moods, spa treatments, twilight architectural reveals',
        status: 'drafting',
        targetDueDate: '2026-11-10',
        assignedEmployeeId: 'emp-3',
        clientApproved: false,
      },
      {
        id: 'del-303',
        projectId: 'proj-3',
        clientId: 'cli-3',
        type: 'frames',
        title: '6x Black Ash Gallery Wall Frames for Lobby',
        specifications: '20x30 fine art cotton rag prints, archival matting',
        status: 'drafting',
        targetDueDate: '2026-11-18',
        assignedEmployeeId: 'emp-1',
        clientApproved: false,
      },
    ],
    milestones: [
      {
        id: 'ms-301',
        projectId: 'proj-3',
        title: 'Initial Deposit & Creative Moodboard Signoff (30%)',
        percentage: 30,
        amount: 5850,
        dueDate: '2026-09-25',
        status: 'paid',
        completedAt: '2026-09-23',
        billingReportId: 'rep-4',
      },
      {
        id: 'ms-302',
        projectId: 'proj-3',
        title: 'On-Site Photography & Video Production (40%)',
        percentage: 40,
        amount: 7800,
        dueDate: '2026-10-15',
        status: 'pending',
      },
      {
        id: 'ms-303',
        projectId: 'proj-3',
        title: 'Framing, Photobook Press & Deliverables (30%)',
        percentage: 30,
        amount: 5850,
        dueDate: '2026-11-20',
        status: 'pending',
      },
    ],
    expenses: [
      {
        id: 'exp-301',
        projectId: 'proj-3',
        category: 'Assistant & Crew Stipend',
        description: 'Location scouting assistant & interior lighting rigger stipend',
        amount: 450,
        date: '2026-09-22',
        paidByEmployeeId: 'emp-1',
        receiptRef: 'REC-SCOUT-091',
        status: 'approved',
      },
    ],
  },
];

export const INITIAL_BILLING_REPORTS: BillingReport[] = [
  {
    id: 'rep-1',
    invoiceNumber: 'MANDAP-2026-081',
    projectId: 'proj-1',
    clientId: 'cli-1',
    milestoneId: 'ms-1',
    milestoneTitle: 'Contract Booking & Production Reserve (30%)',
    issueDate: '2026-06-18',
    dueDate: '2026-06-25',
    status: 'paid',
    items: [
      {
        id: 'item-1',
        description: 'Contract Booking Reserve - 30% of Project Rate (Rs. 85,000)',
        quantity: 1,
        unitPrice: 25500,
        total: 25500,
      },
    ],
    subtotal: 25500,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 25500,
    paidAmount: 25500,
    notes: 'Thank you for choosing Mandap Visuals. Booking retainer received.',
    bankDetails: DEFAULT_CONFIG.bankDetails,
    generatedAt: '2026-06-18T14:00:00Z',
  },
  {
    id: 'rep-2',
    invoiceNumber: 'MANDAP-2026-094',
    projectId: 'proj-1',
    clientId: 'cli-1',
    milestoneId: 'ms-2',
    milestoneTitle: 'Production Days Wrap & Raw Ingestion (35%)',
    issueDate: '2026-08-24',
    dueDate: '2026-08-31',
    status: 'paid',
    items: [
      {
        id: 'item-2',
        description: 'Shoot Wrap & Multi-Cam Ingestion - 35% of Project Rate (Rs. 85,000)',
        quantity: 1,
        unitPrice: 29750,
        total: 29750,
      },
      {
        id: 'item-2b',
        description: 'Associated Milestone Deliverables: RAW backup archived to 2x off-site encrypted vaults',
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ],
    subtotal: 29750,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 29750,
    paidAmount: 29750,
    notes: 'Milestone 2 completed upon wrap of Emerald Bay on-site production.',
    bankDetails: DEFAULT_CONFIG.bankDetails,
    generatedAt: '2026-08-24T16:30:00Z',
  },
  {
    id: 'rep-3',
    invoiceNumber: 'MANDAP-2026-102',
    projectId: 'proj-2',
    clientId: 'cli-2',
    milestoneId: 'ms-201',
    milestoneTitle: 'Project Kickoff & Flight Safety Clearances (25%)',
    issueDate: '2026-09-04',
    dueDate: '2026-09-18',
    status: 'paid',
    items: [
      {
        id: 'item-3',
        description: 'Keynote Campaign Initial Milestone - 25% of Project Rate (Rs. 60,000)',
        quantity: 1,
        unitPrice: 15000,
        total: 15000,
      },
    ],
    subtotal: 15000,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 15000,
    paidAmount: 15000,
    notes: 'Production flight clearances approved.',
    bankDetails: DEFAULT_CONFIG.bankDetails,
    generatedAt: '2026-09-04T10:00:00Z',
  },
  {
    id: 'rep-4',
    invoiceNumber: 'MANDAP-2026-118',
    projectId: 'proj-3',
    clientId: 'cli-3',
    milestoneId: 'ms-301',
    milestoneTitle: 'Initial Deposit & Creative Moodboard Signoff (30%)',
    issueDate: '2026-09-23',
    dueDate: '2026-10-07',
    status: 'paid',
    items: [
      {
        id: 'item-4',
        description: 'Solace Resort Creative Deposit - 30% of Project Rate (Rs. 50,000)',
        quantity: 1,
        unitPrice: 15000,
        total: 15000,
      },
    ],
    subtotal: 15000,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 15000,
    paidAmount: 15000,
    notes: 'Moodboard approved. Shoot dates reserved.',
    bankDetails: DEFAULT_CONFIG.bankDetails,
    generatedAt: '2026-09-23T11:20:00Z',
  },
];

class LocalDatabase {
  private db: AppDatabase;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.db = this.loadFromStorage();
  }

  private loadFromStorage(): AppDatabase {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.projects && parsed.employees && parsed.clients) {
          // Automatic migration to NPR and project-based rates
          if (!parsed.config || parsed.config.currency === 'USD' || !parsed.config.currencySymbol) {
            parsed.config = {
              ...DEFAULT_CONFIG,
              ...(parsed.config || {}),
              currency: 'NPR',
              currencySymbol: 'Rs.',
              taxRate: 0,
            };
          }
          if (parsed.employees) {
            parsed.employees = parsed.employees.map((e: any) => ({
              ...e,
              projectRate: e.projectRate ?? (e.hourlyRate ? e.hourlyRate * 100 : 15000),
            }));
          }
          if (parsed.projects) {
            parsed.projects = parsed.projects.map((p: any) => {
              if (!p.employeeProjectRates) {
                const rates: Record<string, number> = {};
                (p.assignedEmployeeIds || []).forEach((id: string) => {
                  const emp = (parsed.employees || []).find((e: any) => e.id === id);
                  rates[id] = emp?.projectRate ?? 15000;
                });
                p.employeeProjectRates = rates;
              }
              return p;
            });
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse database from localStorage, initializing fresh:', e);
    }

    const initialDb: AppDatabase = {
      projects: INITIAL_PROJECTS,
      clients: INITIAL_CLIENTS,
      employees: INITIAL_EMPLOYEES,
      billingReports: INITIAL_BILLING_REPORTS,
      config: DEFAULT_CONFIG,
      version: 1,
    };
    this.saveToStorage(initialDb);
    return initialDb;
  }

  private saveToStorage(database: AppDatabase) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
    } catch (e) {
      console.error('Failed to persist to localStorage:', e);
    }
  }

  private notify() {
    this.saveToStorage(this.db);
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getSnapshot(): AppDatabase {
    return this.db;
  }

  // --- CLIENTS ---
  public getClients(): Client[] {
    return this.db.clients;
  }

  public getClient(id: string): Client | undefined {
    return this.db.clients.find((c) => c.id === id);
  }

  public createClient(clientData: Omit<Client, 'id' | 'createdAt'>): Client {
    const newClient: Client = {
      ...clientData,
      id: `cli-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.db = {
      ...this.db,
      clients: [newClient, ...this.db.clients],
    };
    this.notify();
    return newClient;
  }

  public updateClient(id: string, updates: Partial<Client>): Client {
    this.db = {
      ...this.db,
      clients: this.db.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    };
    this.notify();
    return this.getClient(id)!;
  }

  public deleteClient(id: string): boolean {
    this.db = {
      ...this.db,
      clients: this.db.clients.filter((c) => c.id !== id),
      // Clean up orphaned projects or keep them with unassigned
      projects: this.db.projects.map((p) =>
        p.clientId === id ? { ...p, clientId: '' } : p
      ),
    };
    this.notify();
    return true;
  }

  // --- EMPLOYEES (CRUD) ---
  public getEmployees(): Employee[] {
    return this.db.employees;
  }

  public getEmployee(id: string): Employee | undefined {
    return this.db.employees.find((e) => e.id === id);
  }

  public createEmployee(empData: Omit<Employee, 'id'>): Employee {
    const newEmployee: Employee = {
      ...empData,
      id: `emp-${Date.now()}`,
    };
    this.db = {
      ...this.db,
      employees: [newEmployee, ...this.db.employees],
    };
    this.notify();
    return newEmployee;
  }

  public updateEmployee(id: string, updates: Partial<Employee>): Employee {
    this.db = {
      ...this.db,
      employees: this.db.employees.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    };
    this.notify();
    return this.getEmployee(id)!;
  }

  public deleteEmployee(id: string): boolean {
    this.db = {
      ...this.db,
      employees: this.db.employees.filter((e) => e.id !== id),
      projects: this.db.projects.map((p) => ({
        ...p,
        assignedEmployeeIds: p.assignedEmployeeIds.filter((empId) => empId !== id),
        employeeProjectRoles: p.employeeProjectRoles
          ? Object.fromEntries(
              Object.entries(p.employeeProjectRoles).filter(([key]) => key !== id)
            )
          : undefined,
        deliverables: p.deliverables.map((d) =>
          d.assignedEmployeeId === id ? { ...d, assignedEmployeeId: undefined } : d
        ),
      })),
    };
    this.notify();
    return true;
  }

  // --- PROJECTS ---
  public getProjects(): Project[] {
    return this.db.projects;
  }

  public getProject(id: string): Project | undefined {
    return this.db.projects.find((p) => p.id === id);
  }

  public createProject(projData: Omit<Project, 'id' | 'createdAt'>): Project {
    const newProject: Project = {
      ...projData,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.db = {
      ...this.db,
      projects: [newProject, ...this.db.projects],
    };
    this.notify();
    return newProject;
  }

  public updateProject(id: string, updates: Partial<Project>): Project {
    this.db = {
      ...this.db,
      projects: this.db.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    };
    this.notify();
    return this.getProject(id)!;
  }

  public deleteProject(id: string): boolean {
    this.db = {
      ...this.db,
      projects: this.db.projects.filter((p) => p.id !== id),
      billingReports: this.db.billingReports.filter((r) => r.projectId !== id),
    };
    this.notify();
    return true;
  }

  // --- MULTI-EMPLOYEE PROJECT ASSIGNMENT ---
  public assignEmployeesToProject(
    projectId: string,
    assignments: {
      employeeId: string;
      roleOnProject?: string;
      assignedRate?: number;
      subEventAssignments?: import('../types').ProjectEmployeeSubEventAssignment[];
    }[]
  ): Project {
    const project = this.getProject(projectId);
    if (!project) throw new Error('Project not found');

    const assignedEmployeeIds = assignments.map((a) => a.employeeId);
    const employeeProjectRoles: Record<string, string> = {
      ...(project.employeeProjectRoles || {}),
    };
    const employeeProjectRates: Record<string, number> = {
      ...(project.employeeProjectRates || {}),
    };
    const employeeSubEventAssignments: Record<string, import('../types').ProjectEmployeeSubEventAssignment[]> = {
      ...(project.employeeSubEventAssignments || {}),
    };

    assignments.forEach((a) => {
      if (a.roleOnProject) {
        employeeProjectRoles[a.employeeId] = a.roleOnProject;
      }
      if (a.subEventAssignments) {
        employeeSubEventAssignments[a.employeeId] = a.subEventAssignments;
      }
      if (a.assignedRate !== undefined) {
        employeeProjectRates[a.employeeId] = a.assignedRate;
      } else if (employeeProjectRates[a.employeeId] === undefined) {
        const emp = this.getEmployee(a.employeeId);
        if (emp && emp.projectRate !== undefined) {
          employeeProjectRates[a.employeeId] = emp.projectRate;
        }
      }
    });

    return this.updateProject(projectId, {
      assignedEmployeeIds,
      employeeProjectRoles,
      employeeProjectRates,
      employeeSubEventAssignments,
    });
  }

  public updateEmployeeSubEventAssignment(
    projectId: string,
    employeeId: string,
    subEventAssignments: import('../types').ProjectEmployeeSubEventAssignment[]
  ): Project {
    const project = this.getProject(projectId);
    if (!project) throw new Error('Project not found');

    const totalRate = subEventAssignments.reduce((s, a) => s + (a.rate || 0), 0);
    const roleSummary = subEventAssignments.map((a) => a.role).filter(Boolean).join(', ');

    const employeeSubEventAssignments = {
      ...(project.employeeSubEventAssignments || {}),
      [employeeId]: subEventAssignments,
    };
    const employeeProjectRates = {
      ...(project.employeeProjectRates || {}),
      [employeeId]: totalRate,
    };
    const employeeProjectRoles = {
      ...(project.employeeProjectRoles || {}),
      [employeeId]: roleSummary || project.employeeProjectRoles?.[employeeId] || 'Production Crew',
    };

    return this.updateProject(projectId, {
      employeeSubEventAssignments,
      employeeProjectRates,
      employeeProjectRoles,
    });
  }

  public updateEmployeeProjectRate(projectId: string, employeeId: string, rate: number): Project {
    const project = this.getProject(projectId);
    if (!project) throw new Error('Project not found');

    const employeeProjectRates: Record<string, number> = {
      ...(project.employeeProjectRates || {}),
      [employeeId]: Math.max(0, rate),
    };

    return this.updateProject(projectId, { employeeProjectRates });
  }

  // --- DELIVERABLES ---
  public addDeliverable(projectId: string, deliverableData: Omit<Deliverable, 'id' | 'projectId'>): Deliverable {
    const newDeliverable: Deliverable = {
      ...deliverableData,
      id: `del-${Date.now()}`,
      projectId,
    };
    this.db = {
      ...this.db,
      projects: this.db.projects.map((p) =>
        p.id === projectId
          ? { ...p, deliverables: [...p.deliverables, newDeliverable] }
          : p
      ),
    };
    this.notify();
    return newDeliverable;
  }

  public updateDeliverable(projectId: string, deliverableId: string, updates: Partial<Deliverable>): void {
    this.db = {
      ...this.db,
      projects: this.db.projects.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          deliverables: p.deliverables.map((d) =>
            d.id === deliverableId ? { ...d, ...updates } : d
          ),
        };
      }),
    };
    this.notify();
  }

  public deleteDeliverable(projectId: string, deliverableId: string): void {
    this.db = {
      ...this.db,
      projects: this.db.projects.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          deliverables: p.deliverables.filter((d) => d.id !== deliverableId),
        };
      }),
    };
    this.notify();
  }

  // --- EXPENSES (BUDGET vs EXPENSES) ---
  public addExpense(projectId: string, expenseData: Omit<Expense, 'id' | 'projectId'>): Expense {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      projectId,
    };
    this.db = {
      ...this.db,
      projects: this.db.projects.map((p) =>
        p.id === projectId ? { ...p, expenses: [...p.expenses, newExpense] } : p
      ),
    };
    this.notify();
    return newExpense;
  }

  public updateExpense(projectId: string, expenseId: string, updates: Partial<Expense>): void {
    this.db = {
      ...this.db,
      projects: this.db.projects.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          expenses: p.expenses.map((e) =>
            e.id === expenseId ? { ...e, ...updates } : e
          ),
        };
      }),
    };
    this.notify();
  }

  public deleteExpense(projectId: string, expenseId: string): void {
    this.db = {
      ...this.db,
      projects: this.db.projects.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          expenses: p.expenses.filter((e) => e.id !== expenseId),
        };
      }),
    };
    this.notify();
  }

  // --- MILESTONES & AUTOMATED BILLING REPORTS ---
  public updateMilestone(projectId: string, milestoneId: string, updates: Partial<Milestone>): void {
    this.db = {
      ...this.db,
      projects: this.db.projects.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          milestones: p.milestones.map((m) =>
            m.id === milestoneId ? { ...m, ...updates } : m
          ),
        };
      }),
    };
    this.notify();
  }

  public generateAutomatedBillingReport(
    projectId: string,
    milestoneId: string,
    customNotes?: string
  ): BillingReport {
    const project = this.getProject(projectId);
    if (!project) throw new Error('Project not found');

    const milestone = project.milestones.find((m) => m.id === milestoneId);
    if (!milestone) throw new Error('Milestone not found');

    const client = this.getClient(project.clientId);

    const now = new Date();
    const issueDate = now.toISOString().split('T')[0];
    const dueDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    // Find deliverables linked or due around this milestone
    const linkedDeliverables = project.deliverables.filter(
      (d) =>
        (milestone.associatedDeliverableIds &&
          milestone.associatedDeliverableIds.includes(d.id)) ||
        d.status === 'completed' ||
        d.status === 'ready_for_press'
    );

    const sym = this.db.config.currencySymbol || 'Rs.';
    const lineItems = [
      {
        id: `li-1`,
        description: `Milestone Release: ${milestone.title} (${milestone.percentage}% of Project Rate ${sym} ${project.fixedBudget.toLocaleString()})`,
        quantity: 1,
        unitPrice: milestone.amount,
        total: milestone.amount,
      },
    ];

    if (linkedDeliverables.length > 0) {
      linkedDeliverables.slice(0, 3).forEach((d, idx) => {
        lineItems.push({
          id: `li-del-${idx}`,
          description: `Deliverable Verification: [${d.type.toUpperCase()}] ${d.title} (Status: ${d.status.replace(/_/g, ' ')})`,
          quantity: 1,
          unitPrice: 0,
          total: 0,
        });
      });
    }

    const subtotal = milestone.amount;
    const taxRate = 0; // Tax removed
    const taxAmount = 0;
    const totalAmount = subtotal;

    const reportCount = this.db.billingReports.length + 1;
    const invoiceNumber = `MANDAP-${now.getFullYear()}-${String(reportCount).padStart(3, '0')}`;

    const newReport: BillingReport = {
      id: `rep-${Date.now()}`,
      invoiceNumber,
      projectId,
      clientId: project.clientId,
      milestoneId,
      milestoneTitle: milestone.title,
      issueDate,
      dueDate,
      status: 'issued',
      items: lineItems,
      subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      paidAmount: 0,
      notes:
        customNotes ||
        `Automated milestone billing generated upon milestone sign-off for "${project.title}". Remit payment per banking wire instructions.`,
      bankDetails: this.db.config.bankDetails,
      generatedAt: now.toISOString(),
    };

    // Update milestone status to 'billed' and link billingReportId
    this.updateMilestone(projectId, milestoneId, {
      status: 'billed',
      completedAt: milestone.completedAt || issueDate,
      billingReportId: newReport.id,
    });

    this.db = {
      ...this.db,
      billingReports: [newReport, ...this.db.billingReports],
    };
    this.notify();
    return newReport;
  }

  public getBillingReports(): BillingReport[] {
    return this.db.billingReports;
  }

  public updateBillingReport(id: string, updates: Partial<BillingReport>): BillingReport {
    this.db = {
      ...this.db,
      billingReports: this.db.billingReports.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    };
    this.notify();
    return this.db.billingReports.find((r) => r.id === id)!;
  }

  public deleteBillingReport(id: string): void {
    this.db = {
      ...this.db,
      billingReports: this.db.billingReports.filter((r) => r.id !== id),
    };
    this.notify();
  }

  // --- CONFIG ---
  public getConfig(): StudioConfig {
    return this.db.config;
  }

  public updateConfig(updates: Partial<StudioConfig>): StudioConfig {
    this.db = {
      ...this.db,
      config: { ...this.db.config, ...updates },
    };
    this.notify();
    return this.db.config;
  }

  // --- BACKUP & LOCAL DATABASE RECOVERY ---
  public exportDatabaseJSON(): string {
    return JSON.stringify(this.db, null, 2);
  }

  public importDatabaseJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && Array.isArray(parsed.projects) && Array.isArray(parsed.employees)) {
        this.db = parsed;
        this.notify();
        return true;
      }
      throw new Error('Invalid schema in imported JSON');
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }

  public resetToSeedData(): void {
    const initialDb: AppDatabase = {
      projects: INITIAL_PROJECTS,
      clients: INITIAL_CLIENTS,
      employees: INITIAL_EMPLOYEES,
      billingReports: INITIAL_BILLING_REPORTS,
      config: DEFAULT_CONFIG,
      version: 1,
    };
    this.db = initialDb;
    this.notify();
  }

  public clearAllData(): void {
    const emptyDb: AppDatabase = {
      projects: [],
      clients: [],
      employees: [],
      billingReports: [],
      config: this.db.config || DEFAULT_CONFIG,
      version: 1,
    };
    this.db = emptyDb;
    this.notify();
  }
}

export const db = new LocalDatabase();
