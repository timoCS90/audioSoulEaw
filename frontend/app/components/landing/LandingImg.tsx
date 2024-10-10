import Image from "next/image";

export default function ExamplePage() {
  return (
    <div className="p-8">
      <div
        className="relative w-full max-w-4xl mx-auto"
        style={{ aspectRatio: "auto" }}
      >
        {/* You can adjust the aspect ratio if needed */}
        <Image
          src="https://res.cloudinary.com/dsakhvsb9/image/upload/v1/71be7cd9-ed6d-4a43-9c25-594d41298381_gnqebw.jpg"
          alt="Cloudinary Image"
          fill
          className="object-contain rounded-lg shadow-lg" // Keeps the original ratio
        />
      </div>
    </div>
  );
}
