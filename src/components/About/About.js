import React from 'react'
import "./About.css";


function About() {
  return (
    <>
      <div className="about-page">
        <h1>About Us</h1>
      </div>

      <div>
        <div className="image-container ">
          <img
            src={"./images/DaveP.jpg"}
            alt="DavePicture "
            className="img-thumbnail"
            width="200"
            height="250"
          />

          <p>
            <h3>Dave Paquette</h3>
            <span className="container">
              Dave is a front-end and back-end developer in the middle of a
              fellowship that is React JS focused. He also had some graet
              experience in some coding languages and frameworks likes:
              JavaScript, HTML, CSS, Java, Python, SQL, AWS, and GCP. Other
              Interests: - College sports. - Reading novels.
            </span>

            <a href="https://github.com/DaveP80">GitHub</a>
          </p>
        </div>

        <div className="image-container ">
          <img
            src={"./images/RubensL.jpg"}
            alt="RubensPicture "
            className="img-thumbnail"
            width="200"
            height="250"
          />

          <p>
            <h3>Rubens Lombard</h3>
            <span className="container">
              Rubens has been always believed in the development of technology.
              Since computer was introduce to him in the 90's. He had never seen
              himself learning or working in the software industry. After trying
              to become an Computer and Technology engeneer without success, he
              is the way to become a full-Stack developer with the Pursuit.org
              fellowship. He had some some coding experience JavaScript, HTML,
              CSS and React.
            </span>
            <a href="https://github.com/Lumbarudi24">GitHub</a>
          </p>
        </div>
      </div>
    </>
  );
  
}

export default About