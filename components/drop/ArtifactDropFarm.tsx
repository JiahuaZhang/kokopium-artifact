import { Button } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Artifact_Drop, Artifact_Drop_Farm } from '../../src/state/artifact_drop';
import { ArtifactBox } from './ArtifactBox';
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
  const [showNewArtifactForm, setShowNewArtifactForm] = useState(true);
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
        {artifact_drop_farm.created.toDateString()}
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

      {!showNewArtifactForm && (
        <Button className='block m-4 rounded text-right' type='primary'>
          Add Artifact
        </Button>
      )}

      {showNewArtifactForm && (
        <NewArtifact
          close={() => setShowNewArtifactForm(false)}
          add={(artifact: Artifact_Drop) => {
            artifact_drop_farm.artifacts.push(artifact);
            update(artifact_drop_farm);
          }}
        />
      )}

      {/* todo analysis on the this drop farm */}
    </div>
  );
};