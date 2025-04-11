export function maskCNPJ(cnpj: string): string {
  return cnpj
    .replace(/\D/g, '') // Remove non-numeric characters
    .replace(/^(\d{2})(\d)/, '$1.$2') // Add first dot
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3') // Add second dot
    .replace(/\.(\d{3})(\d)/, '.$1/$2') // Add slash
    .replace(/(\d{4})(\d)/, '$1-$2'); // Add dash
}

export function maskPhone(phone: string): string {
  return phone
    .replace(/\D/g, '') // Remove non-numeric characters
    .replace(/^(\d{2})(\d)/, '($1) $2') // Add parentheses around area code
    .replace(/(\d{4,5})(\d{4})$/, '$1-$2'); // Add dash for the number
}

export function maskZipCode(cep: string): string {
  return cep
    .replace(/\D/g, '') // Remove non-numeric characters
    .replace(/^(\d{5})(\d)/, '$1-$2'); // Add dash after the first five digits
}
