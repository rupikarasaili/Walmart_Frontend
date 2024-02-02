export enum PASSWORD_STRENGTH {
  VERY_STRONG = "Very Strong",
  STRONG = "Strong",
  MEDIUM = "Medium",
  WEAK = "Weak",
  VERY_WEAK = "Very Weak",
}

export const determinePasswordStrength = (password: string) => {
  const lengthCriteria = password.length >= 8 && password.length <= 12;
  const upperCaseCriteria = /[A-Z]/.test(password);
  const lowerCaseCriteria = /[a-z]/.test(password);
  const numberCriteria = /\d/.test(password);
  const specialCharacterCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const passedCriteria = [
    lengthCriteria,
    upperCaseCriteria,
    lowerCaseCriteria,
    numberCriteria,
    specialCharacterCriteria,
  ].filter(Boolean).length;

  switch (passedCriteria) {
    case 5:
      return PASSWORD_STRENGTH.VERY_STRONG;
    case 4:
      return PASSWORD_STRENGTH.STRONG;
    case 3:
      return PASSWORD_STRENGTH.MEDIUM;
    case 2:
      return PASSWORD_STRENGTH.WEAK;
    default:
      return PASSWORD_STRENGTH.VERY_WEAK;
  }
};

export const getColorAsPasswordStrength = (
  strength: PASSWORD_STRENGTH
): string => {
  switch (strength) {
    case PASSWORD_STRENGTH.VERY_STRONG:
      return "#0f9d58"; // Dark Green
    case PASSWORD_STRENGTH.STRONG:
      return "#34A853"; // Green
    case PASSWORD_STRENGTH.MEDIUM:
      return "#F4B400"; // Yellow
    case PASSWORD_STRENGTH.WEAK:
      return "#EA4335"; // Orange
    case PASSWORD_STRENGTH.VERY_WEAK:
      return "#D93025"; // Red
    default:
      return "#D93025"; // Default color for undefined strength, can be changed based on preference
  }
};
