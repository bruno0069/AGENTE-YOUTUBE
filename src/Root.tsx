import { Composition, staticFile } from "remotion";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";
import { Naufragio } from "./Naufragio";
import { DURACAO, FPS } from "./Naufragio/roteiro";
import { Girafinha } from "./Girafinha";
import { Patinhos } from "./Patinhos";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        calculateMetadata={calculateCaptionedVideoMetadata}
        schema={captionedVideoSchema}
        width={1080}
        height={1920}
        defaultProps={{
          src: staticFile("sample-video.mp4"),
        }}
      />
      <Composition
        id="Naufragio"
        component={Naufragio}
        durationInFrames={DURACAO}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Patinhos"
        component={Patinhos}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Girafinha"
        component={Girafinha}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
