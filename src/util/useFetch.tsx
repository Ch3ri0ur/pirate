import { useState, useEffect, useRef } from 'react';
// This custom hook centralizes and streamlines handling of HTTP calls

interface Props {
    url: RequestInfo;
    init?: RequestInit;
}

const useFetch = (props: Props): { data: unknown; loading: boolean; error: Error | undefined } => {
    const [data, setData] = useState<unknown>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error>();
    const prevInit = useRef<RequestInit>();
    const prevUrl = useRef<RequestInfo>();

    useEffect(() => {
        // Only refetch if url or init params change.
        if (prevUrl.current === props.url && prevInit.current === props.init) return;
        prevUrl.current = props.url;
        prevInit.current = props.init;
        fetch(props.url, props.init)
            .then((response) => {
                if (response.ok) return response.json();
                setError(Error(response.statusText));
            })
            .then((data) => setData(data))
            .catch((err: Error) => {
                console.error(err);
                setError(err);
            })
            .finally(() => setLoading(false));
    }, [props.init, props.url]);

    return { data, loading, error };
};

export default useFetch;
