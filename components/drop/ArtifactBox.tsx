import { Card, Image, Rate } from 'antd';
import React, { useState } from 'react';
import { ARTIFACT_IMAGES, Artifact_Type } from '../../src/state/artifact';
import { Artifact_Drop } from '../../src/state/artifact_drop';
import { ArtifactEnhanceStatTag } from '../enhance/ArtifactEnhanceStatTag';
import { ArtifactMainStatTag } from '../enhance/ArtifactMainStatTag';
import { UpdateArtifact } from './UpdateArtifact';

interface Props {
  artifact: Artifact_Drop;
  update(artifact: Artifact_Drop): void;
  remove(artifact: Artifact_Drop): void;
}

const colors = ['', 'gray', 'green', 'blue', 'purple', 'orange'];

const getImageUrl = (type: Artifact_Type) => {
  return ARTIFACT_IMAGES.find((a) => a.type === type)?.url;
};

export const ArtifactBox = (props: Props) => {
  const { artifact, update, remove } = props;
  const [showModal, setShowModal] = useState(false);

  const title = (
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
      <ArtifactMainStatTag artifact={artifact} />
    </div>
  );

  return (
    <Card
      className='inline-grid'
      size='small'
      title={title}
      onDoubleClick={() => setShowModal(true)}>
      <ul>
        {artifact.sub_stats
          .filter((s) => s.name)
          .map((sub) => (
            <li key={sub.name}>
              <ArtifactEnhanceStatTag artifact={artifact} enhance={sub} />
            </li>
          ))}
      </ul>

      <UpdateArtifact
        artifact={artifact}
        isVisible={showModal}
        setIsVisible={setShowModal}
        update={update}
        remove={remove}
      />
    </Card>
  );
};
