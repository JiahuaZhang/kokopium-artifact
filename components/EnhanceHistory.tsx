import { Input } from 'antd';
import React, { useState } from 'react';
import { ArtifactHistory } from '../src/state/ArtifactHistory';

interface Props {
  history: ArtifactHistory;
  index: number;
  update: (history: ArtifactHistory, index: number) => void;
}

enum Mode {
  default,
  edit,
}

const EnhanceHistory = (props: Props) => {
  const { history, index, update } = props;
  const [mode, setMode] = useState(Mode.default);
  const [description, setDescription] = useState(history.description);

  return (
    <span className='max-w-xs'>
      {mode === Mode.default && (
        <span onDoubleClick={() => setMode(Mode.edit)} className='m-5'>
          {history.description}
        </span>
      )}

      {mode === Mode.edit && (
        <Input
          autoFocus
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              setMode(Mode.default);
              update({ ...history, description }, index);
            }
          }}
        />
      )}
    </span>
  );
};

export default EnhanceHistory;
