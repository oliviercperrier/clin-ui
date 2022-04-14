import { Form, FormInstance, FormProps } from 'antd';
import { getNamePath } from 'components/Prescription/utils/form';
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
    dispatch(
      prescriptionFormActions.currentFormRefs({
        sumbit: props.form.submit,
        validateFields: props.form.validateFields,
        getFieldsValue: props.form.getFieldsValue,
      }),
    );
  }, []);

  return (
    <AnalysisFormContextProvider
      value={{
        form: props.form,
        getNamePath: (key: (string | number)[]) => getNamePath(currentStep?.id!, key),
      }}
    >
      <Form
        {...props}
        labelWrap
        validateMessages={{
          required: 'Ce champs est obligatoire',
        }}
        onFinish={(values) => {
          if (props.onFinish) {
            props.onFinish(values);
          }
        }}
      />
    </AnalysisFormContextProvider>
  );
};

export default AnalysisForm;
