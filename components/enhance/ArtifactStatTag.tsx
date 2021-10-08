import { Popover, Tag } from 'antd';
import React from 'react';
import { Artifact_Stat } from '../../src/state/artifact';

interface Props {
  stat: Artifact_Stat;
}

export const ArtifactStatTag = (props: Props) => {
  const { stat } = props;

  const displayedStat =
    stat.length < 5
      ? stat
      : stat
          .split(' ')
          .map((s) => s[0])
          .join('')
          .toUpperCase();

  return (
    <Tag>
      {stat.length < 5 && stat}
      {stat.length >= 5 && <Popover content={stat}>{displayedStat}</Popover>}
    </Tag>
  );
};
