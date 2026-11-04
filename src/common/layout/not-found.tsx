import { Button, Result } from "antd";
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <Result
            status="404"
            title="Page not found"
            subTitle="The page you are looking for is not available."
            extra={
                <Link to="/intelligence">
                    <Button type="primary">Back to Intelligence Radar</Button>
                </Link>
            }
        />
    );
}

export default NotFound;
