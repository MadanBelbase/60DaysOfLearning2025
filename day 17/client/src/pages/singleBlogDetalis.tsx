import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/singleBlogDetails.css';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
}

const SingleBlogDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch the current blog
        const blogResponse = await fetch(`http://localhost:3000/getblogs/${id}`);
        if (!blogResponse.ok) throw new Error('Failed to fetch blog');
        const blogData = await blogResponse.json();
        
        // Fetch all blogs
        const allBlogsResponse = await fetch('http://localhost:3000/getblogs');
        if (!allBlogsResponse.ok) throw new Error('Failed to fetch all blogs');
        const allBlogsData = await allBlogsResponse.json();
        
        setBlog(blogData);
        setAllBlogs(allBlogsData.filter((b: Blog) => b._id !== id)); // Exclude current blog
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="loading">Loading blog details...</div>;
  if (!blog) return <div className="not-found">Blog not found.</div>;

  return (
    <div className="main-details">
      <div className="left-details">
        <article className="blog-article">
          <h1 className="blog-title">{blog.title}</h1>
          <div 
            className="blog-content" 
            dangerouslySetInnerHTML={{ __html: blog.content }} 
          />
        </article>
      </div>

      <div className="right-details">
        <h2 className="sidebar-title">Recommended Blogs</h2>
        <div className="recommended-blogs">
          {allBlogs.length > 0 ? (
            allBlogs.slice(0, 4).map((b) => (
              <Link to={`/blogs/${b._id}`} key={b._id} className="recommended-blog-card">
                <div className="recommended-blog-content">
                  <h3 className="recommended-blog-title">{b.title}</h3>
                  <p className="recommended-blog-excerpt">
                    {b.excerpt || "Click to read more..."}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p>No recommended blogs available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleBlogDetails;
