import React from "react";
import { Route } from "react-router-dom";

interface OwnProps {
  component: any;
  layout: any;
  [key: string]: any;
}

const RouteWrapper = ({
  component: Component,
  layout: Layout,
  ...rest
}: OwnProps) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <Layout {...props}>
          <Component {...props} />
        </Layout>
      )}
    />
  );
};

export default RouteWrapper;
