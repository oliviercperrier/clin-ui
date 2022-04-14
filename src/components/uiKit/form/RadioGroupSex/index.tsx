import { Radio, RadioGroupProps } from 'antd';
import { SexValue } from 'utils/commonTypes';
import intl from 'react-intl-universal';

const RadioGroupSex = (props: RadioGroupProps) => (
  <Radio.Group {...props}>
    <Radio value={SexValue.FEMALE}>{intl.get('sex.female')}</Radio>
    <Radio value={SexValue.MALE}>{intl.get('sex.male')}</Radio>
    <Radio value={SexValue.UNKNOWN}>{intl.get('undetermined')}</Radio>
  </Radio.Group>
);

export default RadioGroupSex;
