import { Card, Rate } from 'antd';
import React, { useState } from 'react';
import { Artifact_Enhance } from '../../src/state/artifact';
import { ArtifactEnhanceBoxModal } from './ArtifactEnhanceBoxModal';
import { ArtifactStatTag } from './ArtifactStatTag';

interface Props {
  artifact: Artifact_Enhance;
  update(artifact: Artifact_Enhance): void;
  remove(artifact: Artifact_Enhance): void;
}

export const ArtifactEnhanceBox = (props: Props) => {
  const { artifact, update, remove } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const title = (
    <div>
      <Rate disabled value={artifact.artifact_rarity} />
      <h1>
        {artifact.artifact_type?.split(' ')[0]} - {artifact.main_stat}
      </h1>
      <p>
        substat:
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
        <ul>
          {artifact.enhance.map((e) => (
            <li key={e.name}>
              {e.name} - {e.value}
            </li>
          ))}
        </ul>
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
