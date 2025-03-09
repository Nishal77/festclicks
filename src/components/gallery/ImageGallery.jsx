import React, { useRef, useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { imageGalleryStyles } from "./ImageGalleryStyles";

export function ImageGallery({
  imagesInfoArray = [],
  columnCount = "auto",
  columnWidth = 230,
  gapSize = 24,
  fixedCaption = false,
  thumbnailBorder = "3px solid #fff",
  lazy = true,
  lazyFromIndex = 6,
  customStyles = {},
}) {
  const [imgSrcInfo, setImgSrcInfo] = useState(null);
  const [slideNumber, setSlideNumber] = useState(1);
  const [showModalControls, setShowModalControls] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const dialogRef = useRef(null);
  const lightboxRef = useRef(null);
  const activeThumbImgRef = useRef(null);
  const defaultStyles = imageGalleryStyles(
    columnCount,
    columnWidth,
    gapSize,
    fixedCaption
  );
  const galleryStyles = { ...defaultStyles, ...customStyles };
  const galleryContainerStyle = galleryStyles.galleryContainerStyle;
  const imageContainerStyle = galleryStyles.imageContainerStyle;
  const imageBtnStyle = galleryStyles.imageBtnStyle;
  const imageStyle = galleryStyles.imageStyle;
  const imageCaptionStyle = galleryStyles.imageCaptionStyle;
  const modalContainerStyle = galleryStyles.modalContainerStyle;
  const modalSlideNumberStyle = galleryStyles.modalSlideNumberStyle;
  const modalToolbarStyle = galleryStyles.modalToolbarStyle;
  const modalToolbarBtnStyle = galleryStyles.modalToolbarBtnStyle;
  const modalSlideShowSectionStyle = galleryStyles.modalSlideShowSectionStyle;
  const modalThumbnailSectionStyle = galleryStyles.modalThumbnailSectionStyle;
  const modalThumbImgsPodStyle = galleryStyles.modalThumbImgsPodStyle;
  const modalImageStyle = galleryStyles.modalImageStyle;
  const modalSlideBtnStyle = galleryStyles.modalSlideBtnStyle;

  // Check if array is empty to prevent errors
  const hasImages = Array.isArray(imagesInfoArray) && imagesInfoArray.length > 0;

  // Get current image safely
  const getCurrentImage = () => {
    if (!hasImages) return null;
    const index = Math.min(Math.max(1, slideNumber), imagesInfoArray.length) - 1;
    return imagesInfoArray[index] || null;
  };

  function handleImageContainerMouseEnter(
    e
  ) {
    const figcaption = e.currentTarget.querySelector("figcaption");
    figcaption && (figcaption.style.opacity = "1");
  }

  function handleImageContainerMouseLeave(
    e
  ) {
    const figcaption = e.currentTarget.querySelector("figcaption");
    figcaption && (figcaption.style.opacity = "0");
  }

  function openLightboxOnSlide(
    number,
    src,
    srcSet,
    mediaSizes
  ) {
    if (!hasImages) return;
    
    const safeNumber = Math.min(Math.max(1, number), imagesInfoArray.length);
    setImgSrcInfo({ src, srcSet, mediaSizes });
    setSlideNumber(safeNumber);
    dialogRef.current?.showModal();
  }

  function changeSlide(thumbClick, step) {
    if (!hasImages) return;
    
    const totalImages = imagesInfoArray.length;
    let newSlideNumber = thumbClick ? step + 1 : slideNumber + step;

    // Ensure slide number wraps around correctly
    if (newSlideNumber < 1) newSlideNumber = totalImages;
    if (newSlideNumber > totalImages) newSlideNumber = 1;

    if (newSlideNumber <= totalImages && newSlideNumber > 0) {
      const imageInfo = imagesInfoArray[newSlideNumber - 1];
      if (imageInfo) {
        setSlideNumber(newSlideNumber);
        setImgSrcInfo({
          src: imageInfo.src,
          srcSet: imageInfo.srcSet,
          mediaSizes: imageInfo.mediaSizes,
        });
      }
    }
  }

  function switchFullScreen(on) {
    if (on) {
      lightboxRef.current?.requestFullscreen().catch((error) => {
        console.error(`Error entering fullscreen: ${error.message}`);
      });
    }
    if (!on) {
      document.exitFullscreen().catch((error) => console.error(error));
    }
  }

  function scrollImage(
    thumbClick,
    direction,
    imgIndex
  ) {
    if (!hasImages) return;
    
    const step = thumbClick ? imgIndex : direction;
    flushSync(() => changeSlide(thumbClick, step));
    activeThumbImgRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function handleKeyDownOnModal(e) {
    if (!hasImages) return;
    
    e.key === "ArrowLeft" && scrollImage(false, -1, 0);
    e.key === "ArrowRight" && scrollImage(false, 1, 0);
    e.key === "f" && fullscreen && switchFullScreen(false);
    e.key === "f" && !fullscreen && switchFullScreen(true);
  }

  function exitFullScreenAndDialog() {
    fullscreen && switchFullScreen(false);
    dialogRef.current?.close();
  }

  function SvgElement(pathElement) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        {pathElement}
      </svg>
    );
  }

  function showImageCards() {
    if (!hasImages) return <div>No images to display</div>;
    
    const imageElementsArray = imagesInfoArray.map((imageInfo, index) => {
      if (!imageInfo || !imageInfo.id) {
        return (
          <div key={`missing-id-${index}`}>
            <strong>Error:</strong> Item at index {index} is missing an ID
          </div>
        );
      }
      
      return (
        <button
          type="button"
          style={imageBtnStyle}
          key={imageInfo.id}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            openLightboxOnSlide(
              index + 1,
              imageInfo.src,
              imageInfo.srcSet,
              imageInfo.mediaSizes
            )
          }
        >
          <figure
            style={imageContainerStyle}
            onMouseEnter={(e) =>
              fixedCaption ? undefined : handleImageContainerMouseEnter(e)
            }
            onMouseLeave={(e) =>
              fixedCaption ? undefined : handleImageContainerMouseLeave(e)
            }
          >
            <img
              loading={lazy && index >= lazyFromIndex ? "lazy" : "eager"}
              alt={imageInfo.alt || "Image"}
              src={imageInfo.gridSrc || imageInfo.src}
              onClick={() =>
                openLightboxOnSlide(
                  index + 1,
                  imageInfo.src,
                  imageInfo.srcSet,
                  imageInfo.mediaSizes
                )
              }
              style={imageStyle}
            />
            {imageInfo.caption ? (
              <figcaption style={imageCaptionStyle}>
                {imageInfo.caption}
              </figcaption>
            ) : (
              ""
            )}
          </figure>
        </button>
      );
    });
    return imageElementsArray;
  }

  // Get the current image for lightbox display
  const currentImage = getCurrentImage();

  const lightBoxElement = (
    <dialog ref={dialogRef} style={{ margin: "auto" }}>
      {hasImages && currentImage && (
        <article
          autoFocus
          tabIndex={-1}
          ref={lightboxRef}
          style={modalContainerStyle}
          onKeyDown={(e) => handleKeyDownOnModal(e)}
          onMouseEnter={() => setShowModalControls(true)}
          onMouseLeave={() => setShowModalControls(false)}
          onClick={(e) =>
            e.target.tagName === "SECTION" &&
            exitFullScreenAndDialog()
          }
        >
          <span
            style={{
              opacity: showModalControls ? 1 : 0,
              ...modalSlideNumberStyle,
            }}
          >{`${slideNumber} / ${imagesInfoArray.length}`}</span>
          <span
            style={{
              opacity: showModalControls ? 1 : 0,
              ...modalToolbarStyle,
            }}
          >
            <button
              type="button"
              aria-label="Show thumbnails"
              style={modalToolbarBtnStyle}
              title="Show thumbnails"
              onClick={() => setShowThumbnails(!showThumbnails)}
            >
              {SvgElement(
                <path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z" />
              )}
            </button>
            <button
              type="button"
              aria-label="Go full screen (Keyboard shortcut f)"
              style={{
                display: fullscreen ? "none" : "block",
                ...modalToolbarBtnStyle,
              }}
              title="Go full screen (f)"
              onClick={() => switchFullScreen(true)}
            >
              {SvgElement(
                <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5" />
              )}
            </button>
            <button
              type="button"
              aria-label="Exit full screen"
              style={{
                display: fullscreen ? "block" : "none",
                ...modalToolbarBtnStyle,
              }}
              title="Exit full screen"
              onClick={() => switchFullScreen(false)}
            >
              {SvgElement(
                <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5m5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5M0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5m10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0z" />
              )}
            </button>
            <button
              type="button"
              aria-label="Close lightbox"
              style={modalToolbarBtnStyle}
              title="Close lightbox"
              onClick={() => exitFullScreenAndDialog()}
            >
              {SvgElement(
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              )}
            </button>
          </span>
          <section
            style={{
              height: showThumbnails ? "80vh" : "100vh",
              ...modalSlideShowSectionStyle,
            }}
          >
            <button
              type="button"
              aria-label="Previous image"
              style={{
                opacity: showModalControls ? 1 : 0,
                left: 0,
                ...modalSlideBtnStyle,
              }}
              title="Previous image"
              onClick={() => scrollImage(false, -1, 0)}
            >
              {SvgElement(
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                />
              )}
            </button>
            <figure
              onMouseEnter={(e) =>
                fixedCaption ? undefined : handleImageContainerMouseEnter(e)
              }
              onMouseLeave={(e) =>
                fixedCaption ? undefined : handleImageContainerMouseLeave(e)
              }
            >
              <img
                loading={lazy ? "lazy" : "eager"}
                src={imgSrcInfo?.src}
                srcSet={imgSrcInfo?.srcSet}
                sizes={imgSrcInfo?.mediaSizes}
                alt={currentImage?.alt || "Image"}
                style={{
                  maxHeight: showThumbnails ? "80vh" : "100vh",
                  ...modalImageStyle,
                }}
              />
              {currentImage?.caption ? (
                <figcaption style={imageCaptionStyle}>
                  {currentImage.caption}
                </figcaption>
              ) : (
                ""
              )}
            </figure>
            <button
              type="button"
              aria-label="Next image"
              style={{
                opacity: showModalControls ? 1 : 0,
                right: 0,
                ...modalSlideBtnStyle,
              }}
              title="Next image"
              onClick={() => scrollImage(false, 1, 0)}
            >
              {SvgElement(
                <path
                  fillRule="evenodd"
                  d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                />
              )}
            </button>
          </section>
          <section
            style={{
              opacity: showThumbnails ? 1 : 0,
              ...modalThumbnailSectionStyle,
            }}
          >
            <div style={modalThumbImgsPodStyle}>
              {imagesInfoArray.map((imageInfo, index) => (
                <img
                  loading={lazy ? "lazy" : "eager"}
                  ref={slideNumber - 1 === index ? activeThumbImgRef : null}
                  style={{
                    border: slideNumber - 1 === index ? thumbnailBorder : "",
                    cursor: "pointer",
                  }}
                  key={imageInfo.id || `thumb-${index}`}
                  src={imageInfo.thumbSrc || imageInfo.src}
                  alt={imageInfo.alt || "Thumbnail"}
                  onClick={() => scrollImage(true, 0, index)}
                />
              ))}
            </div>
          </section>
        </article>
      )}
    </dialog>
  );

  useEffect(() => {
    function handleFullscreenChange() {
      setFullscreen(Boolean(document.fullscreenElement));
      lightboxRef.current?.focus();
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    dialogRef.current?.open &&
      (document.documentElement.style.overflow = "hidden");
    !dialogRef.current?.open && (document.documentElement.style.overflow = "");
  });

  return (
    <div style={galleryContainerStyle}>
      {showImageCards()}
      {lightBoxElement}
    </div>
  );
} 