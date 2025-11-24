import { Product, Category } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'UltraTech Cement',
    price: 420,
    category: Category.HEAVY,
    image: 'https://images.unsplash.com/photo-1518709414768-a8c981a45e5d?w=300&h=300&fit=crop',
    unit: '50kg Bag',
    description: 'Premium portland pozzolana cement for strong foundations.',
    tags: ['concrete', 'construction', 'foundation', 'mortar'],
    rating: 4.8,
    reviews: [
      { id: 'r1', userName: 'Ramesh K.', rating: 5, comment: 'Best quality cement, sets very fast.', date: '2023-10-15' },
      { id: 'r2', userName: 'Amit S.', rating: 4, comment: 'Good packaging, timely delivery.', date: '2023-11-02' }
    ]
  },
  {
    id: '2',
    name: 'Red Clay Bricks',
    price: 12,
    category: Category.HEAVY,
    image: 'https://images.unsplash.com/photo-1590074121287-6fa882200b21?w=300&h=300&fit=crop',
    unit: 'Piece',
    description: 'Standard red clay bricks, high durability.',
    tags: ['wall', 'masonry', 'building'],
    rating: 4.2,
    reviews: [
      { id: 'r3', userName: 'Suresh B.', rating: 4, comment: 'Solid bricks, very few broken pieces.', date: '2023-09-20' }
    ]
  },
  {
    id: '3',
    name: 'Bosch Power Drill',
    price: 4500,
    category: Category.TOOLS,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&h=300&fit=crop',
    unit: 'Piece',
    description: '600W Impact Drill for concrete and wood.',
    tags: ['machine', 'hole', 'screw', 'electric'],
    rating: 4.9,
    reviews: [
      { id: 'r4', userName: 'Vikram Singh', rating: 5, comment: 'Powerful machine. Bosch never disappoints.', date: '2023-12-10' },
      { id: 'r5', userName: 'Arun P.', rating: 5, comment: 'Great for home DIY projects.', date: '2023-12-12' }
    ]
  },
  {
    id: '4',
    name: 'Claw Hammer',
    price: 350,
    category: Category.TOOLS,
    image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=300&h=300&fit=crop',
    unit: 'Piece',
    description: 'Drop forged steel head with fiberglass handle.',
    tags: ['nail', 'carpentry', 'hand tool'],
    rating: 4.5,
    reviews: []
  },
  {
    id: '5',
    name: 'Copper Wire 2.5mm',
    price: 1800,
    category: Category.ELECTRICAL,
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=300&h=300&fit=crop',
    unit: '90m Roll',
    description: 'Flame retardant PVC insulated copper wire.',
    tags: ['wiring', 'power', 'circuit', 'cable'],
    rating: 4.7,
    reviews: []
  },
  {
    id: '6',
    name: 'LED Bulb 9W',
    price: 120,
    category: Category.ELECTRICAL,
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=300&h=300&fit=crop',
    unit: 'Piece',
    description: 'Cool daylight LED bulb, energy efficient.',
    tags: ['light', 'lamp', 'energy'],
    rating: 4.3,
    reviews: []
  },
  {
    id: '7',
    name: 'PVC Pipe 4 inch',
    price: 450,
    category: Category.PLUMBING,
    image: 'https://images.unsplash.com/photo-1541480601022-2308c0f9312b?w=300&h=300&fit=crop',
    unit: '10ft Length',
    description: 'Heavy duty PVC pipe for drainage.',
    tags: ['water', 'drain', 'sewage', 'tube'],
    rating: 4.1,
    reviews: []
  },
  {
    id: '8',
    name: 'Brass Bib Tap',
    price: 280,
    category: Category.PLUMBING,
    image: 'https://images.unsplash.com/photo-1585909697693-e5d03a11b22e?w=300&h=300&fit=crop',
    unit: 'Piece',
    description: 'Chrome plated brass tap with aerator.',
    tags: ['faucet', 'water', 'bathroom', 'kitchen'],
    rating: 3.8,
    reviews: [
        { id: 'r6', userName: 'Kunal', rating: 3, comment: 'Good finish but flow is a bit restricted.', date: '2023-08-05' }
    ]
  },
  {
    id: '9',
    name: 'Asian Paints White',
    price: 3200,
    category: Category.FINISHING,
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&h=300&fit=crop',
    unit: '20L Bucket',
    description: 'Premium acrylic emulsion for interior walls.',
    tags: ['color', 'wall', 'decor', 'coating'],
    rating: 4.6,
    reviews: []
  },
  {
    id: '10',
    name: 'Paint Roller Kit',
    price: 450,
    category: Category.FINISHING,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&h=300&fit=crop',
    unit: 'Set',
    description: '9-inch roller with tray and extension pole.',
    tags: ['brush', 'painting', 'tool'],
    rating: 4.4,
    reviews: []
  },
  {
    id: '11',
    name: 'River Sand',
    price: 80,
    category: Category.HEAVY,
    image: 'https://images.unsplash.com/photo-1621257467652-325f69168936?w=300&h=300&fit=crop',
    unit: 'Cubic Ft',
    description: 'Washed river sand for plastering and concrete.',
    tags: ['concrete', 'mix', 'construction'],
    rating: 4.5,
    reviews: []
  },
  {
    id: '12',
    name: 'Measuring Tape 5m',
    price: 150,
    category: Category.TOOLS,
    image: 'https://images.unsplash.com/photo-1596464716127-f9a085960789?w=300&h=300&fit=crop',
    unit: 'Piece',
    description: 'Heavy duty steel measuring tape.',
    tags: ['measure', 'length', 'size'],
    rating: 4.0,
    reviews: []
  },
  {
    id: '13',
    name: 'Screwdriver Set',
    price: 380,
    category: Category.TOOLS,
    image: 'https://images.unsplash.com/photo-1567361808960-dec9cb578182?w=300&h=300&fit=crop',
    unit: 'Set of 6',
    description: 'Magnetic tip screwdriver set with insulated handles.',
    tags: ['tool', 'screw', 'repair'],
    rating: 4.7,
    reviews: []
  },
  {
    id: '14',
    name: 'Water Tank 500L',
    price: 3500,
    category: Category.PLUMBING,
    image: 'https://images.unsplash.com/photo-1616432043562-3671ea2e5242?w=300&h=300&fit=crop',
    unit: 'Piece',
    description: 'Triple layer UV protected water storage tank.',
    tags: ['water', 'storage', 'plastic'],
    rating: 4.8,
    reviews: []
  }
];

export const CATEGORIES = Object.values(Category);