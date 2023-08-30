export const NAME_REGEX = /^[A-z0-9_ -]{3,32}$/;

export const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export const EMAIL_REGEX = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i;

export const PHONE_REGEX = /^[1-9]\d{9}$/i;

export const INTEGER_REGEX = /^[0-9]+$/i;