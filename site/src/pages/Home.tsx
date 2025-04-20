import { FC } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Home: FC = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Nauman Mustafa's Portfolio</h1>
      <p>Senior Machine Learning Engineer</p>
      
      <div className="resume-link-container">
        <Link to="/resume" className="resume-link">
          View My Resume
        </Link>
      </div>
      
      <div className="home-description">
        <p>
          Machine Learning expert with over 6 years of experience specializing in developing
          AI solutions, including deep learning models, OCR systems, and LLM-powered tools.
        </p>
      </div>
    </div>
  );
};

export default Home;
