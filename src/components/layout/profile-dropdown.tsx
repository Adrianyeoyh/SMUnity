import React from "react";

export default function ProfileDropdown(props) {
    const [selected, setSelected] = useState("");

    return (
        <select
            value="{selected}"
            onChange={(e) => 
                setSelected(e.target.value)
        }>
            <option value="profile">Profile</option>
            <option value="">Logout</option>
        </select>
    )
}