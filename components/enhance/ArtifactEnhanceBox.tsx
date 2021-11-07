import { Card, Image, Rate } from 'antd';
import React, { useState } from 'react';
import {
  ALL_ARTIFACT_SUB_STAT,
  Artifact_Enhance,
  ARTIFACT_IMAGES,
  Artifact_Type,
} from '../../src/state/artifact';
import { ArtifactEnhanceBoxModal } from './ArtifactEnhanceBoxModal';
import { ArtifactEnhanceStatTag } from './ArtifactEnhanceStatTag';
import { ArtifactMainStatTag } from './ArtifactMainStatTag';
import { ArtifactStatTag } from './ArtifactStatTag';

interface Props {
  artifact: Artifact_Enhance;
  update(artifact: Artifact_Enhance): void;
  remove(artifact: Artifact_Enhance): void;
  index: number;
}

const colors = ['', 'gray', 'green', 'blue', 'purple', 'orange'];

const getImageUrl = (type: Artifact_Type) => ARTIFACT_IMAGES.find((a) => a.type === type)?.url;

const getUnselectedStats = (artifact: Artifact_Enhance) => {
  if (artifact.sub_stats?.length === 4) return [];

  const existed_stats = artifact.sub_stats?.map((stat) => stat.name).filter(Boolean) || [];
  const existed_attributes = artifact.enhance.map((enhance) => enhance.name);
  const { main_stat } = artifact;
  return ALL_ARTIFACT_SUB_STAT.filter(
    (stat) =>
      !existed_stats.includes(stat) && !existed_attributes.includes(stat) && stat !== main_stat
  );
};

export const ArtifactEnhanceBox = (props: Props) => {
  const { artifact, update, remove, index } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const unSelectedStats = getUnselectedStats(artifact);

  const title = (
    <div className='grid gap-1'>
      <div className='grid grid-flow-col items-center auto-cols-min gap-2'>
        <Rate
          disabled
          value={artifact.artifact_rarity}
          style={{ color: colors[artifact.artifact_rarity as number] }}
        />
        <Image
          width={36}
          src={getImageUrl(artifact.artifact_type as Artifact_Type)}
          alt={artifact.artifact_type}
          preview={false}
        />
      </div>
      <div className='inline-grid grid-flow-col justify-around'>
        <span>#{index + 1}</span>
        <ArtifactMainStatTag artifact={artifact} />
      </div>
      <p>
        {artifact.sub_stats
          ?.map((stat) => stat.name)
          .filter(Boolean)
          .map((stat) => (
            <ArtifactStatTag stat={stat} key={stat} />
          ))}
      </p>
    </div>
  );

  return (
    <div className='inline-block'>
      <Card
        size='small'
        title={title}
        className='inline-block'
        onDoubleClick={() => setIsModalOpen(true)}>
        <ul className='grid gap-2'>
          {artifact.enhance.map((e) => (
            <li key={e.name}>
              <ArtifactEnhanceStatTag artifact={artifact} enhance={e} />
            </li>
          ))}
        </ul>
        {unSelectedStats.length > 0 && (
          <ul className='mt-2 inline-grid grid-cols-3 gap-1 border border-blue-200 rounded p-1'>
            {unSelectedStats.map((stat) => (
              <ArtifactStatTag stat={stat} key={stat} />
            ))}
          </ul>
        )}
      </Card>
      <ArtifactEnhanceBoxModal
        artifact={artifact}
        is_visible={isModalOpen}
        set_is_visible={setIsModalOpen}
        remove={remove}
        update={update}
      />
    </div>
  );
};
