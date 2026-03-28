import { useState, useEffect } from "react";
import "./Dropdown.css"

function Dropdown({buttonRef, children}){
    const [position, setPosition] = useState({top:0, left:0})
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setPosition({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX
            })
            setTimeout(() => setShow(true), 10)
        }
    }, [buttonRef])

    if (!buttonRef.current) return null;

    return (
       <div
        className={`dropdown ${show ? "show" : ""}`}
        style={{
            top: `${position.top}px`,
            left: `${position.left}px`
        }}
       >
            <div className="dropdown-arrow" />
            <div className="dropdown-content">{children}</div>
       </div>
    )
}

export default Dropdown