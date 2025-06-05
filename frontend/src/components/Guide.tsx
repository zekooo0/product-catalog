"use client";

const Guide = () => {
  return (
    <div className="w-fit bg-blue-500/10 rounded-md py-2 pl-2 pr-4 border border-dashed border-blue-500 border-blue-500/20">
      <div className="container mx-auto flex justify-center items-center hover:underline ">
        <a
          href="/Comprehensive Guide To Affiliate Programs.pdf"
          download="Comprehensive Guide To Affiliate Programs.pdf"
          className="flex items-center justify-center gap-3 text-blue-500 hover:text-blue-600 transition-colors"
        >
          <div className="bg-blue-500 rounded-full p-1.5 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>
          <span className="font-medium text-center whitespace-nowrap">
            Free Comprehensive Guide To <br /> Affiliate Marketing
          </span>
        </a>
      </div>
    </div>
  );
};

export default Guide;
