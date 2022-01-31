/**@jsxImportSource @emotion/react */
import { Button, Form, Image, Radio, Rate, Row, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  ALL_ARTIFACT_IMAGES,
  ALL_ARTIFACT_SUB_STAT,
  ALL_ARTIFACT_SUB_STAT_TIER_INFO,
  ALL_ARTIFACT_TYPE_MAIN_STATS,
  Artifact,
  Artifact_Type,
} from '../../src/state/artifact';
import { processArtifactState } from '../../src/state/recoil/artifact_domain';
import { AntdSelectOption, toFormSelection } from '../../src/util/form';

interface Props {
  domainId: string;
  artifactId?: string;
  onUpdateTrigger?(): void;
}

const rarityColors = [
  '',
  'text-gray-300',
  'text-green-500',
  'text-blue-700',
  'text-purple-700',
  'text-orange-300',
];

const sub_stat_options = ALL_ARTIFACT_SUB_STAT.map(toFormSelection);
const ArtifactForm = (props: Props) => {
  const { domainId, artifactId = '', onUpdateTrigger = () => {} } = props;
  const [needSmartUpdate, setNeedSmartUpdate] = useState(true);
  const artifact = useRecoilValue(processArtifactState({ domainId, artifactId, type: 'fetch' }));
  const add = useSetRecoilState(processArtifactState({ domainId, artifactId, type: 'add' }));
  const update = useSetRecoilState(processArtifactState({ domainId, artifactId, type: 'update' }));
  const [rarityClassName, setRarityClassName] = useState('text-orange-300');
  const [rarityHoverClassName, setHoverRarityClassName] = useState('');
  const [form] = Form.useForm();
  const [mainStatOptions, setMainStatOptions] = useState<AntdSelectOption[]>([]);
  const [subStatOptions, setSubStatOptions] = useState<AntdSelectOption[][][]>([
    [sub_stat_options, []],
    [sub_stat_options, []],
    [sub_stat_options, []],
    [sub_stat_options, []],
  ]);

  const updateFormOptions = () => {
    const currentArtifact = form.getFieldsValue() as Artifact;
    const { rarity, main_stat, sub_stats, type } = currentArtifact;
    const existed_sub_stats = [...sub_stats.map((sub_stat) => sub_stat.stat), main_stat].filter(
      Boolean
    );

    if (type) {
      const possibleMainOptions = ALL_ARTIFACT_TYPE_MAIN_STATS[type].filter(
        (stat) =>
          !sub_stats
            .map((s) => s.stat)
            .filter(Boolean)
            .includes(stat as any)
      );
      setMainStatOptions(possibleMainOptions.map(toFormSelection));
    }

    const newSubStatOptions = sub_stats.map((sub_stat) => {
      const available_stats = [sub_stat.stat]
        .concat(ALL_ARTIFACT_SUB_STAT.filter((stat) => !existed_sub_stats.includes(stat)))
        .filter(Boolean);

      if (rarity && sub_stat.stat) {
        const available_values = ALL_ARTIFACT_SUB_STAT_TIER_INFO[sub_stat.stat][rarity];
        return [available_stats.map(toFormSelection), available_values.map(toFormSelection)];
      }

      return [available_stats.map(toFormSelection), []];
    });

    setSubStatOptions(newSubStatOptions);
  };

  useEffect(() => {
    if (needSmartUpdate) {
      if (artifact.id) {
        form.setFieldsValue(artifact);
      } else {
        form.setFields([{ name: 'rarity', value: 5 }]);
      }
    }

    updateFormOptions();
    setNeedSmartUpdate(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needSmartUpdate]);

  return (
    <div className='m-auto max-w-lg'>
      <Form
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.metaKey) {
            form.submit();
          }
        }}
        form={form}
        labelCol={{ span: 4 }}
        onFinish={(values: Artifact) => {
          const { rarity } = values;

          if (artifact.id) {
            update({ ...artifact, ...values });
            onUpdateTrigger();
          } else {
            values.sub_stats = values.sub_stats.filter((stat) => stat.stat && stat.value);
            add(values);
            form.resetFields();
            form.setFields([{ name: 'rarity', value: rarity }]);
          }
        }}>
        <Form.Item label='rarity' className='mb-3' name='rarity'>
          <Rate
            className={rarityHoverClassName ? rarityHoverClassName : rarityClassName}
            onChange={(value) => {
              setRarityClassName(rarityColors[value]);
              updateFormOptions();
            }}
            onHoverChange={(value) =>
              value
                ? setHoverRarityClassName(`${rarityColors[value]}`)
                : setHoverRarityClassName('')
            }
          />
        </Form.Item>

        <Form.Item
          className='mb-3'
          label='type'
          name='type'
          css={{ '& label': { height: '100%' } }}>
          <Radio.Group
            onChange={(event) => {
              const { value } = event.target;
              const possibleMainOptions = ALL_ARTIFACT_TYPE_MAIN_STATS[value as Artifact_Type];

              if (possibleMainOptions.length === 1) {
                form.setFields([{ name: 'main_stat', value: possibleMainOptions[0] }]);
              } else {
                const currentMainStat = form.getFieldValue('main_stat');
                if (!possibleMainOptions.includes(currentMainStat)) {
                  form.setFields([{ name: 'main_stat', value: '' }]);
                }
              }

              updateFormOptions();
            }}>
            {ALL_ARTIFACT_IMAGES.map((val) => (
              <Radio key={val.type} value={val.type} className='items-center'>
                <Image alt={val.type} src={val.url} width={36} preview={false} />
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item label='main stat' className='mb-2' name='main_stat'>
          <Select options={mainStatOptions} onChange={updateFormOptions} showSearch />
        </Form.Item>

        {subStatOptions.map((subStatOption, index) => (
          <Form.Item className='m-0' label={`sub stat ${index + 1}`} key={index}>
            <Row>
              <Form.Item className='w-2/3 mb-1' name={['sub_stats', index, 'stat']}>
                <Select
                  allowClear
                  listHeight={400}
                  placeholder='attribute'
                  showSearch
                  options={subStatOption[0]}
                  onChange={updateFormOptions}
                />
              </Form.Item>

              <Form.Item className='w-1/3 mb-1' name={['sub_stats', index, 'value']}>
                <Select showSearch allowClear placeholder='value' options={subStatOption[1]} />
              </Form.Item>
            </Row>
          </Form.Item>
        ))}

        <Form.Item className='text-right mt-3 mb-0'>
          <Space size='large'>
            <Button onClick={() => form.resetFields()}>Clear</Button>
            <Button htmlType='submit' type='primary' className='bg-blue-600 rounded'>
              {artifactId ? 'Update' : 'Smart Create'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ArtifactForm;
