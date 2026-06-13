export function PropertyGallery({ images, name }: { images: string[]; name: string }) {
  return (
    <div className="gallery">
      {images.slice(0, 5).map((image, index) => <div className={`gallery-${index + 1}`} key={image + index}><img src={image} alt={`${name} view ${index + 1}`} />{index === 4 && <span>View all photos</span>}</div>)}
    </div>
  );
}
