import { Button, Form, Input, Modal, Select } from 'antd';
import React, { useEffect } from 'react';
import { ALL_ARTIFACT_DROP_FARM_TYPE, Artifact_Drop_Farm } from '../../src/state/artifact_drop';

interface Props {
  artifact_drop_farm: Artifact_Drop_Farm;
  update(artifact_drop_farm: Artifact_Drop_Farm): void;
  remove(artifact_drop_farm: Artifact_Drop_Farm): void;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const options = ALL_ARTIFACT_DROP_FARM_TYPE.map((type) => ({ label: type, value: type }));

export const UpdateArtifactDrop = (props: Props) => {
  const { artifact_drop_farm, update, isVisible, setIsVisible, remove } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(artifact_drop_farm);
  }, [artifact_drop_farm, form]);

  return (
    <Modal
      visible={isVisible}
      title='New Artifact Drop'
      onCancel={() => setIsVisible(false)}
      onOk={() => {
        form.submit();
        setIsVisible(false);
      }}>
      <Form
        form={form}
        className='max-w-lg'
        labelCol={{ span: 8 }}
        onFinish={(e) => {
          const { description, use_condensed } = e;

          const new_artifact_drop_farm = { ...artifact_drop_farm, description, use_condensed };

          update(new_artifact_drop_farm);
        }}>
        <Form.Item label='description' name='description'>
          <Input placeholder='for example, which set?' />
        </Form.Item>
        <Form.Item label='type' name='type'>
          <Select options={options} />
        </Form.Item>

        <Form.Item className='m-0 text-right'>
          <Button onClick={() => remove(artifact_drop_farm)} className='bg-red-500 text-white'>
            Delete
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
