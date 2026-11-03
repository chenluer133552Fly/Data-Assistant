import { Button, Result } from "antd";

function ServerError() {
  return (
    <Result
      status="500"
      title="Unable to load this page"
      subTitle="Please try again in a moment."
      extra={
        <Button type="primary" onClick={() => window.location.reload()}>
          Try again
        </Button>
      }
    />
  );
}

export default ServerError;
