import React from 'react';
import { useRecoilValue } from 'recoil';
import { allEnhancedArtiifactsState } from '../../src/state/recoil/artifact_enhance';
import { EnhanceArtifactCard } from './EnhanceArtifact';

type Props = {};

export const EnhanceHistory = (props: Props) => {
  const enhanceArtiafctsState = useRecoilValue(allEnhancedArtiifactsState);

  return (
    <div>
      {enhanceArtiafctsState.map((enhance) => (
        <EnhanceArtifactCard key={enhance.artifact.id} id={enhance.artifact.id} />
      ))}
    </div>
  );
};
