import { forwardRef } from "react";

const UserButton = forwardRef( ({onClick}, ref) => (
    <button className="header-button" ref={ref} onClick={onClick}>
        👤
    </button>
))

export default UserButton