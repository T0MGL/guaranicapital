interface LogoProps {
  className?: string;
  width?: number;
}

/*
  The mark is square. It used to declare a 140x45 intrinsic box while rendering
  at 140x140, so the browser reserved the wrong height and the navbar shifted
  once the file arrived. Width and height now match the asset.
*/
export const Logo = ({ className = '', width = 140 }: LogoProps) => (
  <img
    src="/logo-mark.webp"
    alt="Guaraní Capital"
    className={className}
    width={width}
    height={width}
    decoding="async"
    style={{ width: `${width}px`, height: 'auto' }}
  />
);
