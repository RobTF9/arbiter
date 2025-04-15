import { db } from "~/lib/db";
import { getAuth } from "@clerk/nuxt/server";

export default defineEventHandler(async (event) => {
  try {
    // Get the authenticated user's Clerk ID
    const { userId: clerkId } = getAuth(event);

    if (!clerkId) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    // Get the list with related data
    const list = await db.list.findFirst({
      where: {
        id: event.context.params?.id,
      },
      include: {
        characters: {
          include: {
            weapons: true,
            wargear: true,
            skills: true,
            injuries: true,
            advancements: true,
          },
        },
        _count: {
          select: {
            characters: true,
          },
        },
      },
    });

    return { list };
  } catch (error) {
    console.error("Error fetching lists:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch lists",
    });
  }
});
