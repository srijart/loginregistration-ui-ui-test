import React, { useState } from "react";
import "./Categories.css"; 
import categories from './CategoriesData';
import TeCategoriesData  from "./TeCategoriesData"; 
import { useSelector } from "react-redux";
import HiCategoriesData from "./HiCategoriesData";
import BnCategoriesData from "./BnCategoriesData";
import MrCategoriesData from "./MrCategoriesData";
import TaCategoriesData from "./TaCategoriesData";
import UrCategoriesData from "./UrCategoriesData";
import GuCategoriesData from "./GuCategoriesData";
import KnCategoriesData from "./KnCategoriesData";
import MlCategoriesData from "./MlCategoriesData";
import categoriesDataOr from "./OrCategoriesData";
import categoriesDataPa from "./PaCategoriesData";
import categoriesDataAs from "./AsCategoriesData";
import categoriesDataNe from "./NeCategoriesData";
import categoriesDataSd from "./SdCategoriesData";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const language = useSelector(store => store.LanguageSlice.language) || { code: 'en', name: 'English' }; 

  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubCategory, setHoveredSubCategory] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [activeTopicIndex, setActiveTopicIndex] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);

  const navigate=useNavigate();

  const handleCategoryCourse = async (option, topic) => {
    navigate(`/categories?option=${option}&topic=${topic}`);
};


  var categoriesData=null;

switch (language.code) {
  case 'en':
    categoriesData = categories;
    break;
  case 'hi':
    categoriesData = HiCategoriesData;
    break;
  case 'te':
    categoriesData = TeCategoriesData;
    break;
  case 'bn':
    categoriesData = BnCategoriesData;
    break;
  case 'mr':
    categoriesData = MrCategoriesData;
    break;
  case 'ta':
    categoriesData = TaCategoriesData;
    break;
  case 'ur':
    categoriesData = UrCategoriesData;
    break;
  case 'gu':
    categoriesData = GuCategoriesData;
    break;
  case 'kn':
    categoriesData = KnCategoriesData;
    break;
  case 'ml':
    categoriesData = MlCategoriesData;
    break;
  case 'or':
    categoriesData = categoriesDataOr;
    break;
  case 'pa':
    categoriesData = categoriesDataPa;
    break;
  case 'as':
    categoriesData = categoriesDataAs;
    break;
  case 'sd':
    categoriesData = categoriesDataSd;
    break;
  case 'ne':
    categoriesData = categoriesDataNe;
    break;
  default:
    categoriesData = categories;  
}

  return (
    <div className="categories-container">
      <ul className="main-category-list">
        {categoriesData.map((category, index) => (
          <li
            key={index}
            onMouseEnter={() => {
              setHoveredCategory(index); 
              setActiveCategory(index);  
            }}
            className={index === activeCategory ? 'active' : ''}
          >
            {category.title}
          </li>
        ))}
      </ul>

      {hoveredCategory !== null && categories[hoveredCategory].subcategories && (
        <ul className="sub-category-list">
          {categoriesData[hoveredCategory].subcategories.map((subcategory, subIndex) => (
            <li
              key={subIndex}
              onMouseEnter={() => {
                setHoveredSubCategory(subIndex);
                setActiveSubCategory(subIndex);  
              }}
              className={subIndex === activeSubCategory ? 'active' : ''}
            >
              {subcategory.title}
            </li>
          ))}
        </ul>
      )}

      {hoveredCategory !== null &&
        hoveredSubCategory !== null &&
        categoriesData[hoveredCategory].subcategories &&
        categoriesData[hoveredCategory].subcategories[hoveredSubCategory] &&
        categoriesData[hoveredCategory].subcategories[hoveredSubCategory].popularTopics && (
          <ul className="popular-topics-list">
            {categoriesData[hoveredCategory].subcategories[hoveredSubCategory].popularTopics.map(
              (topic, topicIndex) => (
                <li
                  key={topicIndex}
                  onMouseEnter={() => setActiveTopicIndex(topicIndex)} 
                  onClick={()=>handleCategoryCourse('searchTerm', topic)}
                  className={topicIndex === activeTopicIndex ? 'active' : ''}
                >
                  {topic}
                </li>
              )
            )}
          </ul>
      )}
    </div>
  );
};

export default Categories;
