const allowedTypes = ['work', 'home', 'personal'];

export const parseFilterParams = (query) => {
  const filter = {};

  if (query.type) {
    const type = query.type.trim();
    if (allowedTypes.includes(type)) {
      filter.contactType = type;
    }
  }

  if (query.isFavourite === 'true') {
    filter.isFavourite = true;
  } else if (query.isFavourite === 'false') {
    filter.isFavourite = false;
  }

  return filter;
};
