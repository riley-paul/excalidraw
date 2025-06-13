import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { UserSelect } from "@/lib/types";
import { Avatar, Button, Popover, Separator, Text } from "@radix-ui/themes";

type Props = { user: UserSelect };

export const NavUser: React.FC<Props> = ({ user }) => {
  const { isMobile } = useSidebar();

  const fallback = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Popover.Root>
          <Popover.Trigger>
            <Button
              variant="ghost"
              color="gray"
              className="h-auto p-2 rounded-3 w-full"
            >
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
              <i className="fas fa-caret-right size-4" />
            </Button>
          </Popover.Trigger>
          <Popover.Content
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
            className="w-64 grid gap-3"
          >
            <header className="flex gap-2 items-center">
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
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavUser;
