import { CalendarOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { MaskedInput } from 'antd-mask-input';
import { MaskedInputProps } from 'antd-mask-input/build/main/lib/MaskedInput';
import { MaskedRange } from 'imask';

const { Text } = Typography;

const MaskedDateInput = (props: Omit<MaskedInputProps, 'mask'>) => (
  <MaskedInput
    {...props}
    style={{ ...props.style, width: props.style?.width ?? 150 }}
    placeholder="yyyy / mm / dd"
    mask={'yyyy / mm / dd'}
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
    suffix={
      <Text disabled>
        <CalendarOutlined />
      </Text>
    }
  />
);

export default MaskedDateInput;
