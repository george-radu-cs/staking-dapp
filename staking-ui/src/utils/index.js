export const TOKEN_SYMBOL = "XCN";
export const ETHER_VALUE_REGEX = /^[0-9]+\.[0-9]{1,18}$/;

export const validateEtherValue = value => ETHER_VALUE_REGEX.test(value);