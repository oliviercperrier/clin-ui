import { CalendarOutlined } from '@ant-design/icons';
import { MaskedInput } from 'antd-mask-input';
import { MaskedInputProps } from 'antd-mask-input/build/main/lib/MaskedInput';
import { MaskedRange } from 'imask';

const MASK = 'yyyy / mm / dd';

const MaskedDateInput = (props: Omit<MaskedInputProps, 'mask'>) => (
  <MaskedInput
    {...props}
    style={{ ...props.style, width: props.style?.width ?? 150 }}
    placeholder={MASK}
    mask={MASK}
    onChange={(e) => {
      e.unmaskedValue = e.maskedValue.replace(/\s/g, '').replaceAll('/', '-');
      props.onChange && props.onChange(e);
    }}
    maskOptions={{
      blocks: {
        yyyy: {
          mask: '0000',
          placeholderChar: 'y',
        },
        mm: {
          mask: MaskedRange,
          from: 1,
          to: 12,
          placeholderChar: 'm',
        },

        dd: {
          mask: MaskedRange,
          from: 1,
          to: 31,
          placeholderChar: 'd',
        },
      },
    }}
    suffix={<CalendarOutlined />}
  />
);

export default MaskedDateInput;
