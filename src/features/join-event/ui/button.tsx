import { trpc } from "@/shared/api";
import { useSession } from "next-auth/react";

type JoinEventButtonProps = {
  eventId: number;
  onSuccess?: () => void;
};

export const JoinEventButton = ({
  eventId,
  onSuccess,
}: JoinEventButtonProps) => {
  const { data: session } = useSession();
  const { mutate } = trpc.event.join.useMutation({ onSuccess });

  const handleClick = () => {
    if (session?.user) mutate({ id: eventId });
  };

  return (
    <button
      className="h-10 px-6 font-semibold rounded-md bg-black text-white disabled:bg-gray-400"
      onClick={handleClick}
      disabled={!session?.user}
      title={!session?.user ? "Пожалуйста, войдите в систему" : ""}
    >
      Присоединиться
    </button>
  );
};
