import { NamePath } from 'antd/lib/form/interface';

export const getNamePath = (parent: NamePath | undefined, key: string): NamePath =>
  parent ? (typeof parent === 'object' ? [...parent, key] : [parent, key]) : key;
