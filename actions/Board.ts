"use server"
import { db } from "@/lib/db";
import { fetchUser } from "@/lib/utils";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Get all boards of the workspace
export const getAllBoardsOfWorkspace = async (orgId: string) => {
    try {
        const data = await db.board.findMany({
            where: { orgId: orgId },
            orderBy: {
                createdAt: "desc"
            }
        })
        if (!data) return { success: false, message: "Boards not found" }
        return { success: true, message: 'success', data }
    } catch (error) {
        return { success: false, message: "Server error try again later!" };
    }
}
// Type for imagedata
interface imgData {
    imageId: string,
    imageThumbUrl: string,
    imageFullUrl: string,
    imageUserName: string,
    imageLinkHTML: string
}
// Create board for the workspace by-admin
export const createBoardInWorkspace = async (orgId: string, title: string, imageData: imgData, path: string) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return res
        const { user } = res
        const Org = await db.organization.findUnique({ where: { id: orgId }, select: { id: true, adminId: true } })
        if (!Org || Org.adminId !== user.id) return { success: false, message: "Unauthorized ! only admin can create boards!" }
        const boardData = await db.board.create({
            data: {
                title: title,
                orgId: Org.id,
                imageId: imageData.imageId,
                imageFullUrl: imageData.imageFullUrl,
                imageLinkHTML: imageData.imageLinkHTML,
                imageThumbUrl: imageData.imageThumbUrl,
                imageUserName: imageData.imageUserName
            }
        })
        await db.audit.create({
            data: {
                orgId,
                entityId: boardData.id,
                entityType: ENTITY_TYPE.BOARD,
                entityTitle: boardData.title,
                action: ACTION.CREATE,
                userId: user.id,
                userName: user.name,
            }
        });
        revalidatePath(path)
        return { success: true, message: `Board "${title}" created` }

    } catch (error) {
        return { success: false, message: "Server error try again later!" };
    }
}

export const getBoardPageContent = async (orgId: string, boardId: string, email: string) => {
    try {
        const user = await db.user.findUnique({where: {email}, select:{id:true}})
        const Org = await db.organization.findUnique({where: {id: orgId}, select:{adminId: true}})
        if(!user || !Org) return {success: false, message: 'not found'}
        const board = await db.board.findUnique({
            where: { id: boardId, orgId }
        });
        if (!board) return { success: false, message: 'not found' }
        const lists = await db.list.findMany({
            where: { boardId, board: { orgId } },
            include: {
                cards: {
                  orderBy: {
                    order: "asc",
                  },
                },
            },
            orderBy: { order: "asc" },
        });
        const isAdmin = user.id === Org?.adminId
        if (!lists) return { success: false, message: 'not found' }
        return {success: true, message: 'success', lists, board, isAdmin }
    } catch (error) {
        return { success: false, message: "Server error try again later!" }
    }
}

export const updateBoardTitle = async (orgId: string, boardId: string, title: string, path: string) =>{
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return {success: false, message: 'Unauthorized session expired !!'}
        const { user } = res
        const Org = await db.organization.findUnique({ where: { id: orgId }, select: { id: true, adminId: true } })
        if (!Org || Org.adminId !== user.id) return { success: false, message: "Unauthorized ! only admin can update boards!" }
       const boardData = await db.board.update({
            where: {id: boardId},
            data: {title}
        })
        await db.audit.create({
            data: {
                orgId,
                entityId: boardData.id,
                entityType: ENTITY_TYPE.BOARD,
                entityTitle: boardData.title,
                action: ACTION.UPDATE,
                userId: user.id,
                userName: user.name,
            }
        });
        revalidatePath(path)
        return {success: true, message: `Board "${title}" updated`}
    } catch (error) {
        return {success: false, message: 'Server error try again later!'}
    }
}

// Delete Board
export const deleteBoardInOrg = async (orgId: string, boardId: string) =>{
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return {success: false, message: 'Unauthorized session expired !!'}
        const { user } = res
        const Org = await db.organization.findUnique({ where: { id: orgId }, select: { id: true, adminId: true } })
        if (!Org || Org.adminId !== user.id) return { success: false, message: "Unauthorized ! only admin can delete boards!" }
       const data =  await db.board.delete({
            where: {id: boardId, orgId}
        })
        await db.audit.create({
            data: {
                orgId,
                userName: user.name,
                userId: user.id,
                action: ACTION.DELETE,
                entityId: boardId,
                entityTitle: data.title,
                entityType: ENTITY_TYPE.BOARD
            }
        })
        return {success: true, message: `Board "${data.title}" deleted !`}
    } catch (error) {
        return {success: false, message: 'Server error try again later!'}
    }
}
// Edit Board
