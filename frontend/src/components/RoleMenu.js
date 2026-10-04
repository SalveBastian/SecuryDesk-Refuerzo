export function menuItemsForRole(role) {
  const common = [
    { id: 'incidents', label: 'Consultar incidentes' }
  ];

  if (role === 'ADMIN') {
    return [
      ...common,
      { id: 'new-incident', label: 'Crear incidente' },
      { id: 'users', label: 'Administrar usuarios' },
      { id: 'admin', label: 'Panel administrativo' }
    ];
  }

  if (role === 'ANALISTA') {
    return [
      ...common,
      { id: 'new-incident', label: 'Crear incidente' }
    ];
  }

  return common;
}

export function renderRoleMenu(container, role, onSelect) {
  container.replaceChildren();
  for (const item of menuItemsForRole(role)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'menu-button';
    button.dataset.panel = item.id;
    button.textContent = item.label;
    button.addEventListener('click', () => onSelect(item.id));
    container.append(button);
  }
}
