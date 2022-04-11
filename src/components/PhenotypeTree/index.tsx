import { Col, Modal, Row, Spin, Tooltip, Transfer, Tree, Button } from 'antd';
import intl from 'react-intl-universal';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { getFlattenTree, TreeNode, removeSameTerms, TTitleFormatter } from './OntologyTree';
import { PhenotypeStore } from './PhenotypeStore';
import { BranchesOutlined, UserOutlined } from '@ant-design/icons';
import { findChildrenKey, generateTree, getExpandedKeys, isChecked, searchInTree } from './helpers';
import Empty from '@ferlab/ui/core/components/Empty';
import { cloneDeep, isEmpty } from 'lodash';

import styles from './index.module.scss';

const AUTO_EXPAND_TREE = 1;
const MIN_SEARCH_TEXT_LENGTH = 3;
const FIELD_NAME = 'observed_phenotype';

type Props = {
  type: string;
  initialSelectedValue: any[];
  titleFormatter?: TTitleFormatter;
  onApply?: (selectedKeys: string[]) => void;
};

const PrenotypeTree = ({ type, titleFormatter, initialSelectedValue, onApply }: Props) => {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const phenotypeStore = useRef(new PhenotypeStore());
  const [rootNode, setRootNode] = useState<TreeNode>();
  const [treeData, setTreeData] = useState<TreeNode>();

  const getInitialExpandedKeys = (data: TreeNode[], collectedKeys: string[] = [], counter = 0) => {
    if (counter < AUTO_EXPAND_TREE) {
      data.forEach((node) => {
        counter++;
        collectedKeys.push(node.key);
        if (node.children) {
          getInitialExpandedKeys(node.children, collectedKeys, counter);
        }
      });
    }
    return collectedKeys;
  };

  const checkKeys = (
    key: string | number,
    dataSource = treeData ? [treeData] : [],
    accu: { check: string[]; halfcheck: string[] } = {
      check: [],
      halfcheck: [],
    },
  ) => {
    dataSource.forEach((o) => {
      if (o.key === key) {
        return accu.check.push(o.key);
      }

      if (accu.check.length === 0) {
        checkKeys(key, o.children, accu);

        if (accu.check.length > 0) {
          accu.halfcheck.push(o.key);
        }
      }
    });
    return accu;
  };

  const onCheckOrSelect = (
    onItemSelect: any,
    key: string,
    checkedKeys: string[],
    children: TreeNode[],
  ) => {
    const hasChildAlreadyChecked = findChildrenKey(checkedKeys, children);
    onItemSelect(key.toString(), !isChecked(checkedKeys, key.toString()));
    setTargetKeys(removeSameTerms([], hasChildAlreadyChecked ? [key] : [...checkedKeys, key]));
  };

  const handleCancel = () => {
    setVisible(false);
    setTreeData(undefined);
    setRootNode(undefined);
  };

  const handleOnApply = () => {
    onApply && onApply(targetKeys);
  };

  useEffect(() => {
    if (visible) {
      setIsLoading(true);
      phenotypeStore.current
        .fetch({
          field: FIELD_NAME,
          titleFormatter,
        })
        .then(() => {
          const rootNode = phenotypeStore.current.getRootNode()!;

          setIsLoading(false);

          if (rootNode) {
            setTreeData(rootNode);
            setRootNode(rootNode);

            const flatTree = getFlattenTree(rootNode!);

            if (initialSelectedValue) {
              const targetKeys = flatTree
                .filter(({ title }) => initialSelectedValue.includes(title))
                .map(({ key }) => key);

              setExpandedKeys(getExpandedKeys(targetKeys));
              setTargetKeys(removeSameTerms([], targetKeys));
            } else {
              setExpandedKeys(getInitialExpandedKeys([rootNode!]));
              setTargetKeys([]);
            }
          }
        });
    }

    // eslint-disable-next-line
  }, [visible]);

  return (
    <Modal
      visible={visible}
      wrapClassName={styles.hpoTreeModalWrapper}
      className={styles.hpoTreeModal}
      title={intl.get(`component.phenotypeTree.modal.title`)}
      okText={intl.get(`component.phenotypeTree.modal.okText`)}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button type="primary" style={{ marginLeft: '8px' }} onClick={() => handleOnApply()}>
          Apply
        </Button>,
      ]}
      okButtonProps={{ disabled: isEmpty(targetKeys) && isEmpty(treeData) }}
      onOk={() => handleOnApply()}
      onCancel={handleCancel}
    >
      <Transfer<TreeNode>
        className={styles.hpoTransfer}
        showSearch={!isEmpty(treeData)}
        targetKeys={targetKeys}
        selectedKeys={[]}
        oneWay
        onChange={(targetKeys, direction) => {
          if (direction === 'left') {
            setTargetKeys(targetKeys);
          }
        }}
        onSearch={(_, value) => {
          if (value && value.length > MIN_SEARCH_TEXT_LENGTH) {
            const hits: string[] = [];
            const tree = cloneDeep(treeData)!;
            searchInTree(value, tree, hits);
            setExpandedKeys(hits);
            setTreeData(tree);
          } else {
            setExpandedKeys(getInitialExpandedKeys([rootNode!]));
            setTreeData(rootNode);
          }
        }}
        locale={{
          searchPlaceholder: intl.get(`component.phenotypeTree.searchPlaceholder`),
          notFoundContent: (
            <Empty
              imageType="grid"
              description={intl.get(`component.phenotypeTree.emptySelection`)}
            />
          ),
        }}
        filterOption={(inputValue, item) => item.title.indexOf(inputValue) !== -1}
        onSelectChange={(s, t) => {
          setTargetKeys(
            removeSameTerms(
              [],
              targetKeys.filter((el) => {
                return !t.includes(el);
              }),
            ),
          );
        }}
        dataSource={treeData ? getFlattenTree(treeData) : []}
        render={(item) =>
          (titleFormatter ? titleFormatter(item.title) : item.title) as ReactElement
        }
        showSelectAll={false}
        operationStyle={{ visibility: 'hidden', width: '5px' }}
      >
        {({ direction, onItemSelect, selectedKeys }) => {
          if (direction === 'left') {
            const checkedKeys = [...removeSameTerms(selectedKeys, targetKeys)];
            const halfCheckedKeys = checkedKeys
              .map((k) => checkKeys(k))
              .flatMap((k) => k.halfcheck);
            return (
              <Spin spinning={isLoading}>
                {isEmpty(treeData) ? (
                  <Empty imageType="grid" />
                ) : (
                  <>
                    <Row justify="space-between" className={styles.phenotypeTreeHeader}>
                      <Col></Col>
                      <Col>
                        <Row style={{ width: 100 }}>
                          <Col span={12} className={styles.phenotypeTreeCountTag}>
                            <Tooltip title={intl.get(`component.phenotypeTree.tags.exact`)}>
                              <UserOutlined />
                            </Tooltip>
                          </Col>
                          <Col span={12} className={styles.phenotypeTreeCountTag}>
                            <Tooltip title={intl.get(`component.phenotypeTree.tags.all`)}>
                              <BranchesOutlined />
                            </Tooltip>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Tree
                      checkable
                      checkStrictly
                      height={600}
                      expandedKeys={expandedKeys}
                      onExpand={(keys) => setExpandedKeys(keys as string[])}
                      checkedKeys={{
                        checked: checkedKeys,
                        halfChecked: halfCheckedKeys,
                      }}
                      titleRender={(node) => node.name}
                      treeData={treeData ? generateTree([treeData], checkedKeys) : []}
                      onCheck={(_, { node: { key, children } }) =>
                        onCheckOrSelect(
                          onItemSelect,
                          key as string,
                          checkedKeys,
                          children as TreeNode[],
                        )
                      }
                      onSelect={(_, { node: { key, children } }) =>
                        onCheckOrSelect(
                          onItemSelect,
                          key as string,
                          checkedKeys,
                          children as TreeNode[],
                        )
                      }
                    />
                  </>
                )}
              </Spin>
            );
          }
        }}
      </Transfer>
    </Modal>
  );
};

export default PrenotypeTree;
