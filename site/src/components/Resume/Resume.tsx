import { FC } from 'react';
import resumeData from '../../../public/data/data.json';
import './Resume.css';

const Resume: FC = () => {
  const { personal, summary, workExperience, skills, languages, projects, interests, education } = resumeData;

  return (
    <div className="resume-wrapper">
      <div className="resume-container">
        {/* Sidebar */}
        <aside className="resume-sidebar">
          <div className="profile-container">
            <img src="/data/photo.png" alt={personal.name} className="profile-photo" />
            <h1 className="name">{personal.name}</h1>
            <p className="title">{personal.title}</p>
          </div>

          <div className="contact-info">
            <h3 className="sidebar-heading">Contact</h3>
            <div className="info-item">
              <span className="icon">✉️</span>
              <a href={`mailto:${personal.email}`}>{personal.email}</a>
            </div>
            <div className="info-item">
              <span className="icon">📱</span>
              <a href={`tel:${personal.phone}`}>{personal.phone}</a>
            </div>
            <div className="info-item">
              <span className="icon">📍</span>
              <span>{personal.location}</span>
            </div>
          </div>

          <div className="social-links">
            <h3 className="sidebar-heading">Connect</h3>
            <div className="info-item">
              <span className="icon">🔗</span>
              <a href={`https://${personal.social.linkedin}`} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
            <div className="info-item">
              <span className="icon">💻</span>
              <a href={`https://${personal.social.github}`} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </div>
            <div className="info-item">
              <span className="icon">📝</span>
              <a href={`https://${personal.social.medium}`} target="_blank" rel="noopener noreferrer">
                Medium
              </a>
            </div>
          </div>

          <div className="skills-section">
            <h3 className="sidebar-heading">Skills</h3>
            <div className="skills-container">
              {skills.map((skill, index) => (
                <div key={`skill-${index}`} className="skill-badge">
                  {skill}
                </div>
              ))}
            </div>
          </div>

          <div className="languages-section">
            <h3 className="sidebar-heading">Languages</h3>
            {languages.map((lang, index) => (
              <div key={`language-${index}`} className="language-item">
                <div className="language-name">{lang.language}</div>
                <div className="language-proficiency">{lang.proficiency}</div>
              </div>
            ))}
          </div>

          <div className="interests-section">
            <h3 className="sidebar-heading">Interests</h3>
            <div className="interests-container">
              {interests.map((interest, index) => (
                <span key={`interest-${index}`} className="interest-tag">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="resume-main">
          <section className="about-section">
            <h2 className="main-heading">About Me</h2>
            <p className="summary">{summary}</p>
          </section>

          <section className="experience-section">
            <h2 className="main-heading">Work Experience</h2>
            {workExperience.map((job, index) => (
              <div key={`job-${index}`} className="experience-item">
                <div className="experience-header">
                  <div className="job-title-company">
                    <h3 className="job-title">{job.title}</h3>
                    <h4 className="company-name">
                      <a href={job.companyUrl} target="_blank" rel="noopener noreferrer" className="company-link">
                        {job.company}
                      </a>
                    </h4>
                    {job.description && <p className="job-description">{job.description}</p>}
                  </div>
                  <div className="job-meta">
                    <div className="job-period">{job.period.start} - {job.period.end}</div>
                    <div className="job-location">{job.location}</div>
                  </div>
                </div>
                <ul className="achievements-list">
                  {job.achievements.map((achievement, i) => (
                    <li key={`achievement-${index}-${i}`}>{achievement}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="projects-section">
            <h2 className="main-heading">Projects</h2>
            <div className="projects-container">
              {projects.map((project, index) => (
                <div key={`project-${index}`} className="project-item">
                  <div className="project-header">
                    <h3 className="project-name">
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="project-link">
                        {project.name}
                      </a>
                    </h3>
                    <span className="project-date">{project.date}</span>
                  </div>
                  <p className="project-description">{project.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="education-section">
            <h2 className="main-heading">Education</h2>
            {education.map((edu, index) => (
              <div key={`education-${index}`} className="education-item">
                <div className="education-header">
                  <div className="education-details">
                    <h3 className="degree">{edu.degree}</h3>
                    <h4 className="institution">
                      <a href={edu.institutionUrl} target="_blank" rel="noopener noreferrer" className="institution-link">
                        {edu.institution}
                      </a>
                    </h4>
                  </div>
                  <div className="education-meta">
                    <div className="education-period">{edu.period.start} - {edu.period.end}</div>
                    <div className="education-gpa">GPA: {edu.gpa}</div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Resume;
