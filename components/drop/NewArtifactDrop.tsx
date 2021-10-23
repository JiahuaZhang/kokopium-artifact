import { Button, Form, Input, Modal, Select } from 'antd';
import React, { useState } from 'react';
import { v4 } from 'uuid';
import { ALL_ARTIFACT_DROP_FARM_TYPE, Artifact_Drop_Farm } from '../../src/state/artifact_drop';

interface Props {
  add(artifact_drop_farm: Artifact_Drop_Farm): void;
}

const options = ALL_ARTIFACT_DROP_FARM_TYPE.map((type) => ({ label: type, value: type }));

export const NewArtifactDrop = (props: Props) => {
  const { add } = props;
  const [toggleModal, setToggleModal] = useState(false);
  const [form] = Form.useForm();

  return (
    <div>
      <Button
        htmlType='submit'
        type='primary'
        className='rounded'
        onClick={() => setToggleModal(true)}>
        New Artifact Drop
      </Button>
      <Modal
        visible={toggleModal}
        title='New Artifact Drop'
        onCancel={() => setToggleModal(false)}
        onOk={() => {
          form.submit();
          setToggleModal(false);
        }}>
        <Form
          form={form}
          className='max-w-lg'
          labelCol={{ span: 8 }}
          onFinish={(e) => {
            const { description, type } = e;

            const new_artifact_drop_farm = {
              id: v4(),
              created: new Date(),
              description,
              type,
              artifacts: [],
            } as Artifact_Drop_Farm;

            add(new_artifact_drop_farm);
          }}>
          <Form.Item label='description' name='description'>
            <Input placeholder='for example, which set?' />
          </Form.Item>
          <Form.Item label='type' name='type'>
            <Select options={options} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
