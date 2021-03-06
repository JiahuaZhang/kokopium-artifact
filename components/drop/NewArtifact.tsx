/**@jsxImportSource @emotion/react */
import { Button, Form, Image, Radio, Rate, Row, Select, Space } from 'antd';
import { FormInstance } from 'rc-field-form';
import { CSSProperties, useState } from 'react';
import { v4 } from 'uuid';
import {
  ALL_ARTIFACT_SUB_STAT,
  ALL_ARTIFACT_SUB_STAT_TIER_INFO,
  ALL_ARTIFACT_TYPE_MAIN_STATS,
  ARTIFACT_IMAGES,
  Artifact_Rarity,
  Artifact_Sub_Stat,
  Artifact_Type,
} from '../../src/state/artifact';
import { Artifact_Drop } from '../../src/state/artifact_drop';

interface Props {
  add(artifact: Artifact_Drop): void;
  close(): void;
}

interface SelectOption {
  label: number | string;
  value: number | string;
}

const mapper = (value: string | number) => ({ value, label: value });
const sub_stat_options = ALL_ARTIFACT_SUB_STAT.map(mapper);

const getUpdateStatOptions = (form: FormInstance<any>, index: number) => {
  const main_stat = form.getFieldValue('main_stat');
  const sub_stats = (form.getFieldValue('sub_stats') || ([] as any))
    .filter(Boolean)
    .map((val: any) => val.name);
  const current_sub_stat = form.getFieldValue(['sub_stats', index, 'name']);

  const filter_stats = [main_stat, ...sub_stats].filter((stat) => stat !== current_sub_stat);

  const options = ALL_ARTIFACT_SUB_STAT.filter((stat) => !filter_stats.includes(stat));
  return options.map(mapper);
};

const getUpdateStatValueOptiosn = (form: FormInstance<any>, index: number): SelectOption[] => {
  const rarity = form.getFieldValue('artifact_rarity');
  if (!rarity || rarity < 3) return [];

  const attribute = form.getFieldValue(['sub_stats', index, 'name']);

  if (!attribute) return [];

  const options =
    ALL_ARTIFACT_SUB_STAT_TIER_INFO[attribute as Artifact_Sub_Stat][rarity as Artifact_Rarity];
  return options.map(mapper);
};

export const NewArtifact = (props: Props) => {
  const { add, close } = props;
  const [form] = Form.useForm();
  const [mainStatOptions, setMainStatOptions] = useState<SelectOption[]>([]);
  const [subStat1Options, setSubStat1Options] = useState(sub_stat_options);
  const [subStat2Options, setSubStat2Options] = useState(sub_stat_options);
  const [subStat3Options, setSubStat3Options] = useState(sub_stat_options);
  const [subStat4Options, setSubStat4Options] = useState(sub_stat_options);
  const [subStat1ValueOptions, setSubStat1ValueOptions] = useState<SelectOption[]>([]);
  const [subStat2ValueOptions, setSubStat2ValueOptions] = useState<SelectOption[]>([]);
  const [subStat3ValueOptions, setSubStat3ValueOptions] = useState<SelectOption[]>([]);
  const [subStat4ValueOptions, setSubStat4ValueOptions] = useState<SelectOption[]>([]);
  const [rarityStyle, setRarityStyle] = useState<CSSProperties>({ color: 'orange' });

  const updateAllStatOptions = (form: FormInstance<any>) => {
    [setSubStat1Options, setSubStat2Options, setSubStat3Options, setSubStat4Options].forEach(
      (fn, index) => fn(getUpdateStatOptions(form, index))
    );

    [
      setSubStat1ValueOptions,
      setSubStat2ValueOptions,
      setSubStat3ValueOptions,
      setSubStat4ValueOptions,
    ].forEach((fn, index) => fn(getUpdateStatValueOptiosn(form, index)));
  };

  return (
    <div className='mt-6'>
      <Form
        onClick={(e) => e.stopPropagation()}
        form={form}
        className='max-w-lg'
        labelCol={{ span: 6 }}
        onFinish={(values: Artifact_Drop) => {
          values.id = v4();
          values.sub_stats = values.sub_stats.filter((stat) => stat.name);
          add(values);
        }}>
        <header className='text-center font-medium text-md'>New Artifact: </header>
        <Form.Item label='rarity' name='artifact_rarity'>
          <Rate
            onChange={(value) => {
              updateAllStatOptions(form);
              const colors = ['', 'gray', 'green', 'blue', 'purple', 'orange'];
              const color = colors[value as number];
              setRarityStyle({ color });
            }}
            style={rarityStyle}
          />
        </Form.Item>

        <Form.Item label='type' name='artifact_type' css={{ '& label': { height: '100%' } }}>
          <Radio.Group
            onChange={(e) => {
              const { value } = e.target;
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

              updateAllStatOptions(form);
            }}>
            {ARTIFACT_IMAGES.map((art) => (
              <Radio key={art.type} value={art.type} className='items-center'>
                <Image alt={art.type} src={art.url} width={36} preview={false} />
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item label='main stat' name='main_stat'>
          <Select
            showSearch
            options={mainStatOptions}
            onChange={(e) => {
              updateAllStatOptions(form);
            }}
          />
        </Form.Item>

        <Form.Item label='sub stat 1' className='m-0'>
          <Row>
            <Form.Item name={['sub_stats', 0, 'name']} className='w-2/3 mb-1'>
              <Select
                listHeight={300}
                placeholder='attribute'
                showSearch
                options={subStat1Options}
                onChange={() => updateAllStatOptions(form)}
              />
            </Form.Item>
            <Form.Item name={['sub_stats', 0, 'value']} className='w-1/3 mb-1'>
              <Select placeholder='value' showSearch options={subStat1ValueOptions} />
            </Form.Item>
          </Row>
        </Form.Item>

        <Form.Item label='sub stat 2' className='m-0'>
          <Row>
            <Form.Item name={['sub_stats', 1, 'name']} className='w-2/3 mb-1'>
              <Select
                listHeight={300}
                placeholder='attribute'
                showSearch
                options={subStat2Options}
                onChange={() => updateAllStatOptions(form)}
              />
            </Form.Item>
            <Form.Item name={['sub_stats', 1, 'value']} className='w-1/3 mb-1'>
              <Select placeholder='value' showSearch options={subStat2ValueOptions} />
            </Form.Item>
          </Row>
        </Form.Item>

        <Form.Item label='sub stat 3' className='m-0'>
          <Row>
            <Form.Item name={['sub_stats', 2, 'name']} className='w-2/3 mb-1'>
              <Select
                listHeight={300}
                placeholder='attribute'
                showSearch
                options={subStat3Options}
                onChange={() => updateAllStatOptions(form)}
              />
            </Form.Item>
            <Form.Item name={['sub_stats', 2, 'value']} className='w-1/3 mb-1'>
              <Select placeholder='value' showSearch options={subStat3ValueOptions} />
            </Form.Item>
          </Row>
        </Form.Item>

        <Form.Item label='sub stat 4' className='m-0'>
          <Row>
            <Form.Item name={['sub_stats', 3, 'name']} className='w-2/3'>
              <Select
                listHeight={300}
                placeholder='attribute'
                showSearch
                options={subStat4Options}
                onChange={() => updateAllStatOptions(form)}
              />
            </Form.Item>
            <Form.Item name={['sub_stats', 3, 'value']} className='w-1/3'>
              <Select placeholder='value' showSearch options={subStat4ValueOptions} />
            </Form.Item>
          </Row>
        </Form.Item>

        <Form.Item className='text-right'>
          <Space size='large'>
            <Button className='bg-red-400 text-white rounded' onClick={(event) => close()}>
              Close
            </Button>

            <Button onClick={() => form.resetFields()}>Clear</Button>

            <Button
              type='primary'
              onClick={() => {
                form.submit();
                setTimeout(() => form.resetFields());
              }}>
              Submit & Clear
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};
