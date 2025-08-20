import React from 'react';

interface CertificateProps {
  userName: string;
  churchName: string;
  ministry: string;
  title: string;
  accomplishments: string[];
  pastorName: string;
  date: string;
}

export const Certificate: React.FC<CertificateProps> = React.forwardRef(
  ({ userName, churchName, ministry, title, accomplishments, pastorName, date }, ref) => {
    return (
      <div ref={ref as React.RefObject<HTMLDivElement>} className="w-[800px] h-[600px] p-8 bg-white border-4 border-blue-800 text-center text-gray-800 font-serif">
        <div className="border-2 border-blue-600 p-4 h-full flex flex-col justify-between">
          <div>
            <h1 className="text-5xl font-bold text-blue-800">{churchName}</h1>
            <h2 className="text-3xl font-semibold text-blue-600 mt-2">{ministry}</h2>
          </div>
          <div>
            <p className="text-2xl my-4">This certificate is awarded to</p>
            <h3 className="text-4xl font-bold my-4">{userName}</h3>
            <p className="text-2xl my-4">in recognition of their outstanding achievement in</p>
            <h4 className="text-3xl font-semibold my-4">{title}</h4>
            <ul className="text-xl list-disc list-inside mx-auto max-w-md">
              {accomplishments.map((accomplishment, index) => (
                <li key={index}>{accomplishment}</li>
              ))}
            </ul>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xl border-t-2 border-gray-800 px-4 pt-2">{pastorName}</p>
              <p className="text-lg">Senior Pastor</p>
            </div>
            <div>
              <p className="text-xl border-t-2 border-gray-800 px-4 pt-2">{date}</p>
              <p className="text-lg">Date</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Certificate.displayName = 'Certificate';
