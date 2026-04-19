import React from 'react';

/**
 * Avatar component
 * Displays a user's initials or a profile image in a circular format.
 *
 * @param {string} initials - The initials to display if no image is provided.
 * @param {string} image - Optional URL to the profile picture.
 * @param {number} size - The size of the avatar in pixels (default: 40).
 */
const Avatar = ({ initials, image, size = 40 }) => {
  const styles = {
    avatar: {
      width: size,
      height: size,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      backgroundColor: "#E2E8F0", // Default slate background
      color: "#475569",          // Default slate-600 text
      fontSize: size * 0.4,       // Responsive font size
      fontWeight: 600,
      userSelect: "none",
      flexShrink: 0,
      border: "1px solid rgba(0,0,0,0.05)"
    },
    img: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  };

  return (
    <div style={styles.avatar}>
      {image ? (
        <img src={image} alt="Avatar" style={styles.img} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
