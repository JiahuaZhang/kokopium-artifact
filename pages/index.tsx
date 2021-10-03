import type { NextPage } from 'next';
import { Input } from 'antd';
import { useState } from 'react';
import { ArtifactHistory } from '../src/state/ArtifactHistory';
import EnhanceHistory from '../components/EnhanceHistory';

const Home: NextPage = () => {
  const [enchanceHistory, setEnchanceHistory] = useState<ArtifactHistory[]>([]);
  const [history, setHistory] = useState('');

  return (
    <div>
      <section>
        {enchanceHistory.map((history, index) => (
          <EnhanceHistory
            key={index}
            history={history}
            index={index}
            update={(history, index) => {
              setEnchanceHistory((histories) =>
                histories.map((h, i) => (i === index ? history : h))
              );
            }}
          />
        ))}
      </section>
      <div className='max-w-xs m-10'>
        <Input
          value={history}
          onChange={(event) => setHistory(event.target.value)}
          onKeyDown={(event) => {
            if (!history) return;

            if (event.key === 'Enter') {
              setEnchanceHistory((histories) => [
                ...histories,
                { description: history, index: histories.length },
              ]);
              setHistory('');
            }
          }}
        />
      </div>
    </div>
  );
};

export default Home;
