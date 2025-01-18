type UploadResultProps = {
    title: string; // 업로드된 음악 제목
  };
  
  const UploadResult: React.FC<UploadResultProps> = ({ title }) => {
    return (
      <div className="flex flex-col items-center mt-8">
        {/* SVG 음표 아이콘 */}
        <svg
          width="101"
          height="100"
          viewBox="0 0 101 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.5"
            width="100"
            height="100"
            rx="50"
            fill="black"
            fillOpacity="0.05"
          />
          <path
            d="M19.25 81.375H81.75V18.875H19.25V81.375Z"
            fill="black"
          />
        </svg>
        {/* 업로드된 음악 제목 */}
        <p className="mt-4 text-lg font-semibold text-gray-800">{title}</p>
      </div>
    );
  };
  
  export default UploadResult;
  