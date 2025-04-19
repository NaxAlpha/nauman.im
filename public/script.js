// Fetch resume data from API
async function fetchResumeData() {
  try {
    const response = await fetch('/api/resume');
    if (!response.ok) {
      throw new Error('Failed to fetch resume data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching resume data:', error);
    document.body.innerHTML = `<div class="error-message">
      <h2>Error loading resume data</h2>
      <p>${error.message}</p>
    </div>`;
    return null;
  }
}

// Populate page with resume data
async function populateResume() {
  const data = await fetchResumeData();
  if (!data) return;

  // Populate personal info
  document.getElementById('name').textContent = data.personal.name;
  document.getElementById('title').textContent = data.personal.title;
  
  // Populate summary
  document.getElementById('summary-text').textContent = data.summary;
  
  // Populate work experience
  const workExperienceEl = document.getElementById('work-experience');
  workExperienceEl.innerHTML = '';
  
  data.workExperience.forEach(job => {
    const jobEl = document.createElement('div');
    jobEl.className = 'job';
    
    const jobHeader = document.createElement('div');
    jobHeader.className = 'job-header';
    
    const jobTitleCompany = document.createElement('div');
    jobTitleCompany.innerHTML = `
      <div class="job-title">${job.title}</div>
      <div class="job-company">${job.company}</div>
    `;
    
    const jobPeriodLocation = document.createElement('div');
    jobPeriodLocation.innerHTML = `
      <div class="job-period">${job.period.start} - ${job.period.end}</div>
      <div class="job-location">${job.location}</div>
    `;
    
    jobHeader.appendChild(jobTitleCompany);
    jobHeader.appendChild(jobPeriodLocation);
    jobEl.appendChild(jobHeader);
    
    if (job.description) {
      const jobDesc = document.createElement('div');
      jobDesc.className = 'job-description';
      jobDesc.textContent = job.description;
      jobEl.appendChild(jobDesc);
    }
    
    if (job.achievements && job.achievements.length > 0) {
      const achievementsList = document.createElement('ul');
      job.achievements.forEach(achievement => {
        const achievementItem = document.createElement('li');
        achievementItem.textContent = achievement;
        achievementsList.appendChild(achievementItem);
      });
      jobEl.appendChild(achievementsList);
    }
    
    workExperienceEl.appendChild(jobEl);
  });
  
  // Populate skills
  const skillsEl = document.getElementById('skills');
  skillsEl.innerHTML = '';
  
  data.skills.forEach(skill => {
    const skillEl = document.createElement('div');
    skillEl.className = 'skill';
    skillEl.textContent = skill;
    skillsEl.appendChild(skillEl);
  });
  
  // Populate projects
  const projectsEl = document.getElementById('projects');
  projectsEl.innerHTML = '';
  
  data.projects.forEach(project => {
    const projectEl = document.createElement('div');
    projectEl.className = 'project';
    
    const projectHeader = document.createElement('div');
    projectHeader.className = 'project-header';
    
    const projectName = document.createElement('div');
    projectName.className = 'project-name';
    projectName.textContent = project.name;
    
    const projectDate = document.createElement('div');
    projectDate.className = 'project-date';
    projectDate.textContent = project.date;
    
    projectHeader.appendChild(projectName);
    projectHeader.appendChild(projectDate);
    
    const projectDesc = document.createElement('div');
    projectDesc.className = 'project-description';
    projectDesc.textContent = project.description;
    
    projectEl.appendChild(projectHeader);
    projectEl.appendChild(projectDesc);
    projectsEl.appendChild(projectEl);
  });
  
  // Populate education
  const educationEl = document.getElementById('education');
  educationEl.innerHTML = '';
  
  data.education.forEach(edu => {
    const eduEl = document.createElement('div');
    eduEl.className = 'education-item';
    
    const degreeEl = document.createElement('div');
    degreeEl.className = 'education-degree';
    degreeEl.textContent = edu.degree;
    
    const schoolEl = document.createElement('div');
    schoolEl.className = 'education-school';
    schoolEl.textContent = edu.institution;
    
    const periodGpaEl = document.createElement('div');
    periodGpaEl.innerHTML = `
      <span class="education-period">${edu.period.start} - ${edu.period.end}</span>
      <span class="education-gpa">${edu.gpa}</span>
    `;
    
    eduEl.appendChild(degreeEl);
    eduEl.appendChild(schoolEl);
    eduEl.appendChild(periodGpaEl);
    educationEl.appendChild(eduEl);
  });
  
  // Populate languages
  const languagesEl = document.getElementById('languages');
  languagesEl.innerHTML = '';
  
  data.languages.forEach(lang => {
    const langEl = document.createElement('div');
    langEl.className = 'language';
    langEl.innerHTML = `
      <span class="language-name">${lang.language}:</span>
      <span class="language-proficiency">${lang.proficiency}</span>
    `;
    languagesEl.appendChild(langEl);
  });
  
  // Populate interests
  const interestsEl = document.getElementById('interests');
  interestsEl.innerHTML = '';
  
  data.interests.forEach(interest => {
    const interestEl = document.createElement('div');
    interestEl.className = 'interest';
    interestEl.textContent = interest;
    interestsEl.appendChild(interestEl);
  });
  
  // Populate contact information
  const contactEl = document.getElementById('contact');
  contactEl.innerHTML = '';
  
  const contactInfo = document.createElement('div');
  contactInfo.className = 'contact-info';
  
  // Email
  const emailEl = document.createElement('div');
  emailEl.className = 'contact-item';
  emailEl.innerHTML = `<a href="mailto:${data.personal.email}">${data.personal.email}</a>`;
  contactInfo.appendChild(emailEl);
  
  // Phone
  const phoneEl = document.createElement('div');
  phoneEl.className = 'contact-item';
  phoneEl.innerHTML = `<a href="tel:${data.personal.phone}">${data.personal.phone}</a>`;
  contactInfo.appendChild(phoneEl);
  
  // Location
  const locationEl = document.createElement('div');
  locationEl.className = 'contact-item';
  locationEl.textContent = data.personal.location;
  contactInfo.appendChild(locationEl);
  
  // Social links
  if (data.personal.social) {
    for (const [platform, url] of Object.entries(data.personal.social)) {
      const socialEl = document.createElement('div');
      socialEl.className = 'contact-item';
      socialEl.innerHTML = `<a href="https://${url}" target="_blank">${platform}</a>`;
      contactInfo.appendChild(socialEl);
    }
  }
  
  contactEl.appendChild(contactInfo);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', populateResume);
