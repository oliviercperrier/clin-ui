import { Form, FormItemProps, Space } from 'antd';
import { Rule } from 'antd/lib/form';
import MaskedDateInput from 'components/uiKit/input/MaskedDateInput';
import { isValid } from 'date-fns';

import styles from './index.module.scss';

export type InputDateFormItemProps = {
  formItemProps?: Omit<FormItemProps, 'getValueFromEvent' | 'rules'>;
  extra?: React.ReactNode;
  onValidate?: (valid: boolean, value: Date) => void;
};

const InputDateFormItem = ({
  formItemProps,
  extra,
  onValidate,
  ...rest
}: InputDateFormItemProps) => {
  return (
    <Form.Item noStyle>
      <Space>
        <Form.Item
          {...formItemProps}
          getValueFromEvent={(e) => e.unmaskedValue}
          rules={[
            {
              required: formItemProps?.required,
              validator(_, value) {
                if (isValid(new Date(value))) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('La date est invalide'));
              },
              validateTrigger: 'onSubmit',
            },
          ]}
        >
          <MaskedDateInput
            className={styles.maskedInputDate}
            onChange={(e) => {
              if (onValidate) {
                const date = new Date(e.unmaskedValue);
                onValidate(isValid(date), date);
              }
            }}
          />
        </Form.Item>
        <div>{extra}</div>
      </Space>
    </Form.Item>
  );
};

export default InputDateFormItem;
