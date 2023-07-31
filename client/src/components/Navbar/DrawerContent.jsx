import { useSelector } from "react-redux";
import { List } from "antd";
import { useNavigate } from "react-router-dom";

export default function DrawerContent({ features }) {
    const navigate = useNavigate();
    const { employee } = useSelector((state) => state.employee);

    const handleListItemClick = (link) => {
        navigate(link);
    };

    return (
        <List
            dataSource={features}
            renderItem={(feature) => (
                <List.Item
                    key={feature.name}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleListItemClick(feature.link)}
                >
                    <span className="anticon">{feature.icon}</span>
                    <span style={{ marginLeft: 8 }}>{feature.name}</span>
                </List.Item>
            )}
        />
    );
}
