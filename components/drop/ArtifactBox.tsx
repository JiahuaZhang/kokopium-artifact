import { Card, Image, Rate } from 'antd';
import React, { useState } from 'react';
import { ARTIFACT_IMAGES, Artifact_Sub_Stat, Artifact_Type } from '../../src/state/artifact';
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

const getImageUrl = (type: Artifact_Type) => ARTIFACT_IMAGES.find((a) => a.type === type)?.url;

const getArtifactScore = (artifact: Artifact_Drop) => {
  const { artifact_type, main_stat = '', sub_stats } = artifact;

  let score = 0;
  const weakStats = ['hp%', 'def%'];
  if (artifact_type === 'Sands of Eon') {
    if (weakStats.includes(main_stat)) {
      score -= 1;
    } else {
      score += 2;
    }
  } else if (artifact_type === 'Goblet of Eonothem') {
    if (weakStats.includes(main_stat)) {
      score -= 1;
    } else if (main_stat === 'atk%') {
      score += 1;
    } else {
      score += 2;
    }
  } else if (artifact_type === 'Circlet of Logos') {
    if (weakStats.includes(main_stat)) {
      score -= 1;
    } else if (['atk%', 'healing bonus%'].includes(main_stat)) {
      score += 1;
    } else {
      score += 3;
    }
  }

  const sub_stat_score: { [key in Artifact_Sub_Stat]: number } = {
    hp: 0,
    'hp%': 0,
    atk: 0,
    'atk%': 1,
    def: 0,
    'def%': 0,
    'elemental mastery': 1,
    'energy recharge': 1,
    'crit rate%': 2,
    'crit dmg%': 2,
  };

  sub_stats.forEach((sub) => (score += sub_stat_score[sub.name]));

  return score;
};

const getArtifactStyle = (artifact: Artifact_Drop) => {
  const score = getArtifactScore(artifact);

  if (score < 3) {
    return '';
  }

  const borderColors = ['', '', '', 'border-blue-400', 'border-purple-400', 'border-yellow-400'];

  if (score === 3) {
    return `border-dashed ${borderColors[artifact.artifact_rarity || 0]}`;
  }

  return borderColors[artifact.artifact_rarity || 0];
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
      className={`inline-grid ${getArtifactStyle(artifact)} border-2 mr-2`}
      size='small'
      title={title}
      onDoubleClick={() => setShowModal(true)}>
      <ul className='h-24'>
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
