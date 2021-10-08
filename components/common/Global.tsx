import React from 'react';
import { ArtifactMenu } from './ArtifactMenu';

interface Props {
  children: React.ReactChild;
}

const Global = (props: Props) => {
  const { children } = props;

  return (
    <>
      <ArtifactMenu />
      {children}
    </>
  );
};

export default Global;
