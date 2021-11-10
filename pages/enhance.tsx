import type { NextPage } from 'next';
import { useState } from 'react';
import { DownloadAsJson } from '../components/common/DownloadAsJson';
import { AddArtifactEnhance } from '../components/enhance/add/AddArtifactEnhance';
import { ArtifactEnhanceAnalysis } from '../components/enhance/ArtifactEnhanceAnalysis';
import { ArtifactEnhanceHistory } from '../components/enhance/ArtifactEnhanceHistory';
import { Artifact_Enhance } from '../src/state/artifact';

const Enhance: NextPage = () => {
  const [state, setState] = useState<Artifact_Enhance[]>([]);

  return (
    <div>
      <ArtifactEnhanceHistory state={state} setState={setState} />

      <AddArtifactEnhance
        add={(artifactEnhance) => setState((prev) => [...prev, artifactEnhance])}
      />

      <ArtifactEnhanceAnalysis artifact_enhance={state} />

      <DownloadAsJson filename='artifact-enhance' data={state} />
    </div>
  );
};

export default Enhance;
