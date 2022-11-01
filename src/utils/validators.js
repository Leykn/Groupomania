import * as Validators from '@vuelidate/validators'
const withMessage = Validators.helpers.withMessage

export const helpers = Validators.helpers

// built-in Validators
export const required = withMessage('Ce camp est obligatoire.', Validators.required)
export const email = withMessage("Format incorrect de l'adresse email.", Validators.email)
export const minLength = (min) => withMessage(`Le nombre de caractères minimum est de ${min}.`, Validators.minLength(min))
export const maxLength = (max) => withMessage(`Le nombre de caractères maximum est de ${max}.`, Validators.maxLength(max))
export const sameAs = (equalTo) => withMessage('Cette valeur ne correspond pas à celle désirée.', Validators.sameAs(equalTo))

// Custom Validators
export const sameAsPassword = (password) => withMessage('Les deux mots de passe ne sont pas identique.', Validators.sameAs(password))
export const sameAsTrue = withMessage('Cette case doit être cochée.', Validators.sameAs(true))
