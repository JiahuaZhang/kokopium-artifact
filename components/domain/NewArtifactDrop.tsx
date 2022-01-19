import { Button, Popover } from 'antd';
import React, { useState } from 'react';
import ArtifactForm from './ArtifactForm';

interface Props {
  domainId: string;
}

export const NewArtifactDrop = (props: Props) => {
  const { domainId } = props;
  const [isCreating, setIsCreating] = useState(true);

  return (
    <div>
      {!isCreating && (
        <Button
          type='primary'
          className='bg-blue-500 rounded mx-auto block mt-2'
          onClick={(event) => {
            event.stopPropagation();
            setIsCreating(true);
          }}>
          New Artifact
        </Button>
      )}

      {isCreating && <ArtifactForm domainId={domainId} />}

      {isCreating && (
        <Popover content='Click to collapse form' className='block ml-auto mr-8'>
          <Button onClick={() => setIsCreating(false)}>^</Button>
        </Popover>
      )}
    </div>
  );
};
