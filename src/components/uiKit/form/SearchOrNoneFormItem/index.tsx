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
import { NamePath } from 'antd/lib/form/interface';
import { SearchProps } from 'antd/lib/input';
import { ApiResponse } from 'api';
import cx from 'classnames';
import { get } from 'lodash';
import { useEffect, useState } from 'react';

import styles from './index.module.scss';

export interface ISearchOrNoneFormItemProps<TSearchResult> {
  form: FormInstance;
  inputFormItemProps: FormItemProps & { name: NamePath };
  checkboxFormItemProps: Omit<
    FormItemProps & { name: NamePath; title: string },
    'label' | 'valuePropName'
  >;
  inputProps?: Omit<SearchProps, 'disabled' | 'onSearch'> & {
    handlesearch?: (value: string, search: (value: string) => void) => void;
  };
  checkboxProps?: Omit<CheckboxProps, 'disabled'>;
  onReset?: () => void;
  onSearchDone: (result: TSearchResult | undefined) => void;
  apiPromise: (value: string) => Promise<ApiResponse<TSearchResult>>;
  disabled?: boolean;
}

const SearchOrNoneFormItem = <TSearchResult,>({
  form,
  inputFormItemProps,
  checkboxFormItemProps,
  inputProps,
  checkboxProps,
  onReset,
  onSearchDone,
  apiPromise,
  disabled = false,
}: ISearchOrNoneFormItemProps<TSearchResult>) => {
  const checkboxName = checkboxFormItemProps.name;
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(disabled);

  useEffect(() => {
    if (disabled !== isDisabled) {
      setIsDisabled(disabled);
    }
  }, [disabled]);

  const processSearch = (value: string) => {
    setIsLoading(true);
    apiPromise(value)
      .then(({ error, data }) => {
        onSearchDone(data);
      })
      .finally(() => {
        setIsLoading(false);
        setIsDisabled(true);
      });
  };

  return (
    <>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          get(prevValues, checkboxName) !== get(currentValues, checkboxName)
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
                    disabled={isDisabled}
                    onSearch={(value) => {
                      if (inputProps?.handlesearch) {
                        inputProps.handlesearch(value, processSearch);
                      } else {
                        processSearch(value);
                      }
                    }}
                    loading={isLoading}
                  />
                </Form.Item>
                {isDisabled && (
                  <Button
                    size="small"
                    type="link"
                    className={styles.resetBtn}
                    onClick={() => {
                      form.resetFields([inputFormItemProps.name, checkboxFormItemProps.name]);
                      setIsDisabled(false);
                      if (onReset) {
                        onReset();
                      }
                    }}
                  >
                    Réinitialisé
                  </Button>
                )}
              </Space>
            </Form.Item>
          ) : null;
        }}
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          get(prevValues, checkboxName) !== get(currentValues, checkboxName)
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
            <Checkbox {...checkboxProps} disabled={isDisabled}>
              {checkboxFormItemProps.title}
            </Checkbox>
          </Form.Item>
        )}
      </Form.Item>
    </>
  );
};

export default SearchOrNoneFormItem;
