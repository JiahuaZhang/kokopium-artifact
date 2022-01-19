import { Button, Form, Input, Popover, Select } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { v4 } from 'uuid';
import { ALL_ARTIFACT_DOMAIN_TYPE, Artifact_Domain } from '../../src/state/artifact';
import { processedAllArtifactDomainsState } from '../../src/state/recoil/artifact_domain';
import { toFormSelection } from '../../src/util/form';

interface Props {}

const options = ALL_ARTIFACT_DOMAIN_TYPE.map(toFormSelection);

export const NewArtifactDomainDrop = (props: Props) => {
  const [isCreating, setIsCreating] = useState(true);
  const [form] = Form.useForm();
  const adder = useSetRecoilState(processedAllArtifactDomainsState('add'));

  return (
    <div>
      {!isCreating && (
        <Button
          htmlType='submit'
          type='primary'
          className='rounded bg-blue-500 block mx-auto mt-4'
          onClick={() => setIsCreating(true)}>
          New Artifact Domain Drop
        </Button>
      )}

      {isCreating && (
        <Form
          form={form}
          className='m-auto mt-4 max-w-2xl'
          labelCol={{ span: 3 }}
          onKeyDown={(event) => {
            if (event.metaKey && event.key === 'Enter') {
              form.submit();
            }
          }}
          onFinish={(data: Artifact_Domain) => {
            data.id = v4();
            data.created = moment().toString();
            data.artifacts = [];
            adder([data]);
            setIsCreating(false);
          }}>
          <Form.Item label='description' name='description'>
            <Input placeholder='for example, which domain?' />
          </Form.Item>

          <Form.Item label='type' name='type'>
            <Select options={options} />
          </Form.Item>

          <Form.Item className='text-right'>
            <Button className='mr-2' onClick={() => form.resetFields()}>
              Clear
            </Button>
            <Button type='primary' htmlType='submit' className='bg-blue-500'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}

      {isCreating && (
        <Popover content='Click to collapse form' className='ml-auto block'>
          <Button onClick={() => setIsCreating(false)}>^</Button>
        </Popover>
      )}
    </div>
  );
};
