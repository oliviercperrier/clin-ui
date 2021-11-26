import { Button } from "antd";

type PatientIdCellProps = {
  patientId: string;
};

const PatientIdCell = ({ patientId }: PatientIdCellProps) => (
  <Button
    type="link"
    onClick={() => {
      /* eslint no-restricted-globals: ["off"] */
      if (top && top.window) {
        // iframe support
        top.window.location.href = `/patient/${patientId}`;
      } else {
        window.location.href = `/patient/${patientId}`;
      }
    }}
  >
    {patientId}
  </Button>
);

export default PatientIdCell;
