import { type ClassValue, clsx } from "clsx"
import { getServerSession } from "next-auth";
import { twMerge } from "tailwind-merge"
import { db } from "./db";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const fetchUser = async () => {
  try {
    const session = await getServerSession()
    if (!session || !session.user || !session.user.email) return { success: false, message: "invalid request, session expired please relogin" }
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })
    if (!user) { return { success: false, message: "session expired please relogin" } } else { return { user, success: true } }

  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export function getContrastTextColor(hexColor: string) {
  // Convert hex to RGB
  if (!hexColor) return "#ffffff"
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Use white text for dark backgrounds and black text for light backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  // Create a shallow copy of the input array
  const result = Array.from(list);
  // Remove the element at the startIndex from the copied array and store it in the 'removed' variable
  const [removed] = result.splice(startIndex, 1);
  // Insert the removed element at the endIndex in the copied array
  result.splice(endIndex, 0, removed);
  // Return the modified array
  return result;
};