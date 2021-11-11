import { Select, Popover } from 'antd';
import React, { useState } from 'react';
import {
  ALL_ARTIFACT_SUB_STAT,
  Artifact_Enhance,
  Artifact_Sub_Stat,
} from '../../../src/state/artifact';

interface Props {
  artifact_enhance: Artifact_Enhance[];
}

const stats_selection = ALL_ARTIFACT_SUB_STAT.map((stat) => ({ name: stat, value: stat }));

const getStyle = (artifact: Artifact_Enhance, stats: Artifact_Sub_Stat[]) => {
  if (stats.length === 0) return 'bg-gray-200';

  const enhance_stats = artifact.enhance.map((stat) => stat.name).filter(Boolean);
  if (!enhance_stats.length) return 'border-gray-200 border-2';

  if (enhance_stats.some((stat) => stats.includes(stat as Artifact_Sub_Stat)))
    return 'bg-green-200';

  const { main_stat = '', sub_stats = [] } = artifact;
  const existed_sub_stats = sub_stats.map((stat) => stat.name).filter(Boolean);

  if (existed_sub_stats.length === 4) {
    if (stats.some((stat) => existed_sub_stats.includes(stat))) {
      return 'bg-red-400';
    } else {
      return 'bg-yellow-200';
    }
  }

  if (enhance_stats.some((stat) => existed_sub_stats.includes(stat))) {
    if (stats.length === 1 && stats[0] === main_stat) {
      return 'bg-yellow-200';
    } else {
      return 'bg-red-400';
    }
  } else {
    const candidate_stats = ALL_ARTIFACT_SUB_STAT.filter(
      (stat) => stat !== main_stat || !existed_sub_stats.includes(stat)
    );
    if (candidate_stats.some((stat) => stats.includes(stat))) {
      return 'bg-red-400';
    } else {
      return 'bg-yellow-200';
    }
  }
};

export const ArtifactEnhanceStatTrace = (props: Props) => {
  const { artifact_enhance } = props;
  const [selectedStats, setSelectedStats] = useState<Artifact_Sub_Stat[]>([
    'crit rate%',
    'crit dmg%',
  ]);

  return (
    <div>
      <Select
        onChange={setSelectedStats}
        value={selectedStats}
        options={stats_selection}
        className='min-w-full'
        listHeight={400}
        mode='multiple'
      />
      <section className='flex flex-wrap'>
        {artifact_enhance.map((value, index) => (
          <Popover
            key={value.id}
            content={
              <ul>
                {value.enhance
                  .filter((value) => value.name)
                  .map((e) => (
                    <li key={e.name}>
                      {e.name} - {e.value}
                    </li>
                  ))}
              </ul>
            }>
            <span className={`m-1 rounded p-1 ${getStyle(value, selectedStats)}`}>
              #{index + 1}
            </span>
          </Popover>
        ))}
      </section>
    </div>
  );
};
