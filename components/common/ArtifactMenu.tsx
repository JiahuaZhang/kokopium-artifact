import { Menu } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

interface Props {}

const selectedKeys: { [key: string]: string } = {
  '/': 'home',
  '/drop': 'drop',
  '/enhance': 'enhance',
  '/old_drop': 'old drop',
};

export const ArtifactMenu = (props: Props) => {
  const router = useRouter();

  return (
    <Menu mode='horizontal' selectedKeys={[selectedKeys[router.pathname]]}>
      <Menu.Item key='home'>
        <Link href='/'>
          <a>Home</a>
        </Link>
      </Menu.Item>
      <Menu.Item key='old_drop' className='ml-auto'>
        <Link href='old_drop'>
          <a>Old Drop</a>
        </Link>
      </Menu.Item>
      <Menu.Item key='enhance'>
        <Link href='enhance'>
          <a>Artifact Enhance</a>
        </Link>
      </Menu.Item>
      <Menu.Item key='drop'>
        <Link href='drop'>
          <a>Artifact Drop</a>
        </Link>
      </Menu.Item>
    </Menu>
  );
};
