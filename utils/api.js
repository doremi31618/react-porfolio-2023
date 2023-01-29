import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

const postsDirectory = join(process.cwd(), "_posts");



export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}


export async function fetchPostBySlug(id,fields = []) {
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
  console.log("post response", formatdata, "url", api_url);
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


export function getPostBySlug(slug, fields = []) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = content;
    }

    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });

  return items;
}

export function getAllPosts(fields = []) {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  // console.log("posts", posts);
  return posts;
}

export async function fetchAllPost(fields = []) {
  const db_url = "https://Strapi-CMS.doremi31618.repl.co"
  const api_url = db_url + "/api/blogs?populate=*";
  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)"
  }

  let response = await fetch(api_url, {
    method: "GET",
    headers: headersList
  });

  let formatdata = await response.json();//await JSON.parse(response);
  // console.log("post response", formatdata);

  let posts = [];
  for (let postData of formatdata.data){
    let post = {};
    for (let field of fields){
      switch(field){
        case "image":
          post[field] = db_url + postData.attributes[field].data.attributes.url;
          // console.log("img", post[field]);
          break;
        case "id":
          post["id"] = postData["id"].toString();
          break;
        default:
          post[field] = postData.attributes[field];
          break;
      }
      
    }
    posts.push(post);
  }
  // console.log("format posts", posts);
  return posts;

}
