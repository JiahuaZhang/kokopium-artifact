import { AutoComplete, Button, Col, Form, Image, Radio, Rate, Row, Select, Space } from 'antd';
import React, { CSSProperties, useState } from 'react';
import { v4 } from 'uuid';
import {
  ALL_ARTIFACT_SUB_STAT,
  ALL_ARTIFACT_SUB_STAT_TIER_INFO,
  ALL_ARTIFACT_TYPE_MAIN_STATS,
  Artifact_Enhance,
  ARTIFACT_IMAGES,
  Artifact_Stat_Enhance,
  Artifact_Sub_Stat,
  Artifact_Type,
} from '../../../src/state/artifact';

interface Props {
  add(artifactEnhance: Artifact_Enhance): void;
}

interface SelectOption {
  label: number | string;
  value: number | string;
}

const mapper = (value: string | number) => ({ value, label: value });
const sub_stat_options = ALL_ARTIFACT_SUB_STAT.map(mapper);

export const AddArtifactEnhance = (props: Props) => {
  const { add } = props;
  const [form] = Form.useForm();
  const [rarityStyle, setRarityStyle] = useState<CSSProperties>({ color: 'orange' });
  const [mainStatOptions, setMainStatOptions] = useState<SelectOption[]>([]);
  const [subStatOptions, setSubStatOptions] = useState<SelectOption[][]>([
    sub_stat_options,
    sub_stat_options,
    sub_stat_options,
    sub_stat_options,
  ]);
  const [subStatValueOptions, setSubStatValueOptions] = useState<SelectOption[][]>([
    [],
    [],
    [],
    [],
  ]);
  const [attributeOptions, setAttributeOptions] = useState<SelectOption[][]>([
    sub_stat_options,
    sub_stat_options,
    sub_stat_options,
    sub_stat_options,
  ]);
  const [attributeValueOptions, setAttributeValueOptions] = useState<SelectOption[][]>([
    [],
    [],
    [],
    [],
  ]);

  const updateForm = () => {
    const value = form.getFieldsValue() as Artifact_Enhance;
    const artifact_rarity = value.artifact_rarity || 0;
    const main_stat = value.main_stat || '';
    const sub_stats = value.sub_stats || [];
    const attributes = value.enhance || [];

    const existed_stat = new Set(
      [main_stat, ...sub_stats.map((stat) => stat.name)].filter((stat) =>
        ALL_ARTIFACT_SUB_STAT.includes(stat as Artifact_Sub_Stat)
      )
    );
    const other_stats = ALL_ARTIFACT_SUB_STAT.filter((stat) => !existed_stat.has(stat));

    const new_sub_stats = sub_stats
      .map((stat) => (stat.name ? [stat.name, ...other_stats] : other_stats))
      .map((stats) => stats.map(mapper));
    setSubStatOptions(new_sub_stats);

    const existed_sub_stats = sub_stats.map((stat) => stat.name).filter(Boolean);
    const existed_attributes = attributes.map((attribute) => attribute.name).filter(Boolean);
    const other_attributes = ALL_ARTIFACT_SUB_STAT.filter(
      (stat) =>
        stat !== main_stat &&
        !existed_attributes.includes(stat) &&
        !existed_sub_stats.includes(stat)
    );

    const new_attributes = attributes
      .map((attribute) => {
        if (existed_sub_stats.length === 4) {
          return existed_sub_stats.filter(
            (stat) => !existed_attributes.includes(stat) || attribute.name === stat
          );
        }

        if (attribute.name) {
          return [attribute.name, ...other_attributes];
        }

        if (existed_sub_stats.length + existed_attributes.length === 4) {
          return existed_sub_stats;
        }

        return other_attributes;
      })
      .map((attributes) => attributes.map(mapper));
    setAttributeOptions(new_attributes);

    if (!artifact_rarity) return;
    const new_sub_stats_value = sub_stats
      .map((stat) =>
        stat.name
          ? ALL_ARTIFACT_SUB_STAT_TIER_INFO[stat.name as Artifact_Sub_Stat][artifact_rarity]
          : []
      )
      .map((values) => values.map(mapper));
    setSubStatValueOptions(new_sub_stats_value);

    const new_attributes_value = attributes
      .map((attribute) =>
        attribute.name
          ? ALL_ARTIFACT_SUB_STAT_TIER_INFO[attribute.name as Artifact_Sub_Stat][artifact_rarity]
          : []
      )
      .map((values) => values.map(mapper));
    setAttributeValueOptions(new_attributes_value);
  };

  const reEnhance = () => {
    const value = form.getFieldsValue() as Artifact_Enhance;
    let { sub_stats = [], enhance } = value;

    enhance.forEach((e) => {
      if (e.name && e.value) {
        const index = sub_stats.findIndex((stat) => stat.name === e.name);

        if (index === -1) {
          sub_stats.push({ name: e.name, value: e.value });
        } else {
          sub_stats![index].value = (e.value || 0) + (sub_stats![index].value || 0);
        }
      }
    });

    value.sub_stats = sub_stats.filter((stat) => stat.name);
    value.enhance = enhance.map(() => ({ value: 0 } as Artifact_Stat_Enhance));

    form.setFieldsValue(value);
    updateForm();
  };

  return (
    <div className='m-auto max-w-screen-lg'>
      <Form
        labelCol={{ span: 4 }}
        form={form}
        onFinish={(value: Artifact_Enhance) => {
          value.id = v4();
          value.sub_stats = value.sub_stats?.filter((stat) => stat.name) || [];
          value.enhance = value.enhance.filter((stat) => stat.name) || [];
          value.enhance = value.enhance.map((enhance) => {
            if (!value.artifact_rarity || !enhance.value) return enhance;

            const range =
              ALL_ARTIFACT_SUB_STAT_TIER_INFO[enhance.name as Artifact_Sub_Stat][
                value.artifact_rarity
              ];
            if (enhance.value >= range[0] && enhance.value <= range[range.length - 1]) {
              return enhance;
            }

            const old_stat = value.sub_stats?.find((stat) => stat.name === enhance.name);
            if (!old_stat || !old_stat.value) return enhance;

            enhance.value = enhance.value - old_stat.value;

            return enhance;
          });
          add(value);
        }}>
        <Row gutter={[16, 0]} className='w-full'>
          <Col span={12}>
            <Form.Item label='rarity' name='artifact_rarity' className='mb-2'>
              <Rate
                style={rarityStyle}
                onChange={(value) => {
                  updateForm();
                  const colors = ['', 'gray', 'green', 'blue', 'purple', 'orange'];
                  const color = colors[value as number];
                  setRarityStyle({ color });
                }}
              />
            </Form.Item>
            <Form.Item label='type' name='artifact_type'>
              <Radio.Group
                onChange={(event) => {
                  const { value } = event.target;
                  const possibleMainOptions = ALL_ARTIFACT_TYPE_MAIN_STATS[value as Artifact_Type];
                  setMainStatOptions(possibleMainOptions.map(mapper));

                  if (possibleMainOptions.length === 1) {
                    form.setFields([{ name: 'main_stat', value: possibleMainOptions[0] }]);
                  } else {
                    const currentMainStat = form.getFieldValue('main_stat');
                    if (!possibleMainOptions.includes(currentMainStat)) {
                      form.setFields([{ name: 'main_stat', value: '' }]);
                    }
                  }

                  updateForm();
                }}>
                {ARTIFACT_IMAGES.map((art) => (
                  <Radio key={art.type} value={art.type} className='items-center'>
                    <Image alt={art.type} src={art.url} width={36} preview={false} />
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
            <Form.Item label='main stat' name='main_stat'>
              <Select showSearch options={mainStatOptions} onChange={updateForm} />
            </Form.Item>
            <Form.Item label='sub stat 1' className='m-0'>
              <Row>
                <Form.Item name={['sub_stats', 0, 'name']} className='w-2/3 mb-0'>
                  <Select
                    placeholder='attribute'
                    showSearch
                    options={subStatOptions[0]}
                    onChange={() => updateForm()}
                  />
                </Form.Item>
                <Form.Item name={['sub_stats', 0, 'value']} className='w-1/3 mb-0'>
                  <AutoComplete placeholder='value' options={subStatValueOptions[0]} />
                </Form.Item>
              </Row>
            </Form.Item>
            <Form.Item label='sub stat 2' className='m-0'>
              <Row>
                <Form.Item name={['sub_stats', 1, 'name']} className='w-2/3 mb-0'>
                  <Select
                    placeholder='attribute'
                    showSearch
                    options={subStatOptions[1]}
                    onChange={() => updateForm()}
                  />
                </Form.Item>
                <Form.Item name={['sub_stats', 1, 'value']} className='w-1/3 mb-0'>
                  <AutoComplete placeholder='value' options={subStatValueOptions[1]} />
                </Form.Item>
              </Row>
            </Form.Item>
            <Form.Item label='sub stat 3' className='m-0'>
              <Row>
                <Form.Item name={['sub_stats', 2, 'name']} className='w-2/3 mb-0'>
                  <Select
                    placeholder='attribute'
                    showSearch
                    options={subStatOptions[2]}
                    onChange={() => updateForm()}
                  />
                </Form.Item>
                <Form.Item name={['sub_stats', 2, 'value']} className='w-1/3 mb-0'>
                  <AutoComplete placeholder='value' options={subStatValueOptions[2]} />
                </Form.Item>
              </Row>
            </Form.Item>
            <Form.Item label='sub stat 4' className='m-0'>
              <Row>
                <Form.Item name={['sub_stats', 3, 'name']} className='w-2/3 mb-0'>
                  <Select
                    placeholder='attribute'
                    showSearch
                    options={subStatOptions[3]}
                    onChange={() => updateForm()}
                  />
                </Form.Item>
                <Form.Item name={['sub_stats', 3, 'value']} className='w-1/3 mb-0'>
                  <AutoComplete placeholder='value' options={subStatValueOptions[3]} />
                </Form.Item>
              </Row>
            </Form.Item>
          </Col>

          <Col span={12}>
            enhance new sub stat
            <Form.Item label='attribute 1' className='m-0'>
              <Row>
                <Form.Item name={['enhance', 0, 'name']} className='w-2/3 mb-0'>
                  <Select
                    allowClear
                    placeholder='attribute'
                    showSearch
                    options={attributeOptions[0]}
                    onChange={() => updateForm()}
                  />
                </Form.Item>
                <Form.Item name={['enhance', 0, 'value']} className='w-1/3 mb-0'>
                  <AutoComplete placeholder='value' options={attributeValueOptions[0]} />
                </Form.Item>
              </Row>
            </Form.Item>
            <Form.Item label='attribute 2' className='m-0'>
              <Row>
                <Form.Item name={['enhance', 1, 'name']} className='w-2/3 mb-0'>
                  <Select
                    allowClear
                    placeholder='attribute'
                    showSearch
                    options={attributeOptions[1]}
                    onChange={updateForm}
                  />
                </Form.Item>
                <Form.Item name={['enhance', 1, 'value']} className='w-1/3 mb-0'>
                  <AutoComplete placeholder='value' options={attributeValueOptions[1]} />
                </Form.Item>
              </Row>
            </Form.Item>
            <Form.Item label='attribute 3' className='m-0'>
              <Row>
                <Form.Item name={['enhance', 2, 'name']} className='w-2/3 mb-0'>
                  <Select
                    allowClear
                    placeholder='attribute'
                    showSearch
                    options={attributeOptions[2]}
                    onChange={updateForm}
                  />
                </Form.Item>
                <Form.Item name={['enhance', 2, 'value']} className='w-1/3 mb-0'>
                  <AutoComplete placeholder='value' options={attributeValueOptions[2]} />
                </Form.Item>
              </Row>
            </Form.Item>
            <Form.Item label='attribute 4' className='m-0'>
              <Row>
                <Form.Item name={['enhance', 3, 'name']} className='w-2/3 mb-0'>
                  <Select
                    allowClear
                    placeholder='attribute'
                    showSearch
                    options={attributeOptions[3]}
                    onChange={updateForm}
                  />
                </Form.Item>
                <Form.Item name={['enhance', 3, 'value']} className='w-1/3'>
                  <AutoComplete placeholder='value' options={attributeValueOptions[3]} />
                </Form.Item>
              </Row>
            </Form.Item>
            <Form.Item label='times' name='times'>
              <Select allowClear options={[1, 2, 3, 4, 5].map(mapper)} />
            </Form.Item>
            <Form.Item className='text-right'>
              <Space size='large'>
                <Button onClick={() => form.resetFields()}>Clear</Button>

                <Button
                  type='primary'
                  onClick={() => {
                    form.submit();
                    setTimeout(() => form.resetFields());
                  }}>
                  Submit & Clear
                </Button>

                <Button
                  type='primary'
                  onClick={() => {
                    form.submit();
                    setTimeout(reEnhance);
                  }}>
                  Submit & Reenhance
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
