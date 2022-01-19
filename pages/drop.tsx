import { NextPage } from 'next';
import { useRecoilValue } from 'recoil';
import { DownloadAsJson } from '../components/common/DownloadAsJson';
import ArtifactDomainDrop from '../components/domain/ArtifactDomainDrop';
import { NewArtifactDomainDrop } from '../components/domain/NewArtifactDomainDrop';
import { allArtifactDomainsState } from '../src/state/recoil/artifact_domain';

const Drop: NextPage = () => {
  const domainState = useRecoilValue(allArtifactDomainsState);

  return (
    <div>
      {domainState.map((state) => (
        <ArtifactDomainDrop id={state.id} key={state.id} />
      ))}

      <NewArtifactDomainDrop />

      <DownloadAsJson
        className='ml-auto block max-w-max mt-2'
        filename='artifact_drop'
        data={domainState}
      />
    </div>
  );
};

export default Drop;
