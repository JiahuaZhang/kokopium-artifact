import { Popover } from 'antd';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { handleEnhanceArtifactState } from '../../src/state/recoil/artifact_enhance';
import { MainStatDisplayNames } from '../domain/ArtifactMainStatHeader';

type Props = {
  id: string;
};

const EnhanceMainStatHeader = (props: Props) => {
  const { id } = props;
  const enhanceArtifact = useRecoilValue(handleEnhanceArtifactState(id));

  let className = '';
  switch (enhanceArtifact.artifact.type) {
    case 'Sands of Eon':
      if (
        ['atk%', 'elemental mastery', 'energy recharge'].includes(
          enhanceArtifact.artifact.main_stat
        )
      ) {
        className = 'bg-orange-400 text-white';
      }
      break;
    case 'Goblet of Eonothem':
      if (
        ['elemental dmg bonus%', 'physical dmg bonus%', 'elemental mastery'].includes(
          enhanceArtifact.artifact.main_stat
        )
      ) {
        className = 'bg-orange-400 text-white';
      } else if (enhanceArtifact.artifact.main_stat === 'atk%') {
        className = 'bg-purple-400 text-white';
      }
      break;
    case 'Circlet of Logos':
      if (
        ['crit rate%', 'crit dmg%', 'elemental mastery'].includes(
          enhanceArtifact.artifact.main_stat
        )
      ) {
        className = 'bg-orange-400 text-white';
      } else if (['healing bonus%', 'atk%'].includes(enhanceArtifact.artifact.main_stat)) {
        className = 'bg-purple-400 text-white';
      }
      break;
  }

  const displayName = MainStatDisplayNames[enhanceArtifact.artifact.main_stat];

  return (
    <span className={`${className} px-1 rounded`}>
      {displayName !== enhanceArtifact.artifact.main_stat && (
        <Popover title={enhanceArtifact.artifact.main_stat}>{displayName}</Popover>
      )}
      {displayName === enhanceArtifact.artifact.main_stat && displayName}
    </span>
  );
};

export default EnhanceMainStatHeader;
