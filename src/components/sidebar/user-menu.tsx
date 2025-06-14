import { useIsMobile } from "@/hooks/use-mobile";
import type { UserSelect } from "@/lib/types";
import { Avatar, Button, Popover, Separator, Text } from "@radix-ui/themes";

type Props = { user: UserSelect };

export const UserMenu: React.FC<Props> = ({ user }) => {
  const isMobile = useIsMobile();

  const fallback = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Popover.Root>
      <Popover.Trigger>
        <button className="hover:bg-gray-3 flex items-center gap-3 p-3 transition-colors">
          <Avatar
            src={user.avatarUrl ?? ""}
            alt={user.name}
            fallback={fallback}
          />
          <div className="grid flex-1 text-left">
            <Text size="2" weight="medium" truncate>
              {user.name}
            </Text>
            <Text size="1" color="gray" truncate>
              {user.email}
            </Text>
          </div>
          <i className="fas fa-chevron-right text-1" />
        </button>
      </Popover.Trigger>
      <Popover.Content maxWidth="10rem" side="right" align="end" className="grid gap-3">
        <header className="flex items-center gap-2">
          <Avatar
            src={user.avatarUrl ?? ""}
            alt={user.name}
            fallback={fallback}
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
        <Separator size="4" orientation="horizontal" />
        <Button asChild className="w-full" variant="soft">
          <a href="/logout">
            <i className="fas fa-arrow-right-from-bracket" />
            Log out
          </a>
        </Button>
      </Popover.Content>
    </Popover.Root>
  );
};

export default UserMenu;
