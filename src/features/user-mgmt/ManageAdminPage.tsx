import { UserListPage } from './UserListPage';

export default function ManageAdminPage() {
  return (
    <UserListPage
      title="Manage Admins"
      roleFilter="Admin"
      addLink="/app/add-users?role=Admin"
      formAriaLabel="Admin search"
    />
  );
}
