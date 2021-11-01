import { StarFilled } from '@ant-design/icons';
import { Image } from 'antd';
import { ALL_ARTIFACT_SUB_STAT, ALL_ARTIFACT_TYPE, ARTIFACT_IMAGES } from '../../state/artifact';
import { Artifact_Drop_Farm } from '../../state/artifact_drop';

export interface ArtifactDropAnalysisData {
  key: string;
  name: string;
  5: number;
  4: number;
  3: number;
  total: number;
  percentage5?: number;
  allPercentage?: number;
}

const toRecordType = (value: string): ArtifactDropAnalysisData => ({
  key: value,
  name: value,
  5: 0,
  4: 0,
  3: 0,
  total: 0,
  allPercentage: 0,
  percentage5: 0,
});

export const ArtifactDropColumns = [
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

export const AllArtifactDropColumns = [
  ...ArtifactDropColumns,
  {
    title: (
      <span>
        <StarFilled className='text-yellow-400 fill-current' /> percentage
      </span>
    ),
    dataIndex: 'percentage5',
    key: 'percentage5',
    render: (text: number) => (text * 100).toFixed(2) + '%',
  },
  {
    title: 'all percentage',
    dataIndex: 'allPercentage',
    key: 'allPercentage',
    render: (text: number) => (text * 100).toFixed(2) + '%',
  },
];

export const getArtifactDropAnalysisData = (artifacts: Artifact_Drop_Farm) => {
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

  return analysis_data;
};

export const getAggregateArtifactDropAnalysis = (data: ArtifactDropAnalysisData[][]) => {
  const all_analysis_data = [
    ...ALL_ARTIFACT_TYPE.map(toRecordType),
    toRecordType('all'),
    toRecordType('bad main stat'),
    toRecordType('good main stat'),
    ...ALL_ARTIFACT_SUB_STAT.map(toRecordType),
  ];
  const indexMapping: { [key: string]: number } = all_analysis_data.reduce(
    (prev, current, currentIndex) => {
      return { ...prev, [current.key]: currentIndex };
    },
    {}
  );

  const simpleUpdate = (name: string, d: ArtifactDropAnalysisData[]) => {
    all_analysis_data[indexMapping[name]][3] += d[indexMapping[name]]?.[3] || 0;
    all_analysis_data[indexMapping[name]][4] += d[indexMapping[name]]?.[4] || 0;
    all_analysis_data[indexMapping[name]][5] += d[indexMapping[name]]?.[5] || 0;
  };

  data.forEach((d) => {
    ALL_ARTIFACT_TYPE.forEach((type) => {
      simpleUpdate(type, d);
    });

    simpleUpdate('all', d);
    simpleUpdate('good main stat', d);
    simpleUpdate('bad main stat', d);

    ALL_ARTIFACT_SUB_STAT.forEach((stat) => simpleUpdate(stat, d));
  });

  all_analysis_data.forEach((d) => (d.total = d[3] + d[4] + d[5]));

  const total_artifacts = ALL_ARTIFACT_TYPE.reduce(
    (prev, cur) => prev + all_analysis_data[indexMapping[cur]].total,
    0
  );
  ALL_ARTIFACT_TYPE.forEach(
    (type) =>
      (all_analysis_data[indexMapping[type]].allPercentage =
        all_analysis_data[indexMapping[type]].total / total_artifacts)
  );

  const total_5_artifacts = ALL_ARTIFACT_TYPE.reduce(
    (prev, cur) => prev + all_analysis_data[indexMapping[cur]][5],
    0
  );
  ALL_ARTIFACT_TYPE.forEach(
    (type) =>
      (all_analysis_data[indexMapping[type]].percentage5 =
        all_analysis_data[indexMapping[type]][5] / total_5_artifacts)
  );

  const counted_main_stat =
    all_analysis_data[indexMapping['good main stat']].total +
    all_analysis_data[indexMapping['bad main stat']].total;
  all_analysis_data[indexMapping['good main stat']].allPercentage =
    all_analysis_data[indexMapping['good main stat']].total / counted_main_stat;
  all_analysis_data[indexMapping['bad main stat']].allPercentage =
    all_analysis_data[indexMapping['bad main stat']].total / counted_main_stat;

  const counted_5_main_stat =
    all_analysis_data[indexMapping['good main stat']][5] +
    all_analysis_data[indexMapping['bad main stat']][5];
  all_analysis_data[indexMapping['good main stat']].percentage5 =
    all_analysis_data[indexMapping['good main stat']][5] / counted_5_main_stat;
  all_analysis_data[indexMapping['bad main stat']].percentage5 =
    all_analysis_data[indexMapping['bad main stat']][5] / counted_5_main_stat;

  const all_sub_stats = ALL_ARTIFACT_SUB_STAT.reduce(
    (prev, cur) => prev + all_analysis_data[indexMapping[cur]].total,
    0
  );
  ALL_ARTIFACT_SUB_STAT.forEach(
    (stat) =>
      (all_analysis_data[indexMapping[stat]].allPercentage =
        all_analysis_data[indexMapping[stat]].total / all_sub_stats)
  );

  const all_5_sub_stats = ALL_ARTIFACT_SUB_STAT.reduce(
    (prev, cur) => prev + all_analysis_data[indexMapping[cur]][5],
    0
  );

  ALL_ARTIFACT_SUB_STAT.forEach(
    (stat) =>
      (all_analysis_data[indexMapping[stat]].percentage5 =
        all_analysis_data[indexMapping[stat]][5] / all_5_sub_stats)
  );

  return all_analysis_data;
};
