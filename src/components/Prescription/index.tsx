import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Affix, Button, Col, Modal, Row, Space, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { usePrescriptionForm } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';
import StepsPanel from './StepsPanel';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import intl from 'react-intl-universal';
import { isUndefined } from 'lodash';
import { AnalysisType } from 'store/prescription/types';
import MuscularDisease from './Analyses/MuscularDisease';
import { isMuscularAnalysis } from 'store/prescription/helper';

import styles from './index.module.scss';
import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';

const { Title } = Typography;

const getAnalysisForm = (type: AnalysisType) => {
  if (isMuscularAnalysis(type)) {
    return <MuscularDisease />;
  } else {
    return undefined; // TODO
  }
};

const PrescriptionForm = () => {
  const dispatch = useDispatch();
  const { prescriptionVisible, analysisType, currentStep, currentFormRefs } = usePrescriptionForm();

  return (
    <Modal
      className={styles.createPrescriptionModal}
      visible={prescriptionVisible}
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
                  dispatch(prescriptionFormActions.cancel());
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
      <Row gutter={[24, 24]} className={styles.modalContentRow}>
        <Col span={6} className={styles.siderCol}>
            <StepsPanel />
        </Col>
        <Col span={18} className={styles.contentCol}>
          <ScrollContent className={styles.contentScroller}>
            <GridCard
              title={<Title level={3}>{currentStep?.title}</Title>}
              content={analysisType ? getAnalysisForm(analysisType) : undefined}
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
                        onClick={() => currentFormRefs?.sumbit && currentFormRefs.sumbit()}
                      >
                        Suivant <ArrowRightOutlined />
                      </Button>
                    )}
                  </Space>
                </div>
              }
            />
          </ScrollContent>
        </Col>
      </Row>
    </Modal>
  );
};

export default PrescriptionForm;
