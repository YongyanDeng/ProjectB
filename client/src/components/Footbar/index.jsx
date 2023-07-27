import "./styles.css";
import { Link } from "react-router-dom";
import { YoutubeOutlined, TwitterOutlined, FacebookOutlined } from "@ant-design/icons";

export default function Footbar() {
    const RIGHTS = "©2022 All Rights Reserved.";

    const handleIconClick = () => {
        console.log("Icons clicked");
    };

    return (
        <footer className="footbar">
            <p className="copyrights">{RIGHTS}</p>
            <div className="icons">
                <button
                    onClick={handleIconClick}
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                    <YoutubeOutlined style={{ color: "#fff", fontSize: "20px" }} />
                </button>
                <button
                    onClick={handleIconClick}
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                    <TwitterOutlined style={{ color: "#fff", fontSize: "20px" }} />
                </button>
                <button
                    onClick={handleIconClick}
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                    <FacebookOutlined style={{ color: "#fff", fontSize: "20px" }} />
                </button>
            </div>
            <div className="links">
                <Link className="links">Contact us</Link>
                <Link className="links">Privacy Polices</Link>
                <Link className="links">Helps</Link>
            </div>
        </footer>
    );
}
