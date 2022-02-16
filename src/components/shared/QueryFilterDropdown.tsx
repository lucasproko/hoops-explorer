// React imports:
import React, { useState } from 'react';

// Icons:
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

// App imports
import GenericTogglingMenuItem from "./GenericTogglingMenuItem";
import { CommonFilterType, QueryUtils } from "../../utils/QueryUtils";

type Props = {
   queryFilters: CommonFilterType[],
   setQueryFilters: (newQueryFilter: CommonFilterType[]) => void
};

const QueryFilterDropdown: React.FunctionComponent<Props> = ({queryFilters, setQueryFilters}) => {

   const filterMenuItem = (item: CommonFilterType, text: String) => {
      return <GenericTogglingMenuItem
        text={text}
        truthVal={QueryUtils.filterHas(queryFilters, item)}
        onSelect={() => setQueryFilters(QueryUtils.toggleFilter(queryFilters, item))}
      />;
    };
  
   return  <Dropdown as={InputGroup.Append} variant="outline-secondary" alignRight>
   <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
     <FontAwesomeIcon icon={faFilter} />
   </Dropdown.Toggle>
   <Dropdown.Menu>
     {filterMenuItem("Conf", "Conference games only")}
     <Dropdown.Divider />
     {filterMenuItem("Home", "Home games only")}
     {filterMenuItem("Away", "Away games only")}
     {filterMenuItem("Not-Home", "Away/Neutral games only")}
     <Dropdown.Divider />
     {filterMenuItem("Nov-Dec", "Nov/Dec only")}
     {filterMenuItem("Jan-Apr", "Jan-Apr only")}
     {filterMenuItem("Last-30d", "Last 30 days only")}
     <Dropdown.Divider />
     <Dropdown.Item as={Button}>
       <div onClick={() => {setQueryFilters([])}}>
         <span>Clear all query filters</span>
       </div>
     </Dropdown.Item>
   </Dropdown.Menu>
 </Dropdown>;
};
export default QueryFilterDropdown;
