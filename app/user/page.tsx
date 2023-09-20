import Table from "../components/table";
import UI from "./ui"

export default async function App() {
    const columns = [
        {
            key: "custom_id",
            label: "Id",
        },
        {
            key: "name",
            label: "Name",
        },
        {
            key: "role",
            label: "Peran",
        },
    ];
    const role = [
        { value: "student", label: "Student", },
        { value: "teacher", label: "Teacher", },
        { value: "admin", label: "Admin", },
    ]
    return (
        <UI />
    );
}
