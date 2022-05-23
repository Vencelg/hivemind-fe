import { user } from "../stores/store.js";
import { posts } from "../stores/posts.js";

const handleCommentSubmit = async (details) => {
    const token = "Bearer " + window.localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8000/api/comments/", {
        method: "POST",
        body: details,
        headers: {
            "Access-Control-Allow-Origin": "*",
            Accept: "application/json",
            Authorization: token,
        },
        mode: "cors",
    });

    const json = await res.json();
    const result = JSON.stringify(json);
    let resultFinal = await JSON.parse(result);

    if (res.ok) {
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].id == resultFinal.comment.post_id) {
                console.log(posts[i]);
                posts[i].comments = [
                    ...posts[i].comments,
                    resultFinal.comment,
                ];
            }
        }
    }
};

export default handleCommentSubmit;