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
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
              <input
                type="text"
                value={resumeData.personalInfo.name}
                onChange={(e) => updatePersonalInfo({ name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md ${
                  isDark
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
                  className={`w-full px-3 py-2 border rounded-md ${
                    isDark
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
                  className={`w-full px-3 py-2 border rounded-md ${
                    isDark
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
                className={`w-full px-3 py-2 border rounded-md ${
                  isDark
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
                className={`w-full px-3 py-2 border rounded-md ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Brief overview of your professional experience and goals..."
              />
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
                      className={`px-3 py-2 border rounded-md ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                      placeholder="Company"
                      className={`px-3 py-2 border rounded-md ${
                        isDark
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
                    className={`w-full px-3 py-2 border rounded-md ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                      placeholder="Start Date"
                      className={`px-3 py-2 border rounded-md ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        disabled={exp.current}
                        placeholder="End Date"
                        className={`flex-1 px-3 py-2 border rounded-md ${
                          isDark
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
                          className={`flex-1 px-3 py-2 border rounded-md ${
                            isDark
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
                    className={`w-full px-3 py-2 border rounded-md ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                    placeholder="Institution"
                    className={`w-full px-3 py-2 border rounded-md ${
                      isDark
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
                      className={`px-3 py-2 border rounded-md ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <input
                      type="month"
                      value={edu.graduationDate}
                      onChange={(e) => updateEducation(edu.id, { graduationDate: e.target.value })}
                      placeholder="Graduation Date"
                      className={`px-3 py-2 border rounded-md ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <input
                      type="text"
                      value={edu.gpa || ''}
                      onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                      placeholder="GPA (optional)"
                      className={`px-3 py-2 border rounded-md ${
                        isDark
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
                    className={`w-1/3 px-3 py-2 border rounded-md ${
                      isDark
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
                    className={`flex-1 px-3 py-2 border rounded-md ${
                      isDark
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
      </div>
    </div>
  );
}
