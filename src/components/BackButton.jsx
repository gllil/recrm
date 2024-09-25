/* eslint-disable react/prop-types */
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const BackButton = ({
  children,
  type,
  size,
  variant,
  active,
  disabled,
  href,
  as,
  path,
}) => {
  const navigate = useNavigate();
  return (
    <Button
      type={type}
      size={size}
      variant={variant}
      active={active}
      disabled={disabled}
      href={href}
      as={as}
      onClick={() => navigate(path)}
    >
      {children}
    </Button>
  );
};
export default BackButton;
