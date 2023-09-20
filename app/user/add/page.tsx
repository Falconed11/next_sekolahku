import { Input } from '@nextui-org/react'
import AddUser from "../../components/user/adduser"

export default async function Page() {
    const list = await fetch('http://localhost:3001/api/role').then(res => res.json())

    return <AddUser role={list} />
}