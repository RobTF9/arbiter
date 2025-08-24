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

    // Get request body
    const { title, description, gang, credits } = await readBody(event);

    if (!title || !gang) {
      throw createError({
        statusCode: 400,
        message: "Title is required",
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

    // Create a new list
    const newList = await db.list.create({
      data: {
        title,
        description,
        gang,
        credits,
        userId: user.id,
      },
    });

    return { list: newList };
  } catch (error) {
    console.error("Error creating list:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to create list",
    });
  }
});
