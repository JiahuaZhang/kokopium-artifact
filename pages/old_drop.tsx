import { Table } from 'antd';
import { NextPage } from 'next';
import { useState } from 'react';
import { ArtifactDropFarm } from '../components/drop/ArtifactDropFarm';
import { NewArtifactDrop } from '../components/drop/NewArtifactDrop';
import { Artifact_Drop_Farm } from '../src/state/artifact_drop';
// import mockDrop from '../public/drop/2021-10-25 Mon artifact-drop.json';
// import mockDrop from '../public/drop/2021-10-26 Tue artifact-drop.json';
// import mockDrop from '../public/drop/2021-10-30 Sat artifact-drop.json';
// import mockDrop from '../public/drop/2021-10-31 Sun artifact-drop.json';
// import mockDrop from '../public/drop/2021-11-01 Mon artifact-drop.json';
// import mockDrop from '../public/drop/2021-11-02 Tue artifact-drop.json';
// import mockDrop from '../public/drop/2021-11-21 Sun artifact-drop.json';
import { DownloadAsJson } from '../components/common/DownloadAsJson';
import {
  AllArtifactDropColumns,
  getAggregateArtifactDropAnalysis,
  getArtifactDropAnalysisData,
} from '../src/util/analysis/drop';

const Drop: NextPage = () => {
  // const [state, setState] = useState<Artifact_Drop_Farm[]>(mockDrop as Artifact_Drop_Farm[]);
  const [state, setState] = useState<Artifact_Drop_Farm[]>([] as Artifact_Drop_Farm[]);

  const analysisData = state.map((s) => getArtifactDropAnalysisData(s));
  const aggregateData = getAggregateArtifactDropAnalysis(analysisData);

  // todo?
  // upload multiple pass data, for super aggregate data!

  return (
    <div>
      {state.map((s, index) => (
        <ArtifactDropFarm
          analysis_data={analysisData[index].filter((d) => d.total > 0)}
          key={s.id}
          artifact_drop_farm={s}
          update={(drop) => setState((values) => values.map((v) => (v.id === drop.id ? drop : v)))}
          remove={(item) => setState((values) => values.filter((v) => v.id !== item.id))}
        />
      ))}

      <div className='grid grid-flow-col justify-between'>
        <NewArtifactDrop add={(drop) => setState((values) => [...values, drop])} />
        <DownloadAsJson filename='artifact-drop' data={state} />
      </div>

      <Table
        size='small'
        pagination={false}
        dataSource={aggregateData.filter((d) => d.total > 0)}
        columns={AllArtifactDropColumns}
      />

      {/* todo: enable dev local mode, if there some initial at /public? directory, load the json automaically */}
    </div>
  );
};

export default Drop;
