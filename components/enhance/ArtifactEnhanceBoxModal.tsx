import { Modal, Rate, Form, Radio, AutoComplete, Input, Button } from 'antd';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import {
  ALL_ARTIFACT_MAIN_STAT,
  ALL_ARTIFACT_SUB_STAT,
  ALL_ARTIFACT_TYPE,
  Artifact_Enhance,
} from '../../src/state/artifact';

interface Props {
  is_visible: boolean;
  set_is_visible: Dispatch<SetStateAction<boolean>>;
  artifact: Artifact_Enhance;
  remove(artifact: Artifact_Enhance): void;
  update(artifact: Artifact_Enhance): void;
}

const mapper = (value: string) => ({ value, label: value });
const artifact_sub_stat_options = ALL_ARTIFACT_SUB_STAT.map(mapper);
const artifact_main_stat_options = ALL_ARTIFACT_MAIN_STAT.map(mapper);

export const ArtifactEnhanceBoxModal = (props: Props) => {
  const { is_visible, set_is_visible, artifact, remove, update } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    const { artifact_rarity, artifact_type, main_stat, sub_stats = [], enhance = [] } = artifact;
    form.setFieldsValue({
      artifact_rarity,
      artifact_type,
      main_stat,
      sub_stat1: sub_stats[0]?.name,
      sub_stat1_value: sub_stats[0]?.value,
      sub_stat2: sub_stats[1]?.name,
      sub_stat2_value: sub_stats[1]?.value,
      sub_stat3: sub_stats[2]?.name,
      sub_stat3_value: sub_stats[2]?.value,
      sub_stat4: sub_stats[3]?.name,
      sub_stat4_value: sub_stats[3]?.value,
      enhance_stat1: enhance[0]?.name,
      enhance_stat1_value: enhance[0]?.value,
      enhance_stat2: enhance[1]?.name,
      enhance_stat2_value: enhance[1]?.value,
      enhance_stat3: enhance[2]?.name,
      enhance_stat3_value: enhance[2]?.value,
      enhance_stat4: enhance[3]?.name,
      enhance_stat4_value: enhance[3]?.value,
    });
  }, [form, artifact]);

  return (
    <Modal
      onOk={() => {
        form.submit();
        set_is_visible(false);
      }}
      onCancel={() => set_is_visible(false)}
      visible={is_visible}>
      <Form
        labelCol={{ span: 6 }}
        form={form}
        onFinish={(values) => {
          console.log('on finish');
          console.log(values);

          const {
            artifact_rarity,
            artifact_type,
            main_stat,
            sub_stat1,
            sub_stat1_value,
            sub_stat2,
            sub_stat2_value,
            sub_stat3,
            sub_stat3_value,
            sub_stat4,
            sub_stat4_value,
            enhance_stat1,
            enhance_stat1_value,
            enhance_stat2,
            enhance_stat2_value,
            enhance_stat3,
            enhance_stat3_value,
            enhance_stat4,
            enhance_stat4_value,
          } = values;

          const new_artifact = {
            id: artifact.id,
            artifact_rarity,
            artifact_type,
            main_stat,
            sub_stats: [
              { name: sub_stat1, value: sub_stat1_value },
              { name: sub_stat2, value: sub_stat2_value },
              { name: sub_stat3, value: sub_stat3_value },
              { name: sub_stat4, value: sub_stat4_value },
            ],
            enhance: [
              { name: enhance_stat1, value: enhance_stat1_value },
              { name: enhance_stat2, value: enhance_stat2_value },
              { name: enhance_stat3, value: enhance_stat3_value },
              { name: enhance_stat4, value: enhance_stat4_value },
            ],
          } as Artifact_Enhance;
          update(new_artifact);
        }}>
        <Form.Item name='artifact_rarity' className='m-0 text-center'>
          <Rate value={artifact.artifact_rarity} />
        </Form.Item>
        <Form.Item label='type' name='artifact_type' className='m-0'>
          <Radio.Group>
            {ALL_ARTIFACT_TYPE.map((type) => (
              <Radio.Button value={type} key={type}>
                {type}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label='main stat' name='main_stat' className='my-1'>
          <AutoComplete options={artifact_main_stat_options} filterOption={true} allowClear />
        </Form.Item>
        <header className='text-center text-xl'>Original Sub Stats:</header>
        <Form.Item label='sub stat 1' name='sub_stat1' className='m-0'>
          <AutoComplete options={artifact_sub_stat_options} filterOption={true} allowClear />
        </Form.Item>
        <Form.Item label='sub stat 1 value' name='sub_stat1_value' className='m-0'>
          <Input type='number' step='0.01' />
        </Form.Item>
        <Form.Item label='sub stat 2' name='sub_stat2' className='m-0'>
          <AutoComplete options={artifact_sub_stat_options} filterOption={true} allowClear />
        </Form.Item>
        <Form.Item label='sub stat 2 value' name='sub_stat2_value' className='m-0'>
          <Input type='number' step='0.01' />
        </Form.Item>
        <Form.Item label='sub stat 3' name='sub_stat3' className='m-0'>
          <AutoComplete options={artifact_sub_stat_options} filterOption={true} allowClear />
        </Form.Item>
        <Form.Item label='sub stat 3 value' name='sub_stat3_value' className='m-0'>
          <Input type='number' step='0.01' />
        </Form.Item>
        <Form.Item label='sub stat 4' name='sub_stat4' className='m-0'>
          <AutoComplete options={artifact_sub_stat_options} filterOption={true} allowClear />
        </Form.Item>
        <Form.Item label='sub stat 4 value' name='sub_stat4_value' className='mb-2'>
          <Input type='number' step='0.01' />
        </Form.Item>
        <header className='text-center text-xl'>Enhance Sub Stats:</header>
        <Form.Item label='sub stat 1' name='enhance_stat1' className='m-0'>
          <AutoComplete options={artifact_sub_stat_options} filterOption={true} allowClear />
        </Form.Item>
        <Form.Item label='sub stat 1 value' name='enhance_stat1_value' className='m-0'>
          <Input type='number' step='0.01' />
        </Form.Item>
        <Form.Item label='sub stat 2' name='enhance_stat2' className='m-0'>
          <AutoComplete options={artifact_sub_stat_options} filterOption={true} allowClear />
        </Form.Item>
        <Form.Item label='sub stat 2 value' name='enhance_stat2_value' className='m-0'>
          <Input type='number' step='0.01' />
        </Form.Item>
        <Form.Item label='sub stat 3' name='enhance_stat3' className='m-0'>
          <AutoComplete options={artifact_sub_stat_options} filterOption={true} allowClear />
        </Form.Item>
        <Form.Item label='sub stat 3 value' name='enhance_stat3_value' className='m-0'>
          <Input type='number' step='0.01' />
        </Form.Item>
        <Form.Item label='sub stat 4' name='enhance_stat4' className='m-0'>
          <AutoComplete options={artifact_sub_stat_options} filterOption={true} allowClear />
        </Form.Item>
        <Form.Item label='sub stat 4 value' name='enhance_stat4_value' className='m-0'>
          <Input type='number' step='0.01' />
        </Form.Item>
        <Form.Item className='m-0'>
          <Button onClick={() => remove(artifact)} className='bg-red-500 text-white'>
            Delete
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
