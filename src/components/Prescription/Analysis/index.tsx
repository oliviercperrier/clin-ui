import { usePrescriptionForm } from 'store/prescription';
import { Form } from 'antd';
import { useDispatch } from 'react-redux';
import { prescriptionFormActions } from 'store/prescription/slice';
import { stepsMapping } from './stepMapping';

const PrescriptionAnalysis = () => {
  const dispatch = useDispatch();
  const { currentStep } = usePrescriptionForm();

  return (
    <Form.Provider
      onFormFinish={(formName, info) => {
        // Handle every form submission here
        console.log('Form name: ', formName);
        console.log('Form data: ', info.values);

        dispatch(prescriptionFormActions.saveStepData(info.values));
      }}
    >
      {/** Eventually find a way to customize specific step based on the selected analysis */}
      {stepsMapping[currentStep?.id!]}
    </Form.Provider>
  );
};

export default PrescriptionAnalysis;
