"use server"

import { db } from "@/lib/db"
import { fetchUser } from "@/lib/utils"
import { ACTION, ENTITY_TYPE } from "@prisma/client"
import { revalidatePath } from "next/cache"

export const createCardInList = async (orgId: string, boardId: string, listId: string, title: string) => {
    try {
        //verifing user is in the Org or not
        const res = await fetchUser()
        if (res.success === false || !res.user) return { success: false, message: 'Unauthorized session expired !!' }
        const { user } = res
        if (!user.orgsId.includes(orgId)) return { success: false, message: "Invalid request!" }
        //Verifing board 
        const list = await db.list.findUnique({ where: { id: listId, board: { orgId } } });
        if (!list) return { success: false, message: 'list not found' }
        // checking last list for orders
        const lastCard = await db.card.findFirst({
            where: { listId: listId },
            orderBy: { order: "desc" },
            select: { order: true },
        });
        const newOrder = lastCard ? lastCard.order + 1 : 1;

        const data = await db.card.create({
            data: {
                title,
                order: newOrder,
                listId: listId
            }
        })
        await db.audit.create({
            data: {
                orgId,
                entityId: data.id,
                entityType: ENTITY_TYPE.CARD,
                entityTitle: data.title,
                action: ACTION.CREATE,
                userId: user.id,
                userName: user.name,
            }
        });
        revalidatePath(`board/${orgId}/${boardId}`)
        return { success: true, message: `Card "${title}" created!` }
    } catch (error) {
        return { success: false, message: 'server error try again !' }
    }
}
// Add or update label
export const updateCardLabel = async (label: string, labelColor: string, cardId: string, listId: string, boardId: string, orgId: string) => {
    try {
        if(!label || !labelColor) return {success: false, message: 'Invaild request'}
        const res = await fetchUser()
        if (res.success === false || !res.user) return { success: false, message: 'Unauthorized session expired !!' }
        const { user } = res
        if (!user.orgsId.includes(orgId)) return { success: false, message: "Invalid request!" }
        //Verifing board 
        const list = await db.list.findUnique({ where: { id: listId, board: { orgId } } });
        if (!list) return { success: false, message: 'list not found' }
        const cardData = await db.card.update({
            where: { id: cardId, listId },
            data: { label, labelColor }
        })
        await db.audit.create({
            data: {
                orgId,
                entityId: cardData.id,
                entityType: ENTITY_TYPE.CARD,
                entityTitle: cardData.title,
                action: ACTION.UPDATE,
                userId: user.id,
                userName: user.name,
            }
        });
        revalidatePath(`/board/${orgId}/${boardId}`)
        return { success: true, message: `Card "${cardData.title}" updated` }
    } catch (error) {
        return { success: false, message: 'server error try again !' }
    }
}
export const updateCardTitle = async (title: string, cardId: string, listId: string, boardId: string, orgId: string) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return { success: false, message: 'Unauthorized session expired !!' }
        const { user } = res
        if (!user.orgsId.includes(orgId)) return { success: false, message: "Invalid request!" }
        //Verifing list 
        const List = await db.list.findUnique({ where: { id: listId, boardId, board: { orgId } } });
        if (!List) return { success: false, message: 'list not found' }
        const cardData = await db.card.update({
            where: { id: cardId, listId },
            data: { title }
        })
        await db.audit.create({
            data: {
                orgId,
                entityId: cardData.id,
                entityType: ENTITY_TYPE.CARD,
                entityTitle: cardData.title,
                action: ACTION.UPDATE,
                userId: user.id,
                userName: user.name,
            }
        });
        revalidatePath(`/board/${orgId}/${boardId}`)
        return { success: true, message: `Card "${title}" updated` }
    } catch (error) {
        return { success: false, message: 'server error try again !' }
    }
}
export const updateCardDesc = async (Desc: string, cardId: string, listId: string, boardId: string, orgId: string,) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return { success: false, message: 'Unauthorized session expired !!' }
        const { user } = res
        if (!user.orgsId.includes(orgId)) return { success: false, message: "Invalid request!" }
        //Verifing list 
        const List = await db.list.findUnique({ where: { id: listId, boardId, board: { orgId } } });
        if (!List) return { success: false, message: 'list not found' }
        const cardData = await db.card.update({
            where: { id: cardId, listId },
            data: { description: Desc }
        })
        await db.audit.create({
            data: {
                orgId,
                entityId: cardData.id,
                entityType: ENTITY_TYPE.CARD,
                entityTitle: cardData.title,
                action: ACTION.UPDATE,
                userId: user.id,
                userName: user.name,
            }
        });
        revalidatePath(`/board/${orgId}/${boardId}`)
        return { success: true, message: `Card "${cardData.title}" updated` }
    } catch (error) {
        return { success: false, message: 'server error try again !' }
    }
}
// Delete Card
export const deleteCardFromList = async (id: string, listId: string, boardId: string, orgId: string) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return { success: false, message: 'Unauthorized session expired !!' }
        const { user } = res
        if (!user.orgsId.includes(orgId)) return { success: false, message: "Invalid request!" }
        const card = await db.card.delete({
            where: {
                id,
                listId,
                list: { board: { orgId } }
            },
        });
        if (!card) return { success: false, message: "List not found" }
        await db.audit.create({
            data: {
                orgId,
                entityId: card.id,
                entityType: ENTITY_TYPE.CARD,
                entityTitle: card.title,
                action: ACTION.DELETE,
                userId: user.id,
                userName: user.name,
            }
        })
        revalidatePath(`/board/${orgId}/${boardId}`)
        return { success: true, message: `Card "${card.title}" deleted!` }
    } catch (error) {
        return { success: false, message: `Server error try again later!` }
    }
}
// Copy Card
export const CopyCard = async (id: string, listId: string, boardId: string, orgId: string,) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return { success: false, message: 'Unauthorized session expired !!' }
        const { user } = res
        if (!user.orgsId.includes(orgId)) return { success: false, message: "Invalid request!" }

        const CardToCopy = await db.card.findUnique({
            where: { id, list: { board: { orgId } } }
        });

        if (!CardToCopy) return { success: false, message: "Card not found" }

        const lastCard = await db.card.findFirst({
            where: { listId: listId },
            orderBy: { order: "desc" },
            select: { order: true },
        });

        const newOrder = lastCard ? lastCard.order + 1 : 1;

        const newCard = await db.card.create({
            data: { listId, title: `${CardToCopy.title} - Copy`, order: newOrder, description: CardToCopy.description, label: CardToCopy.label, labelColor: CardToCopy.labelColor }
        });
        await db.audit.create({
            data: {
                orgId,
                entityId: newCard.id,
                entityType: ENTITY_TYPE.CARD,
                entityTitle: newCard.title,
                action: ACTION.CREATE,
                userId: user.id,
                userName: user.name,
            }
        })
        revalidatePath(`/board/${orgId}/${boardId}`)
        return { success: true, message: `Card "${newCard.title}" Created!` }
    } catch (error) {
        return { success: false, message: `Server error try again later!` }
    }
}
// Reorder card
interface Obj {
    order: number;
    id: string;
    title: string;
    listId: string;
    description?: string
}
export const updataCardOrder = async (orgId: string, boardId: string, items: Obj[]) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return { success: false, message: 'Unauthorized session expired !!' }
        const { user } = res
        if (!user.orgsId.includes(orgId)) return { success: false, message: "Invalid request!" }
        const transaction = items.map((card) =>
            db.card.update({
                where: {
                    id: card.id,
                    list: {
                        board: {
                            orgId,
                        },
                    },
                },
                data: {
                    order: card.order,
                    listId: card.listId,
                },
            }),
        );

        await db.$transaction(transaction);
        revalidatePath(`/board/${orgId}/${boardId}`);
        return { success: true, message: `Card "Reordered"` }

    } catch (error) {
        return { success: false, message: `Server error try again later!` }
    }
}
// Get Activity
export const getCardActivity = async (id: string, orgId: string) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return { success: false, message: 'Unauthorized session expired !!' }
        const { user } = res
        if (!user.orgsId.includes(orgId)) return { success: false, message: "Invalid request!" }

        const data = await db.audit.findMany({
            where: { orgId, entityId: id, entityType: 'CARD' }
        })
        if (!data) return { success: false, message: 'not found' }
        return { success: true, message: 'Data found', data }
    } catch (error) {
        return { success: false, message: `Server error try again later!` }
    }
}