import { Descriptions, Divider } from 'antd';

interface OwnProps {
  className?: string;
}

const PrescriptionSummary = ({ className = '' }: OwnProps) => (
  <div className={className}>
    <Descriptions column={1} size="small">
      <Descriptions.Item label="ID prescription">Lol</Descriptions.Item>
      <Descriptions.Item label="Analyse demandée">Lol</Descriptions.Item>
      <Descriptions.Item label="Médecin prescripteur">Lol</Descriptions.Item>
      <Descriptions.Item label="Créée le">Lol</Descriptions.Item>
    </Descriptions>
    <Divider style={{ margin: '12px 0' }} />
    <Descriptions column={1} size="small">
      <Descriptions.Item label="Cas-index">Lol</Descriptions.Item>
      <Descriptions.Item label="Mère">Lol</Descriptions.Item>
    </Descriptions>
  </div>
);

export default PrescriptionSummary;
