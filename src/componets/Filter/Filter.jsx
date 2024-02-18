import React, { useContext, useState } from 'react';
import './filter.scss';
import { FaSearch } from 'react-icons/fa';
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from "classnames";
import { Apicontext } from '../Context/Context';
import { LuSearchX } from "react-icons/lu";
const Dropdown = ({ isOpen, toggleDropdown, selectedItem, handleItemClick, items }) => {
  const uniqueItems = Array.from(new Set(items)); // Ensure unique items
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="dropdown-menu"
        >
          {uniqueItems.map((item, index) => ( // Use index as key for unique identification
            <p key={index} className="items" onClick={() => handleItemClick(item)}>
              {item}
            </p>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const Filter = () => {
  const { mode, searchkey, setsearchkey, filtertype, setfiltertype, filterprice, setfilterprice, product, resultfound } = useContext(Apicontext);
  const [isOpen1, setIsOpen1] = useState(false);
  const [selectedItem1, setSelectedItem1] = useState(null);
  const [isOpen2, setIsOpen2] = useState(false);
  const [selectedItem2, setSelectedItem2] = useState(null);

  const toggleDropdown1 = () => {
    setIsOpen1(!isOpen1);
  };

  const handleItemClick1 = (item) => {
    setSelectedItem1(item);
    setfiltertype(item);
    setIsOpen1(false);
  };

  const toggleDropdown2 = () => {
    setIsOpen2(!isOpen2);
  };

  const handleItemClick2 = (item) => {
    setSelectedItem2(item);
    setfilterprice(item);
    setIsOpen2(false);
  };

  const resetFilter = () => {
    setIsOpen1(false);
    setIsOpen2(false);
    setSelectedItem1(null);
    setSelectedItem2(null);
    setfilterprice("");
    setfiltertype("");
  };

  const darkmode = classNames("section2", { mode: !mode });

  return (
    <section className={darkmode}>
      
      <div className="filter-div">
        <div className="search-box">
          <span>
            <FaSearch />
          </span>
          <input type="text" onChange={(e) => setsearchkey(e.target.value)} value={searchkey} placeholder="Search items..." />
        </div>
        {resultfound &&
          <div className="noresult">
            <span>No Result Found <small><LuSearchX /></small> </span>
          </div>
        }

        <div className="h2">
          <h1 onClick={resetFilter}>Reset Filter</h1>
        </div>

        <div className="dropdown">
          <motion.div className="item">
            <div className="item-div">
              <h2>{selectedItem1 ? selectedItem1 : 'By Category'}</h2>
              <p onClick={toggleDropdown1}>
                {isOpen1 ? <IoMdArrowDropupCircle /> : <IoMdArrowDropdownCircle />}
              </p>
            </div>
            <Dropdown
              isOpen={isOpen1}
              toggleDropdown={toggleDropdown1}
              selectedItem={selectedItem1}
              handleItemClick={handleItemClick1}
              items={product.map((item) => item.category)}
            />
          </motion.div>

          <motion.div className="item">
            <div className="item-div">
              <h2>{selectedItem2 ? selectedItem2 : 'By Money'}</h2>
              <p onClick={toggleDropdown2}>
                {isOpen2 ? <IoMdArrowDropupCircle /> : <IoMdArrowDropdownCircle />}
              </p>
            </div>
            <Dropdown
              isOpen={isOpen2}
              toggleDropdown={toggleDropdown2}
              selectedItem={selectedItem2}
              handleItemClick={handleItemClick2}
              items={['Under-500', '500-1000', 'Upto-1000']}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
