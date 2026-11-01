export function roleHomePath(role: string | null | undefined) {
  return role === 'CLIENT' ? '/enquiries/new' : '/';
}
