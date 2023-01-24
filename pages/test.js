// import React from "react"
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cursor from "../components/Cursor";
import Header from "../components/Header";
import ProjectResume from "../components/ProjectResume";
import Socials from "../components/Socials";
import Button from "../components/Button";
import { useTheme } from "next-themes";
//// Data
//// import { name, showResume } from "../data/portfolio.json";
//// import { resume } from "../data/portfolio.json";
import data from "../data/portfolio.json";

async function fetchResume() {

  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)"
  }

  let response = await fetch("https://Strapi-CMS.doremi31618.repl.co/api/resume?populate=*", {
    method: "GET",
    headers: headersList
  });

  let data = await response.json();//await JSON.parse(response);
  // console.log("resume response", data);

  return data;


}
export default function Resume () {
  const router = useRouter();
  const theme = useTheme();
  const [mount, setMount] = useState(false);
  const [resume, setResume] = useState(data.resume);
  let {name, showResume} = resume;

  
  useEffect(async () => {
    setMount(true);
    // if (!showResume) {
    //   router.push("/");
    // }
    
    let resumeData = await fetchResume();
    console.log('resume data', resumeData);
    //first test point
    if (!resumeData.data) {
      console.log('failed to fetch data');
      return;
    }

    //format resume
    resumeData = resumeData.data.attributes;

    //format resume/ education
    const universityName = resumeData.educations.data[0].name || "NTUT - National Taipei University of Technology (Interactive Design)";
    const universityDate = resumeData.educations.data[0].date || "2015-2020";
    const universityPara = resumeData.educations.data[0].para || "about university and major";
    let education = {
      universityName,
      universityDate,
      universityPara,
    }
    resumeData.education = education;

    //format resume/ experiences
    const experiences = [];
    for (var _exp of resumeData.experiences.data) {
      let bullets = "system design,software architect";//_exp.attributes.bullets !== null ? _exp.attributes.bullets.split("\n") : ["system design","software architect"]
      let exp = {
        id : _exp.id,
        dates : _exp.attributes.date,
        type : "FULL TIME",
        position : _exp.attributes.position,
        bullets,
      }
      experiences.push(exp)
    }
    resumeData.experiences = experiences;
    
    //format resume/ language
    const languages = [];
    for (var _lan of resumeData.languages.data) {
      let lan = _lan.attributes.name;
      languages.push(lan);
    }
    resumeData.languages = languages;
    
    //format resume/ framework
    const frameworks = [];
    for (var _framwork of resumeData.frameworks.data) {
      let framework = _framwork.attributes.name;
      frameworks.push(framework);
    }
    resumeData.frameworks = frameworks;
    
    
    //format resume/ otherskill
    const others = [];
    for (var _other of resumeData.otherskills.data) {
      let other = _other.attributes.name;
      others.push(other);
    }
    resumeData.others = others;
    setResume(prev=>{
      return {
        ...prev,
        ...resumeData
      }
    })
    /*

    
    */
  }, []);
  
  // return <div>resume page ver1</div>

  return (
    <>
      <div
        className={`container mx-auto mb-10 ${data.showCursor && "cursor-none"
          }`}
      >
        <Header isBlog />
        {mount && (
          <div className="mt-10 w-full flex flex-col items-center">
            <div
              className={`w-full ${mount && theme.theme === "dark" ? "bg-slate-800" : "bg-gray-50"
                } max-w-4xl p-20 mob:p-5 desktop:p-20 rounded-lg shadow-sm`}
            >
              <h1 className="text-3xl font-bold">{name}</h1>
              <h2 className="text-xl mt-5">{resume.tagline}</h2>
              <h2 className="w-4/5 text-xl mt-5 opacity-50">
                {resume.description}
              </h2>
              <div className="mt-2">
                <Socials />
              </div>
              <div className="mt-5">
                <h1 className="text-2xl font-bold">Experience</h1>

                {resume.experiences.map(
                  ({ id, dates, type, position, bullets }) => (
                    <ProjectResume
                      key={id}
                      dates={dates}
                      type={type}
                      position={position}
                      bullets={bullets}
                    ></ProjectResume>
                  )
                )}
              </div>
              <div className="mt-5">
                <h1 className="text-2xl font-bold">Education</h1>
                <div className="mt-2">
                  <h2 className="text-lg">{resume.education.universityName}</h2>
                  <h3 className="text-sm opacity-75">
                    {resume.education.universityDate}
                  </h3>
                  <p className="text-sm mt-2 opacity-50">
                    {resume.education.universityPara}
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <h1 className="text-2xl font-bold">Skills</h1>
                <div className="flex mob:flex-col desktop:flex-row justify-between">
                  {resume.languages && (
                    <div className="mt-2 mob:mt-5">
                      <h2 className="text-lg">Languages</h2>
                      <ul className="list-disc">
                        {resume.languages.map((language, index) => (
                          <li key={index} className="ml-5 py-2">
                            {language}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {resume.frameworks && (
                    <div className="mt-2 mob:mt-5">
                      <h2 className="text-lg">Frameworks</h2>
                      <ul className="list-disc">
                        {resume.frameworks.map((framework, index) => (
                          <li key={index} className="ml-5 py-2">
                            {framework}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {resume.others && (
                    <div className="mt-2 mob:mt-5">
                      <h2 className="text-lg">Others</h2>
                      <ul className="list-disc">
                        {resume.others.map((other, index) => (
                          <li key={index} className="ml-5 py-2">
                            {other}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};



/*
export default function Resume(){
  const router = useRouter();
  const theme = useTheme();
  const [mount, setMount] = useState(false);
  const [resume, setResume] = useState(data.resume);
  let {name, showResume} = resume;
  
  
  
*/
