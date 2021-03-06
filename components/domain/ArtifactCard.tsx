import { Card, Image, Rate } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { ALL_ARTIFACT_IMAGES, Artifact, Artifact_Type } from '../../src/state/artifact';
import { processArtifactState } from '../../src/state/recoil/artifact_domain';
import ArtifactForm from './ArtifactForm';
import ArtifactMainStatHeader from './ArtifactMainStatHeader';
import ArtifactSubStatTag from './ArtifactSubStatTag';

interface Props {
  domainId: string;
  artifactId: string;
}

export const RarityColors = [
  '',
  'text-gray-300',
  'text-green-500',
  'text-blue-700',
  'text-purple-700',
  'text-orange-300',
];

export const getImageUrl = (type: Artifact_Type) =>
  ALL_ARTIFACT_IMAGES.find((a) => a.type === type)?.url;

const getArtifactStyle = (artifact: Artifact) => {
  const stats = [artifact.main_stat, ...artifact.sub_stats.map((stat) => stat.stat)].filter(
    Boolean
  );
  const crit_counts = stats.reduce((prev, current) => (/^crit/.test(current) ? prev + 1 : prev), 0);
  const styles = {
    5: ['', `border-2 border-orange-200 border-dashed`, `border-2 border-orange-200`],
    4: ['', `border-2 border-purple-200 border-dashed`, `border-2 border-purple-200`],
    3: ['', `border-2 border-sky-200 border-dashed`, `border-2 border-sky-200`],
    2: [],
    1: [],
  };

  return styles[artifact.rarity][crit_counts];
};

const ArtifactCard = (props: Props) => {
  const { domainId, artifactId } = props;
  const artifact = useRecoilValue(processArtifactState({ domainId, artifactId, type: 'fetch' }));
  const [isModalVisible, setIsModalVisible] = useState(false);

  const title = (
    <header className='grid grid-flow-col auto-cols-min gap-2 items-center'>
      <Rate disabled value={artifact.rarity || 0} className={RarityColors[artifact.rarity]} />
      <Image width={36} src={getImageUrl(artifact.type)} alt={artifact.type} preview={false} />
      <ArtifactMainStatHeader domainId={domainId} artifactId={artifactId} />
    </header>
  );

  return (
    <Card
      onDoubleClick={() => setIsModalVisible(true)}
      className={`inline-grid mr-2 ${getArtifactStyle(artifact)}`}
      size='small'
      title={title}>
      <ul className='grid gap-2 h-30'>
        {artifact.sub_stats.map(
          (sub, index) =>
            sub.stat && (
              <li key={sub.stat}>
                <ArtifactSubStatTag domainId={domainId} artifactId={artifactId} index={index} />
              </li>
            )
        )}
      </ul>
      <Modal footer={null} onCancel={() => setIsModalVisible(false)} visible={isModalVisible}>
        <ArtifactForm
          onUpdateTrigger={() => setIsModalVisible(false)}
          domainId={domainId}
          artifactId={artifactId}
        />
      </Modal>
    </Card>
  );
};

export default ArtifactCard;
