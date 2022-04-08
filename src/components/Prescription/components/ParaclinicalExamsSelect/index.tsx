import { Form, Input, Radio, Select, Space } from 'antd';
import { IAnalysisFormPart } from 'components/Prescription/utils/type';
import { ReactNode, useEffect } from 'react';
import cx from 'classnames';
import { getNamePath } from 'components/Prescription/utils/form';
import LabelWithInfo from 'components/uiKit/form/LabelWithInfo';
import { isEmpty } from 'lodash';

import styles from './index.module.scss';

type OwnProps = IAnalysisFormPart & {
  initialData?: IParaclinicalExamsDataType;
};

interface IParaclinicalExam {
  title: string;
  label?: ReactNode;
  extra?: (index: number) => ReactNode;
}

const DEFAULT_EXAMS: IParaclinicalExam[] = [
  {
    title: 'Créatine kinase sérique',
    extra: (name) => (
      <Form.Item wrapperCol={{ md: 12, lg: 12, xxl: 6 }} colon={false} label={<></>}>
        <LabelWithInfo
          title="Valeur ou intervalle de valeurs en UI/L"
          colon
          size="small"
          popoverProps={{
            title: 'Bonjour',
            content: 'Aloo',
          }}
        />
        <Form.Item name={[name, 'creatine_level']}>
          <Input />
        </Form.Item>
      </Form.Item>
    ),
  },
  { title: 'EMG' },
  { title: 'IRM musculaire' },
  { title: 'Test répétitions CTG' },
  { title: 'Test répétitions GCN' },
  { title: 'Test délétions et duplication' },
  {
    title: 'Biopsie musculaire',
    extra: (name) => (
      <Form.Item wrapperCol={{ xxl: 14 }} colon={false} label={<></>}>
        <LabelWithInfo title="Spécifier tout ce qui s'applique" colon size="small" />
        <Form.Item name={[name, 'biopsie_values']}>
          <Select mode="multiple" placeholder="Sélectionner" />
        </Form.Item>
      </Form.Item>
    ),
  },
];

export enum PARACLINICAL_EXAMS_FI_KEY {
  EXAMS = 'exams',
  STATUS = 'status',
  OTHER_EXAMS = 'other_exams',
}

export enum ParaclinicalExamStatus {
  NOT_DONE = 'not_done',
  ABNORMAL = 'abnormal',
  NORMAL = 'normal',
}

export interface IClinicalSignItem {
  [PARACLINICAL_EXAMS_FI_KEY.STATUS]: string;
}

export interface IParaclinicalExamsDataType {
  [PARACLINICAL_EXAMS_FI_KEY.EXAMS]: IClinicalSignItem[];
  [PARACLINICAL_EXAMS_FI_KEY.OTHER_EXAMS]?: string;
}

const ParaclinicalExamsSelect = ({ form, parentKey, initialData }: OwnProps) => {
  const getName = (...key: (string | number)[]) => getNamePath(parentKey, key);

  useEffect(() => {
    if (initialData && !isEmpty(initialData)) {
      form.setFields(
        Object.entries(initialData).map((value) => ({
          name: getName(value[0]),
          value: value[1],
        })),
      );
    } else {
      form.setFields([
        {
          name: getName(PARACLINICAL_EXAMS_FI_KEY.EXAMS),
          value: DEFAULT_EXAMS.map((exam) => ({
            name: exam.title,
            status: ParaclinicalExamStatus.NOT_DONE,
          })),
        },
      ]);
    }
  }, []);

  return (
    <div className={styles.paraExamsSelect}>
      <Form.List name={getName(PARACLINICAL_EXAMS_FI_KEY.EXAMS)}>
        {(fields) =>
          fields.map(({ key, name, ...restField }) => {
            const exam = DEFAULT_EXAMS[name];
            const title = exam.label ?? exam.title;
            const extra = exam.extra;

            return (
              <div key={key} className={cx(styles.paraExamFormItem)}>
                <Space direction="vertical" className={styles.paraExamFormItemContent} size={0}>
                  <Form.Item
                    {...restField}
                    name={[name, PARACLINICAL_EXAMS_FI_KEY.STATUS]}
                    label={title}
                  >
                    <Radio.Group>
                      <Radio value={ParaclinicalExamStatus.NOT_DONE}>Non effectué</Radio>
                      <Radio value={ParaclinicalExamStatus.ABNORMAL}>Anormal</Radio>
                      <Radio value={ParaclinicalExamStatus.NORMAL}>Normal</Radio>
                    </Radio.Group>
                  </Form.Item>
                  {extra && (
                    <Form.Item noStyle shouldUpdate>
                      {({ getFieldValue }) =>
                        getFieldValue(
                          getName(
                            PARACLINICAL_EXAMS_FI_KEY.EXAMS,
                            name,
                            PARACLINICAL_EXAMS_FI_KEY.STATUS,
                          ),
                        ) === ParaclinicalExamStatus.ABNORMAL
                          ? extra(name)
                          : null
                      }
                    </Form.Item>
                  )}
                </Space>
              </div>
            );
          })
        }
      </Form.List>
      <Form.Item
        wrapperCol={{ xxl: 14 }}
        label="Autres examens paracliniques"
        name={getName(PARACLINICAL_EXAMS_FI_KEY.OTHER_EXAMS)}
        className={styles.otherExamsTextarea}
      >
        <Input.TextArea rows={3} />
      </Form.Item>
    </div>
  );
};

export default ParaclinicalExamsSelect;
