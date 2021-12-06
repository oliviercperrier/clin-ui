import { redirectParent } from 'utils/bridge';

type PatientIdCellProps = {
  patientId: string;
};

const PatientIdCell = ({ patientId }: PatientIdCellProps) => (
  <a
    onClick={() => {
      redirectParent(`/patient/${patientId}`);
    }}
  >
    {patientId}
  </a>
);

export default PatientIdCell;
