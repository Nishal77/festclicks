export function imageGalleryStyles(
  columnCount,
  columnWidth,
  gapSize = 24,
  fixedCaption = false
) {
  const modalThumbnailSectionHeight = "20vh";
  const galleryContainerStyle = {
    columnCount,
    columnWidth: `${columnWidth}px`,
    columnGap: `${gapSize}px`,
  };
  const imageBtnStyle = {
    border: "none",
    background: "none",
    margin: 0,
    padding: 0,
  };
  const imageContainerStyle = {
    margin: `0 0 ${gapSize}px`,
    position: "relative",
  };
  const imageStyle = {
    width: "100%",
    aspectRatio: "1/1 auto",
    backgroundColor: "#D3D3D3",
    cursor: "pointer",
    borderRadius: "12px", // Added for modern look
    transition: "transform 0.3s ease, box-shadow 0.3s ease", // Added for hover effects
    objectFit: "cover" // Ensure images cover the container nicely
  };
  const imageCaptionStyle = {
    opacity: fixedCaption ? 1 : 0,
    transition: fixedCaption ? undefined : "opacity 1s ease-in-out",
    position: "absolute",
    left: 0,
    bottom: 0,
    zIndex: "1000",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    background:
      "linear-gradient(180deg, rgba(25, 27, 38, 0), rgba(25, 27, 38, 1))",
    padding: "16px",
    fontSize: "0.85rem",
    textAlign: "center",
    color: "#fff",
    borderBottomLeftRadius: "12px", // Match the image border radius
    borderBottomRightRadius: "12px" // Match the image border radius
  };
  const modalContainerStyle = {
    outline: "none",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.85)", // Slightly darker
    WebkitBackdropFilter: "blur(5px)",
    backdropFilter: "blur(5px)",
  };
  const modalSlideNumberStyle = {
    zIndex: 1,
    position: "absolute",
    left: 0,
    padding: "13px",
    backgroundColor: "rgba(35, 35, 35, 0.73)",
    color: "#fff",
    fontSize: "0.93rem",
    transition: "opacity 1s ease-in-out",
    userSelect: "none",
    WebkitUserSelect: "none",
  };
  const modalToolbarStyle = {
    zIndex: 1,
    display: "flex",
    position: "absolute",
    right: 0,
    alignItems: "center",
    backgroundColor: "rgba(35, 35, 35, 0.73)",
    transition: "opacity 1s ease-in-out",
    cursor: "pointer",
  };
  const modalToolbarBtnStyle = {
    margin: 0,
    border: "none",
    background: "none",
    padding: "13px",
    color: "#fff",
    cursor: "pointer",
  };
  const modalSlideShowSectionStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "inherit",
    transition: "height .7s linear",
  };
  const modalImageStyle = {
    margin: "auto",
    maxWidth: "100vw",
    transition: "height .7s linear",
    borderRadius: "4px",
  };
  const modalSlideBtnStyle = {
    position: "absolute",
    border: "none",
    marginInline: "7px",
    padding: "10px 15px",
    backgroundColor: "rgba(35, 35, 35, 0.73)",
    color: "#fff",
    transition: "opacity 1s ease-in-out",
    cursor: "pointer",
    userSelect: "none",
    WebkitUserSelect: "none",
    borderRadius: "50%", // Make slide buttons circular
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };
  const modalThumbnailSectionStyle = {
    overflow: "hidden",
    height: `${modalThumbnailSectionHeight}`,
    textAlign: "center",
  };
  const modalThumbImgsPodStyle = {
    display: "inline-flex",
    height: "inherit",
    paddingBlock: "12px",
    columnGap: "7px",
  };
  return {
    galleryContainerStyle,
    imageBtnStyle,
    imageContainerStyle,
    imageStyle,
    imageCaptionStyle,
    modalContainerStyle,
    modalSlideNumberStyle,
    modalToolbarStyle,
    modalToolbarBtnStyle,
    modalSlideShowSectionStyle,
    modalThumbnailSectionStyle,
    modalThumbImgsPodStyle,
    modalImageStyle,
    modalSlideBtnStyle,
  };
} 