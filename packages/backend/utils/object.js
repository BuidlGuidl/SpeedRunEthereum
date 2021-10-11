function getProp(parentObject, pathArray, defaultVal) {
  const object = parentObject[pathArray[0]];
  if (object && pathArray.length > 1) {
    return getProp(object, pathArray.slice(1));
  }
  return object === undefined ? defaultVal : object;
}

module.exports = {
  getProp,
};
