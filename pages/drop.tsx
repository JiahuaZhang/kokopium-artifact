import { NextPage } from 'next';
import { useState } from 'react';
import { ArtifactDropFarm } from '../components/drop/ArtifactDropFarm';
import { NewArtifactDrop } from '../components/drop/NewArtifactDrop';
import { Artifact_Drop_Farm } from '../src/state/artifact_drop';
import { DownloadAsJson } from '../components/common/DownloadAsJson';

const Drop: NextPage = () => {
  const [state, setState] = useState<Artifact_Drop_Farm[]>([]);

  return (
    <div>
      {state.map((s) => (
        <ArtifactDropFarm
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

      {/* analysis part for all drop farms */}
    </div>
  );
};

export default Drop;
