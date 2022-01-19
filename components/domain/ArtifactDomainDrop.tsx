import { Input, Select, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { processedAllArtifactDomainsState } from '../../src/state/recoil/artifact_domain';
import { ALL_ARTIFACT_DOMAIN_TYPE } from '../../src/state/artifact';
import { toFormSelection } from '../../src/util/form';
import { useEscape } from '../../src/util/useEscape';
import { DeleteFilled, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { NewArtifactDrop } from './NewArtifactDrop';
import ArtifactCard from './ArtifactCard';

interface Props {
  id: string;
}

const options = ALL_ARTIFACT_DOMAIN_TYPE.map(toFormSelection);

const ArtifactDomainDrop = (props: Props) => {
  const { id } = props;
  const domain = useRecoilValue(processedAllArtifactDomainsState(id))[0];
  const updater = useSetRecoilState(processedAllArtifactDomainsState('update'));
  const deleter = useSetRecoilState(processedAllArtifactDomainsState('delete'));
  const [isEdittingDescription, setIsEdittingDescription] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEscape(inputRef, () => setIsEdittingDescription(false));
  const [description, setDescription] = useState(domain.description);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const deleteRef = useRef(null);
  useEscape(deleteRef, () => setIsConfirmingDelete(false));

  return (
    <div>
      <header
        className='grid items-center gap-3 mx-4 text-lg'
        style={{ gridTemplateColumns: '1fr repeat(3, max-content)' }}>
        {!isEdittingDescription && (
          <span
            className='text-2xl'
            onDoubleClick={(event) => {
              setIsEdittingDescription(true);
              event.stopPropagation();
            }}>
            {domain.description || 'Double click to add description'}
          </span>
        )}
        {isEdittingDescription && (
          <Input
            autoFocus
            className='text-2xl m-0 p-1'
            ref={(r) => {
              if (r) inputRef.current = r.input;
            }}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) {
                const newDomain = { ...domain, description };
                updater([newDomain]);
                setIsEdittingDescription(false);
              } else if (e.key === 'Escape') {
                setDescription(domain.description);
              }
            }}
          />
        )}

        <Select
          options={options}
          defaultValue={domain.type}
          className='w-32'
          onChange={(type) => {
            const newDomain = { ...domain, type };
            updater([newDomain]);
          }}
        />

        <span>{moment(domain.created).format('dddd MMM Do yyyy')}</span>

        {isConfirmingDelete && (
          <Tooltip title='Click to confirm delete' defaultVisible={true}>
            <DeleteFilled
              ref={deleteRef}
              className='text-red-400 cursor-pointer'
              onClick={(e) => deleter([domain])}
            />
          </Tooltip>
        )}

        {!isConfirmingDelete && (
          <DeleteOutlined
            className='cursor-pointer'
            onClick={(event) => {
              event.stopPropagation();
              setIsConfirmingDelete(true);
            }}
          />
        )}
      </header>

      {domain.artifacts.map((artifact) => (
        <ArtifactCard domainId={domain.id} artifactId={artifact.id} key={artifact.id} />
      ))}

      <NewArtifactDrop domainId={domain.id} />
    </div>
  );
};

export default ArtifactDomainDrop;
