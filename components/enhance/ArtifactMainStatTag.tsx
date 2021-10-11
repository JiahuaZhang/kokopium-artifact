import { Tag } from 'antd';
import React from 'react';
import { Artifact_Enhance } from '../../src/state/artifact';

interface Props {
  artifact: Artifact_Enhance;
}

export const ArtifactMainStatTag = (props: Props) => {
  const { artifact } = props;

  let className = '';

  if (
    ['Circlet of Logos', 'Goblet of Eonothem', 'Sands of Eon'].includes(
      artifact.artifact_type || ''
    )
  ) {
    className = /hp%|def%/i.test(artifact.main_stat || 'hp%') ? '' : 'bg-yellow-400';
  }

  return <Tag className={className}> {artifact.main_stat} </Tag>;
};
