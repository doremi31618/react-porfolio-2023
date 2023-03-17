import React, { useRef, useState } from "react";
import { fetchAllPost, fetchPostById, getAllPosts, cache } from "../../utils/api";
import Header from "../../components/Header";
import ContentSection from "../../components/ContentSection";
import Footer from "../../components/Footer";
import Head from "next/head";
import { useIsomorphicLayoutEffect } from "../../utils";
import { stagger } from "../../animations";
import Button from "../../components/Button";
import BlogEditor from "../../components/BlogEditor";
import { useRouter } from "next/router";
import Cursor from "../../components/Cursor";
import data from "../../data/portfolio.json";

async function fecthBlog(id,fields = []){
  const db_url = "https://Strapi-CMS.doremi31618.repl.co"
  const api_url = db_url + `/api/blogs/${id}?populate=*`;
  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)"
  }

  let response = await fetch(api_url, {
    method: "GET",
    headers: headersList
  });

  let formatdata = await response.json();//await JSON.parse(response);
  let postData = formatdata.data;
  // console.log("post response", formatdata, "url", api_url);
 let post = {};
    for (let field of fields){
      switch(field){
        case "image":
          post[field] = db_url + postData.attributes[field].data.attributes.url;
          // console.log("img", post[field]);
          break;
        case "id":
          post["id"] = postData["id"]
          break;
        default:
          post[field] = postData.attributes[field];
          break;
      }
      
    }
  return post;
}

const BlogPost = ({ post }) => {
  const [showEditor, setShowEditor] = useState(false);
  const textOne = useRef();
  const textTwo = useRef();
  const router = useRouter();

  useIsomorphicLayoutEffect(() => {
    stagger([textOne.current, textTwo.current], { y: 30 }, { y: 0 });
  }, []);


  return (
    <>
      <Head>
        <title>{"Blog - " + post.title}</title>
        <meta name="description" content={post.preview} />
      </Head>
      {data.showCursor && <Cursor />}

      <div
        className={`container mx-auto mt-10 ${
          data.showCursor && "cursor-none"
        }`}
      >
        <Header isBlog={true} />
        <div className="mt-10 flex flex-col">
          <img
            className="w-full h-96 rounded-lg shadow-lg object-cover"
            src={post.image}
            alt={post.title}
          ></img>
          <h1
            ref={textOne}
            className="mt-10 text-4xl mob:text-2xl laptop:text-6xl text-bold"
          >
            {post.title}
          </h1>
          <h2
            ref={textTwo}
            className="mt-2 text-xl max-w-4xl text-darkgray opacity-50"
          >
            {post.tagline}
          </h2>
        </div>
        <ContentSection content={post.content}></ContentSection>
        <Footer />
      </div>
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-6 right-6">
          <Button onClick={() => setShowEditor(true)} type={"primary"}>
            Edit this blog
          </Button>
        </div>
      )}

      {showEditor && (
        <BlogEditor
          post={post}
          close={() => setShowEditor(false)}
          refresh={() => router.reload(window.location.pathname)}
        />
      )}
    </>
  );
};
export async function getStaticProps({params}) {
  let id = "undeined";
  const acquireField = ["id", "slug"];
  const posts = await fetchAllPost(acquireField);
  for (var _post of posts){
    if (_post.slug==params.slug){
      id = _post.id;
    }
  }
  if (id == "undeined")return;
  const post = await fetchPostById(id, [
    "date",
    "slug",
    "preview",
    "title",
    "tagline",
    "preview",
    "image",
    "content",
    "id"
  ]);
  console.log('[blog/slug.js]: getStaticProps', post);
  return {
    props: {
      post: {
        ...post,
      },
    },
  };
}

export async function getStaticPaths() {
  const acquireField = ["id", "slug"];
  const posts = await fetchAllPost(acquireField);
  
  console.log("id path", posts);
  // const _posts = getAllPosts(acquireField);
  const slugs = getAllPosts(["slug", "id"]);
  let paths = posts.map((post) => {
      cache[post.slug] = post.id;
    
      console.log('set cache',cache,  post.slug, post.id)
      return {
        params: {
          slug: post.slug,
        },
        
      };
    })
  return {
    paths: paths,
    fallback: false,
  };
}
export default BlogPost;
