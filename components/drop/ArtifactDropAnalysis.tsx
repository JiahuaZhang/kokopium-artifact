import { Table } from 'antd';
import React from 'react';
import { ArtifactDropAnalysisData, ArtifactDropColumns } from '../../src/util/analysis/drop';

interface Props {
  analysis: ArtifactDropAnalysisData[];
}

export const ArtifactDropAnalysis = (props: Props) => {
  const { analysis } = props;

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Table size='small' pagination={false} dataSource={analysis} columns={ArtifactDropColumns} />
    </div>
  );
};
