import React, { Dispatch, SetStateAction } from 'react';
import { Artifact_Enhance } from '../../src/state/artifact';
import { ArtifactEnhanceBox } from './ArtifactEnhanceBox';

interface Props {
  state: Artifact_Enhance[];
  setState: Dispatch<SetStateAction<Artifact_Enhance[]>>;
}

export const ArtifactEnhanceHistory = (props: Props) => {
  const { state, setState } = props;

  return (
    <>
      {state.map((s) => (
        <ArtifactEnhanceBox
          key={s.id}
          artifact={s}
          remove={(artifact) => setState((prev) => prev.filter((a) => a.id !== artifact.id))}
          update={(artifact) =>
            setState((prev) =>
              prev.map((a) => {
                if (a.id === artifact.id) return artifact;
                return a;
              })
            )
          }
        />
      ))}
    </>
  );
};
