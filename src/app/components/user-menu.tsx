import type { UserSelect } from "@/lib/types";
import { Avatar, DropdownMenu, Text } from "@radix-ui/themes";
import { useAtom } from "jotai";
import { ChevronsUpDownIcon, LogOutIcon, Trash2Icon } from "lucide-react";
import { alertSystemAtom } from "./alert-system/alert-system.store";
import useMutations from "../hooks/use-mutations";

type Props = { user: UserSelect };

export const UserMenu: React.FC<Props> = ({ user }) => {
  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const { deleteAccount } = useMutations();

  const handleDeleteAccount = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Delete Account",
        message:
          "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
        handleDelete: () => {
          deleteAccount.mutate({});
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  const fallback = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger>
        <button className="hover:bg-gray-3 flex cursor-pointer items-center gap-3 p-3 transition-colors">
          <Avatar
            src={user.avatarUrl ?? ""}
            alt={user.name}
            fallback={fallback}
            radius="full"
          />
          <div className="grid flex-1 text-left">
            <Text size="2" weight="medium" truncate>
              {user.name}
            </Text>
            <Text size="1" color="gray" truncate>
              {user.email}
            </Text>
          </div>
          <ChevronsUpDownIcon className="size-4 opacity-70" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="right" className="grid gap-3">
        <header className="flex items-center gap-2 p-2">
          <Avatar
            src={user.avatarUrl ?? ""}
            alt={user.name}
            fallback={fallback}
            radius="full"
          />
          <div className="grid flex-1 leading-0.5">
            <Text weight="medium" truncate>
              {user.name}
            </Text>
            <Text color="gray" size="2">
              {user.email}
            </Text>
          </div>
        </header>
        <DropdownMenu.Separator />
        <a href="/logout">
          <DropdownMenu.Item color="amber">
            <LogOutIcon className="size-4 opacity-70" />
            <span>Log out</span>
          </DropdownMenu.Item>
        </a>
        <DropdownMenu.Item color="red" onClick={handleDeleteAccount}>
          <Trash2Icon className="size-4 opacity-70" />
          <span>Delete account</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default UserMenu;
