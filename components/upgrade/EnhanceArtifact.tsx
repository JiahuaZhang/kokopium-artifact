import { Card, Rate, Image } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Artifact_Sub_Stat_Enhance, Enhanced_Artifact } from '../../src/state/artifact';
import { handleEnhanceArtifactState } from '../../src/state/recoil/artifact_enhance';
import { getImageUrl, RarityColors } from '../domain/ArtifactCard';
import ArtifactEnhanceForm from './ArtifactEnhanceForm';
import EnhanceMainStatHeader from './EnhanceMainStatHeader';
import EnhanceSubStatTag from './EnhanceSubStatTag';
import { SubStatTag } from './SubStatTag';

type Props = {
  id: string;
};

const borderStyles = ['', 'border-purple-200', 'border-orange-200'];
const getExistedSubStatBorder = (sub_stats: Artifact_Sub_Stat_Enhance[]) => {
  const counts = sub_stats.reduce((prev, current) => prev + Number(/crit/i.test(current.stat)), 0);
  return borderStyles[counts];
};

const getBorderStyle = (enhance: Enhanced_Artifact) => {
  const examed_enhancements = enhance.enhancements.filter((e) => e.stat && e.value);

  if (examed_enhancements.every((e) => /crit/i.test(e.stat))) {
    return borderStyles[2];
  }

  if (!examed_enhancements.some((e) => /crit/i.test(e.stat))) return '';

  const non_crit = examed_enhancements.filter((e) => !/crit/i.test(e.stat));
  if (
    non_crit.every((e) => (e.times || 1) <= 1) &&
    non_crit.every((e) => enhance.artifact.sub_stats.every((sub) => sub.stat !== e.stat))
  ) {
    return borderStyles[2];
  }

  return borderStyles[1];
};

export const EnhanceArtifactCard = (props: Props) => {
  const { id } = props;
  const enhanceArtifact = useRecoilValue(handleEnhanceArtifactState(id));
  const [isModalVisible, setIsModalVisible] = useState(false);

  const title = (
    <header className='grid grid-flow-col auto-cols-min gap-2 items-center'>
      <Rate
        disabled
        value={enhanceArtifact.artifact.rarity || 0}
        className={RarityColors[enhanceArtifact.artifact.rarity]}
      />
      <Image
        width={36}
        src={getImageUrl(enhanceArtifact.artifact.type)}
        alt={enhanceArtifact.artifact.type}
        preview={false}
      />
      <EnhanceMainStatHeader id={id} />
    </header>
  );

  return (
    <Card
      onDoubleClick={() => setIsModalVisible(true)}
      title={title}
      size='small'
      className={`inline-grid mr-2 border-2 rounded ${getBorderStyle(enhanceArtifact)}`}>
      <ul
        className={`inline-grid gap-2 grid-flow-col mb-2 p-1 rounded border-2 ${getExistedSubStatBorder(
          enhanceArtifact.artifact.sub_stats
        )}`}>
        {enhanceArtifact.artifact.sub_stats.map(
          (sub, index) =>
            sub.stat && (
              <li key={sub.stat}>
                <SubStatTag id={id} index={index} />
              </li>
            )
        )}
      </ul>
      <ul className='grid gap-1'>
        {enhanceArtifact.enhancements.map(
          (enhance, index) =>
            enhance.stat &&
            enhance.value && (
              <li key={enhance.stat}>
                <EnhanceSubStatTag id={id} index={index} />
              </li>
            )
        )}
      </ul>
      <Modal
        width={800}
        footer={null}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}>
        <ArtifactEnhanceForm id={id} onUpdateTrigger={() => setIsModalVisible(false)} />
      </Modal>
    </Card>
  );
};

export default EnhanceArtifactCard;
