import React from 'react'

const Tab = ({ data, currentTab, setCurrentTab, type = "large" }) => {
  return (
     <div className={`flex space-x-2 md:space-x-4 bg-deepGrey border border-customWhite w-fit p-2 rounded-2xl overflow-x-auto whitespace-nowrap break-keep`}>
        { data?.map(tab => (
        <button 
            key={tab}
            className={`${type === "small" ? "py-2 px-4" : "py-2 px-6"} font-medium ${currentTab === tab ? "bg-white rounded-md shadow-sm" : "text-grey"} cursor-pointer text-xs md:text-sm break-keep whitespace-nowrap`}
            onClick={() => {
              setCurrentTab(tab)
            }} 
        >
            {tab}
        </button>
        ))
        }
    </div>
  )
}

export default Tab
