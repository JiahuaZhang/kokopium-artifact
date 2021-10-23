import { Artifact_Main_Stat, Artifact_Rarity, Artifact_Sub_Stat, Artifact_Type } from './artifact';

export interface Artifact_Drop_Sub_Stat {
  name: Artifact_Sub_Stat;
  value: number;
}

export interface Artifact_Drop {
  id: string;
  artifact_rarity?: Artifact_Rarity;
  artifact_type?: Artifact_Type,
  main_stat?: Artifact_Main_Stat,
  sub_stats: Artifact_Drop_Sub_Stat[];
}

export type Artifact_Drop_Farm_Type = '20' | 'condensed' | 'boss';

export const ALL_ARTIFACT_DROP_FARM_TYPE: Artifact_Drop_Farm_Type[] = ['20', 'condensed', 'boss'];

export interface Artifact_Drop_Farm {
  id: string;
  created: Date;
  type: Artifact_Drop_Farm_Type;
  description?: string;
  artifacts: Artifact_Drop[];
}