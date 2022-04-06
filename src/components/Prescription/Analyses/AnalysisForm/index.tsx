import { Form, FormInstance, FormProps } from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import { isUndefined } from 'lodash';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { usePrescriptionForm } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';
import { AnalysisFormContextProvider } from './context';

const AnalysisForm = (
  props: Omit<FormProps, 'labelWrap'> & { form: FormInstance; name: string },
) => {
  const { currentStep } = usePrescriptionForm();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(prescriptionFormActions.currentFormSubmitRef(props.form.submit));
  }, []);

  return (
    <AnalysisFormContextProvider
      value={{
        form: props.form,
        name: props.name,
        getNamePath: (key: string) => [props.name, key],
      }}
    >
      <Form
        {...props}
        labelWrap
        onFinish={(values) => {
          if (props.onFinish) {
            props.onFinish(values);
          }
          if (!isUndefined(currentStep?.nextStepIndex)) {
            dispatch(prescriptionFormActions.nextStep());
          }
        }}
      />
    </AnalysisFormContextProvider>
  );
};

export default AnalysisForm;
