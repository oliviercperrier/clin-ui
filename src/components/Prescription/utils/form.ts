import { FormInstance } from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import { get } from 'lodash';
import { IGetNamePathParams } from './type';

export const getNamePath = (parent: NamePath | undefined, key: IGetNamePathParams): NamePath =>
  parent ? (typeof parent === 'object' ? [...parent, ...key] : [parent, ...key]) : key;

export const resetFieldError = (form: FormInstance, namePath: NamePath) =>
  form.setFields([
    {
      name: namePath,
      errors: [],
    },
  ]);

export const setFieldError = (form: FormInstance, namePath: NamePath, error: string) =>
  form.setFields([
    {
      name: namePath,
      errors: [error],
    },
  ]);

export const setFieldValue = (form: FormInstance, namePath: NamePath, value: string | any[]) =>
  form.setFields([
    {
      name: namePath,
      errors: [],
      value: value,
    },
  ]);

export const setInitialValues = (
  form: FormInstance,
  getName: (...key: IGetNamePathParams) => NamePath,
  initialData: any,
  keyEnum: any,
) => {
  form.setFields(
    Object.entries(initialData)
      .filter((value) => isEnumHasField(keyEnum, value[0]))
      .map((value) => ({
        name: getName(value[0]),
        value: value[1],
      })),
  );
};

export const checkShouldUpdate = (previousData: any, currentData: any, paths: NamePath[]) =>
  paths.some((path) => get(previousData, path) !== get(currentData, path));

export const isEnumHasField = (keyEnum: any, key: string) => Object.values(keyEnum).includes(key);
