import { forwardRef } from "react";

const NotifButton = forwardRef( ({onClick}, ref) => (
    <button className="header-button" ref={ref} onClick={onClick}>
        🔔
    </button>
))

export default NotifButton