import Empty from "@ferlab/ui/core/components/Empty";
import intl from "react-intl-universal";

const NoData = () => (
  <Empty
    imageType="grid"
    description={intl.get("no.data.available")}
  />
);

export default NoData;
