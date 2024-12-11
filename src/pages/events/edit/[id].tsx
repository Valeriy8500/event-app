import { useRouter } from "next/router";
import EditEvent from "./editEvent";

export default function EditEventPage() {
    const router = useRouter();
    const id = Number(router.query.id);

    if (!id || Array.isArray(id)) {
        return <p>Некорректный ID события</p>;
    }

    return <EditEvent eventId={id} />;
}
