export const checkNumber = (value) => {

  if (value === "") {
    return true;
  }

  const val = Number(value);

  const regex = /^[0-9]*\.?[0-9]*$/;

  if (regex.test(val)) {

    return true;
  }

  return false;
}