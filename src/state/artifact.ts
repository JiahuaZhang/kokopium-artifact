export type Artifact_Type = 'Flower of Life' | 'Plume of Death' | 'Sands of Eon' | 'Goblet of Eonothem' | 'Circlet of Logos';

export const ALL_ARTIFACT_TYPE: Artifact_Type[] = ['Flower of Life', 'Plume of Death', 'Sands of Eon', 'Goblet of Eonothem', 'Circlet of Logos'];

export type Flower_Artifact_Main_Stat = 'hp';

export type Plume_Artifact_Main_Stat = 'atk';

export type Sands_Artifact_Main_Stat = 'hp%' | 'atk%' | 'def%' | 'elemental mastery' | 'energy recharge';

export type Goblet_Artifact_Main_Stat = 'hp%' | 'atk%' | 'def%' | 'elemental mastery' | 'elemental dmg bonus%' | 'physical dmg bonus%';

export type Circlet_Artifact_Main_Stat = 'hp%' | 'atk%' | 'def%' | 'elemental mastery' | 'crit rate%' | 'crit dmg%' | 'healing bonus%';

export type Artifact_Main_Stat = Flower_Artifact_Main_Stat | Plume_Artifact_Main_Stat | Sands_Artifact_Main_Stat | Goblet_Artifact_Main_Stat | Circlet_Artifact_Main_Stat;

export const ALL_ARTIFACT_MAIN_STAT: Artifact_Main_Stat[] = ['hp', 'atk', 'hp%', 'atk%', 'def%', 'elemental mastery', 'energy recharge', 'elemental dmg bonus%', 'physical dmg bonus%', 'crit rate%', 'crit dmg%', 'healing bonus%'];

export type Artifact_Sub_Stat = 'hp' | 'hp%' | 'atk' | 'atk%' | 'def' | 'def%' | 'elemental mastery' | 'energy recharge' | 'crit rate%' | 'crit dmg%';

export const ALL_ARTIFACT_SUB_STAT: Artifact_Sub_Stat[] = ['hp', 'hp%', 'def', 'def%', 'atk', 'atk%', 'elemental mastery', 'energy recharge', 'crit rate%', 'crit dmg%'];

export type Artifact_Stat = Artifact_Main_Stat | Artifact_Sub_Stat;

export interface Artifact_Stat_Description {
  attribute: Artifact_Stat;
  type: 'number' | 'percentage';
}

export interface Artifact_Main_Stat_Meta {
  attribute: Artifact_Main_Stat;
  initialValue: number;
  levelUpValue: number;
}

export const ALL_ARTIFACT_MAIN_STAT_DATA: { [key in Artifact_Main_Stat]: { [key in 3 | 4 | 5]: Artifact_Main_Stat_Meta } } = {
  hp: {
    3: { attribute: 'hp', initialValue: 430, levelUpValue: 122 },
    4: { attribute: 'hp', initialValue: 645, levelUpValue: 183 },
    5: { attribute: 'hp', initialValue: 717, levelUpValue: 203 }
  },
  atk: {
    3: { attribute: 'atk', initialValue: 28, levelUpValue: 8 },
    4: { attribute: 'atk', initialValue: 42, levelUpValue: 12 },
    5: { attribute: 'atk', initialValue: 47, levelUpValue: 13 },
  },
  'elemental mastery': {
    3: { attribute: 'elemental mastery', initialValue: 21, levelUpValue: 6 },
    4: { attribute: 'elemental mastery', initialValue: 25, levelUpValue: 7 },
    5: { attribute: 'elemental mastery', initialValue: 28, levelUpValue: 8 },
  },
  'hp%': {
    3: { attribute: 'hp%', initialValue: 5.2, levelUpValue: 1.5 },
    4: { attribute: 'hp%', initialValue: 6.3, levelUpValue: 1.8 },
    5: { attribute: 'hp%', initialValue: 7.0, levelUpValue: 2.0 },
  },
  'def%': {
    3: { attribute: 'def%', initialValue: 6.6, levelUpValue: 1.9 },
    4: { attribute: 'def%', initialValue: 7.9, levelUpValue: 2.2 },
    5: { attribute: 'def%', initialValue: 8.7, levelUpValue: 2.5 },
  },
  'atk%': {
    3: { attribute: 'atk%', initialValue: 5.2, levelUpValue: 1.5 },
    4: { attribute: 'atk%', initialValue: 6.3, levelUpValue: 1.8 },
    5: { attribute: 'atk%', initialValue: 7.0, levelUpValue: 2.0 },
  },
  'energy recharge': {
    3: { attribute: 'energy recharge', initialValue: 5.8, levelUpValue: 1.7 },
    4: { attribute: 'energy recharge', initialValue: 7.9, levelUpValue: 2.0 },
    5: { attribute: 'energy recharge', initialValue: 8.7, levelUpValue: 2.5 },
  },
  'elemental dmg bonus%': {
    3: { attribute: 'elemental dmg bonus%', initialValue: 5.2, levelUpValue: 1.5 },
    4: { attribute: 'elemental dmg bonus%', initialValue: 6.3, levelUpValue: 1.8 },
    5: { attribute: 'elemental dmg bonus%', initialValue: 7.0, levelUpValue: 2.0 },
  },
  'physical dmg bonus%': {
    3: { attribute: 'physical dmg bonus%', initialValue: 6.6, levelUpValue: 1.9 },
    4: { attribute: 'physical dmg bonus%', initialValue: 7.9, levelUpValue: 2.2 },
    5: { attribute: 'physical dmg bonus%', initialValue: 8.7, levelUpValue: 2.5 },
  },
  'healing bonus%': {
    3: { attribute: 'healing bonus%', initialValue: 4.0, levelUpValue: 1.2 },
    4: { attribute: 'healing bonus%', initialValue: 4.8, levelUpValue: 1.4 },
    5: { attribute: 'healing bonus%', initialValue: 5.4, levelUpValue: 1.5 },
  },
  'crit rate%': {
    3: { attribute: 'crit rate%', initialValue: 3.5, levelUpValue: 1.0 },
    4: { attribute: 'crit rate%', initialValue: 4.2, levelUpValue: 1.2 },
    5: { attribute: 'crit rate%', initialValue: 4.7, levelUpValue: 1.3 },
  },
  "crit dmg%": {
    3: { attribute: 'crit dmg%', initialValue: 7.0, levelUpValue: 2.0 },
    4: { attribute: 'crit dmg%', initialValue: 8.4, levelUpValue: 2.4 },
    5: { attribute: 'crit dmg%', initialValue: 9.4, levelUpValue: 2.6 },
  }
};

export const ALL_ARTIFACT_STAT_DESCRIPTION: { [key in Artifact_Stat]: Artifact_Stat_Description } = {
  'hp': { attribute: 'hp', type: 'number' },
  'hp%': { attribute: 'hp%', type: 'percentage' },
  'atk': { attribute: 'atk', type: 'number' },
  'atk%': { attribute: 'atk%', type: 'percentage' },
  'def': { attribute: 'def', type: 'number' },
  'def%': { attribute: 'def%', type: 'percentage' },
  'elemental mastery': { attribute: 'elemental mastery', type: 'number' },
  'energy recharge': { attribute: 'energy recharge', type: 'percentage' },
  'elemental dmg bonus%': { attribute: 'elemental dmg bonus%', type: 'percentage' },
  'physical dmg bonus%': { attribute: 'physical dmg bonus%', type: 'percentage' },
  'healing bonus%': { attribute: 'healing bonus%', type: 'percentage' },
  'crit rate%': { attribute: 'crit rate%', type: 'percentage' },
  'crit dmg%': { attribute: 'crit dmg%', type: 'percentage' }
};

export const artifactMainStatDescriptoins: { [key in Artifact_Type]: Artifact_Stat_Description[] } = {
  'Flower of Life': [ALL_ARTIFACT_STAT_DESCRIPTION.hp],
  'Plume of Death': [ALL_ARTIFACT_STAT_DESCRIPTION.atk],
  'Sands of Eon': [ALL_ARTIFACT_STAT_DESCRIPTION['hp%'], ALL_ARTIFACT_STAT_DESCRIPTION['atk%'], ALL_ARTIFACT_STAT_DESCRIPTION['def%'], ALL_ARTIFACT_STAT_DESCRIPTION['energy recharge'], ALL_ARTIFACT_STAT_DESCRIPTION['elemental mastery']],
  'Goblet of Eonothem': [ALL_ARTIFACT_STAT_DESCRIPTION['hp%'], ALL_ARTIFACT_STAT_DESCRIPTION['atk%'], ALL_ARTIFACT_STAT_DESCRIPTION['def%'], ALL_ARTIFACT_STAT_DESCRIPTION['elemental mastery'], ALL_ARTIFACT_STAT_DESCRIPTION['physical dmg bonus%'], ALL_ARTIFACT_STAT_DESCRIPTION['elemental dmg bonus%']],
  'Circlet of Logos': [ALL_ARTIFACT_STAT_DESCRIPTION['hp%'], ALL_ARTIFACT_STAT_DESCRIPTION['atk%'], ALL_ARTIFACT_STAT_DESCRIPTION['def%'], ALL_ARTIFACT_STAT_DESCRIPTION['elemental mastery'], ALL_ARTIFACT_STAT_DESCRIPTION['crit rate%'], ALL_ARTIFACT_STAT_DESCRIPTION['crit dmg%'], ALL_ARTIFACT_STAT_DESCRIPTION['healing bonus%']]
};

export type Artifact_Rarity = 1 | 2 | 3 | 4 | 5;

export const ALL_ARTIFACT_RARITY: Artifact_Rarity[] = [1, 2, 3, 4, 5];

export const ALL_ARTIFACT_SUB_STAT_TIER_INFO: { [key in Artifact_Sub_Stat]: { [key in Artifact_Rarity]: number[] } } = {
  atk: {
    1: [2],
    2: [3, 4, 5],
    3: [7, 8, 9],
    4: [11, 12, 14, 16],
    5: [14, 16, 18, 19]
  },
  def: {
    1: [2],
    2: [4, 5, 6],
    3: [8, 9, 10, 11],
    4: [13, 15, 17, 19],
    5: [16, 19, 21, 23],
  },
  hp: {
    1: [24, 30],
    2: [50, 61, 72],
    3: [100, 115, 129, 143],
    4: [167, 191, 215, 239],
    5: [209, 239, 269, 299]
  },
  'elemental mastery': {
    1: [5, 6],
    2: [7, 8, 9],
    3: [10, 11, 13, 14],
    4: [13, 15, 17, 19],
    5: [16, 19, 21, 23],
  },
  'atk%': {
    1: [1.2, 1.5],
    2: [1.6, 2, 2.3],
    3: [2.5, 2.8, 3.2, 3.5],
    4: [3.3, 3.7, 4.2, 4.7],
    5: [4.1, 4.7, 5.3, 5.8],
  },
  "hp%": {
    1: [1.2, 1.5],
    2: [1.6, 2, 2.3],
    3: [2.5, 2.8, 3.2, 3.5],
    4: [3.3, 3.7, 4.2, 4.7],
    5: [4.1, 4.7, 5.3, 5.8],
  },
  "def%": {
    1: [1.5, 1.8],
    2: [2, 2.5, 2.9],
    3: [3.1, 3.5, 3.9, 4.4],
    4: [4.1, 4.7, 5.3, 5.8],
    5: [5.1, 5.8, 6.6, 7.3],
  },
  "energy recharge": {
    1: [1.3, 1.6],
    2: [1.8, 2.2, 2.6],
    3: [2.7, 3.1, 3.5, 3.9],
    4: [3.6, 4.1, 4.7, 5.2],
    5: [4.5, 5.2, 5.8, 6.5],
  },
  'crit rate%': {
    1: [0.8, 1],
    2: [1.1, 1.3, 1.6],
    3: [1.6, 1.9, 2.1, 2.3],
    4: [2.2, 2.5, 2.8, 3.1],
    5: [2.7, 3.1, 3.5, 3.9],
  },
  "crit dmg%": {
    1: [1.6, 1.9],
    2: [2.2, 2.6, 3.1],
    3: [3.3, 3.7, 4.2, 4.7],
    4: [4.4, 5, 5.6, 6.2],
    5: [5.4, 6.2, 7, 7.8],
  }
};

export interface Artifact_Stat_Enhance {
  name: Artifact_Stat,
  value?: number;
  time?: number;
}

export interface Artifact_Enhance {
  id: string;
  artifact_rarity?: Artifact_Rarity;
  artifact_type?: Artifact_Type,
  main_stat?: Artifact_Main_Stat,
  sub_stats?: Artifact_Stat_Enhance[];
  enhance: Artifact_Stat_Enhance[];
}
