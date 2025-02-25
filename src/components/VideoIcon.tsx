interface VideoIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const VideoIcon: React.FC<VideoIconProps> = ({
  width = 24,
  height = 24,
  color = 'currentColor',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={color}
      viewBox="0 0 24 24"
    >
      <path d="M17 10.5V7c0-1.103-.897-2-2-2H3C1.897 5 1 5.897 1 7v10c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-3.5l4 4v-11l-4 4z" />
    </svg>
  );
};

export default VideoIcon;
