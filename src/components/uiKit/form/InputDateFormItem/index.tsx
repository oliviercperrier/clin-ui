import { Form, FormItemProps, InputProps, Space } from 'antd';
import MaskedDateInput from 'components/uiKit/input/MaskedDateInput';
import { isValid } from 'date-fns';

export type InputDateFormItemProps = {
  formItemProps?: Omit<FormItemProps, 'getValueFromEvent'>;
  extra?: React.ReactNode;
  onValidate?: (valid: boolean, value: Date) => void;
};

const InputDateFormItem = ({ formItemProps, extra, onValidate }: InputDateFormItemProps) => (
  <Form.Item>
    <Space>
      <Form.Item
        {...formItemProps}
        getValueFromEvent={(e) => e.unmaskedValue}
        rules={[
          ...(formItemProps?.rules ?? []),
          () => ({
            validator(_, value) {
              const date = new Date(value);
              if (isValid(date)) {
                onValidate && onValidate(true, date);
                return Promise.resolve();
              }
              onValidate && onValidate(false, date);
              return Promise.reject(new Error('La date est invalide'));
            },
          }),
        ]}
      >
        <MaskedDateInput />
      </Form.Item>
      {extra}
    </Space>
  </Form.Item>
);

export default InputDateFormItem;
