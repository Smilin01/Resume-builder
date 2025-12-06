import { useResumeStore } from '../store/resumeStore';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export function VisualEditor() {
  const {
    resumeData,
    updatePersonalInfo,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkillCategory,
    updateSkillCategory,
    deleteSkillCategory,
    addCustomSection,
    updateCustomSection,
    deleteCustomSection,
    settings,
  } = useResumeStore();

  const isDark = settings.theme === 'dark';

  return (
    <div className={`h-full overflow-y-auto ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <section className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Personal Information
          </h2>
          <div className="space-y-4">
            {settings.template === 'glacial' && (
              <div className="flex items-center gap-6 pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/30 p-1">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                      {resumeData.personalInfo.profileImage ? (
                        <img
                          src={resumeData.personalInfo.profileImage}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20">
                          <svg className="h-10 w-10 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  {resumeData.personalInfo.profileImage && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Profile Picture
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Upload a professional photo • Square image • Max 1MB
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {resumeData.personalInfo.profileImage ? 'Change' : 'Upload'}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 1024 * 1024) {
                              alert('File size must be less than 1MB');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              updatePersonalInfo({ profileImage: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {resumeData.personalInfo.profileImage && (
                      <button
                        onClick={() => updatePersonalInfo({ profileImage: '' })}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${isDark
                          ? 'bg-gray-700 text-gray-300 hover:bg-red-900/30 hover:text-red-400'
                          : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
                          }`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
              <input
                type="text"
                value={resumeData.personalInfo.name}
                onChange={(e) => updatePersonalInfo({ name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md ${isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                  }`}
                placeholder="John Doe"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email
                </label>
                <input
                  type="email"
                  value={resumeData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  placeholder="+1-555-123-4567"
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Location
              </label>
              <input
                type="text"
                value={resumeData.personalInfo.location}
                onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md ${isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                  }`}
                placeholder="San Francisco, CA"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Professional Summary
                <span className="text-xs ml-2 text-gray-500">
                  {resumeData.personalInfo.summary.length}/500
                </span>
              </label>
              <textarea
                value={resumeData.personalInfo.summary}
                onChange={(e) => updatePersonalInfo({ summary: e.target.value.slice(0, 500) })}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md ${isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                  }`}
                placeholder="Brief overview of your professional experience and goals..."
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Social Profiles & Links
              </label>
              <div className="space-y-2">
                {resumeData.personalInfo.profiles.map((profile, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={profile.network}
                      onChange={(e) => {
                        const newProfiles = [...resumeData.personalInfo.profiles];
                        newProfiles[index].network = e.target.value;
                        updatePersonalInfo({ profiles: newProfiles });
                      }}
                      placeholder="Network (e.g. LinkedIn)"
                      className={`w-1/3 px-3 py-2 border rounded-md ${isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    />
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) => {
                        const newProfiles = [...resumeData.personalInfo.profiles];
                        newProfiles[index].username = e.target.value;
                        updatePersonalInfo({ profiles: newProfiles });
                      }}
                      placeholder="Username/Text"
                      className={`w-1/3 px-3 py-2 border rounded-md ${isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    />
                    <input
                      type="text"
                      value={profile.url}
                      onChange={(e) => {
                        const newProfiles = [...resumeData.personalInfo.profiles];
                        newProfiles[index].url = e.target.value;
                        updatePersonalInfo({ profiles: newProfiles });
                      }}
                      placeholder="URL"
                      className={`flex-1 px-3 py-2 border rounded-md ${isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    />
                    <button
                      onClick={() => {
                        const newProfiles = resumeData.personalInfo.profiles.filter((_, i) => i !== index);
                        updatePersonalInfo({ profiles: newProfiles });
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newProfiles = [...resumeData.personalInfo.profiles, { network: '', username: '', url: '' }];
                    updatePersonalInfo({ profiles: newProfiles });
                  }}
                  className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  + Add Profile Link
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Experience</h2>
            <button
              onClick={() =>
                addExperience({
                  jobTitle: '',
                  company: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  current: false,
                  bulletPoints: [''],
                })
              }
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </button>
          </div>

          <div className="space-y-6">
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id} className={`p-4 border rounded-md ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <GripVertical className={`h-5 w-5 mr-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Position {index + 1}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteExperience(exp.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={exp.jobTitle}
                      onChange={(e) => updateExperience(exp.id, { jobTitle: e.target.value })}
                      placeholder="Job Title"
                      className={`px-3 py-2 border rounded-md ${isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                      placeholder="Company"
                      className={`px-3 py-2 border rounded-md ${isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    />
                  </div>

                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                    placeholder="Location"
                    className={`w-full px-3 py-2 border rounded-md ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                      }`}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                      placeholder="Start Date"
                      className={`px-3 py-2 border rounded-md ${isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        disabled={exp.current}
                        placeholder="End Date"
                        className={`flex-1 px-3 py-2 border rounded-md ${isDark
                          ? 'bg-gray-700 border-gray-600 text-white disabled:opacity-50'
                          : 'bg-white border-gray-300 text-gray-900 disabled:opacity-50'
                          }`}
                      />
                      <label className="flex items-center whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) =>
                            updateExperience(exp.id, { current: e.target.checked, endDate: '' })
                          }
                          className="mr-2"
                        />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Current</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Key Achievements
                    </label>
                    {exp.bulletPoints.map((bullet, bIndex) => (
                      <div key={bIndex} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => {
                            const newBullets = [...exp.bulletPoints];
                            newBullets[bIndex] = e.target.value;
                            updateExperience(exp.id, { bulletPoints: newBullets });
                          }}
                          placeholder={`Achievement ${bIndex + 1}`}
                          className={`flex-1 px-3 py-2 border rounded-md ${isDark
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                            }`}
                        />
                        <button
                          onClick={() => {
                            const newBullets = exp.bulletPoints.filter((_, i) => i !== bIndex);
                            updateExperience(exp.id, { bulletPoints: newBullets });
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newBullets = [...exp.bulletPoints, ''];
                        updateExperience(exp.id, { bulletPoints: newBullets });
                      }}
                      className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                    >
                      + Add achievement
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Education</h2>
            <button
              onClick={() =>
                addEducation({
                  degree: '',
                  institution: '',
                  location: '',
                  graduationDate: '',
                  gpa: '',
                })
              }
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </button>
          </div>

          <div className="space-y-6">
            {resumeData.education.map((edu, index) => (
              <div key={edu.id} className={`p-4 border rounded-md ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between mb-4">
                  <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Education {index + 1}
                  </span>
                  <button onClick={() => deleteEducation(edu.id)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                    placeholder="Degree (e.g., Bachelor of Science in Computer Science)"
                    className={`w-full px-3 py-2 border rounded-md ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                      }`}
                  />
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                    placeholder="Institution"
                    className={`w-full px-3 py-2 border rounded-md ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                      }`}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                      placeholder="Location"
                      className={`px-3 py-2 border rounded-md ${isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    />
                    <input
                      type="text"
                      value={edu.graduationDate}
                      onChange={(e) => updateEducation(edu.id, { graduationDate: e.target.value })}
                      placeholder="Graduation Date"
                      className={`px-3 py-2 border rounded-md ${isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    />
                    <input
                      type="text"
                      value={edu.gpa || ''}
                      onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                      placeholder="GPA (optional)"
                      className={`px-3 py-2 border rounded-md ${isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Skills</h2>
            <button
              onClick={() => addSkillCategory({ category: '', skills: [] })}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </button>
          </div>

          <div className="space-y-4">
            {resumeData.skills.map((skillCat) => (
              <div key={skillCat.id} className={`p-4 border rounded-md ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex gap-3 items-start">
                  <input
                    type="text"
                    value={skillCat.category}
                    onChange={(e) => updateSkillCategory(skillCat.id, { category: e.target.value })}
                    placeholder="Category (e.g., Programming Languages)"
                    className={`w-1/3 px-3 py-2 border rounded-md ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                      }`}
                  />
                  <input
                    type="text"
                    value={skillCat.skills.join(', ')}
                    onChange={(e) =>
                      updateSkillCategory(skillCat.id, {
                        skills: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                    placeholder="Skills (comma-separated)"
                    className={`flex-1 px-3 py-2 border rounded-md ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                      }`}
                  />
                  <button
                    onClick={() => deleteSkillCategory(skillCat.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Custom Sections */}
        <section className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Additional Sections</h2>
            <button
              onClick={() => addCustomSection({ title: '', items: [''] })}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </button>
          </div>

          <div className="space-y-6">
            {resumeData.customSections.map((section) => (
              <div key={section.id} className={`p-4 border rounded-md ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between mb-4">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateCustomSection(section.id, { title: e.target.value })}
                    placeholder="Section Title (e.g., Hobbies, Awards)"
                    className={`text-lg font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none ${isDark ? 'text-white' : 'text-gray-900'
                      }`}
                  />
                  <button
                    onClick={() => deleteCustomSection(section.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {section.items.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newItems = [...section.items];
                          newItems[index] = e.target.value;
                          updateCustomSection(section.id, { items: newItems });
                        }}
                        placeholder={`Item ${index + 1}`}
                        className={`flex-1 px-3 py-2 border rounded-md ${isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                          }`}
                      />
                      <button
                        onClick={() => {
                          const newItems = section.items.filter((_, i) => i !== index);
                          updateCustomSection(section.id, { items: newItems });
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newItems = [...section.items, ''];
                      updateCustomSection(section.id, { items: newItems });
                    }}
                    className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                  >
                    + Add item
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
