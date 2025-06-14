import { cn } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/themes";
import {
  type CSSProperties,
  type ReactNode,
  type RefObject,
  type WheelEvent,
  useEffect,
  useRef,
  useState,
} from "react";

export interface ScrollShadowWrapperProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const ScrollShadowWrapper: React.FC<ScrollShadowWrapperProps> = (props) => {
  const { children, className = "", style = {} } = props;

  const [scrollTop, setScrollTop] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);

  const onScrollHandler = (event: WheelEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
    setScrollHeight(event.currentTarget.scrollHeight);
    setClientHeight(event.currentTarget.clientHeight);
  };

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resetRefSizes = (ref: RefObject<HTMLDivElement | null>) => {
      if (!ref.current) return;

      setScrollTop(ref.current.scrollTop);
      setScrollHeight(ref.current.scrollHeight);
      setClientHeight(ref.current.clientHeight);
    };

    resetRefSizes(wrapperRef);
  }, [wrapperRef?.current?.clientHeight]);

  const getVisibleSides = (): { top: boolean; bottom: boolean } => {
    const isBottom = clientHeight === scrollHeight - scrollTop;
    const isTop = scrollTop === 0;
    const isBetween = scrollTop > 0 && clientHeight < scrollHeight - scrollTop;

    return {
      top: (isBottom || isBetween) && !(isTop && isBottom),
      bottom: (isTop || isBetween) && !(isTop && isBottom),
    };
  };

  return (
    <ScrollArea
      data-testid="scroll-shadow-wrapper"
      ref={wrapperRef}
      style={style}
      className={cn("relative overflow-y-auto pr-[1px]", className)}
      onScroll={onScrollHandler}
    >
      <div
        data-testid="scroll-shadow-top"
        className={cn(
          `bg-gray-4`,
          "pointer-events-none sticky top-0 -mb-4 h-4 w-full transition-opacity duration-300",
          getVisibleSides().top ? "opacity-70" : "opacity-0",
        )}
      />
      {children}
      <div
        data-testid="scroll-shadow-bottom"
        className={cn(
          "bg-gray-4",
          "pointer-events-none sticky bottom-0 -mt-4 h-4 w-full rotate-180 transition-opacity duration-300",
          getVisibleSides().bottom ? "opacity-70" : "opacity-0",
        )}
      />
    </ScrollArea>
  );
};

export default ScrollShadowWrapper;
