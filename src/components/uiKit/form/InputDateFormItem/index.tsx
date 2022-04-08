import { Form, FormItemProps, InputProps, Space } from 'antd';
import MaskedDateInput from 'components/uiKit/input/MaskedDateInput';
import { isValid } from 'date-fns';

export type InputDateFormItemProps = {
  formItemProps?: Omit<FormItemProps, 'getValueFromEvent'>;
  extra?: React.ReactNode;
  onValidate?: (valid: boolean, value: Date) => void;
};

const InputDateFormItem = ({
  formItemProps,
  extra,
  onValidate,
  ...rest
}: InputDateFormItemProps) => (
  <Form.Item noStyle>
    <Space>
      <Form.Item
        {...formItemProps}
        getValueFromEvent={(e) => e.unmaskedValue}
        rules={[
          ...(formItemProps?.rules ?? []),
          () => ({
            validator(_, value) {
              if (isValid(new Date(value))) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('La date est invalide'));
            },
            validateTrigger: 'onSubmit',
          }),
        ]}
      >
        <MaskedDateInput
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

export default InputDateFormItem;
