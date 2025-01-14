import { useRef, useEffect, useState } from "react";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import Socials from "../components/Socials";
import WorkCard from "../components/WorkCard";
import { useIsomorphicLayoutEffect } from "../utils";
import { stagger } from "../animations";
import Footer from "../components/Footer";
import Head from "next/head";
import Button from "../components/Button";
import Link from "next/link";
import Cursor from "../components/Cursor";
// import {fetchHomepageData} from '../utils/api';

// Local Data
import tempdata from "../data/portfolio.json";

async function fetchHomepage() {
  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)"
  }
  let domainName = "https://Strapi-CMS.doremi31618.repl.co";
  let api = "/api/setting?populate[0]=socials&populate[1]=projects.image&populate[2]=services"
  let url = domainName + api;
  let response = await fetch(url, {
    method: "GET",
    headers: headersList
  });

  let data = await response.json();//await JSON.parse(response);
  data.data.attributes.url = url;
  data.data.attributes.domain = domainName;
  data.data.attributes.api = api;
  // console.log("homepage response", data);

  return data;
}



export default function Home({homepageData}) {
  const [data, setData] = useState(homepageData);
  // Ref
  const workRef = useRef();
  const aboutRef = useRef();
  const textOne = useRef();
  const textTwo = useRef();
  const textThree = useRef();
  const textFour = useRef();

  useEffect(()=>{
    async function fetchHomepage(){
      let fetchData = await fetchHomepage();
      let formatData = await formatHomepageData();

      setData((prev)=>{
        return {
          ...prev,
          ...formatData
        }
      })
    }
    fetchHomepage();
  },[])

  // Handling Scroll
  const handleWorkScroll = () => {
    window.scrollTo({
      top: workRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleAboutScroll = () => {
    window.scrollTo({
      top: aboutRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  useIsomorphicLayoutEffect(() => {
    stagger(
      [textOne.current, textTwo.current, textThree.current, textFour.current],
      { y: 40, x: -10, transform: "scale(0.95) skew(10deg)" },
      { y: 0, x: 0, transform: "scale(1)" }
    );
  }, []);

  return (
    <div className={`relative ${data.showCursor && "cursor-none"}`}>
      {data.showCursor && <Cursor />}
      <Head>
        <title>{data.name}</title>
      </Head>

      <div className="gradient-circle"></div>
      <div className="gradient-circle-bottom"></div>

      <div className="container mx-auto mb-10">
        <Header
          handleWorkScroll={handleWorkScroll}
          handleAboutScroll={handleAboutScroll}
        />
        <div className="laptop:mt-20 mt-10">
          <div className="mt-5">
            <h1
              ref={textOne}
              className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-4/5 mob:w-full laptop:w-4/5"
            >
              {data.headerTaglineOne}
            </h1>
            <h1
              ref={textTwo}
              className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
            >
              {data.headerTaglineTwo}
            </h1>
            <h1
              ref={textThree}
              className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
            >
              {data.headerTaglineThree}
            </h1>
            <h1
              ref={textFour}
              className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
            >
              {data.headerTaglineFour}
            </h1>
          </div>

          <Socials className="mt-2 laptop:mt-5" socialDataList={data.socials}/>
        </div>
        <div className="mt-10 laptop:mt-30 p-2 laptop:p-0" ref={workRef}>
          <h1 className="text-2xl text-bold">Work.</h1>

          <div className="mt-5 laptop:mt-10 grid grid-cols-1 tablet:grid-cols-2 gap-4">
            {data.projects.map((project) => (
              <WorkCard
                key={project.id}
                img={project.imageSrc}
                name={project.title}
                description={project.description}
                onClick={() => window.open(project.url)}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 laptop:mt-30 p-2 laptop:p-0">
          <h1 className="tablet:m-10 text-2xl text-bold">Services.</h1>
          <div className="mt-5 tablet:m-10 grid grid-cols-1 laptop:grid-cols-2 gap-6">
            {data.services.map((service, index) => (
              <ServiceCard
                key={index}
                name={service.title}
                description={service.description}
              />
            ))}
          </div>
        </div>
        {/* This button should not go into production */}
        {process.env.NODE_ENV === "development" && (
          <div className="fixed bottom-5 right-5">
            <Link href="/edit">
              <Button type="primary">Edit Data</Button>
            </Link>
          </div>
        )}
        <div className="mt-10 laptop:mt-40 p-2 laptop:p-0" ref={aboutRef}>
          <h1 className="tablet:m-10 text-2xl text-bold">About.</h1>
          <p className="tablet:m-10 mt-2 text-xl laptop:text-3xl w-full laptop:w-3/5">
            {data.aboutpara}
          </p>
        </div>
        <Footer />
      </div>
    </div>
  );
}
async function formatHomepageData(homepageData) {
      // console.log('fetch home page data', homepageData);
      //check if validate data
      if (!homepageData.data) {
        console.log('failed to fetch data, terminate updating process')
      }

      homepageData = homepageData.data.attributes;

      //format social
      let socials = [];
      for (var _social of homepageData.socials.data) {
        let social = {
          id: _social.id,
          title: _social.attributes.title,
          link: _social.attributes.url
        }
        socials.push(social);
      }
      homepageData.socials = socials;

      //format projects 
      let projects = [];
      //console.log("projects", homepageData.projects);
      for (var _project of homepageData.projects.data) {
        let imageUrl = homepageData.domain +_project.attributes.image.data.attributes.url;
        let project = {
          id: _project.id || 0,
          title: _project.attributes.title || "project title",
          url: _project.attributes.url || "./",
          description: _project.attributes.description || "project description",
          imageSrc: imageUrl || "https://images.unsplash.com/photo-1487837647815-bbc1f30cd0d2?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8Njl8fHBhc3RlbHxlbnwwfHwwfA%3D%3D&auto=format&fit=crop&w=400&q=60",
        }
        // console.log('image src', project.imageSrc);
        projects.push(project);
      }
      homepageData.projects = projects;

      //format services
      let services = [];
      for (var _service of homepageData.services.data) {
        let service = {
          id: _service.id || 0,
          title: _service.attributes.title || "service title",
          description: _service.attributes.description || "service description",
        }
        // console.log('image src', project.imageSrc);
        services.push(service);
      }
      homepageData.services = services;

      // console.log("format homepage data", homepageData);
      return homepageData;
    }
export async function getStaticProps() {
  const homepageData = await fetchHomepage();
  const formatData = await formatHomepageData(homepageData);
  
  return {
    props: {
      homepageData: {
        ...tempdata,
        ...formatData},
    },
  };
}