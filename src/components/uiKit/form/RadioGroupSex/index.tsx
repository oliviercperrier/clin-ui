import { Radio, RadioGroupProps } from 'antd';
import { SexValue } from 'utils/commonTypes';

const RadioGroupSex = (props: RadioGroupProps) => (
  <Radio.Group {...props}>
    <Radio value={SexValue.FEMALE}>Féminin</Radio>
    <Radio value={SexValue.MALE}>Masculin</Radio>
    <Radio value={SexValue.UNKNOWN}>Indéterminé</Radio>
  </Radio.Group>
);

export default RadioGroupSex;
