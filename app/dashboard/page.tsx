import DropDown from '../components/dropdown'


export default async function Page() {
    const list = await getAttendeeList()
    let hadir = 3
    const tepat_waktu = 3
    const terlambat = hadir - tepat_waktu
    return <div className="flex flex-col">
        <h1>Dashboard</h1>
        <DropDown title="peran" message="Peran" list={list} option={[
            { value: "", name: "Semua", },
            { value: "student", name: "Siswa", },
            { value: "teacher", name: "Guru", },
            { value: "admin", name: "Admin", },
        ]} />

    </div>
}
async function getAttendeeList() {
    // Call an external API endpoint to get posts.
    // You can use any data fetching library
    const getCurrentDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Note that months are zero-based
        const day = (currentDate.getDate()).toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const current_date = getCurrentDate()

    const res = await fetch(`http://localhost:3001/api/attendance/${current_date}`, {
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
    const list = await res.json()
    // By returning { props: { posts } }, the Blog component
    // will receive `posts` as a prop at build time
    return list
}