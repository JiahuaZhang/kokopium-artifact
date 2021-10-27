import { StarFilled } from '@ant-design/icons';
import { Image, Table } from 'antd';
import React from 'react';
import {
  ALL_ARTIFACT_SUB_STAT,
  ALL_ARTIFACT_TYPE,
  ARTIFACT_IMAGES,
} from '../../src/state/artifact';
import { Artifact_Drop_Farm } from '../../src/state/artifact_drop';

interface Props {
  artifacts: Artifact_Drop_Farm;
}

const toRecordType = (value: string) => ({
  key: value,
  name: value,
  5: 0,
  4: 0,
  3: 0,
  total: 0,
});

const columns = [
  {
    title: '',
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => {
      if (ALL_ARTIFACT_TYPE.includes(text as any)) {
        const artifact_image = ARTIFACT_IMAGES.find((a) => a.type === text);
        return (
          <Image alt={artifact_image!.type} src={artifact_image!.url} width={36} preview={false} />
        );
      } else if (/good main stat|crit/.test(text)) {
        return <span className='bg-yellow-300 p-2 rounded'> {text} </span>;
      } else if (text === 'bad main stat') {
        return <span className='bg-gray-300 p-2 rounded'> {text} </span>;
      }

      return text;
    },
  },
  {
    title: <StarFilled className='text-yellow-400 fill-current' />,
    dataIndex: 5,
    key: 5,
  },
  {
    title: <StarFilled className='text-purple-400 fill-current' />,
    dataIndex: 4,
    key: 4,
  },
  {
    title: <StarFilled className='text-blue-400 fill-current' />,
    dataIndex: 3,
    key: 3,
  },
  {
    title: 'total',
    dataIndex: 'total',
    key: 'total',
  },
];

const getAnalysisData = (artifacts: Artifact_Drop_Farm) => {
  const analysis_data = [
    ...ALL_ARTIFACT_TYPE.map(toRecordType),
    toRecordType('all'),
    toRecordType('bad main stat'),
    toRecordType('good main stat'),
    ...ALL_ARTIFACT_SUB_STAT.map(toRecordType),
  ];
  const indexMapping: { [key: string]: number } = analysis_data.reduce(
    (prev, current, currentIndex) => {
      return { ...prev, [current.key]: currentIndex };
    },
    {}
  );
  artifacts.artifacts.forEach((artifact) => {
    if (![3, 4, 5].includes(artifact.artifact_rarity)) return;

    const { artifact_type, main_stat, sub_stats } = artifact;
    const artifact_rarity = artifact.artifact_rarity as 3 | 4 | 5;
    analysis_data[indexMapping[artifact_type]][artifact_rarity]++;
    analysis_data[indexMapping['all']][artifact_rarity]++;
    sub_stats.forEach((sub) => {
      analysis_data[indexMapping[sub.name]][artifact_rarity]++;
    });

    const weakStats = ['hp%', 'def%'];
    if (['Flower of Life', 'Plume of Death'].includes(artifact_type)) return;
    if (weakStats.includes(main_stat)) {
      analysis_data[indexMapping['bad main stat']][artifact_rarity]++;
    } else {
      analysis_data[indexMapping['good main stat']][artifact_rarity]++;
    }
  });

  analysis_data.forEach((data) => {
    data.total = data[3] + data[4] + data[5];
  });

  return analysis_data.filter((data) => data.total !== 0);
};

export const ArtifactDropAnalysis = (props: Props) => {
  const { artifacts } = props;

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Table
        size='small'
        pagination={false}
        dataSource={getAnalysisData(artifacts)}
        columns={columns}
      />
    </div>
  );
};
