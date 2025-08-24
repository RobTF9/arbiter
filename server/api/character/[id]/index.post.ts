import { db } from "~/lib/db";
import { getAuth } from "@clerk/nuxt/server";
import { Prisma } from "@prisma/client";

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

    const characterUpdates: Prisma.CharacterUpdateInput = await readBody(event);

    const character = await db.character.update({
      where: {
        id: event.context.params?.id,
      },
      data: characterUpdates,
    });

    return { character };
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to authenticate user",
    });
  }
});
