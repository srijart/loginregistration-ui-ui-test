import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { createCourse } from '../Services/courseService';
import { useTranslation } from 'react-i18next';
import ClipLoader from 'react-spinners/ClipLoader';
import QuizConfirmModal from './QuizConfirmModal';  
import './AddCourse.css';

const AddCourse = () => {
  const { t } = useTranslation();  
  const userId = localStorage.getItem('userId');
  
  const categories = ['PROGRAMMING', 'DESIGN', 'MARKETING', 'BUSINESS'];
  const subcategories = {
    PROGRAMMING: ['JAVA', 'PYTHON', 'GRAPHIC_DESIGN', 'SEO', 'MACHINE_LEARNING'],
    DESIGN: ['Graphic Design', 'UI/UX Design', 'Animation'],
    MARKETING: ['SEO', 'Content Marketing', 'Social Media'],
    BUSINESS: ['Entrepreneurship', 'Finance', 'Leadership'],
  };
  const levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
  const languages = ['ENGLISH', 'TELUGU', 'HINDI', 'MALAYALAM', 'TAMIL'];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [level, setLevel] = useState('');
  const [language, setLanguage] = useState('');
  const [sections, setSections] = useState([{ sectionTitle: '', lessons: [{ title: '', video: null }] }]);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);  
  const [courseId, setCourseId] = useState('');
  const navigate = useNavigate();

  const handleVideoChange = (sectionIndex, lessonIndex, e) => {
    const newSections = [...sections];
    const { name, files } = e.target;
  
    if (name === 'title') {
      newSections[sectionIndex].lessons[lessonIndex].title = e.target.value;
    } else if (name === 'video') {
      const file = files[0];
      newSections[sectionIndex].lessons[lessonIndex].video = file;
      toast.success("Video selected successfully.");
    }
  
    setSections(newSections);
  };
  

  const handleAddLesson = (sectionIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].lessons.push({ title: '', video: null });
    setSections(newSections);
  };

  const handleRemoveLesson = (sectionIndex, lessonIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].lessons.splice(lessonIndex, 1);
    setSections(newSections);
  };

  const handleAddSection = () => {
    setSections([...sections, { sectionTitle: '', lessons: [{ title: '', video: null }] }]);
    setActiveSectionIndex(sections.length);
  };

  const handleRemoveSection = (index) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
    setActiveSectionIndex(Math.max(0, activeSectionIndex - 1));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      toast.error("Please upload an image smaller than 2 MB.");
    } else {
      setImage(file);
      toast.success("Image selected successfully.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  
    toast.success("Uploading your course... This may take some time, please wait.");

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image);
    formData.append('category', category);
    formData.append('subCategory', subcategory);
    formData.append('level', level);
    formData.append('instructorId', userId);
    formData.append('language', language);
  
    sections.forEach((section, sectionIndex) => {
      formData.append(`sections[${sectionIndex}].title`, section.sectionTitle);
      section.lessons.forEach((lesson, lessonIndex) => {
        if (lesson.title && lesson.video) {
          formData.append(`sections[${sectionIndex}].lessons[${lessonIndex}].title`, lesson.title);
          formData.append(`sections[${sectionIndex}].lessons[${lessonIndex}].video`, lesson.video);
        }
      });
    });

    try {
      const response = await createCourse(formData);
      setLoading(false);  
      if (response.status === 201) {
        toast.success("Course added successfully!");
        setCourseId(response?.data?.data);
        setShowModal(true); 
      } else {
        toast.error("Failed to add the course. Please try again.");
      }
    } catch (error) {
      setLoading(false);  
      toast.error("An error occurred while adding the course. Ensure all entries, including title, description, video, & images, are relevant");
    }
  };
  

  const handleConfirmQuizCreation = () => {
    navigate(`/quiz-creation/${courseId}`);  
    setShowModal(false);
  };

  const handleCancelQuizCreation = () => {
    navigate('/');  
    setShowModal(false);
  };

  return (
    <div className="course-form-container">
      <h2>{t('AddNewCourse')}</h2>
      <form onSubmit={handleSubmit}>
 
        {loading && (
          <div className="loading-overlay">
            <ClipLoader color="#333333" loading={loading} size={50} />
          </div>
        )}

        <div>
          <label>{t('CourseName')}</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>{t('Description')}</label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label>{t('Price')}</label>
          <input
            type="number"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
          />
        </div>

        <div>
          <label>{t('Category')}</label>
          <select
            name="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubcategory('');
            }}
            required
          >
            <option value="">{t('SelectCategory')}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>{t('Subcategory')}</label>
          <select
            name="subcategory"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            required
            disabled={!category}
          >
            <option value="">{t('SelectSubcategory')}</option>
            {category && subcategories[category].map((subcat) => (
              <option key={subcat} value={subcat}>
                {subcat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>{t('Level')}</label>
          <select
            name="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
          >
            <option value="">{t('SelectLevel')}</option>
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>{t('Language')}</label>
          <select
            name="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
          >
            <option value="">{t('SelectLanguage')}</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>{t('UploadThumbnail')}</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {sections.map((section, sectionIndex) => (
          <div 
            key={sectionIndex} 
            className={`section-container ${activeSectionIndex === sectionIndex ? 'active-section' : ''}`}
            onClick={() => setActiveSectionIndex(sectionIndex)} 
          >
            <h3>{t('Section')} {sectionIndex + 1}</h3>
            <input
              type="text"
              placeholder={t('SectionTitle')}
              value={section.sectionTitle}
              onChange={(e) => {
                const newSections = [...sections];
                newSections[sectionIndex].sectionTitle = e.target.value;
                setSections(newSections);
              }}
              required
            />
            {section.lessons.map((lesson, lessonIndex) => (
              <div key={lessonIndex} className="video-input-container">
                <input
                  type="text"
                  placeholder={t('VideoTitle')}
                  name="title"
                  value={lesson.title}
                  onChange={(e) => handleVideoChange(sectionIndex, lessonIndex, e)}
                  required
                />
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  onChange={(e) => handleVideoChange(sectionIndex, lessonIndex, e)}
                  required
                />
                <button
                  type="button"
                  className="remove-video-btn"
                  onClick={() => handleRemoveLesson(sectionIndex, lessonIndex)}
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddLesson(sectionIndex)} className='add-remove-course-btn'
            >
              {t('AddLesson')}
            </button>
            <button
              type="button"
              onClick={() => handleRemoveSection(sectionIndex)} className='add-remove-course-btn'
            >
              {t('RemoveSection')}
            </button>
          </div>
        ))}

        <button type="button" onClick={handleAddSection} className='add-another-course-btn'>
          {t('AddAnotherSection')}
        </button>

        <button type="submit">{t('AddCourse')}</button>
      </form>

      <QuizConfirmModal 
        isOpen={showModal}
        title={t('QuizCreation')}
        message={t('CreateQuizzesForCourse')}
        onConfirm={handleConfirmQuizCreation}
        onCancel={handleCancelQuizCreation}
      />

     </div>
  );
};

export default AddCourse;
