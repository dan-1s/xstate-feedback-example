export default (...classNames) => {
  return classNames.filter(Boolean).join(' ');
}
