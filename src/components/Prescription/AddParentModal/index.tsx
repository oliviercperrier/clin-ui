import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { AutoComplete, Form, Modal, Select, Typography } from 'antd';
import LabelWithInfo from 'components/uiKit/form/LabelWithInfo';
import SelectItem from 'components/uiKit/select/SelectItem';
import { useDispatch } from 'react-redux';
import { usePrescriptionForm } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';
import {
  defaultFormItemsRules,
  defaultValidateMessages,
  STEPS_ID,
} from '../Analysis/AnalysisForm/ReusableSteps/constant';
import PrescriptionSummary from './PrescriptionSummary';
import { useState } from 'react';

import styles from './index.module.scss';

export enum ADD_PARENT_FI_KEY {
  PRESCRIPTION_SEARCH_TERM = 'prescription_search_term',
  PARENT_RELATION = 'parent_relation',
}

const { Text } = Typography;

const AddParentModal = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectedPrescription, setSelectedPrescription] = useState(undefined);
  const { addParentModalVisible } = usePrescriptionForm();

  const onDone = () => {
    form.resetFields();
    setSelectedPrescription(undefined);
  };

  return (
    <Modal
      title="Ajouter un parent à une prescription"
      visible={addParentModalVisible}
      onCancel={() => {
        dispatch(prescriptionFormActions.cancel());
        onDone();
      }}
      okText="Commencer"
      destroyOnClose
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        onFinish={(value) => {
          onDone();
          dispatch(
            prescriptionFormActions.completeAddParentChoice({
              selectedAnalysis: {},
              stepId: value[ADD_PARENT_FI_KEY.PARENT_RELATION],
            }),
          );
        }}
        validateMessages={defaultValidateMessages}
        layout="vertical"
      >
        <Form.Item
          label={
            <LabelWithInfo
              title={'Rechercher par identifiant de prescription ou RAMQ du cas-index'}
              colon
            />
          }
          name={ADD_PARENT_FI_KEY.PRESCRIPTION_SEARCH_TERM}
          rules={defaultFormItemsRules}
          className="noMarginBtm"
          required
        >
          <AutoComplete
            placeholder="RAMQ, SR111111"
            allowClear
            onChange={(value) => {
              if (!value) {
                setSelectedPrescription(undefined);
              }
            }}
            onClear={() => {
              setSelectedPrescription(undefined);
            }}
            onSelect={(value: any) => {
              setSelectedPrescription(value);
            }}
            options={[
              {
                label: (
                  <SelectItem
                    title={
                      <Text strong>Retard global de développement / Déficience intellectuelle</Text>
                    }
                    caption="SR769810 (2022-02-26) — ROY Léon (ROYL 1234 5678)"
                  />
                ),
                value: 'SR769810',
              },
            ]}
          />
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {() =>
            selectedPrescription ? (
              <>
                <Form.Item className="marginTop">
                  <GridCard
                    content={<PrescriptionSummary className={styles.prescriptionDescWrapper} />}
                    theme="shade"
                  />
                </Form.Item>
                <Form.Item
                  name={ADD_PARENT_FI_KEY.PARENT_RELATION}
                  label={<LabelWithInfo title="Relation du parent avec le cas-index" colon />}
                  rules={defaultFormItemsRules}
                  required
                  className="noMarginBtm"
                >
                  <Select
                    placeholder="Sélectionner"
                    options={[
                      {
                        label: 'Père',
                        value: STEPS_ID.FATHER_IDENTIFICATION,
                      },
                      {
                        label: 'Mère',
                        value: STEPS_ID.MOTHER_IDENTIFICATION,
                      },
                    ]}
                  />
                </Form.Item>
              </>
            ) : null
          }
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddParentModal;
