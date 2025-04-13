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

    // Find the user in our database
    const user = await db.user.upsert({
      update: {},
      where: {
        clerkId,
      },
      create: {
        clerkId,
      },
    });

    // Get all lists for this user
    const lists = await db.list.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        _count: {
          select: {
            characters: true,
          },
        },
      },
    });

    return { lists };
  } catch (error) {
    console.error("Error fetching lists:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch lists",
    });
  }
});
