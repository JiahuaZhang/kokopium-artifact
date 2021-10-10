import { Tag } from 'antd';
import { PlusCircleTwoTone } from '@ant-design/icons';
import React from 'react';
import {
  ALL_ARTIFACT_SUB_STAT_TIER_INFO,
  Artifact_Enhance,
  Artifact_Stat_Enhance,
  Artifact_Sub_Stat,
} from '../../src/state/artifact';

interface Props {
  artifact: Artifact_Enhance;
  enhance: Artifact_Stat_Enhance;
}

const tierClassName = ['', 'bg-yellow-200', 'bg-purple-200', 'bg-blue-200', 'bg-green-200'];

export const ArtifactEnhanceStatTag = (props: Props) => {
  const { artifact, enhance } = props;

  const className = /crit/i.test(enhance.name) ? 'bg-yellow-400' : '';

  let tier = 0;
  let isMultiple = false;
  if (artifact.artifact_rarity && enhance.value) {
    const info =
      ALL_ARTIFACT_SUB_STAT_TIER_INFO[enhance.name as Artifact_Sub_Stat][artifact.artifact_rarity];

    const index = info.findIndex((i) => Math.abs(i - Number(enhance.value)) < 0.05);

    if (index !== -1) {
      tier = info.length - index;
    } else if (Number(enhance.value) > info[info.length - 1]) {
      isMultiple = true;
    }
  }

  return (
    <>
      <Tag className={`${className} rounded`}>{enhance.name}</Tag> -{' '}
      <Tag className={`${tierClassName[tier]} rounded inline-grid grid-cols-2 items-center`}>
        {enhance.value} {isMultiple && <PlusCircleTwoTone />}
      </Tag>
    </>
  );
};
