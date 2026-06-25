import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/client';
import { UserForm } from './UserForm';
import type { UserFormInput } from './schemas';

export default function AddUsersPage() {
  const mutation = useMutation({
    mutationFn: async (values: UserFormInput): Promise<{ id: string }> =>
      api.post('users', { json: values }).json<{ id: string }>(),
  });

  return (
    <UserForm
      title="Add User"
      submitLabel="Create user"
      ariaLabel="Add user form"
      onSubmit={(v) => mutation.mutateAsync(v)}
    />
  );
}
