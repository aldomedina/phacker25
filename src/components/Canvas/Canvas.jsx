import { useEffect, useRef } from "react";
import Experience from "../../experience/Experience";

const Canvas = () => {
  const ref = useRef();
  const experienceRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    experienceRef.current = new Experience(ref.current);

    // Cleanup function to destroy experience when component unmounts
    return () => {
      if (experienceRef.current && experienceRef.current.destroy) {
        experienceRef.current.destroy();
        experienceRef.current = null;
        // Reset the singleton instance
        window.experience = null;
      }
    };
  }, []);

  return <canvas ref={ref} style={{ width: "100%", height: "100%" }} />;
};

export default Canvas;
