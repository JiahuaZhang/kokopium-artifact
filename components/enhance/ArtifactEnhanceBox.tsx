import { Card, Rate } from 'antd';
import React from 'react';
import { Artifact_Enhance } from '../../src/state/artifact';
import { ArtifactStatTag } from './ArtifactStatTag';

interface Props {
  artifact: Artifact_Enhance;
  update(artifact: Artifact_Enhance): void;
  remove(artifact: Artifact_Enhance): void;
}

export const ArtifactEnhanceBox = (props: Props) => {
  const { artifact, update, remove } = props;

  // todo, add update, remove function

  const title = (
    <div>
      <Rate value={artifact.artifact_rarity} />
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
    <Card size='small' title={title} className='inline-block'>
      <ul>
        {artifact.enhance
          .filter((enhance) => enhance.name)
          .map((e) => (
            <li key={e.name}>
              {e.name} - {e.value}
            </li>
          ))}
      </ul>
    </Card>
  );
};
