import { Form, FormProps } from 'antd';
import { isUndefined } from 'lodash';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { usePrescriptionForm } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';

const AnalysisForm = (props: Omit<FormProps, 'form'>) => {
  const [form] = Form.useForm();
  const { currentStep } = usePrescriptionForm();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(prescriptionFormActions.currentFormSubmitRef(form.submit));
  }, []);

  return (
    <Form
      {...props}
      form={form}
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
