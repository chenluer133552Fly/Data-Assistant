import { Button, Result } from "antd";
import { Link } from "react-router-dom";

function Forbidden() {
    return (
        <Result
            status="403"
            title="Access unavailable"
            subTitle="You do not have permission to access this page."
            extra={
                <Link to="/intelligence">
                    <Button type="primary">Back to Intelligence Radar</Button>
                </Link>
            }
        />
    );
}

export default Forbidden;
