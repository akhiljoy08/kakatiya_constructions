/*
 * Indicative floor plans used on the project details page.
 * These are illustrative sample layouts (not the actual approved plans of
 * any project) — the page labels them as such. Units are feet; rooms tile
 * the full footprint so walls line up.
 */

export type RoomKind =
  | 'bedroom'
  | 'living'
  | 'dining'
  | 'kitchen'
  | 'toilet'
  | 'wardrobe'
  | 'balcony'
  | 'utility'
  | 'foyer'
  | 'study';

export type Room = {
  id: string;
  name: string;
  kind: RoomKind;
  x: number;
  y: number;
  w: number;
  h: number;
  provisions: string[];
};

/** Hinged door in a wall. `o`: wall orientation; `open`: side the leaf swings to. */
export type Door = { x: number; y: number; len: number; o: 'h' | 'v'; open: 'up' | 'down' | 'left' | 'right' };
/** Opening without a door (open-plan) or a sliding door / window, along a wall. */
export type Opening = { x: number; y: number; len: number; o: 'h' | 'v'; type: 'open' | 'sliding' | 'window' };

export type FloorPlan = {
  id: string;
  label: string;
  width: number;
  height: number;
  rooms: Room[];
  doors: Door[];
  openings: Opening[];
  /** Where the main entrance arrow points in */
  entrance: { x: number; y: number; dir: 'left' | 'right' | 'up' | 'down' };
};

const P = {
  bedroom: ['Split AC provision', 'Wardrobe niche', 'TV & internet point', 'Large windows for cross-ventilation'],
  master: ['Split AC provision', 'Attached toilet & walk-in wardrobe', 'TV & internet point', 'Premium laminated flooring'],
  living: ['Split AC provision', 'TV, DTH & internet points', 'Premium vitrified flooring', 'Video door-phone provision'],
  dining: ['Open plan with living area', 'Wash-basin counter provision', 'Pendant light point'],
  kitchen: ['Granite platform with SS sink', 'Chimney & water-purifier provision', 'Dedicated 15A points for appliances', 'Access to utility'],
  toilet: ['Branded CP & sanitary fittings', 'Geyser & exhaust provision', 'Anti-skid floor tiles'],
  wardrobe: ['Walk-in wardrobe space', 'Mirror & dressing provision'],
  balcony: ['Sliding glass doors', 'Anti-skid flooring', 'Light & power point'],
  utility: ['Washing-machine inlet & drain', 'Wash area with tap'],
  foyer: ['Main door with video door-phone', 'Shoe-cabinet niche', 'Mood-light point'],
  study: ['Desk & bookshelf niche', 'Internet & power points', 'Window for daylight'],
};

export const floorPlans: FloorPlan[] = [
  {
    id: '3bhk',
    label: '3 BHK + Study',
    width: 60,
    height: 40,
    rooms: [
      { id: 'mbed', name: 'Master Bedroom', kind: 'bedroom', x: 0, y: 0, w: 16, h: 14, provisions: P.master },
      { id: 'mtoilet', name: 'Toilet', kind: 'toilet', x: 16, y: 0, w: 8, h: 7, provisions: P.toilet },
      { id: 'wardrobe', name: 'Wardrobe', kind: 'wardrobe', x: 16, y: 7, w: 8, h: 7, provisions: P.wardrobe },
      { id: 'bed2', name: 'Bedroom 2', kind: 'bedroom', x: 24, y: 0, w: 14, h: 14, provisions: P.bedroom },
      { id: 'kitchen', name: 'Kitchen', kind: 'kitchen', x: 38, y: 0, w: 12, h: 12, provisions: P.kitchen },
      { id: 'utility', name: 'Utility', kind: 'utility', x: 50, y: 0, w: 10, h: 6, provisions: P.utility },
      { id: 'ctoilet', name: 'Toilet', kind: 'toilet', x: 50, y: 6, w: 10, h: 6, provisions: P.toilet },
      { id: 'living', name: 'Living / Hall', kind: 'living', x: 0, y: 14, w: 22, h: 18, provisions: P.living },
      { id: 'balcony', name: 'Balcony', kind: 'balcony', x: 0, y: 32, w: 22, h: 8, provisions: P.balcony },
      { id: 'dining', name: 'Dining', kind: 'dining', x: 22, y: 14, w: 16, h: 14, provisions: P.dining },
      { id: 'study', name: 'Study', kind: 'study', x: 22, y: 28, w: 16, h: 12, provisions: P.study },
      { id: 'foyer', name: 'Foyer', kind: 'foyer', x: 38, y: 12, w: 22, h: 12, provisions: P.foyer },
      { id: 'bed3', name: 'Bedroom 3', kind: 'bedroom', x: 38, y: 24, w: 22, h: 16, provisions: P.bedroom },
    ],
    doors: [
      { x: 11, y: 14, len: 3, o: 'h', open: 'up' }, // master bedroom
      { x: 16, y: 2, len: 2.5, o: 'v', open: 'right' }, // master toilet
      { x: 26, y: 14, len: 3, o: 'h', open: 'up' }, // bedroom 2
      { x: 41, y: 12, len: 3, o: 'h', open: 'up' }, // kitchen
      { x: 50, y: 1.5, len: 2.5, o: 'v', open: 'right' }, // utility
      { x: 53, y: 12, len: 2.5, o: 'h', open: 'up' }, // common toilet
      { x: 41, y: 24, len: 3, o: 'h', open: 'down' }, // bedroom 3
      { x: 30, y: 28, len: 3, o: 'h', open: 'down' }, // study
      { x: 60, y: 15, len: 4, o: 'v', open: 'left' }, // main entrance
    ],
    openings: [
      { x: 16, y: 8.5, len: 4, o: 'v', type: 'open' }, // wardrobe from master
      { x: 22, y: 16, len: 12, o: 'v', type: 'open' }, // living ↔ dining
      { x: 38, y: 15, len: 8, o: 'v', type: 'open' }, // dining ↔ foyer
      { x: 5, y: 32, len: 12, o: 'h', type: 'sliding' }, // balcony
      { x: 4, y: 0, len: 8, o: 'h', type: 'window' },
      { x: 27, y: 0, len: 8, o: 'h', type: 'window' },
      { x: 41, y: 0, len: 6, o: 'h', type: 'window' },
      { x: 0, y: 18, len: 9, o: 'v', type: 'window' },
      { x: 44, y: 40, len: 10, o: 'h', type: 'window' },
      { x: 26, y: 40, len: 8, o: 'h', type: 'window' },
      { x: 60, y: 28, len: 8, o: 'v', type: 'window' },
    ],
    entrance: { x: 60, y: 17, dir: 'left' },
  },
  {
    id: '2bhk',
    label: '2 BHK',
    width: 48,
    height: 36,
    rooms: [
      { id: 'mbed', name: 'Master Bedroom', kind: 'bedroom', x: 0, y: 0, w: 16, h: 13, provisions: P.master },
      { id: 'mtoilet', name: 'Toilet', kind: 'toilet', x: 16, y: 0, w: 8, h: 7, provisions: P.toilet },
      { id: 'ctoilet', name: 'Toilet', kind: 'toilet', x: 16, y: 7, w: 8, h: 6, provisions: P.toilet },
      { id: 'bed2', name: 'Bedroom 2', kind: 'bedroom', x: 24, y: 0, w: 14, h: 13, provisions: P.bedroom },
      { id: 'kitchen', name: 'Kitchen', kind: 'kitchen', x: 38, y: 0, w: 10, h: 12, provisions: P.kitchen },
      { id: 'utility', name: 'Utility', kind: 'utility', x: 38, y: 12, w: 10, h: 6, provisions: P.utility },
      { id: 'living', name: 'Living / Hall', kind: 'living', x: 0, y: 13, w: 20, h: 15, provisions: P.living },
      { id: 'balcony', name: 'Balcony', kind: 'balcony', x: 0, y: 28, w: 20, h: 8, provisions: P.balcony },
      { id: 'dining', name: 'Dining', kind: 'dining', x: 20, y: 13, w: 18, h: 13, provisions: P.dining },
      { id: 'foyer', name: 'Foyer', kind: 'foyer', x: 38, y: 18, w: 10, h: 8, provisions: P.foyer },
      { id: 'deck', name: 'Sit-out Deck', kind: 'balcony', x: 20, y: 26, w: 28, h: 10, provisions: P.balcony },
    ],
    doors: [
      { x: 10, y: 13, len: 3, o: 'h', open: 'up' }, // master bedroom
      { x: 16, y: 2, len: 2.5, o: 'v', open: 'right' }, // master toilet
      { x: 20, y: 13, len: 2.5, o: 'h', open: 'up' }, // common toilet
      { x: 28, y: 13, len: 3, o: 'h', open: 'up' }, // bedroom 2
      { x: 38, y: 13, len: 2.5, o: 'v', open: 'right' }, // utility (from dining)
      { x: 48, y: 19.5, len: 4, o: 'v', open: 'left' }, // main entrance
    ],
    openings: [
      { x: 20, y: 15, len: 10, o: 'v', type: 'open' }, // living ↔ dining
      { x: 38, y: 19, len: 6, o: 'v', type: 'open' }, // dining ↔ foyer
      { x: 40, y: 12, len: 6, o: 'h', type: 'open' }, // kitchen ↔ utility
      { x: 4, y: 28, len: 12, o: 'h', type: 'sliding' }, // balcony
      { x: 25, y: 26, len: 10, o: 'h', type: 'sliding' }, // deck
      { x: 4, y: 0, len: 8, o: 'h', type: 'window' },
      { x: 27, y: 0, len: 8, o: 'h', type: 'window' },
      { x: 40, y: 0, len: 6, o: 'h', type: 'window' },
      { x: 0, y: 17, len: 8, o: 'v', type: 'window' },
    ],
    entrance: { x: 48, y: 21.5, dir: 'left' },
  },
];

export const planArea = (plan: FloorPlan) => plan.width * plan.height;
