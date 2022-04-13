export type TreeNode = {
  title: string;
  key: string;
  hasChildren?: boolean;
  children?: TreeNode[];
  disabled?: boolean;
  isLeaf: boolean;
};
