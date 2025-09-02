import {useState} from "react";
import {useApi} from "@/src/hooks/useApi";
import {toast} from "sonner";


export function useRegister() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | boolean>(false);
    const {apiPost} = useApi();

    const registerUser = async (data:any) => {
        setLoading(true);
        setError(false);
        try {
            await apiPost('/api/auth/register', data)
            toast.success('Register successful!');
        } catch (e) {
            console.error(e);
            toast.error('Something went wrong!');
            setError("Error while registering");
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        registerUser,
    }
}