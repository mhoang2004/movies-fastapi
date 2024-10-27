import React, { useState } from 'react'

const SortButton = ({ name, onSortChange }) => {
  const [iconClass, setIconClass] = useState('fa-solid fa-sort')

  const handleSort = (e) => {
    const sortField = e.currentTarget.name

    if (iconClass === 'fa-solid fa-sort-up') {
      setIconClass('fa-solid fa-sort-down')
      onSortChange(sortField, 1)
    } else if (iconClass === 'fa-solid fa-sort') {
      setIconClass('fa-solid fa-sort-up')
      onSortChange(sortField, -1)
    } else {
      setIconClass('fa-solid fa-sort')
      onSortChange(sortField, 0)
    }
  }

  return (
    <button
      className="btn p-0 border-0"
      name={name} // or any other field name like "name", "imdb"
      onClick={handleSort}
    >
      <i className={iconClass}></i>
    </button>
  )
}

export default SortButton
