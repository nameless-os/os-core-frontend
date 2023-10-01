function capitalizeFirstLetter(input: string): string {
  if (input.length < 1) {
    return '';
  }

  return input[0].toUpperCase() + input.substr(1);
}

export { capitalizeFirstLetter };
