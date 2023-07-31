import React from "react";
import homeBanner from "../images/homeMain.png";

function HomeBanner() {
  return (
    <div className="homeBanner">
      <div className="banner-left">
        <img src={homeBanner} alt="" />
      </div>
      <div className="banner-right">
        <div className="bannerHead">
          Add your products and give your valuable feedback
        </div>
        <p>
          Easily give your feedback in a matter of minutes. Access your audience
          on all platforms. Observe result manually in real time
        </p>
      </div>
    </div>
  );
}

export default HomeBanner;
