import { Popover, Tag } from 'antd';
import React from 'react';
import { Artifact_Stat } from '../../src/state/artifact';

interface Props {
  stat: Artifact_Stat;
}

export const ArtifactStatTag = (props: Props) => {
  const { stat } = props;

  let className = '';
  if (/crit/i.test(stat)) {
    className = 'bg-yellow-400';
  } else if (['atk%', 'energy recharge', 'elemental mastery'].includes(stat)) {
    className = 'bg-purple-400';
  }

  const displayedStat =
    stat.length < 5
      ? stat
      : stat
          .split(' ')
          .map((s) => s[0])
          .join('')
          .toUpperCase();

  return (
    <Tag className={className}>
      {stat.length < 5 && stat}
      {stat.length >= 5 && <Popover content={stat}>{displayedStat}</Popover>}
    </Tag>
  );
};
