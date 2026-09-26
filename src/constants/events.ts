import { ProjectCategory } from '../types';

export interface SubEventDefinition {
  id: string;
  name: string;
  defaultRole: string;
  description: string;
}

export interface EventCategoryDefinition {
  category: ProjectCategory;
  name: string;
  iconName: string;
  description: string;
  subEvents: SubEventDefinition[];
}

export const EVENT_CATEGORIES: EventCategoryDefinition[] = [
  {
    category: 'Wedding',
    name: 'Wedding & Nuptials',
    iconName: 'HeartHandshake',
    description: 'Multi-day wedding celebrations, cultural rituals, and receptions',
    subEvents: [
      {
        id: 'pre_wedding',
        name: 'Pre-Wedding Shoot',
        defaultRole: 'Lead Photographer & Cinematographer',
        description: 'Scenic romantic couple portraits, sunset stills, teaser video',
      },
      {
        id: 'proposal',
        name: 'Proposal',
        defaultRole: 'Cinematographer (Hidden / Candid)',
        description: 'Candid surprise proposal capture and short cinematic highlight',
      },
      {
        id: 'engagement',
        name: 'Engagement (Supari / Ring Ceremony)',
        defaultRole: 'Lead Photographer',
        description: 'Family exchange ceremonies, ring exchange, stage group portraits',
      },
      {
        id: 'mehendi',
        name: 'Mehendi & Sangeet',
        defaultRole: 'Cinematographer & Colorist',
        description: 'Henna application, dance performances, colorful high-energy motion',
      },
      {
        id: 'haldi',
        name: 'Haldi Ceremony',
        defaultRole: 'Photographer & Assistant',
        description: 'Turmeric ritual, water splashes, candid family moments',
      },
      {
        id: 'main_wedding_bride',
        name: 'Main Wedding (Bride Side)',
        defaultRole: 'Lead Photographer',
        description: 'Bride getting ready, mandap rituals, Kanyadaan, sindoor ceremony',
      },
      {
        id: 'main_wedding_groom',
        name: 'Main Wedding (Groom Side)',
        defaultRole: 'Lead Cinematographer',
        description: 'Baraat procession, groom preparations, varmala & mandap',
      },
      {
        id: 'post_wedding',
        name: 'Post-Wedding / Bidaai',
        defaultRole: 'Cinematographer',
        description: 'Emotional departure, Grihapravesh, arrival at groom house',
      },
      {
        id: 'reception',
        name: 'Reception Party',
        defaultRole: 'Lead Photographer & Drone Op',
        description: 'Grand evening banquet, couple stage portraits, party highlights',
      },
    ],
  },
  {
    category: 'Corporate Film',
    name: 'Corporate & Brand Cinema',
    iconName: 'Building2',
    description: 'Corporate documentaries, leadership profiles, and facility showcases',
    subEvents: [
      {
        id: 'corp_preprod',
        name: 'Pre-Production & Storyboarding',
        defaultRole: 'Creative Director',
        description: 'Concept pitch, narrative outline, interview questions & storyboard',
      },
      {
        id: 'corp_executive',
        name: 'Executive & Leadership Interviews',
        defaultRole: 'Cinematographer & Sound Recordist',
        description: '2-camera 4K setup, lavalier + boom audio, key lighting',
      },
      {
        id: 'corp_facility',
        name: 'Facility, Plant & Drone B-Roll',
        defaultRole: 'Drone Pilot & Gimbal Op',
        description: 'HQ exterior, factory robotics, office team working b-roll',
      },
      {
        id: 'corp_keynote',
        name: 'Keynote & Annual AGM Live Shoot',
        defaultRole: 'Live Multi-Cam Operator',
        description: 'Stage lighting, presentation capture, audience reactions',
      },
      {
        id: 'corp_postprod',
        name: 'Post-Production, Color & Motion Graphics',
        defaultRole: 'Colorist & Video Editor',
        description: 'Assembly cut, DaVinci Resolve color, animated lower-thirds',
      },
    ],
  },
  {
    category: 'Commercial & Brand',
    name: 'Commercial & Brand Campaigns',
    iconName: 'Sparkles',
    description: 'High-end TV spots, digital ads, and luxury product launches',
    subEvents: [
      {
        id: 'comm_concept',
        name: 'Concept & Moodboard Development',
        defaultRole: 'Creative Producer',
        description: 'Brand style guidelines, treatment deck, talent casting',
      },
      {
        id: 'comm_product',
        name: 'Studio Tabletop & Product Stills',
        defaultRole: 'Commercial Still Photographer',
        description: 'Macro optics, strobe lighting, clean acrylic / metallic reflections',
      },
      {
        id: 'comm_lifestyle',
        name: 'Lifestyle & Location Video Shoot',
        defaultRole: 'Lead Cinematographer',
        description: 'On-location model interaction, anamorphic lenses, natural lighting',
      },
      {
        id: 'comm_color_vfx',
        name: 'Color Grading (ACES) & VFX Mastering',
        defaultRole: 'Colorist & Video Editor',
        description: 'ACES color space, cleanup, motion tracking, delivery formats',
      },
      {
        id: 'comm_sound_vo',
        name: 'Sound Design & Voiceover Master',
        defaultRole: 'Sound & Audio Engineer',
        description: 'Sound effects layering, original score sync, voiceover mix',
      },
    ],
  },
  {
    category: 'Editorial & Fashion',
    name: 'Editorial & Fashion Lookbooks',
    iconName: 'Camera',
    description: 'Designer lookbooks, runway documentation, and magazine spreads',
    subEvents: [
      {
        id: 'fashion_lookbook',
        name: 'Lookbook & Studio Model Stills',
        defaultRole: 'Lead Fashion Photographer',
        description: 'High-fashion poses, beauty dish lighting, textured backgrounds',
      },
      {
        id: 'fashion_runway',
        name: 'Runway & Ramp Showcase',
        defaultRole: 'Cinematographer',
        description: 'Continuous motion track, front-of-ramp 4K slow-mo',
      },
      {
        id: 'fashion_bts',
        name: 'Behind-The-Scenes (BTS) Reel',
        defaultRole: 'Vertical Video Creator',
        description: 'Makeup artist prep, wardrobe changes, 9:16 social teasers',
      },
      {
        id: 'fashion_retouch',
        name: 'High-End Magazine Retouching',
        defaultRole: 'Album Designer & Retoucher',
        description: 'Skin frequency separation, color grading, print-ready CMYK',
      },
    ],
  },
  {
    category: 'Event & Gala',
    name: 'Events & Galas',
    iconName: 'Trophy',
    description: 'Charity galas, awards ceremonies, concerts, and cultural festivals',
    subEvents: [
      {
        id: 'gala_red_carpet',
        name: 'Red Carpet & VIP Arrivals',
        defaultRole: 'Lead Photographer',
        description: 'Step-and-repeat backdrop, VIP guest portraits, flash photography',
      },
      {
        id: 'gala_stage',
        name: 'Stage Ceremonies & Awards',
        defaultRole: 'Lead Cinematographer',
        description: 'Award presentations, speeches, acceptance moments',
      },
      {
        id: 'gala_concert',
        name: 'Concert & Cultural Performances',
        defaultRole: 'Multi-Cam Op & Audio',
        description: 'Stage lighting sync, crowd energy, live sound recording',
      },
      {
        id: 'gala_sameday',
        name: 'Same-Day Edit (SDE) Highlight Reel',
        defaultRole: 'Rapid Editor',
        description: 'Fast turn-around reel screened before event finale',
      },
    ],
  },
];

export const getCategoryDefinition = (category: ProjectCategory): EventCategoryDefinition => {
  const found = EVENT_CATEGORIES.find((c) => c.category === category);
  return found || EVENT_CATEGORIES[0];
};

export const getSubEventById = (
  subEventId: string,
  category?: ProjectCategory
): SubEventDefinition | undefined => {
  if (category) {
    const cat = getCategoryDefinition(category);
    const sub = cat.subEvents.find((s) => s.id === subEventId);
    if (sub) return sub;
  }
  for (const cat of EVENT_CATEGORIES) {
    const sub = cat.subEvents.find((s) => s.id === subEventId);
    if (sub) return sub;
  }
  return undefined;
};
