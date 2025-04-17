import { db } from "~/lib/db";
import { getAuth } from "@clerk/nuxt/server";
import type {
  Advancement,
  Character,
  Injury,
  List,
  Skill,
  Wargear,
  Weapon,
} from "@prisma/client";

export default defineEventHandler(
  async (
    event
  ): Promise<{
    list: List & {
      characters: (Character & {
        weapons: Weapon[];
        wargear: Wargear[];
        skills: Skill[];
        injuries: Injury[];
        advancements: Advancement[];
      })[];
    };
  }> => {
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
      const list = await db.list.findUnique({
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
          messages: {
            orderBy: {
              createdAt: "desc",
            },
          },
          _count: {
            select: {
              characters: true,
            },
          },
        },
      });

      if (!list) {
        throw createError({
          statusCode: 404,
          message: "List not found",
        });
      }

      return { list };
    } catch (error) {
      console.error("Error fetching lists:", error);
      throw createError({
        statusCode: 500,
        message: "Failed to fetch lists",
      });
    }
  }
);
