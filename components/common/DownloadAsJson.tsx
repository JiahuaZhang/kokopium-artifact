import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import moment from 'moment';
import React from 'react';

interface Props {
  filename: string;
  data: any;
}

export const DownloadAsJson = (props: Props) => {
  const { filename, data } = props;

  return (
    <Button
      type='primary'
      href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`}
      download={`${moment().format('yyyy-MM-DD ddd')} ${filename}.json`}>
      <DownloadOutlined />
    </Button>
  );
};
