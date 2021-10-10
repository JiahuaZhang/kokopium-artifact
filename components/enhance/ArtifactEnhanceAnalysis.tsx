/** @jsxImportSource @emotion/react */
import { Table } from 'antd';
import { Artifact_Enhance } from '../../src/state/artifact';

interface Props {
  artifact_enhance: Artifact_Enhance[];
}

const columns = [
  {
    title: 'Attribute',
    dataIndex: 'attribute',
    key: 'attribute',
  },
  { title: 'Count', dataIndex: 'count', key: 'count' },
  { title: 'Existed Count', dataIndex: 'existedCount', key: 'existedCount' },
  {
    title: 'Sequence',
    dataIndex: 'sequence',
    key: 'sequence',
    render: (seq: number[]) => seq.map((s) => `#${s}`).join(', '),
  },
];

const getStats = (artifact_enhance: Artifact_Enhance[]) => {
  const data: {
    key: string;
    attribute: string;
    count: number;
    existedCount: number;
    sequence: number[];
  }[] = [
    { key: '1', attribute: 'hp', count: 0, existedCount: 0, sequence: [] },
    { key: '2', attribute: 'hp%', count: 0, existedCount: 0, sequence: [] },
    { key: '3', attribute: 'def', count: 0, existedCount: 0, sequence: [] },
    { key: '4', attribute: 'def%', count: 0, existedCount: 0, sequence: [] },
    { key: '5', attribute: 'atk', count: 0, existedCount: 0, sequence: [] },
    { key: '6', attribute: 'atk%', count: 0, existedCount: 0, sequence: [] },
    { key: '7', attribute: 'elemental mastery', count: 0, existedCount: 0, sequence: [] },
    { key: '8', attribute: 'energy recharge', count: 0, existedCount: 0, sequence: [] },
    { key: '9', attribute: 'crit rate%', count: 0, existedCount: 0, sequence: [] },
    { key: '10', attribute: 'crit dmg%', count: 0, existedCount: 0, sequence: [] },
    { key: '11', attribute: 'total', count: 0, existedCount: 0, sequence: [] },
  ];

  artifact_enhance.forEach((enhance, index) => {
    enhance.enhance.forEach((e) => {
      if (e.name) {
        const dataIndex = data.findIndex((d) => d.attribute === e.name);
        if (dataIndex === -1) return;
        data[dataIndex].count += 1;
        data[dataIndex].sequence.push(index + 1);

        data[10].count += 1;
      }
    });

    if (enhance.main_stat) {
      const dataIndex = data.findIndex((d) => d.attribute === enhance.main_stat);
      if (dataIndex === -1) return;

      data[dataIndex].existedCount += 1;

      data[10].existedCount += 1;
    }

    enhance.sub_stats?.forEach((s) => {
      if (s.name) {
        const dataIndex = data.findIndex((d) => d.attribute === s.name);
        if (dataIndex === -1) return;
        data[dataIndex].existedCount += 1;

        data[10].existedCount += 1;
      }
    });
  });

  return data;
};

const getDistance = (artifact_enhance: Artifact_Enhance[]) => {
  const is_crit = artifact_enhance.map((enhance) =>
    enhance.enhance.some((e) => /crit/i.test(e.name))
  );

  const crit_distances: number[][] = [[]];

  let offset = 0;
  is_crit.forEach((status, index) => {
    if (status) {
      crit_distances[crit_distances.length - 1].push(0);
    } else {
      if (index === 0) {
        crit_distances[0].push(index + 1);
      } else if (is_crit[index - 1]) {
        offset = index;
        crit_distances.push([1]);
      } else {
        crit_distances[crit_distances.length - 1].push(index + 1 - offset);
      }
    }
  });

  return crit_distances;
};

export const ArtifactEnhanceAnalysis = (props: Props) => {
  const { artifact_enhance } = props;

  const distances = getDistance(artifact_enhance);

  return (
    <div>
      <Table
        size='small'
        dataSource={getStats(artifact_enhance)}
        columns={columns}
        pagination={false}
        css={{
          '& tbody tr:nth-child(1n+7)': {
            background: '#FEF3C7',
          },
          '& tbody tr:last-child': {
            background: 'transparent',
          },
        }}
      />
      <ul className='m-2 text-base'>
        {distances.map((distance, index) => (
          <li key={index}> {distance.join(', ')} </li>
        ))}
      </ul>
    </div>
  );
};
