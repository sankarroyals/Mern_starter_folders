import React from 'react'
import './NameGenerator.css'
const NameGenerator = ({userName, sizes}) => {
  return (
      userName!== undefined && <div className='nameGenerator' title={userName} style={{ height: sizes?.height, width: sizes.width, cursor: 'pointer' }}>{userName[0]?.toUpperCase() + userName[1]?.toUpperCase()}</div>
  )
}

export default NameGenerator