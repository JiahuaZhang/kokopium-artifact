import { NextPage } from 'next';
import { useState } from 'react';
import { ArtifactDropFarm } from '../components/drop/ArtifactDropFarm';
import { NewArtifactDrop } from '../components/drop/NewArtifactDrop';
import { Artifact_Drop_Farm } from '../src/state/artifact_drop';

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

      <NewArtifactDrop add={(drop) => setState((values) => [...values, drop])} />

      {/* {JSON.stringify(state)} */}

      {/* analysis part for all drop farms */}
    </div>
  );
};

export default Drop;
