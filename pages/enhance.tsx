import { NextPage } from 'next';
import { useRecoilValue } from 'recoil';
import { DownloadAsJson } from '../components/common/DownloadAsJson';
import ArtifactEnhanceForm from '../components/upgrade/ArtifactEnhanceForm';
import { EnhanceHistory } from '../components/upgrade/EnhanceHistory';
import { allEnhancedArtiifactsState } from '../src/state/recoil/artifact_enhance';

const Enhance: NextPage = () => {
  const enhanceArtiafctsState = useRecoilValue(allEnhancedArtiifactsState);

  return (
    <div>
      <EnhanceHistory />
      <ArtifactEnhanceForm />
      <DownloadAsJson
        className='ml-auto block rounded max-w-max mr-2'
        filename='artifact-enhance'
        data={enhanceArtiafctsState}
      />
    </div>
  );
};

export default Enhance;
