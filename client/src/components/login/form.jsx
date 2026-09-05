import { useState } from "react";
import { useAuth } from "../../hooks/context/AuthContext";

export default function Login() {

    const ENDPOINT = 'http://localhost:3000/api/';

    const [form, setForm] = useState({
        name: '',
        password: '',
    });

    const [alertMessage, setAlertMessage] = useState("");

    const { setUser } = useAuth();
    const [loading, setLoading] = useState(false);

    const checkForm = () => {
        setAlertMessage('');

        if (!form.name || !form.password) {
            setAlertMessage("Preencha todos os campos");
            return undefined;
        }

        return true;
    };

    const handle = async () => {
        const formValid = checkForm();
        if (formValid === undefined) return;
        setLoading(true);
        try {
            const sendRequest = await fetch(`${ENDPOINT}login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(form)
                });

        const result = await sendRequest.json();

        if (!sendRequest.ok || !result.loginIsValid) {
            setAlertMessage('Usuário não pode loggar. Verifique o cadastro.');
            return;
        }

        setUser(result.user);
        setForm({ name: '', password: '' });

    } catch (error) {
        console.log('Erro ao checar login do usuário.');
    } finally {
        setLoading(false);
    }

}

return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

            <h1 className="mb-6 text-2xl font-bold text-gray-800">
                Login
            </h1>

            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    NAME:
                </label>

                <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            name: e.target.value
                        })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5
                           outline-none transition
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
            </div>

            <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    PASSWORD:
                </label>

                <input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            password: e.target.value
                        })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5
                           outline-none transition
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
            </div>

            <button
                onClick={handle}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 mb-4 cursor-pointer
                       font-semibold text-white transition
                       hover:bg-blue-700
                       active:scale-[0.98]"
            >
                Login
            </button>


            {alertMessage && (
                <p className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700 ">
                    {alertMessage}
                </p>
            )}

        </div>
    </div>
);
}