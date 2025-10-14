import React from "react";

function ProfileDropdown() {
    const [selected, setSelected] = useState<string>("");

    return (
        <select
            value={selected}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                setSelected(e.target.value)
        }>
            <option value="profile">Profile</option>
            <option value="">Logout</option>
        </select>
    )
}

export default ProfileDropdown;