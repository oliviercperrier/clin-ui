import { Typography } from 'antd';
import { capitalize } from 'lodash';

const { Text } = Typography;

const titleAndCodeExtractor = (value: string, codeSubstring: string) => {
  if (!value) {
    return null;
  }
  const indexCode = value.indexOf(codeSubstring);

  return {
    title: value.substring(0, indexCode).trim(),
    code: value.substring(indexCode + codeSubstring.length, value.length - 1),
  };
};

// Format is like: Alzheimer disease (HP:0002511)
export const extractPhenotypeTitleAndCode = (phenotype: string) =>
  titleAndCodeExtractor(phenotype, '(HP:');

export const formatHpoTitleAndCode = ({
  phenotype,
  codeColorType = undefined,
  codeClassName = '',
}: {
  phenotype: string;
  codeColorType?: 'secondary' | undefined;
  codeClassName: string;
}) => {
  const phenotypeInfo = extractPhenotypeTitleAndCode(phenotype);
  return (
    <Text>
      {capitalize(phenotypeInfo?.title)}{' '}
      <Text type={codeColorType} className={codeClassName}>
        (HP:{phenotypeInfo?.code})
      </Text>
    </Text>
  );
};
