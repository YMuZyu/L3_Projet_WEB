import Dropdown from "../common/Dropdown"

export default function NotifDropdown({buttonRef}){
    return (
        <Dropdown buttonRef={buttonRef}>
            <p>Message 1</p>
            <p>Message 2</p>
            <p>Message 3</p>
        </Dropdown>
    )
}