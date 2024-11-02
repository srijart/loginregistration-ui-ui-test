import React, { useState } from "react";
import "./Categories.css";  
import categories from './CategoriesData';  
import { useLocation, useNavigate } from "react-router-dom";

const MobileCategories = ({ handleCat }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);

  const handleCategoryClick = (index) => {
    setActiveCategory(index);
    setActiveSubCategory(null); 
  };

  const handleSubCategoryClick = (subIndex) => {
    setActiveSubCategory(subIndex); // Set active subcategory to show popular topics
  };

  const handleBackClick = () => {
    if (activeSubCategory !== null) {
      setActiveSubCategory(null); 
    } else {
      setActiveCategory(null);  
    }
  };

  const location = useLocation();

  const navigate=useNavigate();

  const handleCategoryCourse = async (option, topic) => {
    // event.stopPropagation();
    navigate(`/categories?option=${option}&topic=${topic}`);
    handleCat();
};

const handleBack=(event)=>{
    event.stopPropagation();
    handleCat();
}
  return (
    <div className={`mobile-categories-container ${activeCategory !== null ? 'active' : ''} ${location.pathname === "/" ? "navmob-bg" : "navmob-bg2"}`}>
      <div className="mobile-categories-dropdown">
        {activeCategory === null ? (
          <div>
            <button className="back-button" onClick={handleBack}>
              Back
            </button>
            <ul className="mobile-main-category-list">
              {categories.map((category, index) => (
                <li
                  key={index}
                  className="mobile-category-item"
                  onClick={() => handleCategoryClick(index)}
                >
                  {category.title}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <button className="back-button" onClick={handleBackClick}>
              Back
            </button>
            {activeSubCategory === null ? (
              <ul className="mobile-sub-category-list">
                {categories[activeCategory].subcategories.map((subcategory, subIndex) => (
                  <li
                    key={subIndex}
                    className="mobile-sub-category-item"
                    onClick={() => handleSubCategoryClick(subIndex)}
                  >
                    {subcategory.title}
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                <ul className="mobile-popular-topics-list">
                  {categories[activeCategory].subcategories[activeSubCategory].popularTopics.map((topic, topicIndex) => (
                    <li
                      key={topicIndex}
                      className="mobile-topic-item"
                      onClick={()=>handleCategoryCourse('subCategory', topic)}
                      >
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileCategories;
