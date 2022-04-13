import { TreeNode } from './types';

export const isChecked = (selectedKeys: string[], eventKey: string) =>
  selectedKeys.indexOf(eventKey) !== -1;

export const getFlattenTree = (nodes: TreeNode[]) => {
  const transferDataSource: TreeNode[] = [];
  const flatten = (list: TreeNode[] = []) => {
    list.forEach((item) => {
      transferDataSource.push(item);
      flatten(item.children);
    });
  };

  if (nodes) {
    flatten(nodes);
  }
  
  return transferDataSource;
};
