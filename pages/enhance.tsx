import type { NextPage } from 'next';
import { useState } from 'react';
import { ArtifactEnhanceAnalysis } from '../components/enhance/ArtifactEnhanceAnalysis';
import { ArtifactEnhanceHistory } from '../components/enhance/ArtifactEnhanceHistory';
import { EnhanceArtifact } from '../components/enhance/EnhanceArtifact';
import { Artifact_Enhance } from '../src/state/artifact';

const Enhance: NextPage = () => {
  const [state, setState] = useState<Artifact_Enhance[]>([]);

  return (
    <div>
      <ArtifactEnhanceHistory state={state} setState={setState} />

      <ArtifactEnhanceAnalysis artifact_enhance={state} />
      {/* todo: json debug? */}

      <EnhanceArtifact add={(artifactEnhance) => setState((prev) => [...prev, artifactEnhance])} />
    </div>
  );
};

export default Enhance;
