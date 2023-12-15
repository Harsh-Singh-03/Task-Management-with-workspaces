"use client"

import { defaultImages } from "@/constant/unsplash-image";
import { unsplash } from "@/lib/unsplash";
import { cn } from "@/lib/utils";
import { Check, Loader2, RefreshCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "../ui/use-toast";
import { createBoardInWorkspace } from "@/actions/Board";
import { DialogClose } from "../ui/dialog";
import Loading from "../ui/Loading";
interface props{
    orgId: string
}
const CreateBoard = ({orgId}: props) => {

    const { pending } = useFormStatus();
    const [isLoading, setIsLoading] = useState(false);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [images, setImages] = useState<Array<Record<string, any>>>(defaultImages);
    const [selectedImage, setSelectedImage] = useState({imageId: '', imageThumbUrl: '', imageFullUrl:'', imageUserName: '', imageLinkHTML: ''});
    const [title, setTitle] = useState("")
    const pathname = usePathname()
    const {toast} = useToast()
    const ref = useRef<HTMLButtonElement | null>(null);

    const fetchImages = async () => {
        try {
            setIsLoading(true)
            const result = await unsplash.photos.getRandom({
                collectionIds: ["317099"],
                count: 9,
            });
            if (result && result.response) {
                const newImages = (result.response as Array<Record<string, any>>);
                setImages(newImages);
            } else {
                console.error("Failed to get images from Unsplash");
            }
        } catch (error) {
            console.log(error);
            setImages(defaultImages);
        } finally {
            setIsLoading(false);
        }
    };

    const createBoard = async (e: FormEvent) => {
        e.preventDefault()
        try {
            if(!selectedImage || !selectedImage.imageId || selectedImage.imageId === '') {
                toast({title: 'Please select a board image!!', variant: "destructive"})
                return
            }
            setIsFormLoading(true)
            const data = await createBoardInWorkspace(orgId, title, selectedImage, pathname)
            if(data.success){
                const buttonRef = ref.current as HTMLButtonElement | null;
                if (buttonRef) {
                    buttonRef.click();
                }
                toast({title: data.message})
            }else{
                toast({title: data.message, variant: "destructive"})
            }
        } catch (error) {
            console.log(error)
            toast({title: "Some error occured try again!", variant: "destructive"})
        }finally{
            setIsFormLoading(false)
        }
    }

    return (
        <div className="w-full">
            {!isLoading ? (
                <div className="grid grid-cols-3 gap-2 mb-2">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className={cn(
                                "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted md:min-h-[60px]",
                                pending && "opacity-50 hover:opacity-50 cursor-auto"
                            )}
                            onClick={() => {
                                if (pending) return;
                                setSelectedImage({imageId: image.id, imageFullUrl: image.urls.full, imageThumbUrl: image.urls.thumb,imageLinkHTML: image.links.html,imageUserName: image.user.name});
                            }}
                        >
                            <Image
                                src={image.urls.thumb}
                                alt="Unsplash image"
                                className="object-cover rounded-sm"
                                fill
                            />

                            {selectedImage && selectedImage.imageId === image.id && (
                                <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                                    <Check className="h-6 w-6 text-white" />
                                </div>
                            )}
                            <Link
                                href={image.links.html}
                                target="_blank"
                                className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[8px] md:text-[10px] truncate text-white hover:underline p-0.5 md:p-1 bg-black/50"
                            >
                                {image.user.name}
                            </Link>
                        </div>
                    ))}
                </div>
            ): <div className="my-6 grid place-items-center w-full"><Loading/></div>}
            <div className="grid place-items-end">
                <button className="btn3 px-2" onClick={fetchImages}>
                    <RefreshCcw className="cursor-pointer" width={20} height={20} color="#fff" />
                </button>
            </div>
            <form className={`grid w-full gap-4 ${isFormLoading && 'opacity-80'}`} onSubmit={(e) => createBoard(e)} >
                <input type="text" value={title} name="name" className='form-input font-medium' placeholder='Enter board title...' onChange={(e) => setTitle(e.target.value)} required minLength={3} disabled={isFormLoading} />
                <button type='submit' className='mt-2 w-full btn' disabled={isFormLoading || isLoading ? true : false}>{isFormLoading ? "Processing..." : 'Create Board'}</button>
            </form>
            <DialogClose asChild>
                <button className='hidden' ref={ref}>
                    Close
                </button>
            </DialogClose>
        </div>
    )
}

export default CreateBoard