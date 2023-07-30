export const EmailRegex = /^\S+@\S+\.\S+$/;

export const PasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,100}$/;

export const UsernameRegex = /^(?=\s*\S)[A-Za-z\d.()\-_=+\[\]{}|<>~]{3,20}$/;

export const BubbleRegex = /^(?=\s*\S)[A-Za-z\d.()\-_=+\[\]{}|<>~]{3,20}$/;

export const BodyRegex = /^(?=\s*\S)(.*[^ ].*){0,2000}$/;