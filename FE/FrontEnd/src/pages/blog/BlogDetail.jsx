import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/axios";

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await api.get(`/blog/${id}`);
                setBlog(response.data);
            } catch (err) {
                setError("Failed to load blog post");
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    if (loading) return <p style={{ textAlign: "center", fontSize: "18px" }}>Loading...</p>;
    if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

    return (
        <div style={{
            maxWidth: "800px",
            margin: "auto",
            padding: "20px",
            fontFamily: "'Roboto', sans-serif",
            height: "80vh",
            overflow: "auto",
            border: "1px solid #ddd",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            backgroundColor: "#fff"
        }}>
            <h1 style={{
                color: "#FB7185",
                fontSize: "32px",
                fontWeight: "bold",
                marginBottom: "15px",
                textAlign: "center"
            }}>
                {blog?.title}
            </h1>

            {blog?.imageUrl && (
                <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    style={{
                        width: "100%",
                        maxHeight: "300px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        marginBottom: "20px",
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)"
                    }}
                />
            )}

            <p style={{
                fontSize: "18px",
                lineHeight: "1.8",
                color: "#333",
                textAlign: "justify"
            }}>
                {blog?.content}
            </p>
        </div>
    );
};

export default BlogDetail;
