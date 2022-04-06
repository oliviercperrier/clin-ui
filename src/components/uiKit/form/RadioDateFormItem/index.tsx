import { Form, FormItemProps, Radio, RadioProps, Space } from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import MaskedDateInput from 'components/uiKit/input/MaskedDateInput';
import cx from 'classnames';

import styles from './index.module.scss';

export interface IRadioDateFormItemProps {
  title: string;
  radioProps?: RadioProps;
  dateFormItemProps: FormItemProps & { name: NamePath };
  parentFormItemName: NamePath;
}

const RadioDateFormItem = ({
  title,
  radioProps,
  dateFormItemProps,
  parentFormItemName,
}: IRadioDateFormItemProps) => {
  return (
    <Form.Item noStyle>
      <div className={styles.radioBtnDateWrapper}>
        <Radio {...radioProps}>{title}</Radio>
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) =>
            getFieldValue(parentFormItemName) === radioProps?.value ? (
              <Form.Item
                {...dateFormItemProps}
                className={cx(styles.maskedDateInputFormItem, dateFormItemProps.className)}
              >
                <MaskedDateInput />
              </Form.Item>
            ) : null
          }
        </Form.Item>
      </div>
    </Form.Item>
  );
};

export default RadioDateFormItem;
