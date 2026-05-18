import { useEffect, useState } from 'react'
import './App.css'
import { generateClient } from 'aws-amplify/data'
import type {Schema} from '../amplify/data/resource'

type Post = any;
const client = generateClient<Schema>() as any;
console.log('Available models: ', client.models);

function App() {
  const [notes, setNotes] = useState('');
  const [blogPost, setBlogPost] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  //useEffect(() => {loadPosts();}, []);

  async function generateBlog() {
      const noteArray = notes
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      try {
        const response = await client.queries.generateBlog({
          notes: noteArray,
        });
        console.log("Generated blog response:", response);
        console.log("FULL RESPONSE:", JSON.stringify(response, null, 2));
        if (response.errors) {
          console.error("Error generating blog:", response.errors);
          alert("Failed to generate blog post. Please try again.");
          return;
        }
        setBlogPost(response.data?.body || "");
      } catch (error) {
        console.error("Error generating blog:", error);
        alert("Failed to generate blog post. Please try again.");
      }
    }

  async function savePost() {
    try {
      const newPost = await client.models.Post.create({
        title: 'My AWS Learning Blog',
        content: blogPost,
        createdAt: new Date().toISOString() 
      });
      console.log('Post saved successfully:', newPost);
      if(newPost.errors) {
      console.error('Error saving post:', newPost.errors);
      alert('Failed to save post. Please try again.');
      return;
    } alert ('Post saved successfully!'); 
      await loadPosts();
  } catch (error) { /* saving crashed completely so it catches the error*/
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    }   
  }
  async function loadPosts() {
  try {
    const allPosts = await client.models.Post.list();

    if (allPosts.errors) {
      console.error("LOAD ERRORS:", allPosts.errors);
      return;
    }

    const chronologicalPosts = allPosts.data.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    console.log("Loaded posts:", chronologicalPosts);
    setPosts(chronologicalPosts);
  } catch (error) {
    console.error("Error loading posts:", error);
    alert("Failed to load posts. Please try again.");
  }
}
  async function deletePost(id: string) {
    try {
      const deletedPost =await client.models.Post.delete(id);
      console.log('Post deleted successfully:', deletedPost);
      console.log(deletedPost.id);
      if(deletedPost.errors) {
        console.error('Error deleting post:', deletedPost.errors);
        alert('Failed to delete post. Please try again.');
        return;
      }
      alert('Post deleted successfully!');
      await loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  
  }
    return (
      <main className='app'> 
        <section className='card'>
          <h1>My Learning Blog</h1>
          <p>Add a few bullet points about you learnt/did today.</p>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Example&#10;- Learnt about AWS Amplify, a tool to build cloud-powered apps faster.&#10;- Explored how to use Amplify's Data API to create and manage data models.&#10;- Created a simple blog post model and saved my first post using Amplify's client."
            />
            <button onClick={generateBlog}>Generate Blog Post</button>
            <button onClick={savePost} disabled={!blogPost}>Save Blog Post</button>
            <button onClick={loadPosts}>Load All Posts</button>
            {blogPost && (
              <section className='output'>  
                <h2>Generated Blog Post</h2>
                <p>{blogPost}</p>
              </section>        
            )}

            {posts.length > 0 && (
              <section className='output'>
                <h2>My Saved Blog Posts</h2>
                {posts.map((post) => (
                  <div key={post.id} className="saved-post">
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <small>{new Date(post.createdAt).toLocaleString()}</small>

                    <button onClick={() => deletePost(post.id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </section>
            )}
        </section>
      </main>
    );
}

export default App;