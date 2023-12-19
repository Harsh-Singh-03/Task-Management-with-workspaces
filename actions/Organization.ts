"use server"

import { db } from "@/lib/db"
import { fetchUser } from "@/lib/utils"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

// Create Org by admin
export const CreateOrg = async (name: string, path: string) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return res
        const { user } = res
        const data = await db.organization.create({
            data: {
                name: name,
                adminId: user.id,
                membersId: [user.id]
            }
        })
        user.orgsId.push(data.id)
        await db.user.update({
            where: { email: user.email },
            data: {
                orgsId: user.orgsId
            }
        });
        revalidatePath(path)
        return { success: true, message: "Workspace Created Successfully" }
    } catch (error: any) {
        console.log(error.message)
        return { success: false, message: "An error occurred while creating the workspace." };
    }
}
// Get All organization
export const getOrgs = async () => {
    try {
        const res = await getServerSession()
        if (!res || !res.user || !res.user.email) return { success: false, message: 'Session expires!' }
        const data = await db.user.findUnique({
            where: { email: res.user.email },
            select: {
                Organization: {
                    select: {
                        id: true,
                        name: true,
                        adminId: true
                    },
                },
            },
        })
        return { success: true, data }
    } catch (error) {
        return { success: false, message: "An error occurred while getting the workspace." };
    }
}
// Get a single org TODO:: Search for name & email in members(if possible) & pagination
export const getOrg = async (orgId: string, searchQuery?: string, page?: number, pageSize?: number) => {
    try {
        const res = await fetchUser();
        if (res.success === false || !res.user) return { success: res.success, message: res.message };
        const { user } = res;

        const orgQuery = {
            where: { id: orgId },
            select: {
                id: true,
                name: true,
                adminId: true,
                members: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                    take: pageSize || 10, // Set a default page size if not provided
                    skip: page ? (page - 1) * (pageSize || 10) : 0, // Calculate skip based on page and pageSize
                    where: searchQuery
                        ? {
                            OR: [
                                { name: { contains: searchQuery } },
                                { email: { contains: searchQuery } },
                            ],
                        }
                        : undefined,
                },
            },
        };

        const data = await db.organization.findUnique(orgQuery);
        if (!data) return { success: false, message: 'Not found' };

        const isMember = user.orgsId.includes(data.id);
        if (!isMember) return { success: false, message: 'Unauthorized' };
        const isAdmin = user.id === data?.adminId;

        return { success: true, isAdmin, message: 'Success', data };
    } catch (error: any) {
        return { success: false, message: 'An error occurred while getting the workspace.' };
    }
};
// Verify member
export const verifyMember = async (orgId: string, email: string) => {
    try {
        const data = await db.user.findUnique({
            where: { email: email },
            select: {
                id: true, orgsId: true
            }
        })
        if (!data) return { success: false, message: "email not found" }
        if (data.orgsId.includes(orgId)) return { success: false, message: 'User already exist in this workspace' }
        return { success: true, message: 'User verified !', id: data.id }

    } catch (error: any) {
        return { success: false, message: "An error occurred while verifing an email." };
    }
}
// Add Members by admin
export const addMembersInOrg = async (orgId: string, membersId: string[], path: string) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return res
        const { user } = res
        const Org = await db.organization.findUnique({ where: { id: orgId } })
        if (!Org || Org.adminId !== user.id) return { success: false, message: "Unauthorized ! only admin can add members!" }
        const updatedMembersId = Org.membersId.concat(membersId)
        await db.organization.update({
            where: { id: Org.id },
            data: { membersId: updatedMembersId }
        })
        await db.user.updateMany({
            where: {
                id: { in: membersId }
            },
            data: { orgsId: { push: orgId } },
        })
        // console.log(data, users)
        revalidatePath(path)
        return { success: true, message: 'Members added to the workspace' }
    } catch (error: any) {
        return { success: false, message: "An error occurred while adding members in the workspace." };
    }

}
// Remove Members by admin
export const removeMembersInOrg = async (orgId: string, membersId: string[]) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return res
        const { user } = res
        const Org = await db.organization.findUnique({ where: { id: orgId } })
        if (!Org || Org.adminId !== user.id) return { success: false, message: "Unauthorized ! only admin can remove members!" }
        const updatedMembersId = Org.membersId.filter(member => !membersId.includes(member));
        await db.organization.update({
            where: { id: Org.id },
            data: { membersId: updatedMembersId }
        })
        await db.user.updateMany({
            where: {id: {in: membersId}},
            data: {orgsId: {set: user.orgsId.filter(id => id !== orgId )}},
        });
        return {success: true, message: `Successfully removed member from ${Org.name}`}
    } catch (error) {
        return { success: false, message: "An error occurred while removing members in the workspace." };
    }
}
// Update Name by admin
export const updateOrg = async (orgId: string, name: string, path: string) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return res
        const { user } = res
        const Org = await db.organization.findUnique({ where: { id: orgId } })
        if (!Org || Org.adminId !== user.id) return { success: false, message: "Unauthorized ! only admin can update org!" }
        await db.organization.update({
            where: { id: orgId },
            data: { name }
        })
        revalidatePath(path)
        return { success: true, message: "Organization Updated Successfully" }
    } catch (error) {
        return { success: false, message: "An error occurred while updating the organization." };
    }
}
// Delete Org by admin
export const deleteOrg = async (orgId: string) => {
    // Have to verify admin and delete org and remove it from the organization array from the user , TODO: Have to remove all the boards list activity an all
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return res
        const { user } = res
        const Org = await db.organization.findUnique({ where: { id: orgId } })
        if (!Org || Org.adminId !== user.id) return { success: false, message: "Unauthorized ! only admin can delete workspace!" }
        await db.user.updateMany({
            where: {
                id: { in: Org.membersId }
            },
            data: { orgsId: user.orgsId.filter(id => id !== orgId) },
        })
        await db.board.deleteMany({
            where: {orgId}
        })
        await db.audit.deleteMany({
            where: {orgId}
        })
        await db.organization.delete({
            where: { id: orgId },
        });
        revalidatePath(`/app/settings/${orgId}`)
        return { success: true, message: "Workspace Deleted Successfully" }
    } catch (error: any) {
        return { success: false, message: "An error occurred while deleting the workspace." };
    }
}
// get org activity
export const getAllWorkspaceActivity = async (orgId: string, page?: number, pageSize?: number) =>{
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return { success: false, message: 'Unauthorized session expired !!' }
        const { user } = res
        if (!user.orgsId.includes(orgId)) return { success: false, message: "Invalid request!" }
        const data = await db.audit.findMany({
            where: {orgId},
            orderBy: {createdAt: 'desc'},
            take: pageSize || 10, 
            skip: page ? (page - 1) * (pageSize || 10) : 0, 
        })
        if(!data) return {success: false, message: "not found"}
        return {success: true, message: "found" , data}
    } catch (error) {
        return { success: false, message: "Server error try again later !" };
    }
}
