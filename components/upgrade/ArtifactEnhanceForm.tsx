/**@jsxImportSource @emotion/react */
import { AutoComplete, Button, Col, Form, Image, Radio, Rate, Row, Select, Space } from 'antd';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  ALL_ARTIFACT_IMAGES,
  ALL_ARTIFACT_SUB_STAT,
  ALL_ARTIFACT_SUB_STAT_TIER_INFO,
  ALL_ARTIFACT_TYPE_MAIN_STATS,
  Artifact_Rarity,
  Artifact_Sub_Stat,
  Artifact_Sub_Stat_Enhance,
  Artifact_Type,
  Enhanced_Artifact,
} from '../../src/state/artifact';
import { handleEnhanceArtifactState } from '../../src/state/recoil/artifact_enhance';
import { AntdSelectOption, toFormSelection } from '../../src/util/form';

type Props = {
  id?: string;
  onUpdateTrigger?(): void;
};

const rarityColors = [
  '',
  'text-gray-300',
  'text-green-500',
  'text-blue-700',
  'text-purple-700',
  'text-orange-300',
];

const sub_stat_options = ALL_ARTIFACT_SUB_STAT.map(toFormSelection);

const ArtifactEnhanceForm = (props: Props) => {
  const { id = '', onUpdateTrigger = () => {} } = props;
  const enhance_artifact = useRecoilValue(handleEnhanceArtifactState(id));
  const add = useSetRecoilState(handleEnhanceArtifactState('add'));
  const update = useSetRecoilState(handleEnhanceArtifactState('update'));
  const remove = useSetRecoilState(handleEnhanceArtifactState('delete'));
  const [rarityClassName, setRarityClassName] = useState(rarityColors[5]);
  const [rarityHoverClassName, setRarityHoverClassName] = useState('');
  const [form] = Form.useForm();
  const [mainstatOptions, setMainstatOptions] = useState<AntdSelectOption[]>([]);
  const [subStatOptions, setSubStatOptions] = useState<AntdSelectOption[][][]>([
    [sub_stat_options, []],
    [sub_stat_options, []],
    [sub_stat_options, []],
    [sub_stat_options, []],
  ]);
  const [enhanceStatOptions, setEnhanceStatOptions] = useState<AntdSelectOption[][][]>([
    [sub_stat_options, []],
    [sub_stat_options, []],
    [sub_stat_options, []],
    [sub_stat_options, []],
  ]);
  const [needInitialize, setNeedInitialize] = useState(true);

  const updateForm = () => {
    const current_form: Enhanced_Artifact = form.getFieldsValue();

    let {
      artifact: { rarity, type, sub_stats, main_stat },
      enhancements = [],
    } = current_form;

    if (rarity && type) {
      const possibleMainOptions = ALL_ARTIFACT_TYPE_MAIN_STATS[type as Artifact_Type];
      setMainstatOptions(possibleMainOptions.map(toFormSelection));

      if (possibleMainOptions.length === 1) {
        form.setFields([{ name: ['artifact', 'main_stat'], value: possibleMainOptions[0] }]);
        main_stat = possibleMainOptions[0];
      } else {
        if (!possibleMainOptions.includes(main_stat)) {
          form.setFields([{ name: ['artifact', 'main_stat'], value: '' }]);
          main_stat = '' as any;
        }
      }
    }

    const appeared_stat = new Set(
      [main_stat, ...sub_stats.map((stat) => stat.stat)].filter((stat) =>
        ALL_ARTIFACT_SUB_STAT.includes(stat as Artifact_Sub_Stat)
      )
    );
    const other_stats = ALL_ARTIFACT_SUB_STAT.filter((stat) => !appeared_stat.has(stat));
    const sub_stats_options = sub_stats.map((sub_stat) => {
      const available_stats = [sub_stat.stat, ...other_stats].filter(Boolean);

      if (rarity && sub_stat.stat) {
        const available_values = ALL_ARTIFACT_SUB_STAT_TIER_INFO[sub_stat.stat][rarity];

        return [available_stats.map(toFormSelection), available_values.map(toFormSelection)];
      }

      return [available_stats.map(toFormSelection), []];
    });
    setSubStatOptions(sub_stats_options);

    const existed_sub_stats = sub_stats.map((stat) => stat.stat).filter(Boolean);
    const existed_enhanced_sub_stats = enhancements.map((e) => e.stat).filter(Boolean);
    const other_sub_stats = ALL_ARTIFACT_SUB_STAT.filter(
      (stat) => !appeared_stat.has(stat) && !existed_enhanced_sub_stats.includes(stat)
    );
    const enhance_stats_options = enhancements.map((enhance) => {
      let enhance_options = other_sub_stats;
      if (existed_sub_stats.length === 4) {
        enhance_options = existed_sub_stats;
      } else if (existed_sub_stats.length + existed_enhanced_sub_stats.length >= 4) {
        if (enhance.stat && !existed_sub_stats.includes(enhance.stat)) {
          enhance_options = [enhance.stat, ...other_sub_stats];
        } else {
          enhance_options = existed_sub_stats;
        }
      } else if (enhance.stat) {
        enhance_options = [enhance.stat, ...other_sub_stats];
      }

      if (enhance.stat) {
        return [
          enhance_options.map(toFormSelection),
          ALL_ARTIFACT_SUB_STAT_TIER_INFO[enhance.stat as Artifact_Sub_Stat][
            rarity as Artifact_Rarity
          ].map(toFormSelection),
        ];
      }
      return [enhance_options.map(toFormSelection), []];
    });

    setEnhanceStatOptions(enhance_stats_options);
  };

  const smartAdjustEnhance = (enhanceAritfact: Enhanced_Artifact) => {
    const cloneArtifact = cloneDeep(enhanceAritfact);
    cloneArtifact.enhancements = enhanceAritfact.enhancements.map((enhance) => {
      if (!enhanceAritfact.artifact.rarity || !enhance.value) return enhance;

      const old_stat = enhanceAritfact.artifact.sub_stats?.find(
        (stat) => stat.stat === enhance.stat
      );
      if (!old_stat || !old_stat.value) return enhance;

      return { ...enhance, value: enhance.value - old_stat.value };
    });

    return cloneArtifact;
  };

  const reEnhance = () => {
    let current_form: Enhanced_Artifact = form.getFieldsValue();
    add(smartAdjustEnhance(current_form));
    current_form = cloneDeep(current_form);
    let { artifact, enhancements } = current_form;
    let { sub_stats } = artifact;

    enhancements.forEach((enhance) => {
      if (enhance.stat && enhance.value) {
        const index = sub_stats.findIndex((stat) => stat.stat === enhance.stat);

        if (index === -1) {
          sub_stats.push({
            stat: enhance.stat,
            value: enhance.value,
            times: enhance.times,
          });
        } else {
          current_form.artifact.sub_stats[index].value =
            enhance.value || sub_stats[index].value || 0;
        }
      }
    });

    sub_stats = sub_stats.filter((stat) => Boolean(stat.stat));
    current_form.enhancements = enhancements.map(
      () => ({ value: 0, times: 1 } as Artifact_Sub_Stat_Enhance)
    );

    current_form.artifact.id = '';
    form.setFieldsValue(current_form);
    updateForm();
    initDefaultTimes();
  };

  useEffect(() => {
    if (needInitialize) {
      if (enhance_artifact?.artifact?.id) {
        form.setFieldsValue(enhance_artifact);
      }
    }

    initDefaultTimes();
    updateForm();
    setNeedInitialize(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needInitialize]);

  const initDefaultTimes = () =>
    [0, 1, 2, 3].forEach((index) =>
      form.setFields([{ name: ['enhancements', index, 'times'], value: 1 }])
    );

  return (
    <div className='mt-1 m-auto max-w-screen-lg rounded border-2 border-sky-100'>
      <Form
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.metaKey) {
            form.submit();
          }
        }}
        form={form}
        labelCol={{ span: 5 }}
        onFinish={(value: Enhanced_Artifact) => {
          if (id) {
            value.artifact.id = id;
            value.artifact.sub_stats = value.artifact.sub_stats.map((stat) => ({
              ...stat,
              value: Number(stat.value),
            }));
            value.enhancements = value.enhancements.map((e) => ({ ...e, value: Number(e.value) }));
            update(value);
            onUpdateTrigger();
          } else {
            add(smartAdjustEnhance(value));
            form.resetFields();
            initDefaultTimes();
          }
        }}>
        <Row gutter={[16, 0]} className='w-full'>
          <Col span={12}>
            <Form.Item className='mb-2' label='rarity' name={['artifact', 'rarity']}>
              <Rate
                className={rarityHoverClassName ? rarityHoverClassName : rarityClassName}
                onChange={(value) => {
                  setRarityClassName(rarityColors[value]);
                  updateForm();
                }}
                onHoverChange={(value) =>
                  value
                    ? setRarityHoverClassName(`${rarityColors[value]}`)
                    : setRarityHoverClassName('')
                }
              />
            </Form.Item>

            <Form.Item
              label='type'
              name={['artifact', 'type']}
              css={{ '& label': { height: '100%' } }}>
              <Radio.Group onChange={updateForm}>
                {ALL_ARTIFACT_IMAGES.map((val) => (
                  <Radio className='items-center' key={val.type} value={val.type}>
                    <Image alt={val.type} src={val.url} width={36} preview={false} />
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>

            <Form.Item label='stat' name={['artifact', 'main_stat']}>
              <Select
                placeholder='main stat'
                options={mainstatOptions}
                onChange={updateForm}
                showSearch
              />
            </Form.Item>

            {subStatOptions.map((subStatOption, index) => (
              <Form.Item label={`stat ${index + 1}`} key={index} className='m-0'>
                <Row>
                  <Form.Item name={['artifact', 'sub_stats', index, 'stat']} className='mb-0 w-2/3'>
                    <Select
                      allowClear
                      listHeight={400}
                      placeholder='sub stat'
                      showSearch
                      options={subStatOption[0]}
                      onChange={updateForm}
                    />
                  </Form.Item>
                  <Form.Item
                    name={['artifact', 'sub_stats', index, 'value']}
                    className='mb-0 w-1/3'>
                    <AutoComplete
                      placeholder='value'
                      options={subStatOption[1]}
                      allowClear
                      filterOption={(input, option) =>
                        String(option?.value).includes(String(input))
                      }
                    />
                  </Form.Item>
                </Row>
              </Form.Item>
            ))}
          </Col>

          <Col span={12} className='mt-2'>
            {enhanceStatOptions.map((enhance_option, index) => (
              <Form.Item key={index} label={`stat ${index + 1}`} className='mb-0'>
                <Row>
                  <Form.Item name={['enhancements', index, 'stat']} className='mb-0 w-[56%]'>
                    <Select
                      allowClear
                      listHeight={400}
                      placeholder='enhance stat'
                      showSearch
                      options={enhance_option[0]}
                      onChange={updateForm}
                    />
                  </Form.Item>
                  <Form.Item name={['enhancements', index, 'value']} className='mb-0 w-[22%]'>
                    <AutoComplete
                      placeholder='value'
                      options={enhance_option[1]}
                      allowClear
                      filterOption={(input, option) =>
                        String(option?.value).includes(String(input))
                      }
                    />
                  </Form.Item>
                  <Form.Item name={['enhancements', index, 'times']} className='mb-0 w-[22%]'>
                    <Select placeholder='times' options={[1, 2, 3, 4, 5].map(toFormSelection)} />
                  </Form.Item>
                </Row>
              </Form.Item>
            ))}

            <Form.Item className='text-right mt-3'>
              <Space size='large'>
                {id && (
                  <Button
                    className='text-white bg-red-400 rounded'
                    onClick={() => {
                      remove({ artifact: { id } } as Enhanced_Artifact);
                      onUpdateTrigger();
                    }}>
                    Remove
                  </Button>
                )}

                {id && (
                  <Button
                    onClick={() => {
                      form.submit();
                    }}
                    type='primary'
                    className='rounded bg-blue-600'>
                    Update
                  </Button>
                )}

                {!id && (
                  <Button
                    onClick={() => {
                      form.resetFields();
                      initDefaultTimes();
                    }}>
                    Clear
                  </Button>
                )}

                {!id && (
                  <Button
                    className='bg-blue-600 rounded'
                    type='primary'
                    onClick={() => {
                      form.submit();
                      onUpdateTrigger();
                    }}>
                    Submit & Clear
                  </Button>
                )}

                {!id && (
                  <Button className='bg-blue-600 rounded' type='primary' onClick={reEnhance}>
                    Submit & Reenhance
                  </Button>
                )}
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ArtifactEnhanceForm;
