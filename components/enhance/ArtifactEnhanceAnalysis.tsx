/** @jsxImportSource @emotion/react */
import { Table, Select } from 'antd';
import { useEffect, useState } from 'react';
import {
  ALL_ARTIFACT_SUB_STAT,
  Artifact_Enhance,
  Artifact_Sub_Stat,
} from '../../src/state/artifact';
import { ArtifactEnhanceStatTrace } from './trace/ArtifactEnhanceStatTrace';

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
  excluded: number;
  included: number;
  count: number;
  expected: number;
  diff: number;
}

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
        excluded: 0,
        included: 0,
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
          ALL_ARTIFACT_SUB_STAT.filter((stat) => !existed_sub_stats.includes(stat)).forEach(
            (stat) => (newExpectedStatistics[stat].excluded += 1)
          );

          existed_sub_stats.forEach((stat) => {
            newExpectedStatistics[stat as Artifact_Sub_Stat].included += 1;
            newExpectedStatistics[stat as Artifact_Sub_Stat].expected += 1 / 4;

            if (stat === attribute.name) {
              newExpectedStatistics[stat as Artifact_Sub_Stat][4].on += 1;
              newExpectedStatistics[stat as Artifact_Sub_Stat].count += 1;
            } else {
              newExpectedStatistics[stat as Artifact_Sub_Stat][4].off += 1;
            }
            newExpectedStatistics[stat as Artifact_Sub_Stat].diff =
              newExpectedStatistics[stat as Artifact_Sub_Stat].count -
              newExpectedStatistics[stat as Artifact_Sub_Stat].expected;
          });
        } else {
          ALL_ARTIFACT_SUB_STAT.filter((stat) => !candidate_stats.includes(stat)).forEach(
            (stat) => (newExpectedStatistics[stat].excluded += 1)
          );

          const index = candidate_stats.length as 4 | 6 | 7 | 8 | 9 | 10;
          candidate_stats.forEach((stat) => {
            newExpectedStatistics[stat].included += 1;
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

      statistics[stat].excluded += allStatistics[index - 1][stat].excluded;
      statistics[stat].included += allStatistics[index - 1][stat].included;
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
        {['excluded', 'included', 'count', 'expected', 'diff'].map((value) => (
          <Table.Column
            title={value}
            dataIndex={value}
            key={value}
            render={(val: number) => (Number.isInteger(val) ? val : val.toFixed(2))}
            sorter={(a: any, b: any) => a[value] - b[value]}
          />
        ))}
      </Table>
      <ArtifactEnhanceStatTrace artifact_enhance={artifact_enhance} />
    </div>
  );
};
