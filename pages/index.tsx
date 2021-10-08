import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <ul className='w-1/3 mx-auto mt-16 text-2xl'>
      <li className='my-2'>
        <Link href='drop'>
          <a>Artifact Drop</a>
        </Link>
      </li>
      <li>
        <Link href='enhance'>
          <a>Artifact Enhance</a>
        </Link>
      </li>
    </ul>
  );
};

export default Home;
