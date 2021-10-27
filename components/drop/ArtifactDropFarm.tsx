import React, { useEffect, useRef, useState } from 'react';
import { Artifact_Drop, Artifact_Drop_Farm } from '../../src/state/artifact_drop';
import { ArtifactBox } from './ArtifactBox';
import { ArtifactDropAnalysis } from './ArtifactDropAnalysis';
import { NewArtifact } from './NewArtifact';
import { UpdateArtifactDrop } from './UpdateArtifactDrop';

interface Props {
  artifact_drop_farm: Artifact_Drop_Farm;
  update(artifact_drop_farm: Artifact_Drop_Farm): void;
  remove(artifact_drop_farm: Artifact_Drop_Farm): void;
}

export const ArtifactDropFarm = (props: Props) => {
  const { artifact_drop_farm, update, remove } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [showNewArtifactForm, setShowNewArtifactForm] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      setShowNewArtifactForm(ref.current?.contains(event.target as Node) as boolean);
    };

    document.addEventListener('click', onClick);

    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <div ref={ref} className='border-2 border-gray-300 pb-6'>
      <h1
        className='text-center text-lg font-medium'
        onDoubleClick={() => {
          setShowUpdatePopup(true);
        }}>
        {artifact_drop_farm.description} - {artifact_drop_farm.type} @{' '}
        {new Date(artifact_drop_farm.created).toDateString()}
        <UpdateArtifactDrop
          isVisible={showUpdatePopup}
          setIsVisible={setShowUpdatePopup}
          artifact_drop_farm={artifact_drop_farm}
          update={update}
          remove={remove}
        />
      </h1>

      {artifact_drop_farm.artifacts.map((a) => (
        <ArtifactBox
          key={a.id}
          artifact={a}
          update={(a) => {
            const new_artifact_drop_farm = { ...artifact_drop_farm };
            new_artifact_drop_farm.artifacts = new_artifact_drop_farm.artifacts.map((item) =>
              item.id === a.id ? a : item
            );
            update(new_artifact_drop_farm);
          }}
          remove={(a) => {
            const new_artifact_drop_farm = { ...artifact_drop_farm };
            new_artifact_drop_farm.artifacts = new_artifact_drop_farm.artifacts.filter(
              (item) => item.id !== a.id
            );
            update(new_artifact_drop_farm);
          }}
        />
      ))}

      <ArtifactDropAnalysis artifacts={artifact_drop_farm} />

      {showNewArtifactForm && (
        <NewArtifact
          close={() => setShowNewArtifactForm(false)}
          add={(artifact: Artifact_Drop) => {
            artifact_drop_farm.artifacts.push(artifact);
            update(artifact_drop_farm);
          }}
        />
      )}
    </div>
  );
};
