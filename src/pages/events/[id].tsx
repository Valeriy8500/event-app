import { EventDetail } from "@/entities/event";
import { trpc } from "@/shared/api";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Event() {
  const router = useRouter();
  const session = useSession();

  const { data, isLoading } = trpc.event.findUnique.useQuery({
    id: Number(router.query.id),
  });

  if (isLoading) {
    return <p className="flex justify-center">Загрузка...</p>;
  }

  if (session.status === "unauthenticated") {
    return <p className="flex justify-center">Вы не авторизованы</p>;
  }

  if (!data) {
    return <p className="flex justify-center">Нет данных</p>;
  }

  return <EventDetail {...data} />;
}
