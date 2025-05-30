import { useState, ReactNode } from "react";

function Accordion(props: { title: ReactNode; content: ReactNode; defaultExpanded?: boolean }) {
  const { title, content, defaultExpanded = true } = props
  const [expanded, setExpanded] = useState(defaultExpanded)
  const toggleExpanded = () => setExpanded((current) => !current)
  const minusIcon = '-'
  const plusIcon = '+'

  return (
    <div className="my-2 sm:my-4 md:my-6 shadow-sm cursor-pointer bg-white">
      <div className="px-6 text-left items-center h-20 select-none flex justify-between flex-row">
        <h5 className="flex-1">
          {title}
        </h5>
        <div
          onClick={toggleExpanded}
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
          {expanded ? minusIcon : plusIcon}
        </div>
      </div>
      <div className={`px-6 pt-0 overflow-hidden transition-[max-height] duration-500 ease-in ${expanded ? "max-h-40" : "max-h-0"}`}>
        <p className="pb-4 text-left">
          {content}
        </p>
      </div>
    </div>
  )
}

export default Accordion;