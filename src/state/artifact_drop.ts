import { Artifact_Main_Stat, Artifact_Rarity, Artifact_Sub_Stat, Artifact_Type } from './artifact';

/**@deprecated */
export interface Artifact_Drop_Sub_Stat {
  name: Artifact_Sub_Stat;
  value: number;
}

/**@deprecated */
export interface Artifact_Drop {
  id: string;
  artifact_rarity: Artifact_Rarity;
  artifact_type: Artifact_Type,
  main_stat: Artifact_Main_Stat,
  sub_stats: Artifact_Drop_Sub_Stat[];
}

/**@deprecated */
export type Artifact_Drop_Farm_Type = '20' | 'condensed' | 'boss';

/**@deprecated */
export const ALL_ARTIFACT_DROP_FARM_TYPE: Artifact_Drop_Farm_Type[] = ['20', 'condensed', 'boss'];

/**@deprecated */
export interface Artifact_Drop_Farm {
  id: string;
  created: string;
  type: Artifact_Drop_Farm_Type;
  description?: string;
  artifacts: Artifact_Drop[];
}