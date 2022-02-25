import { NextPage } from 'next';
import ArtifactEnhanceForm from '../components/upgrade/ArtifactEnhanceForm';
import EnhanceHistory from '../components/upgrade/EnhanceHistory';

const Enhance: NextPage = () => {
  return (
    <div>
      <EnhanceHistory />
      <ArtifactEnhanceForm />
    </div>
  );
};

export default Enhance;
