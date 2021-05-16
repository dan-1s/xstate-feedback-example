function classes(...classNames) {
  return classNames.filter(Boolean).join(' ');
}

export default classes;
