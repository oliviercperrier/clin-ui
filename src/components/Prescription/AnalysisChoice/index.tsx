import { Form, Modal, Select, Typography } from 'antd';
import LabelWithInfo from 'components/uiKit/form/LabelWithInfo';
import { useDispatch } from 'react-redux';
import { usePrescriptionForm } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';

const { Text, Link } = Typography;

const AnalysisChoice = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { analysisChoiceVisible } = usePrescriptionForm();

  return (
    <Modal
      title="Choix de l'analyse"
      visible={analysisChoiceVisible}
      onCancel={() => dispatch(prescriptionFormActions.cancel())}
      okText="Commencer"
      destroyOnClose
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={
            <LabelWithInfo
              title="Sélectionner la condition et le panel de gènes à analyser"
              popoverProps={{
                  visible: true,
                title: "Choix de l'analyse",
                content: (
                  <Text>
                    Veuillez <Link>consulter la documentation</Link> pour obtenir la définition de
                    chaque analyse.
                  </Text>
                ),
              }}
            />
          }
          required
        >
          <Select placeholder="Sélectionner">
            <Select.Option>
              Retard global de développement / Déficience intellectuelle (trio)
            </Select.Option>
            <Select.Option>Mitochondriopathie nucléaire</Select.Option>
            <Select.OptGroup label="Maladie musculaire">
              <Select.Option>Maladies musculaires (panel global)</Select.Option>
              <Select.Option>Dystrophies musculaires</Select.Option>
              <Select.Option>Hyperthermie maligne</Select.Option>
              <Select.Option>Myasthénies congénitales</Select.Option>
              <Select.Option>Myopathies congénitales</Select.Option>
              <Select.Option>Rhabomyolyse</Select.Option>
            </Select.OptGroup>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AnalysisChoice;
