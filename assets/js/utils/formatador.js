export function formatarNumero(numero) {
  if (numero.length !== 11) throw new Error('Número de telefone deve ter 11 caracteres');
  return `(${numero.slice(0, 2)}) ${numero.slice(2, 7)}-${numero.slice(7)}`;
}