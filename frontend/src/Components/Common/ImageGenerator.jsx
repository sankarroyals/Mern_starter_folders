import React from 'react'

const ImageGenerator = ({userName, img, sizes}) => {
  return (
      <div title={userName} style={{ cursor: 'pointer' }}>
          <img
              style={{
                  borderRadius: "50%",
                  cursor: "pointer",
                  maxWidth: "100%",
                  height: sizes?.height, width: sizes.width, marginLeft: '0',
                  display: 'block'
              }}
              src={img}
              alt="Profile"
          />
      </div>
  )
}

export default ImageGenerator