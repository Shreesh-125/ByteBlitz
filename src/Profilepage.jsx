import React from 'react';
import Profilecontainer from './Components/Profilecontainer/Profilecontainer';
import Profilepagesidebar from './Components/Profilepagesidebar/Profilepagesidebar';
import Profilepageleftbar from './Components/Profilepageleftbar/Profilepageleftbar';

const Profilepage = () => {
  return (
    <div style={{ marginTop: 40 }}>
      <div 
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-evenly", /* Ensures centered layout */
        //   flexWrap: "wrap", /* Ensures responsiveness */
        //   maxWidth: "150px", /* Prevents overstretching */
          margin: "0 auto", /* Centers the container */
          padding: "0 20px", /* Adds spacing */
        }}
      >
        <Profilepageleftbar/>
        <Profilepagesidebar/>
      </div>
    </div>
  );
};

export default Profilepage;
