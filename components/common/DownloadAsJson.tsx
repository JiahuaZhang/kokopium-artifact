import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import moment from 'moment';
import React, { useRef } from 'react';

interface Props {
  filename: string;
  data: any;
  [key: string]: any;
}

export const DownloadAsJson = (props: Props) => {
  const { filename, data, ...rest } = props;
  const ref = useRef<HTMLLinkElement>(null);

  return (
    <Button
      {...rest}
      ref={ref}
      type='primary'
      href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`}
      onClick={() => {
        console.log(
          ((ref.current as any).download = `${moment().format('yyyy-MM-DD ddd')} ${filename}.json`)
        );
      }}>
      <DownloadOutlined />
    </Button>
  );
};
