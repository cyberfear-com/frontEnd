export const isWebView = () => {
  const userAgent = navigator.userAgent;
  
  // Detect iOS WebView
  const iosWebView = !!(
    (userAgent.includes('iPhone') || userAgent.includes('iPod') || userAgent.includes('iPad')) &&
    (userAgent.includes('AppleWebKit') && !userAgent.includes('Safari'))
  );

  // Detect Android WebView
  const androidWebView = !!(
    userAgent.includes('Android') && userAgent.includes('wv')
  );

  return iosWebView || androidWebView;
};
