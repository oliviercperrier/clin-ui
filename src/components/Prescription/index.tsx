import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Button, Col, Modal, Row, Space, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { usePrescriptionForm } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';
import StepsPanel from './StepsPanel';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import intl from 'react-intl-universal';
import { isUndefined } from 'lodash';
import { AnalysisType } from 'store/prescription/types';
import MuscularDisease from './Analyses/MuscularDisease';

import styles from './index.module.scss';

const { Title } = Typography;

const AnalysisFormMapping = {
  [AnalysisType.MUSCULAR_DISEASE]: <MuscularDisease />,
};

const PrescriptionForm = () => {
  const dispatch = useDispatch();
  const { modalVisible, analysisType, currentStep, currentFormSubmitRef } = usePrescriptionForm();

  return (
    <Modal
      className={styles.createPrescriptionModal}
      visible={modalVisible}
      title={
        <Space className={styles.modalHeader} align="center">
          <Title level={4}>Prescription d'analyse</Title>
          <Button
            className={styles.customCloseBtn}
            type="link"
            icon={<CloseOutlined />}
            danger
            size="small"
            onClick={() =>
              Modal.confirm({
                title: intl.get('prescription-form-cancel-modal-title'),
                icon: <ExclamationCircleOutlined />,
                okText: intl.get('prescription-form-cancel-modal-cancel-btn'),
                content: intl.get('prescription-form-cancel-modal-content'),
                cancelText: intl.get('prescription-form-cancel-modal-close-btn'),
                okButtonProps: { danger: true },
                onOk: (close) => {
                  close();
                  dispatch(prescriptionFormActions.cancelPrescription());
                },
              })
            }
          >
            Annuler
          </Button>
        </Space>
      }
      footer={false}
      destroyOnClose
      closable={false}
    >
      <Row gutter={[24, 24]}>
        <Col span={6}>
          <StepsPanel />
        </Col>
        <Col span={18}>
          <GridCard
            title={<Title level={3}>{currentStep?.title}</Title>}
            content={analysisType ? AnalysisFormMapping[analysisType!] : undefined}
            className={styles.prescriptionFormCard}
            bordered={false}
            footer={
              <div className={styles.prescriptionContentFooter}>
                <Space className={styles.footerLeftSide}>
                  {!isUndefined(currentStep?.previousStepIndex) && (
                    <Button
                      icon={<ArrowLeftOutlined />}
                      onClick={() => dispatch(prescriptionFormActions.previousStep())}
                    >
                      Precédent
                    </Button>
                  )}
                </Space>
                <Space className={styles.footerRightSide}>
                  {isUndefined(currentStep?.nextStepIndex) ? (
                    <Button type="primary" onClick={() => {}}>
                      Soumettre
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      onClick={() => (currentFormSubmitRef ? currentFormSubmitRef() : {})}
                    >
                      Suivant <ArrowRightOutlined />
                    </Button>
                  )}
                </Space>
              </div>
            }
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default PrescriptionForm;
