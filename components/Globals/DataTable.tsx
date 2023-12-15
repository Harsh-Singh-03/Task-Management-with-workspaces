"use client";
import { Info, Loader2 } from 'lucide-react';
import React, { FormEvent, useEffect, useState } from 'react';
import { Popover, PopoverTrigger } from '../ui/popover';
import { PopoverContent } from '@radix-ui/react-popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePathname, useRouter } from 'next/navigation';
import Loading from '../ui/Loading';
import { useToast } from '../ui/use-toast';
import { removeMembersInOrg } from '@/actions/Organization';

interface Member {
    name: string;
    id: string;
    email: string;
}

interface DataTableProps {
    members: Member[];
    isAdmin: boolean;
    adminId: string;
    searchString: string;
    pageSize: string;
    pageNumber: string;
    orgId: string
}

const DataTable: React.FC<DataTableProps> = ({ members, isAdmin, adminId, searchString, pageSize, pageNumber, orgId }) => {
    const [tableData, setTableData] = useState<Member[]>(members || []);
    const [selectedRow, setSelectedRow] = useState<string[]>([]);
    const [search, setSearch] = useState(searchString)
    const [page, setPage] = useState(Number(pageNumber) ? pageNumber : '1')
    const [pagesize, setPageSize] = useState(Number(pageSize) ? pageSize : 10)
    const [isClear, setIsClear] = useState(false)
    const [isTableLoad, setIsTableLoad] = useState(false)
    const [isRemoving, setIsRemoving] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const {toast} = useToast()

    useEffect(() => {
        setTableData(members)
        setIsTableLoad(false)
        if (searchString && searchString.length > 0) {
            setIsClear(true)
        } else {
            setIsClear(false)
        }
    }, [members])


    const masterCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked === true) {
            const stringArray = tableData.map(obj =>{
                if(obj.id !== adminId){
                    return obj.id
                }else{
                    return undefined
                }
            }).filter((id): id is string => id !== undefined);
            setSelectedRow(stringArray);
        }
        if (e.target.checked === false) {
            setSelectedRow([]);
        }
    };

    const onchange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        if (e.target.checked === true) {
            setSelectedRow(prevArray => [...prevArray, id]);
            if (selectedRow.length === tableData.length - 1) {
                const checkbox = document.getElementById("default-checkbox") as HTMLInputElement;
                if (checkbox) {
                    checkbox.checked = true;
                }
            }
        }
        if (e.target.checked === false) {
            setSelectedRow(prevArray => prevArray.filter(rowId => rowId !== id));
            const checkbox = document.getElementById('default-checkbox') as HTMLInputElement;
            if (checkbox && checkbox.checked) {
                checkbox.checked = false;
            }
        }
    };

    const getPageSize = (e: string) => {
        setIsTableLoad(true)
        setPageSize(e)
        setPage('1')
        router.push(`${pathname}?search=${search}&pagesize=${e}&page=1`)
        toast({title: 'Filter applied : pagesize changes'})
    }

    const handleSubmitForSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsTableLoad(true)
        setPage('1')
        router.push(`${pathname}?search=${search}&pagesize=${pagesize}&page=1`)
        toast({title: 'Filter applied : search changes'})
    }
    const clearSearch = () => {
        setIsTableLoad(true)
        setSearch('')
        setPage('1')
        router.push(`${pathname}?pagesize=${pagesize}&page=1&search= `)
        toast({title: 'Filter applied : search cleared'})
    }
    const NextPage = () => {
        if (tableData.length === Number(pagesize)) {
            setIsTableLoad(true)
            setPage(`${Number(page) + 1}`)
            router.push(`${pathname}?pagesize=${pagesize}&page=${Number(page) + 1}&search=${search}`)
            toast({title: 'Filter applied : next page'})
        }
    }
    const PrevPage = () => {
        if (Number(page) > 1) {
            setIsTableLoad(true)
            setPage(`${Number(page) - 1}`)
            router.push(`${pathname}?pagesize=${pagesize}&page=${Number(page) - 1}&search=${search}`)
            toast({title: 'Filter applied : prev page'})
        }
    }
    const removeMembers = async() => {
        try {
            setIsRemoving(true)
            setIsTableLoad(true)
            const data = await removeMembersInOrg(orgId, selectedRow)
            if(data.success === true){
                setPage('1')
                setSelectedRow([])
                router.push(`${pathname}?page=1&pagesize=${pagesize}&search=${search}`)
                toast({title: data.message})
            }
            if(data.success === false){
                toast({title: data.message, variant:"destructive"})
            }
        } catch (error) {
            toast({title: "Some error occured try again", variant:"destructive"})
        }finally{
            setIsTableLoad(false)
            setIsRemoving(false)
        }
    }

    return (
        <div className='w-full'>

            <div className='flex flex-col gap-4 items-end md:items-center md:flex-row justify-between mb-4 md:mb-6'>

                <form className='flex items-center gap-2 w-full' onSubmit={handleSubmitForSearch} >
                    <input type="text" placeholder='Search...' value={search} onChange={(e) => setSearch(e.target.value)} className='input-2 w-full md:w-auto lg:min-w-[280px]' required />
                    <button className='btn3 px-4'>Search</button>
                    {isClear && (
                        <button className='btn2 px-4 py-2 font-medium' onClick={clearSearch}>Clear</button>
                    )}
                </form>

                <Select onValueChange={getPageSize} defaultValue={pagesize === '20' ? '20' : pagesize === '30' ? '30' : '10'}>
                    <SelectTrigger className="w-[180px] hover:bg-gray-100">
                        <SelectValue placeholder="Select pagesize" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Pagesizes</SelectLabel>
                            <SelectItem value="10" className='cursor-pointer'>10</SelectItem>
                            <SelectItem value="20" className='cursor-pointer'>20</SelectItem>
                            <SelectItem value="30" className='cursor-pointer'>30</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="relative overflow-x-auto border border-gray-200 rounded-md">
                {!isTableLoad ? (
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-black uppercase bg-green-300/10">
                            <tr>
                                {isAdmin === true && (
                                    <th scope="col" className="px-6 py-3 flex gap-4 items-center">
                                        <input id="default-checkbox" type="checkbox" value="" className="w-[18px] h-[18px] checkbox" onChange={masterCheckboxChange} />
                                        <Popover>
                                            <PopoverTrigger>
                                                <Info width={20} height={20} className='cursor-pointer' color='#808080' />
                                            </PopoverTrigger>
                                            <PopoverContent className='max-w-[250px] px-4 py-2 border border-gray-300 rounded-md z-50 bg-white'>
                                                <span className='text-gray-1 text-xs font-medium leading-5 tracking-wider'><strong>Note :</strong> It selects only current page members not entire members in workspace</span>
                                            </PopoverContent>
                                        </Popover>
                                    </th>
                                )}
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Email
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.length > 0 ? tableData.map((member, index) => {
                                return (
                                    <tr className={`min-w-max ${index !== (tableData.length - 1) && 'border-b border-b-gray-200'} ${selectedRow.includes(member.id) ? 'bg-gray-100' : "bg-gray-50 hover:bg-gray-100"}`} key={index}>
                                        {isAdmin && (
                                            <td scope="row" className="flex-1 px-6 py-4 font-medium whitespace-nowrap">
                                                <input type="checkbox" value="" checked={selectedRow.includes(member.id)} className="w-4 h-4 checkbox select-input" onChange={(e) => onchange(e, member.id)} disabled={member.id !== adminId ? false : true} />
                                            </td>
                                        )}

                                        <td className="px-6 py-4 min-w-min flex-1 whitespace-nowrap">
                                            {member.name}
                                        </td>
                                        <td className="px-6 py-4 min-w-min flex-1 whitespace-nowrap text-greenshade font-medium">
                                            {member.id === adminId ? "#Admin" : '#Member'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {member.email}
                                        </td>
                                    </tr>
                                )
                            }) : <tr className='my-4 lg:my-6 block'><td></td><td className='px-4 lg:px-6'><p className='text-gray-500 text-base font-medium text-center'>No results..</p></td><td></td></tr>}
                        </tbody>
                    </table>
                ) : (
                    <div className='w-full relative my-10 place-items-center grid'>
                        <Loading />
                    </div>
                )}
            </div>

            <div className='mt-4 mx-2 flex justify-between items-center'>
                {isAdmin === true && tableData.length > 1 ? (
                    <div className='text-gray1 text-xs md:text-sm'>
                        {selectedRow.length} {' '} / {'  '} {tableData.length} {' '} selected rows
                    </div>
                ) : <div className='text-gray1 text-xs md:text-sm'>{tableData.length} {' '} rows </div>}

                <div className='flex gap-2 items-center'>
                    <button className={`btn2 py-1.5 px-4 border font-medium ${Number(page) < 2 && 'pointer-events-none opacity-40 bg-black/10'}`} onClick={PrevPage}>Prev</button>
                    <span className='font-medium rounded-md text-sm py-1 px-2 grid place-items-center bg-gray-700 text-white' >{Number(page) ? page : 1}</span>
                    <button className={`btn2 py-1.5 px-4 border font-medium ${tableData.length < Number(pagesize) && 'pointer-events-none opacity-40 bg-black/10'}`} onClick={NextPage}>Next</button>
                </div>
            </div>

            {selectedRow.length > 0 && isAdmin === true && (
                <div className='fixed bottom-10 w-full grid place-items-center left-0'>
                    <div className='max-w-max animate-in rounded-md p-4 border border-gray-300 z-50 bg-white'>
                        <button className='btn flex justify-center items-center gap-2 py-2 px-6 bg-red-500 hover:bg-red-500/80' disabled={isTableLoad} onClick={removeMembers}>
                            {isRemoving && (
                                <Loader2 className="w-5 h-5 animate-spin text-gray-200"  />
                            )}
                            {isRemoving ? 'Removing...' : 'Remove Selected Member'}
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DataTable;
