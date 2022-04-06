import { Form, FormInstance, FormProps } from 'antd';
import { isUndefined } from 'lodash';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { usePrescriptionForm } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';

const AnalysisForm = (props: FormProps & { form: FormInstance }) => {
  const { currentStep } = usePrescriptionForm();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(prescriptionFormActions.currentFormSubmitRef(props.form.submit));
  }, []);

  return (
    <Form
      {...props}
      onFinish={(values) => {
        if (props.onFinish) {
          props.onFinish(values);
        }
        if (!isUndefined(currentStep?.nextStepIndex)) {
          dispatch(prescriptionFormActions.nextStep());
        }
      }}
    />
  );
};

export default AnalysisForm;
