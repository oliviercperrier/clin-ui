import { CloseOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { usePrescriptionForm } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';

import styles from './index.module.scss';

const PrescriptionForm = () => {
  const dispatch = useDispatch();
  const { modalVisible } = usePrescriptionForm();

  return (
    <Modal
      className={styles.createPrescriptionModal}
      visible={modalVisible}
      onCancel={() => dispatch(prescriptionFormActions.toggleModal())}
      title="Prescription d'analyse"
      footer={false}
      closeIcon={
        <Button className={styles.customCloseBtn} type="link" icon={<CloseOutlined />} danger>
          Annuler
        </Button>
      }
    >
      allo
    </Modal>
  );
};

export default PrescriptionForm;
