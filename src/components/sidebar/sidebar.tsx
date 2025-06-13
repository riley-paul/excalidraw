import React from "react";

import { useAtom } from "jotai";
import { desktopSidebarOpenAtom, mobileSidebarOpenAtom } from "./sidebar.store";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar: React.FC<React.PropsWithChildren> = ({ children }) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useAtom(
    isMobile ? mobileSidebarOpenAtom : desktopSidebarOpenAtom,
  );

  return (
    <>
      {!isMobile && (
        <div
          className={cn(
            "transition-all duration-200 ease-in-out",
            isOpen ? "w-[20rem]" : "w-0",
          )}
        />
      )}
      {isMobile && isOpen && (
        <div
          className="bg-panel-translucent fixed inset-0 z-50 backdrop-blur"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={cn(
          "fixed top-0 bottom-0 left-0 z-20 w-[20rem] transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="bg-panel-solid relative flex h-full w-full flex-col border-r">
          {children}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className={cn(
              "group absolute top-4 -right-2 bottom-4 flex w-4 justify-center transition-[right] duration-200 ease-in-out outline-none",
              !isOpen && "-right-4",
              {
                "cursor-w-resize": isOpen,
                "cursor-e-resize": !isOpen,
              },
            )}
            title="Toggle sidebar [B]"
          >
            <div
              className={cn(
                "bg-gray-6 group-hover:bg-gray-8 m-0 h-full w-[4px] rounded-full p-0 transition ease-out group-hover:w-[6px]",
                "focus:bg-gray-9",
              )}
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
