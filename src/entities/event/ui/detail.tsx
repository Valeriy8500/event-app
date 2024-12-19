import { RouterOutput } from "@/shared/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type EventDetailProps = NonNullable<RouterOutput["event"]["findUnique"]> & { authorId: number };

export const EventDetail = ({
  title,
  description,
  date,
  participations,
  authorId
}: EventDetailProps) => {

  const router = useRouter();
  const editEventId = Number(router.query.id);
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (!editEventId) {
      setError("ID события не найден.");
      setIsModalOpen(true);
      return;
    }

    if (!authorId || authorId !== currentUserId) {
      setError("У вас нет прав на редактирование этого события.");
      setIsModalOpen(true);
      return;
    }

    // Если проверки пройдены, перенаправляем на страницу редактирования
    router.push(`/events/edit/${editEventId}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) closeModal();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const canEdit = currentUserId === authorId; // Проверяем права редактирования

  return (
    <>
      <div className="flex justify-between px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Информация о событии
        </h3>
        <button
          className={`h-10 px-6 font-semibold rounded-md ${canEdit ? "bg-customBlue text-white" : "bg-gray-400 text-gray-700"}`}
          onClick={handleClick}
        >
          Редактировать событие
        </button>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Название
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {title}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Описание
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {description}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Дата проведения
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {date.toLocaleDateString()}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Участники
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {participations.map(({ user }) => user.name).join(", ")}
            </dd>
          </div>
        </dl>
      </div>

      {isModalOpen &&
        (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold text-red-600">Ошибка</h2>
              <p className="mt-4 text-gray-700">{error}</p>
              <div className="mt-6 flex justify-end">
                <button
                  className="px-4 py-2 bg-customBlue text-white rounded-md"
                  onClick={closeModal}
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};
