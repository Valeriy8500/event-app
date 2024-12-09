import { trpc } from "@/shared/api";

type ExitEventButtonProps = {
  eventId: number;
  onSuccess?: () => void;
};

export const ExitEventButton = ({
  eventId,
  onSuccess,
}: ExitEventButtonProps) => {
  const { mutate } = trpc.event.leave.useMutation({ onSuccess });

  const handleClick = () => {
    mutate({ id: eventId });
  };

  return (
    <button
      className="h-10 px-6 font-semibold rounded-md bg-customRed text-white"
      onClick={handleClick}
    >
      Покинуть
    </button>
  );
};
