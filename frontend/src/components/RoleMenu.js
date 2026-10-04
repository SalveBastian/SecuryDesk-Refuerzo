export function menuItemsForRole(role) {
  const common = [
    { label: 'Consultar incidentes', href: '#incidents' }
  ];

  if (role === 'ADMIN') {
    return [
      ...common,
      { label: 'Crear incidente', href: '#new-incident' },
      { label: 'Administrar usuarios', href: '#users' },
      { label: 'Panel administrativo', href: '#admin' }
    ];
  }

  if (role === 'ANALISTA') {
    return [
      ...common,
      { label: 'Crear incidente', href: '#new-incident' }
    ];
  }

  return common;
}

export function renderRoleMenu(container, role) {
  container.replaceChildren();
  for (const item of menuItemsForRole(role)) {
    const anchor = document.createElement('a');
    anchor.href = item.href;
    anchor.textContent = item.label;
    container.append(anchor);
  }
}
