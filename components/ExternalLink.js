/**
 * ExternalLink Component
 * 
 * A standardized way to handle external links throughout the application.
 * This component follows security best practices by using noopener to prevent
 * the new page from accessing window.opener, while giving control over
 * whether to pass referrer information.
 * 
 * Usage:
 * <ExternalLink href="https://example.com">Link text</ExternalLink>
 * <ExternalLink href="https://sauna-business.com" passReferrer={true}>Business link</ExternalLink>
 * <ExternalLink href="https://docs.com" className="text-blue-500 underline">Docs</ExternalLink>
 */

const ExternalLink = ({
  href,
  children,
  passReferrer = false,
  className = "",
  ...props
}) => {
  // Determine the rel attribute based on whether we want to pass referrer info
  const relAttribute = passReferrer ? "noopener" : "noopener noreferrer";

  return (
    <a
      href={href}
      target="_blank"
      rel={relAttribute}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
};

export default ExternalLink; 