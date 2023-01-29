import React from "react";
import Button from "../Button";

import yourData from "../../data/portfolio.json";

const Socials = ({ className, socialDataList }) => {
  if (!socialDataList || socialDataList.length == 0) {
    socialDataList = yourData.socials;
  }
  return (
    <div className={`${className} flex flex-wrap mob:flex-nowrap link`}>
      {
        socialDataList.map((social, index) => (
          <Button key={index} onClick={() => window.open(social.link)}>
            {social.title}
          </Button>
        ))
        //   yourData.socials.map((social, index) => (
        //   <Button key={index} onClick={() => window.open(social.link)}>
        //     {social.title}
        //   </Button>
        // ))
      }
    </div>
  );
};

export default Socials;
