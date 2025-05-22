import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

/**
 * AspectRatio component for maintaining a fixed aspect ratio for its children.
 * يدعم تمرير جميع props الخاصة بـ Radix بما فيها ref
 */
const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>
>((props, ref) => <AspectRatioPrimitive.Root ref={ref} {...props} />);

AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
