import {
  Button,
  Checkbox,
  CheckboxProps,
  Form,
  FormInstance,
  FormItemProps,
  Input,
  Space,
} from 'antd';
import { SearchProps } from 'antd/lib/input';
import cx from 'classnames';

import styles from './index.module.scss';

interface OwnProps {
  form: FormInstance;
  inputFormItemProps: FormItemProps & { name: string };
  checkboxFormItemProps: Omit<
    FormItemProps & { name: string; title: string },
    'label' | 'valuePropName'
  >;
  inputProps?: SearchProps;
  checkboxProps?: CheckboxProps;
}

const SearchNoneFormItem = ({
  form,
  inputFormItemProps,
  checkboxFormItemProps,
  inputProps,
  checkboxProps,
}: OwnProps) => {
  const checkboxName = checkboxFormItemProps.name;

  return (
    <>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues[checkboxName] !== currentValues[checkboxName]
        }
      >
        {({ getFieldValue }) => {
          return !getFieldValue(checkboxName) ? (
            <Form.Item className={styles.noMargin}>
              <Space>
                <Form.Item
                  {...inputFormItemProps}
                  className={cx(styles.noMargin, inputFormItemProps.className)}
                >
                  <Input.Search
                    {...inputProps}
                    className={cx(styles.searchInput, inputProps?.className)}
                    enterButton
                  />
                </Form.Item>
                <Button size="small" type="link" className={styles.resetBtn}>
                  Réinitialisé
                </Button>
              </Space>
            </Form.Item>
          ) : null;
        }}
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues[checkboxName] !== currentValues[checkboxName]
        }
      >
        {({ getFieldValue }) => (
          <Form.Item
            {...checkboxFormItemProps}
            label={getFieldValue(checkboxName) ? inputFormItemProps.label : <></>}
            className={cx(
              getFieldValue(checkboxName) ? '' : styles.hideLabel,
              checkboxFormItemProps.className,
            )}
            valuePropName="checked"
            required={inputFormItemProps.required}
          >
            <Checkbox {...checkboxProps}>{checkboxFormItemProps.title}</Checkbox>
          </Form.Item>
        )}
      </Form.Item>
    </>
  );
};

export default SearchNoneFormItem;
