/** @jsxImportSource @emotion/react */
import { Table, Select } from 'antd';
import { useEffect, useState } from 'react';
import {
  ALL_ARTIFACT_SUB_STAT,
  Artifact_Enhance,
  Artifact_Sub_Stat,
} from '../../src/state/artifact';

interface Props {
  artifact_enhance: Artifact_Enhance[];
}

interface StatStatus {
  on: number;
  off: number;
}
interface ExpectedStatistics {
  4: StatStatus;
  6: StatStatus;
  7: StatStatus;
  8: StatStatus;
  9: StatStatus;
  10: StatStatus;
  count: number;
  expected: number;
  diff: number;
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

const getStatistics = (artifact_enhance: Artifact_Enhance[]) => {
  const toAllExpectedStatistics = () => {
    const result: { [key in Artifact_Sub_Stat]: ExpectedStatistics } = {} as any;

    ALL_ARTIFACT_SUB_STAT.forEach((stat) => {
      result[stat] = {
        4: { on: 0, off: 0 },
        6: { on: 0, off: 0 },
        7: { on: 0, off: 0 },
        8: { on: 0, off: 0 },
        9: { on: 0, off: 0 },
        10: { on: 0, off: 0 },
        count: 0,
        expected: 0.0,
        diff: 0.0,
      } as ExpectedStatistics;
    });

    return result;
  };

  const sequenceExpectedStatistics = artifact_enhance.map((enhance) => {
    const newExpectedStatistics = toAllExpectedStatistics();

    const existed_sub_stats = enhance.sub_stats?.map((stat) => stat.name).filter(Boolean) || [];
    const { main_stat } = enhance;
    const candidate_stats = ALL_ARTIFACT_SUB_STAT.filter(
      (stat) => !existed_sub_stats.includes(stat) && main_stat !== stat
    );

    enhance.enhance.forEach((attribute) => {
      if (attribute.name) {
        if (existed_sub_stats.length === 4) {
          existed_sub_stats.forEach((stat) => {
            newExpectedStatistics[stat as Artifact_Sub_Stat].expected += 1 / 4;

            if (stat === attribute.name) {
              newExpectedStatistics[attribute.name as Artifact_Sub_Stat][4].on += 1;
              newExpectedStatistics[attribute.name as Artifact_Sub_Stat].count += 1;
            } else {
              newExpectedStatistics[attribute.name as Artifact_Sub_Stat][4].off += 1;
            }
            newExpectedStatistics[attribute.name as Artifact_Sub_Stat].diff =
              newExpectedStatistics[attribute.name as Artifact_Sub_Stat].count -
              newExpectedStatistics[attribute.name as Artifact_Sub_Stat].expected;
          });
        } else {
          const index = candidate_stats.length as 4 | 6 | 7 | 8 | 9 | 10;
          candidate_stats.forEach((stat) => {
            newExpectedStatistics[stat].expected += 1 / index;
            if (stat === attribute.name) {
              newExpectedStatistics[stat][index].on += 1;
              newExpectedStatistics[stat].count += 1;
            } else {
              newExpectedStatistics[stat][index].off += 1;
            }
            newExpectedStatistics[stat].diff =
              newExpectedStatistics[stat].count - newExpectedStatistics[stat].expected;
          });
        }
      }
    });

    return newExpectedStatistics;
  });

  sequenceExpectedStatistics.forEach((statistics, index, allStatistics) => {
    if (index === 0) return;

    ALL_ARTIFACT_SUB_STAT.forEach((stat) => {
      [4, 6, 7, 8, 9, 10].forEach((key) => {
        statistics[stat][key as 4 | 6 | 7 | 8 | 9 | 10].on +=
          allStatistics[index - 1][stat][key as 4 | 6 | 7 | 8 | 9 | 10].on;
        statistics[stat][key as 4 | 6 | 7 | 8 | 9 | 10].off +=
          allStatistics[index - 1][stat][key as 4 | 6 | 7 | 8 | 9 | 10].off;
      });

      statistics[stat].count += allStatistics[index - 1][stat].count;
      statistics[stat].expected += allStatistics[index - 1][stat].expected;
      statistics[stat].diff = statistics[stat].count - statistics[stat].expected;
    });
  });

  return sequenceExpectedStatistics;
};

const statisticsToTableData = (statistics: { [key: string]: ExpectedStatistics }) => {
  if (!statistics) return [];

  return ALL_ARTIFACT_SUB_STAT.map((stat) => {
    return { ...statistics[stat], attribute: stat, key: stat };
  });
};

export const ArtifactEnhanceAnalysis = (props: Props) => {
  const { artifact_enhance } = props;
  const distances = getDistance(artifact_enhance);
  const allStatistics = getStatistics(artifact_enhance);
  const [index, setIndex] = useState(artifact_enhance.length - 1);

  useEffect(() => setIndex(artifact_enhance.length - 1), [artifact_enhance]);

  return (
    <div>
      <Select
        className='w-32'
        showSearch
        placeholder='Selecte enhance state'
        onChange={(value: number) => {
          setIndex(value - 1);
        }}
        value={index + 1}>
        {artifact_enhance.map((_, index) => (
          <Select.Option value={index + 1} key={index + 1}>
            {index + 1}
          </Select.Option>
        ))}
      </Select>
      <Table
        dataSource={statisticsToTableData(allStatistics[index])}
        pagination={false}
        size='small'>
        <Table.Column title='attribute' dataIndex='attribute' key='attribute' />
        {[4, 6, 7, 8, 9, 10].map((value) => (
          <Table.ColumnGroup key={value} title={`1/${value}`}>
            <Table.Column title='hit' dataIndex={[value, 'on']} key={`${value}.on`} />
            <Table.Column title='miss' dataIndex={[value, 'off']} key={`${value}.off`} />
          </Table.ColumnGroup>
        ))}
        {['count', 'expected', 'diff'].map((value) => (
          <Table.Column
            title={value}
            dataIndex={value}
            key={value}
            render={(val: number) => val.toFixed(2)}
            sorter={(a: any, b: any) => a[value] - b[value]}
          />
        ))}
      </Table>
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
      {/* todo? smart toggle base on selection attribute, or even multiple */}
      {/* layout might be #1-v #2-x #3-x #4-x #5-v ... */}
      <ul className='m-2 text-base'>
        {distances.map((distance, index) => (
          <li key={index}> {distance.join(', ')} </li>
        ))}
      </ul>
    </div>
  );
};
