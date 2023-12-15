"use server"

import { db } from "@/lib/db"
import { fetchUser } from "@/lib/utils"
import { ACTION, ENTITY_TYPE } from "@prisma/client"
import { revalidatePath } from "next/cache"

export const createListInBoard = async (orgId: string, boardId: string, title: string, path: string) => {
    try {
        //verifing user is in the Org or not
        const res = await fetchUser()
        if (res.success === false || !res.user) return { success: false, message: 'Unauthorized session expired !!' }
        const { user } = res
        if (!user.orgsId.includes(orgId)) return { success: false, message: "Invalid request!" }
        //Verifing board 
        const board = await db.board.findUnique({ where: { id: boardId, orgId } });
        if (!board) return { success: false, message: 'board not found' }
        // checking last list for orders
        const lastList = await db.list.findFirst({
            where: { boardId: boardId },
            orderBy: { order: "desc" },
            select: { order: true },
        });
        const newOrder = lastList ? lastList.order + 1 : 1;

        const data = await db.list.create({
            data: {
                title,
                order: newOrder,
                boardId: boardId
            }
        })
        await db.audit.create({
            data: {
                orgId,
                entityId: data.id,
                entityType: ENTITY_TYPE.LIST,
                entityTitle: data.title,
                action: ACTION.CREATE,
                userId: user.id,
                userName: user.name,
            }
        });
        revalidatePath(path)
        return { success: true, message: `List "${title}" created!` }
    } catch (error) {
        return { success: false, message: 'server error try again !' }
    }
}

export const updateListTitle = async (title: string, listId: string, orgId: string, boardId: string, path: string) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return { success: false, message: 'Unauthorized session expired !!' }
        const { user } = res
        if (!user.orgsId.includes(orgId)) return { success: false, message: "Invalid request!" }
        //Verifing board 
        const board = await db.board.findUnique({ where: { id: boardId, orgId } });
        if (!board) return { success: false, message: 'board not found' }
        const listData = await db.list.update({
            where: { id: listId },
            data: { title }
        })
        await db.audit.create({
            data: {
                orgId,
                entityId: listData.id,
                entityType: ENTITY_TYPE.LIST,
                entityTitle: listData.title,
                action: ACTION.UPDATE,
                userId: user.id,
                userName: user.name,
            }
        });
        revalidatePath(path)
        return { success: true, message: `Board "${title}" updated` }
    } catch (error) {
        return { success: false, message: 'server error try again !' }
    }
}

export const deleteListFromBoard = async (id: string, orgId: string, boardId: string) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return { success: false, message: 'Unauthorized session expired !!' }
        const { user } = res
        if (!user.orgsId.includes(orgId)) return { success: false, message: "Invalid request!" }
        const list = await db.list.delete({
            where: {
                id,
                boardId,
                board: {
                    orgId,
                },
            },
        });
        if (!list) return { success: false, message: "List not found" }
        await db.audit.create({
            data: {
                orgId,
                entityId: list.id,
                entityType: ENTITY_TYPE.LIST,
                entityTitle: list.title,
                action: ACTION.DELETE,
                userId: user.id,
                userName: user.name,
            }
        })
        revalidatePath(`/board/${orgId}/${boardId}`)
        return { success: true, message: `List "${list.title}" deleted!` }
    } catch (error) {
        return { success: false, message: `Server error try again later!` }
    }
}

export const CopyList = async (id: string, orgId: string, boardId: string) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return { success: false, message: 'Unauthorized session expired !!' }
        const { user } = res
        if (!user.orgsId.includes(orgId)) return { success: false, message: "Invalid request!" }

        const listToCopy = await db.list.findUnique({
            where: { id, boardId, board: { orgId } },
            include: { cards: true }
        });
        if (!listToCopy) return { success: false, message: "List not found" }

        const lastList = await db.list.findFirst({
            where: { boardId },
            orderBy: { order: "desc" },
            select: { order: true },
        });

        const newOrder = lastList ? lastList.order + 1 : 1;

        const newList = await db.list.create({
            data: { boardId: listToCopy.boardId, title: `${listToCopy.title} - Copy`, order: newOrder, }
        });
        if (listToCopy.cards && listToCopy.cards.length > 0) {
            await db.card.createMany({
                data: listToCopy.cards.map((card) => ({
                    title: card.title,
                    listId: newList.id,
                    description: card.description,
                    order: card.order,
                    label: card.label,
                    labelColor: card.labelColor
                }))
            })
        }
        await db.audit.create({
            data: {
                orgId,
                entityId: newList.id,
                entityType: ENTITY_TYPE.LIST,
                entityTitle: newList.title,
                action: ACTION.CREATE,
                userId: user.id,
                userName: user.name,
            }
        })
        revalidatePath(`/board/${orgId}/${boardId}`)
        return { success: true, message: `List "${newList.title}" Created!` }
    } catch (error) {
        return { success: false, message: `Server error try again later!` }
    }
}
interface Obj {
    order: number;
    id: string;
    title: string;
    boardId: string;
    cards: any[];
}
export const updateListOrder = async (boardId: string, orgId: string, items: Obj[]) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return { success: false, message: 'Unauthorized session expired !!' }
        const { user } = res
        if (!user.orgsId.includes(orgId)) return { success: false, message: "Invalid request!" }

        const transaction = items.map((list) =>
            db.list.update({
                where: {
                    id: list.id,
                    board: {
                        orgId,
                    },
                },
                data: {
                    order: list.order,
                },
            })
        );

        await db.$transaction(transaction);
        revalidatePath(`/board/${orgId}/${boardId}`);
        return { success: true, message: `List "Reordered" !` }
    } catch (error) {
        return { success: false, message: `Server error try again later!` }
    }
}