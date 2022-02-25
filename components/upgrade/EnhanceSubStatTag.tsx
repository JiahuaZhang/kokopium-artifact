import { Popover } from 'antd';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { ALL_ARTIFACT_SUB_STAT_TIER_INFO } from '../../src/state/artifact';
import { handleEnhanceArtifactState } from '../../src/state/recoil/artifact_enhance';
import { StatNameClass, TierClassName } from '../domain/ArtifactSubStatTag';

type Props = {
  id: string;
  index: number;
};

const EnhanceSubStatTag = (props: Props) => {
  const { id, index } = props;
  const enhanceArtifact = useRecoilValue(handleEnhanceArtifactState(id));
  const { artifact, enhancements } = enhanceArtifact;

  const sub_stat = enhancements[index];
  const avg_stat_value = sub_stat.value / (sub_stat.times || 1);
  let tiers: number[] = [];
  let approximateTierIndex = -1;

  if (artifact.rarity && avg_stat_value) {
    tiers = ALL_ARTIFACT_SUB_STAT_TIER_INFO[sub_stat.stat][artifact.rarity];
    const padded_lenght = 4 - tiers.length;
    tiers = new Array(padded_lenght).fill(0).concat(tiers);

    const diff = tiers.map((tier) => Math.pow(avg_stat_value - tier, 2));
    const minDiff = Math.min(...diff);
    approximateTierIndex = diff.findIndex((val) => val === minDiff);
  }

  const tierBoard = (
    <div className='grid gap-2'>
      {sub_stat.times && sub_stat.times > 1 && (
        <div className='inline-grid grid-flow-col  justify-between'>
          <span>Avg: {avg_stat_value}</span>
          <span>
            ({sub_stat.value} / {sub_stat.times})
          </span>
        </div>
      )}
      <ul className='inline-grid grid-flow-col gap-2'>
        {tiers.map((tier, index) => (
          <li className={`${TierClassName[index]} py-1 px-1 rounded`} key={tier}>
            {tier}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className='grid grid-flow-col justify-between border-b-2 border-zinc-100'>
      <span className={`px-2 py-1 rounded ${StatNameClass[sub_stat.stat]}`}>{sub_stat.stat}</span>
      <Popover title={tierBoard}>
        <span className={`${TierClassName[approximateTierIndex]} px-2 py-1 rounded`}>
          {sub_stat.value}
        </span>
      </Popover>
    </div>
  );
};

export default EnhanceSubStatTag;
