interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo = ({ className = '', width = 140, height = 45 }: LogoProps) => {
  return (
    <img
      src="/medium_500.png"
      alt="Guaraní Capital"
      className={className}
      width={width}
      height={height}
      style={{
        width: `${width}px`,
        height: 'auto',
        objectFit: 'contain',
      }}
    />
  );
};
