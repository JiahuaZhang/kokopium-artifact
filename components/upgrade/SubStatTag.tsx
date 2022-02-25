import { Tooltip } from 'antd';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { Artifact_Sub_Stat } from '../../src/state/artifact';
import { handleEnhanceArtifactState } from '../../src/state/recoil/artifact_enhance';
import { StatNameClass } from '../domain/ArtifactSubStatTag';

type Props = {
  id: string;
  index: number;
};

const subStatDisplayName: {
  [key in Artifact_Sub_Stat]: string;
} = {
  hp: 'hp',
  'hp%': 'hp%',
  def: 'def',
  'def%': 'def%',
  atk: 'atk',
  'atk%': 'atk%',
  'elemental mastery': 'EM',
  'energy recharge': 'ER',
  'crit rate%': 'CR',
  'crit dmg%': 'CD',
};

export const SubStatTag = (props: Props) => {
  const { id, index } = props;
  const enhanceArtifact = useRecoilValue(handleEnhanceArtifactState(id));
  const sub_stat = enhanceArtifact.artifact.sub_stats[index];

  return (
    <Tooltip title={sub_stat.value}>
      <span className={`px-2 py-1 rounded ${StatNameClass[sub_stat.stat]}`}>
        {subStatDisplayName[sub_stat.stat]}
      </span>
    </Tooltip>
  );
};
