import { FormInstance } from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import { get } from 'lodash';

export const getNamePath = (parent: NamePath | undefined, key: (string | number)[]): NamePath =>
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

export const setFieldValue = (form: FormInstance, namePath: NamePath, value: string | string[]) =>
  form.setFields([
    {
      name: namePath,
      errors: [],
      value: value,
    },
  ]);

export const checkShouldUpdate = (previousData: any, currentData: any, paths: NamePath[]) =>
  paths.some((path) => get(previousData, path) !== get(currentData, path));
