import { getAuth } from "@clerk/nuxt/server";
import { db } from "~/lib/db";

export default defineEventHandler(async (event) => {
  try {
    const { userId: clerkId } = getAuth(event);

    if (!clerkId) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    await db.message.deleteMany({
      where: {
        listId: event.context.params?.id,
        list: {
          user: {
            clerkId,
          },
        },
      },
    });

    return {
      message: "Messages deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting message:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to delete message",
    });
  }
});
