import { cn } from "@/lib/utils";

export type PresenceStatus = "online" | "busy" | "offline";

interface PresenceIndicatorProps {
  status: PresenceStatus;
  className?: string;
  showText?: boolean;
}

export const PresenceIndicator = ({ status, className, showText = false }: PresenceIndicatorProps) => {
  const statusConfig = {
    online: {
      color: "bg-online",
      text: "Online",
      pulse: true
    },
    busy: {
      color: "bg-busy",
      text: "Busy",
      pulse: false
    },
    offline: {
      color: "bg-offline",
      text: "Offline",
      pulse: false
    }
  };

  const config = statusConfig[status];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div className={cn(
          "w-3 h-3 rounded-full",
          config.color
        )} />
        {config.pulse && (
          <div className={cn(
            "absolute inset-0 w-3 h-3 rounded-full animate-ping",
            config.color,
            "opacity-75"
          )} />
        )}
      </div>
      {showText && (
        <span className={cn(
          "text-sm font-medium",
          status === "online" && "text-online",
          status === "busy" && "text-busy",
          status === "offline" && "text-offline"
        )}>
          {config.text}
        </span>
      )}
    </div>
  );
};