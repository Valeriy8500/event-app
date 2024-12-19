import { CreateEventForm } from "@/features/create-event";
import { CreateEventSchema, trpc } from "@/shared/api";
import { useRouter } from "next/router";

type EditEventProps = {
    eventId: number;
};

export default function EditEvent({ eventId }: EditEventProps) {
    const router = useRouter();

    // Получаем данные события
    const { data: event } = trpc.event.findUnique.useQuery({ id: eventId });

    // Мутация для обновления события
    const { mutate } = trpc.event.update.useMutation({
        onSuccess: () => {
            router.push(`/events/${eventId}`);
        }
    });

    const handleSubmit = (data: CreateEventSchema) => {
        mutate({
            id: eventId,
            data: { ...data, date: typeof data.date === "string" ? new Date(data.date) : data.date }
        });
    };

    if (!event) return <p>Загрузка...</p>;

    return (
        <CreateEventForm
            onSubmit={handleSubmit}
            defaultValues={{
                title: event.title,
                description: event.description ?? undefined,
                date: event.date ? new Date(event.date).toISOString().split('T')[0] : undefined
            }}
            isEdit
        />
    );
}
