import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";

export const Header = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const handleCreateEvent = () => {
        router.push("/events/create");
    };

    const handleLogin = () => {
        router.push("/api/auth/signin");
    };

    // Определение текущей страницы
    const isCreateEventPage = router.pathname === "/events/create";
    const isEditEventPage = router.pathname.startsWith("/events/edit/");

    return (
        <header className="flex justify-between items-center w-full bg-white shadow-md sticky top-0 z-50 py-4 px-4 mb-2.5">
            <h1 className="text-xl font-bold">EventApp</h1>
            <div className="flex items-center gap-4">
                {session?.user ? (
                    <>
                        <span className="flex items-center text-lg font-medium">
                            {session.user.name}
                            <button
                                className="ml-2 text-gray-500 hover:text-gray-700 transition"
                                onClick={() => signOut({ callbackUrl: "/" })}
                                aria-label="Выйти"
                                title="Выйти"
                            >
                                ⬅
                            </button>
                        </span>
                        {!isCreateEventPage && !isEditEventPage && (
                            <button
                                className="px-4 py-2 bg-green-500 text-white font-medium rounded hover:bg-green-600 transition"
                                onClick={handleCreateEvent}
                            >
                                Создать событие
                            </button>
                        )}
                    </>
                ) : (
                    <button
                        className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition flex items-center"
                        onClick={handleLogin}
                    >
                        Войти
                        <span className="ml-2">➡</span>
                    </button>
                )}
            </div>
        </header>
    );
};
