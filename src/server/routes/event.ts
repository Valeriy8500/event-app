import { CreateEventSchema, JoinEventSchema, LeaveEventSchema, UpdateEventSchema } from "@/shared/api";
import { prisma } from "../db";
import { isAuth, procedure, router } from "../trpc";
import { z } from "zod";

export const eventRouter = router({
  findMany: procedure.query(async ({ ctx: { user } }) => {
    const events = await prisma.event.findMany({
      include: {
        participations: true,
      },
    });

    return events.map(({ participations, ...event }) => ({
      ...event,
      isJoined: participations.some(({ userId }) => userId === user?.id),
    }));
  }),

  findUnique: procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .use(isAuth)
    .query(({ input }) => {
      return prisma.event.findUnique({
        where: input,
        select: {
          title: true,
          description: true,
          date: true,
          authorId: true,
          participations: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
    }),

  create: procedure
    .input(CreateEventSchema)
    .use(isAuth)
    .mutation(({ input, ctx: { user } }) => {
      return prisma.event.create({
        data: {
          authorId: user.id,
          ...input,
        },
      });
    }),

  update: procedure
    .input(UpdateEventSchema)
    .use(isAuth)
    .mutation(async ({ input, ctx: { user } }) => {
      const event = await prisma.event.findUnique({
        where: { id: input.id },
        select: { authorId: true },
      });

      if (!event) {
        throw new Error("Событие не найдено.");
      }

      if (event.authorId !== user.id) {
        throw new Error("У вас нет прав на редактирование этого события.");
      }

      const updatedEvent = await prisma.event.update({
        where: { id: input.id },
        data: input.data,
      });

      return updatedEvent;
    }),

  join: procedure
    .input(JoinEventSchema)
    .use(isAuth)
    .mutation(({ input, ctx: { user } }) => {
      return prisma.participation.create({
        data: {
          eventId: input.id,
          userId: user.id,
        },
      });
    }),

  leave: procedure
    .input(LeaveEventSchema)
    .use(isAuth) // Проверка аутентификации
    .mutation(async ({ input, ctx: { user } }) => {
      // Удаляем запись о присоединении
      const participation = await prisma.participation.deleteMany({
        where: {
          eventId: input.id, // ID события
          userId: user.id, // ID пользователя
        },
      });

      // Проверяем, было ли удаление успешным
      if (participation.count === 0) {
        throw new Error("Вы не присоединились к этому событию.");
      }

      return { success: true };
    }),
});
