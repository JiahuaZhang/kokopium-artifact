import { AutoComplete, Button, Col, Form, Input, Radio, Rate, Row, Select, Space } from 'antd';
import React from 'react';
import { v4 } from 'uuid';
import {
  ALL_ARTIFACT_SUB_STAT,
  Artifact_Enhance,
  ALL_ARTIFACT_TYPE,
  ALL_ARTIFACT_MAIN_STAT,
  Artifact_Stat_Enhance,
} from '../../src/state/artifact';

interface Props {
  add(artifactEnhance: Artifact_Enhance): void;
}

const mapper = (value: string) => ({ value, label: value });

const artifact_sub_stat_options = ALL_ARTIFACT_SUB_STAT.map(mapper);
const artifact_main_stat_options = ALL_ARTIFACT_MAIN_STAT.map(mapper);

export const EnhanceArtifact = (props: Props) => {
  const { add } = props;
  const [form] = Form.useForm();

  return (
    <div>
      <Form
        form={form}
        onFinish={(e) => {
          const {
            attribute1,
            attribute2,
            attribute3,
            attribute4,
            value1,
            value2,
            value3,
            value4,
            rarity,
            type,
            mainStat,
            subStats,
          } = e;

          if (!attribute1) {
            console.warn('no attribute 1');
            return;
          }

          const new_artifact_sub_stat_enhance = [
            [attribute1, value1],
            [attribute2, value2],
            [attribute3, value3],
            [attribute4, value4],
          ]
            .filter((attributes) => attributes[0])
            .map(
              (attributes) =>
                ({
                  name: attributes[0],
                  value: attributes[1],
                } as Artifact_Stat_Enhance)
            );

          const current_artifact_sub_stat_enhance =
            subStats &&
            subStats
              .filter(Boolean)
              .map((stat: string) => ({ name: stat } as Artifact_Stat_Enhance));

          const artifact_enhance: Artifact_Enhance = {
            id: v4(),
            artifact_rarity: rarity,
            artifact_type: type,
            main_stat: mainStat,
            sub_stats: current_artifact_sub_stat_enhance,
            enhance: new_artifact_sub_stat_enhance,
          };

          add(artifact_enhance);
        }}
        className='m-auto max-w-screen-md'
        labelCol={{ span: 10 }}>
        <Row gutter={[0, 0]} className='w-full'>
          <Col span={12}>
            <header className='text-center text-2xl mb-2'>Current stat:</header>
            <Form.Item label='rarity' name='rarity' className='mb-2'>
              <Rate />
            </Form.Item>
            {/* todo: icon base radio, flower, plume, sands, goblet, circlet */}
            <Form.Item label='type' name='type'>
              <Radio.Group>
                {ALL_ARTIFACT_TYPE.map((type) => (
                  <Radio.Button value={type} key={type}>
                    {type}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
            <Form.Item label='main stat' name='mainStat'>
              <AutoComplete options={artifact_main_stat_options} filterOption={true} allowClear />
            </Form.Item>
            <Form.Item label='sub stats' name='subStats'>
              <Select options={artifact_sub_stat_options} mode='multiple' />
            </Form.Item>
            {/* todo? more detail version of current sub-stats, record existed values as well */}
            {/* todo? add submit box but keep current stats fields only */}
            <Form.Item wrapperCol={{ offset: 10 }}>
              <Button onClick={() => form.resetFields()}>Clear</Button>
            </Form.Item>
          </Col>

          <Col span={12}>
            <header className='text-center text-2xl mb-2'>Enhance stat:</header>
            <Form.Item label='attribute 1' name='attribute1' className='m-0' required>
              <AutoComplete options={artifact_sub_stat_options} filterOption={true} allowClear />
            </Form.Item>
            <Form.Item label='value 1' name='value1' className='mb-2'>
              <Input type='number' step='0.01' />
            </Form.Item>
            <Form.Item label='attribute 2' name='attribute2' className='m-0'>
              <AutoComplete options={artifact_sub_stat_options} filterOption={true} allowClear />
            </Form.Item>
            <Form.Item label='value 2' name='value2' className='mb-2'>
              <Input type='number' step='0.01' />
            </Form.Item>
            <Form.Item label='attribute 3' name='attribute3' className='m-0'>
              <AutoComplete options={artifact_sub_stat_options} filterOption={true} allowClear />
            </Form.Item>
            <Form.Item label='value 3' name='value3' className='mb-2'>
              <Input type='number' step='0.01' />
            </Form.Item>
            <Form.Item label='attribute 4' name='attribute4' className='m-0'>
              <AutoComplete options={artifact_sub_stat_options} filterOption={true} allowClear />
            </Form.Item>
            <Form.Item label='value 4' name='value4' className='m-0 mb-2'>
              <Input type='number' step='0.01' />
            </Form.Item>

            <Form.Item className='text-right'>
              <Space size='large'>
                <Button
                  onClick={() => {
                    form.submit();
                    setTimeout(() => form.resetFields());
                  }}>
                  Submit & Clear
                </Button>

                <Button htmlType='submit' type='primary'>
                  Submit
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
