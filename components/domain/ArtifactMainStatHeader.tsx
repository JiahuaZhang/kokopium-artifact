import { Popover } from 'antd';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { Artifact_Main_Stat } from '../../src/state/artifact';
import { processArtifactState } from '../../src/state/recoil/artifact_domain';

interface Props {
  domainId: string;
  artifactId: string;
}

const displayNames: { [key in Artifact_Main_Stat]: string } = {
  atk: 'atk',
  'atk%': 'atk%',
  'crit dmg%': 'crit dmg%',
  'crit rate%': 'crit rate%',
  'def%': 'def%',
  'elemental dmg bonus%': 'elemental',
  'elemental mastery': 'EM',
  'energy recharge': 'energy',
  'healing bonus%': 'healing',
  hp: 'hp',
  'hp%': 'hp%',
  'physical dmg bonus%': 'physical',
};

const ArtifactMainStatHeader = (props: Props) => {
  const { domainId, artifactId } = props;
  const artifact = useRecoilValue(processArtifactState({ domainId, artifactId, type: 'fetch' }));

  let className = '';
  switch (artifact.type) {
    case 'Sands of Eon':
      if (['atk%', 'elemental mastery', 'energy recharge'].includes(artifact.main_stat)) {
        className = 'bg-orange-400 text-white';
      }
      break;
    case 'Goblet of Eonothem':
      if (
        ['elemental dmg bonus%', 'physical dmg bonus%', 'elemental mastery'].includes(
          artifact.main_stat
        )
      ) {
        className = 'bg-orange-400 text-white';
      } else if (artifact.main_stat === 'atk%') {
        className = 'bg-purple-400 text-white';
      }
      break;
    case 'Circlet of Logos':
      if (['crit rate%', 'crit dmg%', 'elemental mastery'].includes(artifact.main_stat)) {
        className = 'bg-orange-400 text-white';
      } else if (['healing bonus%', 'atk%'].includes(artifact.main_stat)) {
        className = 'bg-purple-400 text-white';
      }
      break;
  }

  const displayName = displayNames[artifact.main_stat];

  return (
    <span className={`${className} px-1 rounded`}>
      {displayName !== artifact.main_stat && (
        <Popover title={artifact.main_stat}>{displayName}</Popover>
      )}
      {displayName === artifact.main_stat && displayName}
    </span>
  );
};

export default ArtifactMainStatHeader;
