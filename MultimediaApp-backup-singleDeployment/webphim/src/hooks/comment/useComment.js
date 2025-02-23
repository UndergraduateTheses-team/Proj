import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function useComment(movieId) {
    const [listComment, setListComment] = useState([]);

    useEffect(() => {
        const getComment = async () => {
            try {
                const response = await fetch(`/api/comment/getComment/${movieId}`,{
                    credentials: "include",
                });
                const data = await response.json();
                if (response.ok) {
                    setListComment(data.datas);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getComment();
    }, []);

    const createComment = async (comment) => {
        try {
            const response = await fetch('/api/comment/createComment', {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(comment),
            });
            const data = await response.json();
            if (!response.ok) {
                console.log(data?.message);
                toast.error("Vui lòng đăng nhập !!!");
            } else {
                
                setListComment([...listComment, data.datas]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return { createComment, listComment };
}

export default useComment;
