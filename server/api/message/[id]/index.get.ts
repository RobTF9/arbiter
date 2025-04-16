import { db } from "~/lib/db";

export default defineEventHandler(async (event) => {
  try {
    console.log("Fetching message with ID:", event.context.params?.id);

    const message = await db.message.findUnique({
      where: {
        id: event.context.params?.id,
      },
    });

    if (!message) {
      return null;
    }

    return { message };
  } catch (error) {
    console.error("Error creating list:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to create list",
    });
  }
});
