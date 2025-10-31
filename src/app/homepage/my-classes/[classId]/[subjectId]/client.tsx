'use client';

// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { PlayCircle, BookOpen, Clipboard, FileText, Key, ArrowLeft, Presentation } from 'lucide-react';
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";

// const iconComponents = {
//     PlayCircle,
//     BookOpen,
//     Clipboard,
//     FileText,
//     Key,
//     Presentation
// };

// // The props interface now accepts classId as a direct string prop.
// interface LessonContentClientPageProps {
//   classId: string;
//   subjectId: string;
//   subject: any; // Using 'any' for now to match existing structure
// }

// export default function LessonContentClientPage({ classId, subjectId, subject }: LessonContentClientPageProps) {

//     return (
//         <div className="space-y-6">
//             <div className="flex items-center gap-4">
//                 {/* The Link now correctly uses the direct classId prop. */}
//                 <Link href={`/homepage/my-classes/${classId}`}>
//                     <Button variant="outline">
//                         <ArrowLeft className="h-4 w-4 mr-2" />
//                         Back to Subjects
//                     </Button>
//                 </Link>
//                 <div className="text-center flex-grow">
//                     <h1 className="text-3xl font-bold">{subject.name}</h1>
//                     <p className="text-muted-foreground">• Select a chapter to explore resources</p>
//                 </div>
//                 <div className="w-24" /> 
//             </div>

//             <Accordion type="single" collapsible className="w-full space-y-4">
//                 {subject.chapters.map((chapter, index) => (
//                     <AccordionItem key={chapter.id} value={`item-${index}`} className="rounded-lg border bg-card text-card-foreground shadow-sm">
//                         <AccordionTrigger className="flex w-full items-center justify-between p-4 font-semibold text-lg no-underline hover:no-underline">
//                             <div className="flex items-center gap-3">
//                                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">{index + 1}</div>
//                                 <span>{chapter.name}</span>
//                             </div>
//                         </AccordionTrigger>
//                         <AccordionContent className="p-6">
//                             {chapter.resources && chapter.resources.length > 0 ? (
//                                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
//                                     {chapter.resources.map((resource) => {
//                                         const IconComponent = iconComponents[resource.icon];
//                                         return (
//                                             <Card key={resource.name} className="flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-r from-blue-400 to-purple-400 text-white">
//                                                 {IconComponent && <IconComponent className="h-8 w-8 text-white mb-2" />}
//                                                 <span className="text-sm font-medium text-center">{resource.name}</span>
//                                             </Card>
//                                         );
//                                     })}
//                                 </div>
//                             ) : (
//                                 <p className="text-center text-muted-foreground">No resources available for this chapter.</p>
//                             )}
//                         </AccordionContent>
//                     </AccordionItem>
//                 ))}
//             </Accordion>
//         </div>
//     );
// }
'use client';

// import { useState } from "react";
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { PlayCircle, BookOpen, Clipboard, FileText, Key, ArrowLeft, Presentation } from 'lucide-react';
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";

// const iconComponents = {
//   PlayCircle,
//   BookOpen,
//   Clipboard,
//   FileText,
//   Key,
//   Presentation
// };

// interface LessonContentClientPageProps {
//   classId: string;
//   subjectId: string;
//   subject: any;
// }

// export default function LessonContentClientPage({ classId, subjectId, subject }: LessonContentClientPageProps) {
//   const [selectedVideo, setSelectedVideo] = useState<string | null>(null); // to store the clicked video URL

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-4">
//         <Link href={`/homepage/my-classes/${classId}`}>
//           <Button variant="outline">
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Subjects
//           </Button>
//         </Link>
//         <div className="text-center flex-grow">
//           <h1 className="text-3xl font-bold">{subject.name}</h1>
//           <p className="text-muted-foreground">• Select a chapter to explore resources</p>
//         </div>
//         <div className="w-24" />
//       </div>

//       {/* Video player section — appears only when a video is clicked */}
//       {selectedVideo && (
//         <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
//           <video controls autoPlay className="w-full h-full rounded-lg">
//             <source src={selectedVideo} type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         </div>
//       )}

//       <Accordion type="single" collapsible className="w-full space-y-4">
//         {subject.chapters.map((chapter, index) => (
//           <AccordionItem
//             key={chapter.id}
//             value={`item-${index}`}
//             className="rounded-lg border bg-card text-card-foreground shadow-sm"
//           >
//             <AccordionTrigger className="flex w-full items-center justify-between p-4 font-semibold text-lg no-underline hover:no-underline">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
//                   {index + 1}
//                 </div>
//                 <span>{chapter.name}</span>
//               </div>
//             </AccordionTrigger>

//             <AccordionContent className="p-6">
//               {chapter.resources && chapter.resources.length > 0 ? (
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
//                   {chapter.resources.map((resource) => {
//                     const IconComponent = iconComponents[resource.icon];
//                     return (
//                       <Card
//                         key={resource.name}
//                         className="flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-r from-blue-400 to-purple-400 text-white"
//                         onClick={() => {
//                           if (resource.videoUrl) {
//                             setSelectedVideo(resource.videoUrl); // play clicked video
//                           } else {
//                             alert("No video available for this resource");
//                           }
//                         }}
//                       >
//                         {IconComponent && <IconComponent className="h-8 w-8 text-white mb-2" />}
//                         <span className="text-sm font-medium text-center">{resource.name}</span>
//                       </Card>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <p className="text-center text-muted-foreground">
//                   No resources available for this chapter.
//                 </p>
//               )}
//             </AccordionContent>
//           </AccordionItem>
//         ))}
//       </Accordion>
//     </div>
//   );
// }
'use client';

'use client';

import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlayCircle, BookOpen, Clipboard, FileText, Key, ArrowLeft, Presentation } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const iconComponents = {
  PlayCircle,
  BookOpen,
  Clipboard,
  FileText,
  Key,
  Presentation,
};

interface LessonContentClientPageProps {
  classId: string;
  subjectId: string;
  subject: any;
}

export default function LessonContentClientPage({
  classId,
  subjectId,
  subject,
}: LessonContentClientPageProps) {
  const [selectedResource, setSelectedResource] = useState<any | null>(null);

  // 🔹 Load embed script dynamically when a PDF resource is selected
  useEffect(() => {
    if (selectedResource?.type === "PDF") {
      let scriptUrl: string | null = null;

      // 1️⃣ Try to extract from embedScript if provided
      if (selectedResource.embedScript) {
        const match = selectedResource.embedScript.match(/src=['"]([^'"]+)['"]/);
        scriptUrl = match ? match[1] : null;
      }

      // 2️⃣ Use fallback script if embedScript is blank or invalid
      if (!scriptUrl) {
        scriptUrl = "//pubhtml5.com/plugin/LightBox/js/pubhtml5-light-box-api-min.js";
      }

      // 3️⃣ Dynamically append script
      const script = document.createElement("script");
      script.src = scriptUrl.startsWith("http") ? scriptUrl : `https:${scriptUrl}`;
      script.async = true;
      document.body.appendChild(script);

      // Cleanup when switching resource
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [selectedResource]);

  return (
    <div className="space-y-6">
      {/* 🔹 Header */}
      <div className="flex items-center gap-4">
        <Link href={`/homepage/my-classes/${classId}`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Subjects
          </Button>
        </Link>
        <div className="text-center flex-grow">
          <h1 className="text-3xl font-bold">{subject.name}</h1>
          <p className="text-muted-foreground">• Select a chapter to explore resources</p>
        </div>
        <div className="w-24" />
      </div>

      {/* 🔹 Display Selected Resource */}
      {selectedResource && (
        <div className="w-full flex justify-center">
          {selectedResource.type === "Video" && selectedResource.videoUrl ? (
            <div className="w-[900px] h-[500px] rounded-lg overflow-hidden shadow-lg">
              <video controls autoPlay className="w-full h-full rounded-lg">
                <source src={selectedResource.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : selectedResource.type === "PDF" ? (
            <div
              className="w-[900px] h-[500px]"
              dangerouslySetInnerHTML={{
                __html:
                  selectedResource.htmlContent ||
                  `<div id="pubhtml5-container">
                    <iframe 
                      style="width:900px;height:500px"
                      src="${
                        selectedResource.pdfUrl ||
                        "https://online.pubhtml5.com/wjgsx/zqjg/"
                      }"
                      seamless="seamless"
                      scrolling="no"
                      frameborder="0"
                      allowtransparency="true"
                      allowfullscreen="true">
                    </iframe>
                  </div>`,
              }}
            />
          ) : (
            <p className="text-center text-muted-foreground">
              No preview available.
            </p>
          )}
        </div>
      )}

      {/* 🔹 Accordion for Chapters */}
      <Accordion type="single" collapsible className="w-full space-y-4">
        {subject.chapters.map((chapter, index) => (
          <AccordionItem
            key={chapter.id}
            value={`item-${index}`}
            className="rounded-lg border bg-card text-card-foreground shadow-sm"
          >
            <AccordionTrigger className="flex w-full items-center justify-between p-4 font-semibold text-lg no-underline hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  {index + 1}
                </div>
                <span>{chapter.name}</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="p-6">
              {chapter.resources && chapter.resources.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {chapter.resources.map((resource) => {
                    const IconComponent = iconComponents[resource.icon];
                    return (
                      <Card
                        key={resource.name}
                        className="flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-r from-blue-400 to-purple-400 text-white"
                        onClick={() =>
                          setSelectedResource({
                            type: resource.type, // "Video" or "PDF"
                            videoUrl: resource.videoUrl || null,
                            pdfUrl: resource.pdfUrl || null, // dynamic PDF URL
                            embedScript: resource.embedScript || "", // even if empty
                            htmlContent: resource.htmlContent || null,
                          })
                        }
                      >
                        {IconComponent && (
                          <IconComponent className="h-8 w-8 text-white mb-2" />
                        )}
                        <span className="text-sm font-medium text-center">
                          {resource.name}
                        </span>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  No resources available for this chapter.
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
