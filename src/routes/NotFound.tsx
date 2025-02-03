import { Link } from "react-router";
import "./Style.css"
import img from "./notfound.svg"
import { Image } from "@mantine/core";
export default function NotFound() {
    return (
        <div className="error-container">
            <h1>404 - Page Not Found</h1>
            <Image src={img} width={200} height={150} style={{ objectFit: "contain", backgroundSize: "cover"}} />
            <p>The page you are looking for does not exist.</p>
            <Link to="/">Go to Homepage</Link>
        </div>
    )
}