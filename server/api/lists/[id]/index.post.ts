import { db } from "~/lib/db";

export default defineEventHandler(async (event) => {
  try {
    const params = event.context.params;

    if (!params?.id) {
      throw createError({
        statusCode: 400,
      });
    }

    const { message } = await readBody(event);

    const createdMessage = await db.message.create({
      data: {
        message,
        listId: params?.id,
        source: "USER",
        status: "SUCCESS",
      },
    });

    const response = await db.message.create({
      data: {
        message: "",
        listId: params?.id,
        source: "AI",
      },
    });

    const sendTon8n = await $fetch(
      "https://robsquires.app.n8n.cloud/webhook/arbiter",
      {
        method: "POST",
        body: {
          message: createdMessage.message,
          list: params?.id,
          id: response.id,
        },
      }
    );

    if (!sendTon8n) {
      throw createError({
        statusCode: 500,
        message: "Failed to send message to ton8n",
      });
    }

    return {
      statusCode: 200,
      data: createdMessage,
      responseId: response.id,
    };
  } catch (error) {
    console.error("Error creating list:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to create list",
    });
  }
});
